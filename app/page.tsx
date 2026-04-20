"use client";

import { useState } from "react";
import { useChats } from "@/hooks/useChats";
import { useStream } from "@/hooks/useStream";
import { useDebug } from "@/hooks/useDebug";

import ChatWindow from "@/components/chat/ChatWindow";
import ChatInput from "@/components/chat/ChatInput";
import Sidebar from "@/components/sidebar/Sidebar";
import TypingDots from "@/components/chat/TypingDots";
import ExportButtons from "@/components/ui/ExportButtons";
import DebugPanel from "@/components/ui/DebugPanel";

export default function Home() {
  const {
    chats,
    activeChat,
    activeId,
    setActiveId,
    addMessage,
    updateLastMessage,
    editMessage,
    newChat,
    renameChat,
    deleteChat,
  } = useChats();

  const { startStream, stop, isStreaming } = useStream();
  const { error, wrap } = useDebug();

  const [input, setInput] = useState("");

  const callAI = async (messages: any[]) => {
    await wrap(async () => {
      const res = await fetch("/api/chat", {
        method: "POST",
        body: JSON.stringify({ messages }),
      });

      const data = await res.json();

      addMessage({ role: "assistant", content: "" });

      await startStream(data.reply, (chunk: string) => {
        updateLastMessage(chunk);
      });
    });
  };

  const send = async () => {
    if (!input || isStreaming) return;

    addMessage({ role: "user", content: input });

    await callAI(activeChat.messages);

    setInput("");
  };

  const handleEdit = async (index: number, newText: string) => {
    editMessage(index, newText);
    await callAI(activeChat.messages.slice(0, index + 1));
  };

  const handleRegenerate = async (index: number) => {
    const messages = activeChat.messages.slice(0, index);
    await callAI(messages);
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
        <DebugPanel error={error} />

        <ChatWindow
          messages={activeChat?.messages || []}
          onEdit={handleEdit}
          onRegenerate={handleRegenerate}
        />

        <ExportButtons messages={activeChat?.messages || []} />

        {isStreaming && (
          <>
            <TypingDots />
            <button onClick={stop}>Stop</button>
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
