import { groqChat } from "./groq";

export async function askAI(messages: any[]) {
  const reply = await groqChat(messages);
  return reply;
}
