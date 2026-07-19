export interface SrtEntry {
  index: number;
  start: string;
  end: string;
  text: string;
  startSeconds: number;
  endSeconds: number;
}

function timestampToSeconds(ts: string): number {
  const [hms, ms] = ts.trim().split(",");
  const [h, m, s] = hms.split(":").map(Number);
  return h * 3600 + m * 60 + s + Number(ms) / 1000;
}

export function parseSrt(content: string): SrtEntry[] {
  const normalized = content.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  const blocks = normalized.split(/\n\s*\n/);
  const entries: SrtEntry[] = [];

  for (const block of blocks) {
    const lines = block.trim().split("\n");
    if (lines.length < 2) continue;

    const timeLine = lines.find((l) => l.includes(" --> "));
    if (!timeLine) continue;

    const [start, end] = timeLine.split(" --> ");
    const text = lines
      .slice(lines.indexOf(timeLine) + 1)
      .join("\n")
      .trim();
    if (!text) continue;

    entries.push({
      index: entries.length + 1,
      start: start.trim(),
      end: end.trim(),
      text,
      startSeconds: timestampToSeconds(start),
      endSeconds: timestampToSeconds(end),
    });
  }

  return entries;
}

export function srtToVtt(content: string): string {
  const entries = parseSrt(content);
  const lines = ["WEBVTT", ""];
  for (const entry of entries) {
    lines.push(`${entry.index}`);
    lines.push(
      `${entry.start.replace(",", ".")} --> ${entry.end.replace(",", ".")}`
    );
    lines.push(entry.text);
    lines.push("");
  }
  return lines.join("\n");
}

export function srtToTxt(content: string): string {
  const entries = parseSrt(content);
  return entries.map((e) => e.text).join("\n\n");
}

function formatAssTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  const cs = Math.round((s - Math.floor(s)) * 100);
  return `${h}:${String(m).padStart(2, "0")}:${String(Math.floor(s)).padStart(2, "0")}.${String(cs).padStart(2, "0")}`;
}

export function srtToAss(content: string): string {
  const entries = parseSrt(content);
  const header = `[Script Info]
Title: Converted Subtitles
ScriptType: v4.00+
WrapStyle: 0
ScaledBorderAndShadow: yes
PlayResX: 1920
PlayResY: 1080

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Default,Arial,48,&H00FFFFFF,&H000000FF,&H00000000,&H00000000,0,0,0,0,100,100,0,0,1,2,0,2,10,10,40,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
`;

  const lines = entries.map((e) => {
    const start = formatAssTime(e.startSeconds);
    const end = formatAssTime(e.endSeconds);
    const text = e.text.replace(/\n/g, "\\N");
    return `Dialogue: 0,${start},${end},Default,,0,0,0,,${text}`;
  });

  return header + lines.join("\n") + "\n";
}

export function downloadFile(content: string, filename: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
