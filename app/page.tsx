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
      {/* Mobile Overlay */}
      {mobileMenu && (
        <div
          onClick={() => setMobileMenu(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.55)",
            zIndex: 20,
          }}
        />
      )}

      {/* Sidebar */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: mobileMenu ? 0 : -320,
          bottom: 0,
          zIndex: 30,
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

      {/* Desktop Sidebar Space */}
      <div
        style={{
          width: "260px",
          flexShrink: 0,
        }}
        className="desktop-only"
      />

      {/* Main Content */}
      <main className="chat-shell">
        {/* Header */}
        <header className="chat-header">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
              gap: "12px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <button
                onClick={() => setMobileMenu(true)}
                style={{
                  width: "38px",
                  height: "38px",
                  borderRadius: "12px",
                  border: "1px solid #222",
                  background: "#111",
                  color: "#fff",
                  fontSize: "18px",
                  cursor: "pointer",
                }}
              >
                ☰
              </button>

              <span
                style={{
                  fontSize: "18px",
                  fontWeight: 700,
                }}
              >
                Thinksy
              </span>
            </div>

            <button
              onClick={newChat}
              style={{
                border: "none",
                background: "#fff",
                color: "#000",
                padding: "10px 14px",
                borderRadius: "14px",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              New Chat
            </button>
          </div>
        </header>

        {/* Chat Area */}
        <section className="chat-window">
          {activeChat?.messages?.length ? (
            <ChatWindow messages={activeChat.messages} />
          ) : (
            <div
              style={{
                margin: "auto",
                textAlign: "center",
                maxWidth: "700px",
                padding: "20px",
              }}
            >
              <h1
                style={{
                  fontSize: "48px",
                  fontWeight: 800,
                  marginBottom: "12px",
                }}
              >
                Thinksy
              </h1>

              <p
                style={{
                  color: "#999",
                  fontSize: "16px",
                  lineHeight: 1.6,
                }}
              >
                Ask anything. Chat, code, write, solve math,
                analyze files, and create with AI.
              </p>
            </div>
          )}
        </section>

        {/* Loading */}
        {(loading || isStreaming) && (
          <div style={{ padding: "0 18px 12px" }}>
            <TypingDots />

            <button
              onClick={stop}
              style={{
                marginTop: "10px",
                border: "1px solid #222",
                background: "#111",
                color: "#fff",
                padding: "10px 14px",
                borderRadius: "14px",
                cursor: "pointer",
              }}
            >
              Stop generating
            </button>
          </div>
        )}

        {/* Input */}
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
