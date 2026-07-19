import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { ANON_DAILY_LIMIT, AUTH_DAILY_LIMIT } from "@/lib/constants";
import { getClientIp, hashIp, today } from "@/lib/rate-limit";

function parseUsageCookie(cookie: string | undefined): { date: string; count: number } {
  if (!cookie) return { date: "", count: 0 };
  try {
    return JSON.parse(cookie);
  } catch {
    return { date: "", count: 0 };
  }
}

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const todayStr = today();
    const { count } = await supabase
      .from("usage_logs")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .gte("created_at", `${todayStr}T00:00:00Z`)
      .lte("created_at", `${todayStr}T23:59:59Z`);

    return NextResponse.json({
      allowed: (count ?? 0) < AUTH_DAILY_LIMIT,
      count: count ?? 0,
      limit: AUTH_DAILY_LIMIT,
    });
  }

  const ip = getClientIp(request.headers);
  const ipHash = hashIp(ip);
  const date = today();
  const admin = createAdminClient();

  const { data: existing } = await admin
    .from("anonymous_usage")
    .select("count")
    .eq("ip_hash", ipHash)
    .eq("date", date)
    .single();

  const dbCount = existing?.count ?? 0;
  const raw = request.cookies.get("yt_usage")?.value;
  const parsed = parseUsageCookie(raw);
  const currentDate = today();
  const cookieCount = parsed.date === currentDate ? parsed.count : 0;
  const count = Math.max(dbCount, cookieCount);

  return NextResponse.json({
    allowed: count < ANON_DAILY_LIMIT,
    count,
    limit: ANON_DAILY_LIMIT,
  });
}
