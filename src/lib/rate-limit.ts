import { createHash } from "crypto";

export function getClientIp(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  const realIp = headers.get("x-real-ip");
  if (realIp) return realIp;
  return "unknown";
}

export function hashIp(ip: string): string {
  return createHash("sha256").update(ip).digest("hex");
}

export function today(): string {
  return new Date().toISOString().slice(0, 10);
}
