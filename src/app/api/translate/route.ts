import { NextRequest } from "next/server";

const LANGUAGES = [
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "it", name: "Italian" },
  { code: "pt", name: "Portuguese" },
  { code: "nl", name: "Dutch" },
  { code: "ru", name: "Russian" },
  { code: "ja", name: "Japanese" },
  { code: "ko", name: "Korean" },
  { code: "zh", name: "Chinese (Simplified)" },
  { code: "ar", name: "Arabic" },
  { code: "hi", name: "Hindi" },
] as const;

export { LANGUAGES };

interface Segment {
  offset: number;
  text: string;
}

function fmt(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function parseTranslated(input: string, originalSegments: Segment[]): Segment[] {
  const results: Segment[] = [];
  const lines = input.split("\n");
  let currentText = "";

  for (const line of lines) {
    const match = line.match(/^\[(\d{2}):(\d{2})\]\s*/);
    if (match) {
      if (currentText.trim()) {
        const prev = results[results.length - 1];
        if (prev) {
          prev.text = currentText.trim();
        }
      }
      const mins = parseInt(match[1], 10);
      const secs = parseInt(match[2], 10);
      const offset = mins * 60 + secs;
      currentText = line.slice(match[0].length);
      results.push({ offset, text: "" });
    } else if (line.trim()) {
      if (results.length === 0) {
        // No timestamp markers in output — fall back to mapping by position
        break;
      }
      currentText += (currentText ? " " : "") + line;
    }
  }

  // Flush last segment
  if (currentText.trim() && results.length > 0) {
    const prev = results[results.length - 1];
    prev.text = currentText.trim();
  }

  // If timestamp parsing failed, map translations to original segments by position
  if (results.length === 0 || results.every((s) => !s.text)) {
    const paragraphs = input
      .split(/\n\n+/)
      .map((p) => p.trim())
      .filter(Boolean);

    if (paragraphs.length <= originalSegments.length && paragraphs.length > 0) {
      return originalSegments.slice(0, paragraphs.length).map((seg, i) => ({
        offset: seg.offset,
        text: paragraphs[i],
      }));
    }

    // Absolute fallback: return the full translation as one segment
    const cleanText = input.trim();
    if (cleanText && originalSegments.length > 0) {
      return [
        {
          offset: originalSegments[0].offset,
          text: cleanText.replace(/\[(\d{2}):(\d{2})\]\s*/g, ""),
        },
      ];
    }
  }

  return results.filter((s) => s.text);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { segments, targetLanguage } = body as {
      segments: Segment[];
      targetLanguage: string;
    };

    if (!segments || !Array.isArray(segments) || segments.length === 0) {
      return Response.json({ error: "Segments array is required." }, { status: 400 });
    }

    const combinedText = segments.map((s) => s.text).join(" ");
    if (combinedText.trim().length < 10) {
      return Response.json({ error: "Text is too short." }, { status: 400 });
    }

    if (combinedText.length > 25_000) {
      return Response.json(
        { error: "Text is too long to translate." },
        { status: 400 }
      );
    }

    const lang = LANGUAGES.find((l) => l.code === targetLanguage);
    if (!lang) {
      return Response.json({ error: "Unsupported language." }, { status: 400 });
    }

    const apiKey = process.env.DEEPSEEK_API_KEY;
    const apiUrl = "https://api.deepseek.com/v1";
    const model = process.env.AI_MODEL || "deepseek-chat";

    if (!apiKey) {
      return Response.json(
        { error: "Translation is not configured.", code: "AI_NOT_CONFIGURED" },
        { status: 503 }
      );
    }

    // Format input with timestamp markers
    const markedText = segments
      .map((s) => `[${fmt(s.offset)}] ${s.text}`)
      .join("\n\n");

    const systemPrompt = `You are a translator. Translate each line of the following YouTube transcript to ${lang.name}.

CRITICAL RULES:
- Keep EVERY [MM:SS] timestamp marker EXACTLY as-is at the start of each segment.
- Translate only the text AFTER the marker to ${lang.name}.
- Preserve the original meaning, tone, and paragraph structure.
- Return ONLY the translated text with markers. No explanations, no preamble.`;

    const response = await fetch(`${apiUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: markedText },
        ],
        max_tokens: 4096,
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const errData = await response.text();
      console.error("Translation API error:", errData);
      throw new Error("Translation service temporarily unavailable");
    }

    const data = await response.json();
    const rawTranslation = data.choices[0].message.content;
    const translatedSegments = parseTranslated(rawTranslation, segments);

    return Response.json({ segments: translatedSegments });
  } catch (error) {
    console.error("Translate error:", error);
    return Response.json(
      {
        error:
          error instanceof Error ? error.message : "An unexpected error occurred",
        code: "TRANSLATION_FAILED",
      },
      { status: 500 }
    );
  }
}
