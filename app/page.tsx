"use client";

import { useState } from "react";
import { useChat } from "@/hooks/useChat";
import ChatWindow from "@/components/chat/ChatWindow";
import ChatInput from "@/components/chat/ChatInput";
import Sidebar from "@/components/sidebar/Sidebar";

export default function Home() {
  const { messages, sendMessage, loading } = useChat();
  const [input, setInput] = useState("");

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      
      <Sidebar />

      <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "column"
      }}>
        <ChatWindow messages={messages} />

        {loading && <div style={{ padding: 10 }}>Thinksy is typing...</div>}

        <ChatInput
          input={input}
          setInput={setInput}
          send={() => {
            sendMessage(input);
            setInput("");
          }}
        />
      </div>
    </div>
  );
}
