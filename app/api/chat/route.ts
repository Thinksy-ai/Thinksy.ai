// app/api/chat/route.ts

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
        },

        body: JSON.stringify({
          model:
            "mistralai/mistral-7b-instruct:free",

          messages: [
            {
              role: "system",
              content:
                "You are Lumina AI, a futuristic helpful assistant.",
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

    if (data.error) {
      return NextResponse.json({
        reply:
          "API Error: " +
          data.error.message,
      });
    }

    return NextResponse.json({
      reply:
        data.choices?.[0]?.message
          ?.content ||
        "No response generated.",
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json({
      reply: "Server error occurred.",
    });
  }
}
