import fs from "fs";
import path from "path";
import type { TranscriptSegment } from "./youtube";

export interface SharedTranscript {
  id: string;
  videoId: string;
  segments: TranscriptSegment[];
  createdAt: string;
}

const SHARED_DIR = path.join(process.cwd(), ".shared");

function ensureDir() {
  if (!fs.existsSync(SHARED_DIR)) {
    fs.mkdirSync(SHARED_DIR, { recursive: true });
  }
}

function generateId(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < 8; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

export function saveSharedTranscript(
  videoId: string,
  segments: TranscriptSegment[]
): SharedTranscript {
  ensureDir();

  let id = generateId();
  // Ensure uniqueness
  while (fs.existsSync(path.join(SHARED_DIR, `${id}.json`))) {
    id = generateId();
  }

  const data: SharedTranscript = {
    id,
    videoId,
    segments,
    createdAt: new Date().toISOString(),
  };

  fs.writeFileSync(
    path.join(SHARED_DIR, `${id}.json`),
    JSON.stringify(data, null, 2)
  );

  return data;
}

export function getSharedTranscript(
  id: string
): SharedTranscript | null {
  ensureDir();

  // Prevent path traversal
  if (!/^[a-z0-9]{8}$/.test(id)) return null;

  const filePath = path.join(SHARED_DIR, `${id}.json`);
  if (!fs.existsSync(filePath)) return null;

  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(raw) as SharedTranscript;
  } catch {
    return null;
  }
}
