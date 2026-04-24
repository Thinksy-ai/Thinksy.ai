export async function askAI(messages: any[]) {
  const res = await fetch("/api/chat", {
    method: "POST",
    body: JSON.stringify({ messages }),
  });

  const data = await res.json();

  return data.reply;
}
