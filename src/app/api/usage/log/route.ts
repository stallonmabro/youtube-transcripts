import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Authenticated: insert into usage_logs
  if (user) {
    await supabase.from("usage_logs").insert({ user_id: user.id });
    return NextResponse.json({ success: true });
  }

  // Anonymous: update cookie
  const raw = request.cookies.get("yt_usage")?.value;
  let parsed = { date: "", count: 0 };
  try {
    if (raw) parsed = JSON.parse(raw);
  } catch {}
  const currentDate = today();

  const next =
    parsed.date === currentDate
      ? { date: currentDate, count: parsed.count + 1 }
      : { date: currentDate, count: 1 };

  const response = NextResponse.json({ success: true });
  response.cookies.set("yt_usage", JSON.stringify(next), {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });

  return response;
}
