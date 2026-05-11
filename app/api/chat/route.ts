import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "HTTP-Referer": "https://thinksyultra.vercel.app",
          "X-Title": "Lumina AI",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "openai/gpt-3.5-turbo",

          messages: [
            {
              role: "system",
              content:
                "You are Lumina Ultra AI, a futuristic smart assistant.",
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

    console.log("OPENROUTER:", data);

    if (data.error) {
      return NextResponse.json({
        reply:
          "API Error: " + data.error.message,
      });
    }

    return NextResponse.json({
      reply:
        data.choices?.[0]?.message?.content ||
        "Model returned empty response.",
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json({
      reply: "Server crashed.",
    });
  }
}
