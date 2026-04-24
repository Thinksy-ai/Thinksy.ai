"use client";

import { useState } from "react";
import { useChats } from "@/hooks/useChats";
import { useStream } from "@/hooks/useStream";

import Sidebar from "@/components/sidebar/Sidebar";
import ChatWindow from "@/components/chat/ChatWindow";
import ChatInput from "@/components/chat/ChatInput";
import TypingDots from "@/components/chat/TypingDots";

import { askAI } from "@/lib/ai/realAI";
import { speakElevenLabs } from "@/lib/voice/elevenlabs";

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

  // ✅ FULL AI FUNCTION (no confusion now)
  const callAI = async (messages: any[]) => {
    const reply = await askAI(messages);

    addMessage({ role: "assistant", content: "" });

    let finalText = "";

    await startStream(reply, (chunk: string) => {
      finalText = chunk;
      updateLastMessage(chunk);
    });

    // 🔊 Speak with ElevenLabs
    speakElevenLabs(finalText);
  };

  const send = async (file?: any) => {
    if (!input && !file) return;

    let content = input;

    if (file) {
      if (file.type === "image") {
        content += `\n[Image: ${file.name}]`;
      } else {
        content += `\n${file.data}`;
      }
    }

    addMessage({ role: "user", content });

    await callAI(activeChat.messages);

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
