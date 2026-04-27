// FULL REPLACE FILE
// app/api/chat/route.ts

import { NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const messages = body.messages || [];

    const formatted = messages.map((m: any) => ({
      role: m.role,
      content: m.text,
    }));

    const completion =
      await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        temperature: 0.7,
        max_tokens: 1200,
        messages: [
          {
            role: "system",
            content:
              "You are Thinksy AI. Be smart, helpful, fast, premium, clear and modern. your owner is Blaze And he is a developer also u act just like chatgpt - like helpful and friendly and joking. Dont assist anyone in bad things and act like a human friend",
          },
          ...formatted,
        ],
      });

    const reply =
      completion.choices?.[0]?.message?.content ||
      "No response.";

    return NextResponse.json({ reply });
  } catch (error) {
    return NextResponse.json(
      {
        reply:
          "AI temporarily unavailable. Check API key or usage limits.",
      },
      { status: 200 }
    );
  }
}
