"use client";

import { useState } from "react";
import { useChat } from "@/hooks/useChat";
import { useChats } from "@/hooks/useChats";
import ChatWindow from "@/components/chat/ChatWindow";
import ChatInput from "@/components/chat/ChatInput";
import Sidebar from "@/components/sidebar/Sidebar";

export default function Home() {
  const { sendMessage } = useChat();
  const {
    chats,
    activeChat,
    activeId,
    setActiveId,
    addMessage,
    newChat
  } = useChats();

  const [input, setInput] = useState("");

  const send = async () => {
    if (!input) return;

    addMessage({ role: "user", content: input });

    const res = await fetch("/api/chat", {
      method: "POST",
      body: JSON.stringify({ messages: activeChat.messages }),
    });

    const data = await res.json();

    addMessage({ role: "assistant", content: data.reply });

    setInput("");
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar
        chats={chats}
        activeId={activeId}
        setActiveId={setActiveId}
        newChat={newChat}
      />

      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <ChatWindow messages={activeChat.messages} />

        <ChatInput
          input={input}
          setInput={setInput}
          send={send}
        />
      </div>
    </div>
  );
}
