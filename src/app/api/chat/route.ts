import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return Response.json({ error: "Sign in to use AI chat" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { transcript, messages: prevMessages } = body as {
      transcript: string;
      messages: ChatMessage[];
    };

    if (!transcript || transcript.trim().length < 10) {
      return Response.json(
        { error: "Transcript is too short." },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;
    const MAX_TRANSCRIPT_CHARS = 25_000;
    const MAX_HISTORY_MESSAGES = 20;

    if (transcript.length > MAX_TRANSCRIPT_CHARS) {
      return Response.json(
        { error: "Transcript is too long for AI chat." },
        { status: 400 }
      );
    }

    const trimmedHistory = (prevMessages || []).slice(-MAX_HISTORY_MESSAGES);
    if (!apiKey) {
      return Response.json(
        { error: "AI chat is not configured." },
        { status: 503 }
      );
    }

    const systemMessage = {
      role: "system",
      content:
        "You are a helpful assistant that answers questions about YouTube video transcripts. " +
        "Use the transcript provided to answer the user's questions accurately. " +
        "If the answer isn't in the transcript, say so. Be concise but thorough.",
    };

    const userContext = {
      role: "user",
      content: `Here is the video transcript:\n\n${transcript}\n\n---\n\nNow answer my questions about this transcript.`,
    };

    const messages = [
      systemMessage,
      userContext,
      ...trimmedHistory,
    ];

    const apiUrl = process.env.OPENAI_BASE_URL || "https://api.openai.com/v1";

    const res = await fetch(`${apiUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages,
        stream: true,
        max_tokens: 1024,
        temperature: 0.5,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("OpenAI chat error:", errText);
      return Response.json(
        { error: "AI service temporarily unavailable" },
        { status: 502 }
      );
    }

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        const reader = res.body?.getReader();
        if (!reader) {
          controller.close();
          return;
        }

        const decoder = new TextDecoder();
        let buffer = "";

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() || "";

            for (const line of lines) {
              const trimmed = line.trim();
              if (!trimmed || !trimmed.startsWith("data: ")) continue;
              const data = trimmed.slice(6);
              if (data === "[DONE]") continue;

              try {
                const parsed = JSON.parse(data);
                const content = parsed.choices?.[0]?.delta?.content || "";
                if (content) {
                  controller.enqueue(encoder.encode(content));
                }
              } catch {
                // skip malformed lines
              }
            }
          }
        } catch (err) {
          console.error("Stream error:", err);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
      },
    });
  } catch (error) {
    console.error("Chat error:", error);
    return Response.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
