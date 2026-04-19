import { getAIResponse } from "@/lib/ai";

export async function POST(req: Request) {
  const { messages } = await req.json();
  const reply = await getAIResponse(messages);
  return Response.json({ reply });
}
