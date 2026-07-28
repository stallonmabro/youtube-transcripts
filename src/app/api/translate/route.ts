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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text, targetLanguage } = body as {
      text: string;
      targetLanguage: string;
    };

    if (!text || text.trim().length < 10) {
      return Response.json({ error: "Text is too short." }, { status: 400 });
    }

    const MAX_TEXT_CHARS = 25_000;
    if (text.length > MAX_TEXT_CHARS) {
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
        {
          error: "Translation is not configured.",
          code: "AI_NOT_CONFIGURED",
        },
        { status: 503 }
      );
    }

    const systemPrompt = `You are a translator. Translate the following YouTube transcript to ${lang.name}. Preserve the original meaning, tone, and line breaks. Return only the translation, no explanations.`;

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
          { role: "user", content: text },
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
    return Response.json({ translation: data.choices[0].message.content });
  } catch (error) {
    console.error("Translate error:", error);
    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
        code: "TRANSLATION_FAILED",
      },
      { status: 500 }
    );
  }
}
