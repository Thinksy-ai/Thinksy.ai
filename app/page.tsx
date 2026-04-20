"use client";

import { useState } from "react";
import { useChats } from "@/hooks/useChats";
import { useStream } from "@/hooks/useStream";
import ChatWindow from "@/components/chat/ChatWindow";
import ChatInput from "@/components/chat/ChatInput";
import Sidebar from "@/components/sidebar/Sidebar";
import TypingDots from "@/components/chat/TypingDots";

export default function Home() {
  const {
    chats,
    activeChat,
    activeId,
    setActiveId,
    addMessage,
    updateLastMessage,
    newChat,
    renameChat,
    deleteChat,
  } = useChats();

  const { startStream, stop, isStreaming } = useStream();
  const [input, setInput] = useState("");

  const send = async () => {
    if (!input || isStreaming) return;

    addMessage({ role: "user", content: input });

    const res = await fetch("/api/chat", {
      method: "POST",
      body: JSON.stringify({ messages: activeChat.messages }),
    });

    const data = await res.json();

    addMessage({ role: "assistant", content: "" });

    await startStream(data.reply, (chunk: string) => {
      updateLastMessage(chunk);
    });

    setInput("");
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar
        chats={chats}
        activeId={activeId}
        setActiveId={setActiveId}
        newChat={newChat}
        renameChat={renameChat}
        deleteChat={deleteChat}
      />

      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <ChatWindow messages={activeChat?.messages || []} />

        {isStreaming && (
          <>
            <TypingDots />
            <button onClick={stop}>Stop generating</button>
          </>
        )}

        <ChatInput
          input={input}
          setInput={setInput}
          send={send}
        />
      </div>
    </div>
  );
}
