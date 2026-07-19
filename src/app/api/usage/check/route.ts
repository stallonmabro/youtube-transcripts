import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const ANON_LIMIT = 3;
const AUTH_LIMIT = 100;

function parseUsageCookie(cookie: string | undefined): { date: string; count: number } {
  if (!cookie) return { date: "", count: 0 };
  try {
    return JSON.parse(cookie);
  } catch {
    return { date: "", count: 0 };
  }
}

function today(): string {
  return new Date().toISOString().slice(0, 10);
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
      allowed: (count ?? 0) < AUTH_LIMIT,
      count: count ?? 0,
      limit: AUTH_LIMIT,
    });
  }

  const raw = request.cookies.get("yt_usage")?.value;
  const parsed = parseUsageCookie(raw);
  const currentDate = today();

  if (parsed.date !== currentDate) {
    return NextResponse.json({ allowed: true, count: 0, limit: ANON_LIMIT });
  }

  return NextResponse.json({
    allowed: parsed.count < ANON_LIMIT,
    count: parsed.count,
    limit: ANON_LIMIT,
  });
}
