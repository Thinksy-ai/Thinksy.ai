import { SYSTEM_PROMPT } from "./prompt";

export async function getAIResponse(messages: any[]) {
  const res = await fetch(
    "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.HF_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs:
          SYSTEM_PROMPT +
          "\n" +
          messages.map((m) => m.content).join("\n"),
      }),
    }
  );

  const data = await res.json();
  return data?.[0]?.generated_text || "No response";
}
