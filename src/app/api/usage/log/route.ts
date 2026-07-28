import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { DAILY_LIMIT } from "@/lib/constants";
import { getClientIp, hashIp, today } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const admin = createAdminClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Authenticated: insert into usage_logs
  if (user) {
    await supabase.from("usage_logs").insert({ user_id: user.id });
    return NextResponse.json({ success: true });
  }

  // Anonymous: enforce IP-based limit, keep cookie as cache
  const ip = getClientIp(request.headers);
  const ipHash = hashIp(ip);
  const date = today();

  const { data: existing } = await admin
    .from("anonymous_usage")
    .select("count")
    .eq("ip_hash", ipHash)
    .eq("date", date)
    .single();

  const currentCount = existing?.count ?? 0;
  if (currentCount >= DAILY_LIMIT) {
    return NextResponse.json(
      { error: "Daily limit reached", allowed: false },
      { status: 429 }
    );
  }

  const { error: upsertError } = await admin
    .from("anonymous_usage")
    .upsert(
      { ip_hash: ipHash, date, count: currentCount + 1 },
      { onConflict: "ip_hash,date" }
    );

  if (upsertError) {
    return NextResponse.json({ error: upsertError.message }, { status: 500 });
  }

  const raw = request.cookies.get("yt_usage")?.value;
  let parsed = { date: "", count: 0 };
  try {
    if (raw) parsed = JSON.parse(raw);
  } catch {}
  const currentDate = today();

  const next =
    parsed.date === currentDate
      ? { date: currentDate, count: Math.max(parsed.count, currentCount + 1) }
      : { date: currentDate, count: currentCount + 1 };

  const response = NextResponse.json({ success: true, count: next.count, limit: DAILY_LIMIT });
  response.cookies.set("yt_usage", JSON.stringify(next), {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });

  return response;
}
