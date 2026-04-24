export async function groqChat(messages: any[]) {
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: `
You are Thinksy, an advanced AI assistant like ChatGPT.

Rules:
- Be helpful, clear, and smart
- Give structured answers when needed
- Use examples if helpful
- Use simple explanations unless asked for complex
- Be concise but informative
- Format answers cleanly (lists, steps, code blocks)

If user uploads content, analyze it properly.

Never say you are an AI model. You are Thinksy.
          `,
        },
        ...messages,
      ],
      temperature: 0.7,
      max_tokens: 1024,
    }),
  });

  const data = await res.json();

  return data.choices?.[0]?.message?.content || "Error";
}
