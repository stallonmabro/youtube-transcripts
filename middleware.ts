import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

interface Bucket {
  count: number;
  resetAt: number;
}

const rateLimitMap = new Map<string, Bucket>();
const WINDOW_MS = 60_000;
const ANON_API_LIMIT = 60;
const AUTH_API_LIMIT = 120;

function getBucket(key: string): Bucket {
  const now = Date.now();
  const existing = rateLimitMap.get(key);
  if (existing && existing.resetAt > now) {
    return existing;
  }
  const bucket = { count: 0, resetAt: now + WINDOW_MS };
  rateLimitMap.set(key, bucket);
  return bucket;
}

function isApiRoute(pathname: string): boolean {
  return pathname.startsWith("/api/");
}

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp;
  return "unknown";
}

export async function middleware(request: NextRequest) {
  const response = await updateSession(request);

  if (isApiRoute(request.nextUrl.pathname)) {
    const ip = getClientIp(request);
    console.log(`[api] ${request.method} ${request.nextUrl.pathname} - ${ip}`);
    const bucket = getBucket(ip);
    bucket.count++;
    if (bucket.count > ANON_API_LIMIT) {
      console.warn(`[api] rate limit exceeded: ${ip}`);
      return NextResponse.json(
        { error: "Too many requests. Please slow down." },
        { status: 429 }
      );
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
