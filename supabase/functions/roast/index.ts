import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = (languageName: string) => `You are a sharp, confident observer analyzing a photo to describe someone's 'vibe today.' Take a clear, specific stance on what you see - don't hedge with vague observations. Give the user something worth disagreeing with: a pointed, funny claim about their habits or choices based on specific details in the photo (e.g. 'those three coffee mugs suggest your entire workflow runs on caffeine, not planning'), not a bland summary ('looks like a busy day'). Stay playful and clever, never cruel, and never comment on someone's body, appearance, race, or other sensitive traits - the edge comes from specific, confident opinions about objects and habits, not from personal attacks. 5-8 sentences. End with a one-line verdict/mood label. Do not use any markdown formatting - no asterisks, no bold, no bullet points, no headers. Plain text only. Respond in ${languageName}.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const { image, language, visitor_id, thread_id } = await req.json();

  if (!image || !visitor_id || !thread_id) {
    return new Response(
      JSON.stringify({ error: "Missing image, visitor_id, or thread_id" }),
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
  const MODERATION_COST = config.moderation_cost_usd;
  const AI_CALL_COST = config.ai_call_cost_usd;
  const SPEND_CAP_USD = config.spend_cap_usd;

  const { data: spend, error } = await supabase
    .from("spend_tracker")
    .select("total_estimated_cost")
    .eq("id", 1)
    .single();

  if (error) {
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

  // Moderation check (Google Cloud Vision SafeSearch)
  const visionResponse = await fetch(
    `https://vision.googleapis.com/v1/images:annotate?key=${Deno.env.get("GOOGLE_VISION_API_KEY")}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        requests: [
          {
            image: { content: image },
            features: [{ type: "SAFE_SEARCH_DETECTION" }],
          },
        ],
      }),
    }
  );

  const visionData = await visionResponse.json();

  if (!visionResponse.ok) {
    await logApiError("vision", visionResponse.status, visionData);
  }

  const safeSearch = visionData.responses?.[0]?.safeSearchAnnotation;

  const flagged =
    safeSearch &&
    ["adult", "violence", "racy"].some((category) =>
      ["LIKELY", "VERY_LIKELY"].includes(safeSearch[category])
    );

  await supabase.rpc("increment_spend", { amount: MODERATION_COST });

  if (flagged) {
    await supabase.from("v0_events").insert({
      visitor_id,
      thread_id,
      turn_number: 0,
      event_type: "roast",
      content: null,
      moderation_flagged: true,
      ai_call_succeeded: false,
    });

    return new Response(
      JSON.stringify({ error: "moderation_flagged", message: "This photo can't be analyzed" }),
      { status: 422, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  // Gemini call (roast generation)
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
          parts: [{ text: SYSTEM_PROMPT(languageName) }],
        },
        contents: [
          {
            parts: [
              {
                inline_data: {
                  mime_type: "image/jpeg",
                  data: image,
                },
              },
            ],
          },
        ],
      }),
    }
  );

  const geminiData = await geminiResponse.json();

  if (!geminiResponse.ok) {
    await logApiError("gemini_roast", geminiResponse.status, geminiData);
  }

  const roastText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!roastText) {
    await supabase.from("v0_events").insert({
      visitor_id,
      thread_id,
      turn_number: 0,
      event_type: "roast",
      content: null,
      moderation_flagged: false,
      ai_call_succeeded: false,
    });

    return new Response(
      JSON.stringify({ error: "ai_call_failed", message: "Could not generate a roast" }),
      { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  await supabase.rpc("increment_spend", { amount: AI_CALL_COST });

  await supabase.from("v0_events").insert({
    visitor_id,
    thread_id,
    turn_number: 0,
    event_type: "roast",
    content: roastText,
    moderation_flagged: false,
    ai_call_succeeded: true,
  });

  return new Response(
    JSON.stringify({ roast: roastText }),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
});