import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model:
            "meta-llama/llama-3.3-70b-instruct:free",

          messages: [
            {
              role: "system",
              content:
                "You are Lumina AI, a futuristic assistant.",
            },
            {
              role: "user",
              content: body.message,
            },
          ],
        }),
      }
    );

    const data = await response.json();

    console.log(data);

    return NextResponse.json({
      reply:
        data?.choices?.[0]?.message
          ?.content ||
        "No response given.",
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json({
      reply: "AI request failed.",
    });
  }
}
