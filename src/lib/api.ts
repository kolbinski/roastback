const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function callRoast(params: {
  image: string;
  language: string;
  visitor_id: string;
  thread_id: string;
}) {
  const res = await fetch(`${SUPABASE_URL}/functions/v1/roast`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify(params),
  });

  const data = await res.json();
  return { ok: res.ok, data };
}

export async function callArgue(params: {
  image: string;
  language: string;
  visitor_id: string;
  thread_id: string;
  user_message: string;
}) {
  const res = await fetch(`${SUPABASE_URL}/functions/v1/argue`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify(params),
  });

  const data = await res.json();
  return { ok: res.ok, data };
}

export async function saveEmail(params: { email: string }) {
  const res = await fetch(`${SUPABASE_URL}/functions/v1/save-email`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify(params),
  });

  const data = await res.json();
  return { ok: res.ok, data };
}