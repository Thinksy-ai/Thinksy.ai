import { useState } from "react";

export function useChat() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async (input: string) => {
    if (!input) return;

    setLoading(true);

    const newMsgs = [...messages, { role: "user", content: input }];
    setMessages(newMsgs);

    const res = await fetch("/api/chat", {
      method: "POST",
      body: JSON.stringify({ messages: newMsgs }),
    });

    const data = await res.json();

    setMessages([
      ...newMsgs,
      { role: "assistant", content: data.reply },
    ]);

    setLoading(false);
  };

  return { messages, sendMessage, loading };
}
