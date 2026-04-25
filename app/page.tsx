"use client";

import { useState } from "react";

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
  const [mobileMenu, setMobileMenu] = useState(false);

  const callAI = async (messages: any[]) => {
    try {
      setLoading(true);

      const reply = await askAI(messages);

      addMessage({
        role: "assistant",
        content: "",
      });

      let finalText = "";

      await startStream(reply, (chunk: string) => {
        finalText = chunk;
        updateLastMessage(chunk);
      });

      if (finalText) {
        speakElevenLabs(finalText);
      }
    } catch (error) {
      console.error(error);

      addMessage({
        role: "assistant",
        content: "⚠️ Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
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

    addMessage({
      role: "user",
      content,
    });

    setInput("");

    await callAI(activeChat?.messages || []);
  };

  return (
    <div className="main-layout">
      {/* MOBILE OVERLAY */}
      {mobileMenu && (
        <div
          onClick={() => setMobileMenu(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.55)",
            zIndex: 30,
          }}
        />
      )}

      {/* SIDEBAR */}
      <div
        style={{
          position: window.innerWidth <= 768 ? "fixed" : "relative",
          left: mobileMenu ? 0 : window.innerWidth <= 768 ? -320 : 0,
          top: 0,
          bottom: 0,
          zIndex: 40,
          transition: "0.25s ease",
        }}
      >
        <Sidebar
          chats={chats}
          activeId={activeId}
          setActiveId={setActiveId}
          newChat={newChat}
          renameChat={renameChat}
          deleteChat={deleteChat}
        />
      </div>

      {/* MAIN */}
      <main className="chat-shell">
        {/* HEADER */}
        <header className="chat-header">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              width: "100%",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <button
                onClick={() => setMobileMenu(true)}
                style={{
                  background: "#111",
                  color: "#fff",
                  border: "1px solid #222",
                  width: 38,
                  height: 38,
                  borderRadius: 12,
                  cursor: "pointer",
                  fontSize: 18,
                }}
              >
                ☰
              </button>

              <span
                style={{
                  fontWeight: 700,
                  fontSize: 18,
                  letterSpacing: "-0.3px",
                }}
              >
                Thinksy
              </span>
            </div>

            <button
              onClick={newChat}
              style={{
                background: "#fff",
                color: "#000",
                border: "none",
                padding: "10px 14px",
                borderRadius: 14,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              New Chat
            </button>
          </div>
        </header>

        {/* CHAT */}
        <section className="chat-window">
          {activeChat?.messages?.length ? (
            <ChatWindow messages={activeChat.messages} />
          ) : (
            <div
              style={{
                margin: "auto",
                textAlign: "center",
                opacity: 0.95,
                maxWidth: 700,
                padding: 20,
              }}
            >
              <h1
                style={{
                  fontSize: "clamp(28px,6vw,52px)",
                  marginBottom: 12,
                  fontWeight: 800,
                }}
              >
                Thinksy
              </h1>

              <p
                style={{
                  color: "#9ca3af",
                  fontSize: 16,
                  lineHeight: 1.6,
                }}
              >
                Ask anything. Write, code, research, solve maths,
                brainstorm ideas, and chat with your AI assistant.
              </p>
            </div>
          )}
        </section>

        {/* STREAMING */}
        {(loading || isStreaming) && (
          <div
            style={{
              padding: "0 18px 12px",
            }}
          >
            <TypingDots />

            <button
              onClick={stop}
              style={{
                marginTop: 10,
                background: "#111",
                color: "#fff",
                border: "1px solid #222",
                padding: "10px 14px",
                borderRadius: 14,
                cursor: "pointer",
              }}
            >
              Stop generating
            </button>
          </div>
        )}

        {/* INPUT */}
        <footer className="chat-input-wrap">
          <ChatInput
            input={input}
            setInput={setInput}
            send={send}
          />
        </footer>
      </main>
    </div>
  );
}
