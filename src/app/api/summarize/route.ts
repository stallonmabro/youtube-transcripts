import { NextRequest } from "next/server";

interface SummarizeBody {
  transcript: string;
  length: "brief" | "detailed" | "bullets";
}

const LENGTH_PROMPTS: Record<string, string> = {
  brief:
    "Provide a brief summary in 2-3 sentences covering the main topic and key takeaway.",
  detailed:
    "Provide a detailed summary covering the main topics, key arguments, and important conclusions from the transcript.",
  bullets:
    "Provide a summary as bullet points listing the key topics, ideas, and takeaways.",
};

export async function POST(request: NextRequest) {
  try {
    const body: SummarizeBody = await request.json();

    if (!body.transcript || body.transcript.trim().length < 10) {
      return Response.json(
        { error: "Transcript is too short or empty." },
        { status: 400 }
      );
    }

    const MAX_TRANSCRIPT_CHARS = 25_000;
    if (body.transcript.length > MAX_TRANSCRIPT_CHARS) {
      return Response.json(
        { error: "Transcript is too long to summarize." },
        { status: 400 }
      );
    }

    const lengthInstruction =
      LENGTH_PROMPTS[body.length] || LENGTH_PROMPTS.brief;

    const systemPrompt = `You are a helpful assistant that summarizes YouTube video transcripts. ${lengthInstruction} Keep it concise and well-structured.`;

    const apiKey = process.env.DEEPSEEK_API_KEY;
    const apiUrl = "https://api.deepseek.com/v1";
    const model = process.env.AI_MODEL || "deepseek-chat";

    if (apiKey) {
      const res = await fetch(`${apiUrl}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: "system", content: systemPrompt },
            {
              role: "user",
              content: `Here is the transcript:\n\n${body.transcript}`,
            },
          ],
          max_tokens: body.length === "brief" ? 300 : 800,
          temperature: 0.5,
        }),
      });

      if (!res.ok) {
        const errData = await res.text();
        console.error("DeepSeek API error:", errData);
        throw new Error("AI service temporarily unavailable");
      }

      const data = await res.json();
      return Response.json({ summary: data.choices[0].message.content });
    }

    // Fallback: simple extractive summary
    const words = body.transcript.split(/\s+/).filter(Boolean);
    const firstPart = words.slice(0, Math.min(100, words.length)).join(" ");

    let summary = `This video covers: ${firstPart}...`;

    if (body.length === "bullets") {
      const sentences = body.transcript
        .split(/[.!?]+/)
        .filter((s) => s.trim().length > 20)
        .slice(0, 5);
      summary = sentences
        .map((s) => `• ${s.trim()}.`)
        .join("\n");
    } else if (body.length === "detailed") {
      const sentences = body.transcript
        .split(/[.!?]+/)
        .filter((s) => s.trim().length > 20)
        .slice(0, 8);
      summary = sentences.map((s) => s.trim() + ".").join(" ");
    }

    return Response.json({ summary });
  } catch (error) {
    console.error("Summarize error:", error);
    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      },
      { status: 500 }
    );
  }
}
