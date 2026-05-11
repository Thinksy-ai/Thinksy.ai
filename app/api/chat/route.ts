import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const message = body.message;

    if (!message) {
      return NextResponse.json({
        reply: "No message provided.",
      });
    }

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer":
            "https://lumina-ai.vercel.app",
          "X-Title": "Lumina AI",
        },
        body: JSON.stringify({
          model:
            "deepseek/deepseek-chat-v3-0324:free",

          messages: [
            {
              role: "system",
              content:
                "You are Lumina AI, a futuristic ultra intelligent assistant.",
            },
            {
              role: "user",
              content: message,
            },
          ],
        }),
      }
    );

    const data = await response.json();

    console.log(data);

    return NextResponse.json({
      reply:
        data.choices?.[0]?.message
          ?.content ||
        "No AI response.",
    });
  } catch (err) {
    console.log(err);

    return NextResponse.json({
      reply:
        "Lumina AI failed to respond.",
    });
  }
}
