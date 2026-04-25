"use client";

import { useState } from "react";

// ✅ FIXED IMPORTS (NO @/)
import { useChats } from "../hooks/useChats";
import { useStream } from "../hooks/useStream";

import Sidebar from "../components/sidebar/Sidebar";
import ChatWindow from "../components/chat/ChatWindow";
import ChatInput from "../components/chat/ChatInput";
import TypingDots from "../components/chat/TypingDots";

import { askAI } from "../lib/ai/realAI";
import { speakElevenLabs } from "../lib/voice/elevenlabs";

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
  const [loading, setLoading] = useState(false);

  // 🧠 AI CALL (IMPROVED)
  const callAI = async (messages: any[]) => {
    try {
      setLoading(true);

      const reply = await askAI(messages);

      // add empty assistant message for streaming
      addMessage({ role: "assistant", content: "" });

      let finalText = "";

      await startStream(reply, (chunk: string) => {
        finalText = chunk;
        updateLastMessage(chunk);
      });

      // 🔊 voice (safe)
      if (finalText) {
        speakElevenLabs(finalText);
      }

    } catch (err) {
      console.error("AI ERROR:", err);

      addMessage({
        role: "assistant",
        content: "⚠️ Something went wrong. Try again.",
      });

    } finally {
      setLoading(false);
    }
  };

  // 📤 SEND MESSAGE
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

    setInput("");

    await callAI(activeChat?.messages || []);
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      
      {/* 📂 SIDEBAR */}
      <Sidebar
        chats={chats}
        activeId={activeId}
        setActiveId={setActiveId}
        newChat={newChat}
        renameChat={renameChat}
        deleteChat={deleteChat}
      />

      {/* 💬 MAIN CHAT */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          background: "#0f0f0f",
        }}
      >
        {/* 🧠 CHAT AREA */}
        <ChatWindow messages={activeChat?.messages || []} />

        {/* ⏳ TYPING / LOADING */}
        {(isStreaming || loading) && (
          <div style={{ padding: 10 }}>
            <TypingDots />
            <button
              onClick={stop}
              style={{
                marginTop: 5,
                background: "#222",
                color: "#fff",
                border: "none",
                padding: "6px 10px",
                borderRadius: 6,
                cursor: "pointer",
              }}
            >
              Stop
            </button>
          </div>
        )}

        {/* ✍️ INPUT */}
        <ChatInput
          input={input}
          setInput={setInput}
          send={send}
        />
      </div>
    </div>
  );
}
