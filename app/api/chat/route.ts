import { NextResponse } from "next/server";
import { groqChat } from "@/lib/ai/groq";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const reply = await groqChat(messages);

    return NextResponse.json({ reply });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({
      reply: "Error: AI failed",
    });
  }
}
