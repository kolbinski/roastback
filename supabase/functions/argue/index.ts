import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const ARGUE_SYSTEM_PROMPT = (languageName: string) => `The user is pushing back on your roast - either agreeing and asking you to go harder, or disagreeing and correcting a detail. Look at the photo again and respond to what they actually said. If they're correcting you, acknowledge the mistake with self-deprecating humor and revise your take - don't over-apologize. If they want you to go harder, escalate with an even sharper, more specific observation about the photo. Keep the same playful, confident tone - never cruel, never comment on someone's body, appearance, race, or other sensitive traits. Never open with sympathy or understanding ("I get it", "fair enough") - even when the user is being defensive, escalate the joke instead of softening it. Politely decline anything unrelated to discussing this photo. Keep it short - 3-5 sentences. Do not use any markdown formatting - no asterisks, no bold, no bullet points, no headers. Plain text only. Respond in ${languageName}.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const { image, language, visitor_id, thread_id, user_message } = await req.json();

  if (!image || !visitor_id || !thread_id || !user_message) {
    return new Response(
      JSON.stringify({ error: "Missing required fields" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const logApiError = async (source: string, status: number | null, details: unknown) => {
    await supabase.from("api_errors").insert({
      source,
      status,
      error_details: JSON.stringify(details),
    });
  };

  const { data: configRows, error: configError } = await supabase
    .from("config")
    .select("label, value");

  if (configError || !configRows) {
    return new Response(JSON.stringify({ error: "Could not load config" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const config = Object.fromEntries(configRows.map((row) => [row.label, row.value]));
  const AI_CALL_COST = config.ai_call_cost_usd;
  const SPEND_CAP_USD = config.spend_cap_usd;
  const MAX_ARGUE_TURNS = config.max_argue_turns;

  const { data: spend, error: spendError } = await supabase
    .from("spend_tracker")
    .select("total_estimated_cost")
    .eq("id", 1)
    .single();

  if (spendError) {
    return new Response(JSON.stringify({ error: "Could not check spend cap" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  if (spend.total_estimated_cost >= SPEND_CAP_USD) {
    return new Response(
      JSON.stringify({ error: "closed", message: "Free testing period is over" }),
      { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  // Fetch full thread history (reconstruct conversation server-side, don't trust client for this)
  const { data: history, error: historyError } = await supabase
    .from("v0_events")
    .select("turn_number, event_type, content")
    .eq("thread_id", thread_id)
    .eq("ai_call_succeeded", true)
    .order("turn_number", { ascending: true });

  if (historyError || !history || history.length === 0) {
    return new Response(JSON.stringify({ error: "Could not load thread history" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const currentMaxTurn = history[history.length - 1].turn_number;
  const nextTurn = currentMaxTurn + 1;

  if (nextTurn > MAX_ARGUE_TURNS) {
    return new Response(
      JSON.stringify({ error: "turn_limit_reached", message: "This roast is done - start a new one" }),
      { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  // Rebuild the conversation as alternating model/user turns for Gemini
  const contents: Record<string, unknown>[] = [];

  for (const row of history) {
    if (row.event_type === "roast") {
      contents.push({ role: "model", parts: [{ text: row.content }] });
    } else {
      // argue rows are stored as "USER: ...\nAI: ..."
      const [userPart, aiPart] = row.content.split("\nAI: ");
      const userText = userPart.replace(/^USER: /, "");
      contents.push({ role: "user", parts: [{ text: userText }] });
      contents.push({ role: "model", parts: [{ text: aiPart }] });
    }
  }

  // Add the new user turn, with the photo attached (per earlier decision - AI needs to see it again)
  contents.push({
    role: "user",
    parts: [
      { inline_data: { mime_type: "image/jpeg", data: image } },
      { text: user_message },
    ],
  });

  const languageName = language === "pl" ? "Polish" : "English";

  const geminiResponse = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": Deno.env.get("GEMINI_API_KEY")!,
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: ARGUE_SYSTEM_PROMPT(languageName) }],
        },
        contents,
      }),
    }
  );

  const geminiData = await geminiResponse.json();

  if (!geminiResponse.ok) {
    await logApiError("gemini_argue", geminiResponse.status, geminiData);
  }

  const replyText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!replyText) {
    await supabase.from("v0_events").insert({
      visitor_id,
      thread_id,
      turn_number: nextTurn,
      event_type: "argue",
      content: `USER: ${user_message}`,
      moderation_flagged: false,
      ai_call_succeeded: false,
    });

    return new Response(
      JSON.stringify({ error: "ai_call_failed", message: "Could not generate a reply" }),
      { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  await supabase.rpc("increment_spend", { amount: AI_CALL_COST });

  await supabase.from("v0_events").insert({
    visitor_id,
    thread_id,
    turn_number: nextTurn,
    event_type: "argue",
    content: `USER: ${user_message}\nAI: ${replyText}`,
    moderation_flagged: false,
    ai_call_succeeded: true,
  });

  return new Response(
    JSON.stringify({ reply: replyText, turns_left: MAX_ARGUE_TURNS - nextTurn }),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
});