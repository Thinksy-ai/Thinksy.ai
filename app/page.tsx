"use client";

import { useState } from "react";
import { useChat } from "@/hooks/useChat";
import ChatWindow from "@/components/chat/ChatWindow";
import ChatInput from "@/components/chat/ChatInput";

export default function Home() {
  const { messages, sendMessage, loading } = useChat();
  const [input, setInput] = useState("");

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <h2 style={{ padding: 10 }}>Thinksy AI</h2>

      <ChatWindow messages={messages} />

      {loading && <div style={{ padding: 10 }}>Typing...</div>}

      <ChatInput
        input={input}
        setInput={setInput}
        send={() => {
          sendMessage(input);
          setInput("");
        }}
      />
    </div>
  );
}
