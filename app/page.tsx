"use client";

import { useEffect, useRef, useState } from "react";
import {
  Menu,
  Search,
  MessageSquare,
  Grid2X2,
  Folder,
  Briefcase,
  PenSquare,
  Mic,
  Paperclip,
  SlidersHorizontal,
  ArrowUp,
  Copy,
  Volume2,
  ThumbsUp,
  ThumbsDown,
  RotateCcw,
  Video,
  MoreHorizontal,
  X,
  Sparkles,
} from "lucide-react";

type Role = "user" | "assistant";

type Msg = {
  id: number;
  role: Role;
  text: string;
};

export default function Home() {
  const [input, setInput] = useState("");
  const [mobileMenu, setMobileMenu] = useState(false);
  const [voiceOpen, setVoiceOpen] = useState(false);
  const [typing, setTyping] = useState(false);

  const [messages, setMessages] = useState<Msg[]>([
    {
      id: 1,
      role: "assistant",
      text: "Welcome to Thinksy Ultra. Ask anything.",
    },
  ]);

  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatRef.current?.scrollTo({
      top: chatRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, typing]);

  async function sendMessage() {
    const text = input.trim();
    if (!text) return;

    const userMsg: Msg = {
      id: Date.now(),
      role: "user",
      text,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setTyping(true);

    setTimeout(() => {
      setTyping(false);

      const aiMsg: Msg = {
        id: Date.now() + 1,
        role: "assistant",
        text: `Thinksy response to: ${text}`,
      };

      setMessages((prev) => [...prev, aiMsg]);
    }, 1200);
  }

  function copyText(text: string) {
    navigator.clipboard.writeText(text);
  }

  function speakText(text: string) {
    const utter = new SpeechSynthesisUtterance(text);
    speechSynthesis.speak(utter);
  }

  function regenerate() {
    const lastUser = [...messages].reverse().find((m) => m.role === "user");
    if (!lastUser) return;

    setTyping(true);

    setTimeout(() => {
      setTyping(false);

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          role: "assistant",
          text: `Regenerated answer for: ${lastUser.text}`,
        },
      ]);
    }, 1000);
  }

  return (
    <main className="thinksy-app">
      {/* SIDEBAR */}
      <aside className={`sidebar ${mobileMenu ? "show" : ""}`}>
        <div className="logoRow">
          <Sparkles size={18} />
          <span>Thinksy</span>
        </div>

        <div className="searchBox">
          <Search size={18} />
          <span>Search</span>
        </div>

        <button className="navBtn active">
          <MessageSquare size={18} />
          <span>Chat</span>
        </button>

        <button className="navBtn">
          <Grid2X2 size={18} />
          <span>Explore</span>
        </button>

        <button className="navBtn">
          <Folder size={18} />
          <span>Library</span>
        </button>

        <div className="sectionTitle">Projects</div>

        <button className="navBtn">
          <Briefcase size={18} />
          <span>Work</span>
        </button>

        <button className="navBtn">
          <PenSquare size={18} />
          <span>New Chat</span>
        </button>
      </aside>

      {/* MAIN */}
      <section className="mainPanel">
        {/* TOP */}
        <header className="topBar">
          <button
            className="iconBtn"
            onClick={() => setMobileMenu(!mobileMenu)}
          >
            <Menu size={20} />
          </button>

          <div className="title">Thinksy Ultra</div>

          <button className="iconBtn">
            <PenSquare size={20} />
          </button>
        </header>

        {/* CHAT */}
        <div className="chatArea" ref={chatRef}>
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`bubble ${msg.role === "user" ? "user" : "ai"}`}
            >
              {msg.text}

              {msg.role === "assistant" && (
                <div className="tools">
                  <button onClick={() => copyText(msg.text)}>
                    <Copy size={15} />
                  </button>

                  <button onClick={() => speakText(msg.text)}>
                    <Volume2 size={15} />
                  </button>

                  <button>
                    <ThumbsUp size={15} />
                  </button>

                  <button>
                    <ThumbsDown size={15} />
                  </button>

                  <button onClick={regenerate}>
                    <RotateCcw size={15} />
                  </button>
                </div>
              )}
            </div>
          ))}

          {typing && <div className="bubble ai shimmer">Thinking...</div>}
        </div>

        {/* INPUT */}
        <div className="inputWrap">
          <div className="inputBox">
            <textarea
              rows={1}
              placeholder="Ask anything..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" &&
                !e.shiftKey &&
                (e.preventDefault(), sendMessage())
              }
            />

            <div className="inputTools">
              <button>
                <Paperclip size={18} />
              </button>

              <button>
                <SlidersHorizontal size={18} />
              </button>

              <button onClick={() => setVoiceOpen(true)}>
                <Mic size={18} />
              </button>

              <button className="sendBtn" onClick={sendMessage}>
                <ArrowUp size={18} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* VOICE PANEL */}
      {voiceOpen && (
        <div className="voicePanel">
          <div className="voiceTop">
            <button>
              <Video size={18} />
            </button>

            <button>
              <Mic size={18} />
            </button>

            <button>
              <MoreHorizontal size={18} />
            </button>

            <button onClick={() => setVoiceOpen(false)}>
              <X size={18} />
            </button>
          </div>

          <div className="orb" />
          <p className="voiceText">Listening...</p>
        </div>
      )}

      <style jsx global>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          background: #000;
          color: #fff;
          font-family: Inter, sans-serif;
        }

        .thinksy-app {
          display: flex;
          height: 100vh;
          background: #000;
        }

        .sidebar {
          width: 265px;
          background: #0a0a0a;
          border-right: 1px solid #181818;
          padding: 14px;
        }

        .logoRow {
          display: flex;
          gap: 8px;
          align-items: center;
          font-weight: 700;
          font-size: 20px;
          padding: 10px;
          margin-bottom: 14px;
        }

        .searchBox,
        .navBtn,
        .iconBtn,
        .tools button,
        .inputTools button {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .searchBox {
          justify-content: flex-start;
          gap: 10px;
          height: 44px;
          border-radius: 14px;
          background: #141414;
          padding: 0 14px;
          color: #888;
          margin-bottom: 14px;
        }

        .navBtn {
          width: 100%;
          justify-content: flex-start;
          gap: 12px;
          height: 46px;
          border: none;
          color: #ddd;
          background: transparent;
          padding: 0 14px;
          border-radius: 14px;
          margin-bottom: 8px;
          cursor: pointer;
        }

        .navBtn:hover,
        .navBtn.active {
          background: #171717;
        }

        .sectionTitle {
          color: #666;
          font-size: 13px;
          padding: 14px 10px;
        }

        .mainPanel {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .topBar {
          height: 64px;
          border-bottom: 1px solid #141414;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 14px;
        }

        .title {
          font-size: 22px;
          font-weight: 700;
        }

        .iconBtn,
        .tools button,
        .inputTools button,
        .voiceTop button {
          width: 40px;
          height: 40px;
          border: none;
          border-radius: 50%;
          background: #111;
          color: #fff;
          cursor: pointer;
        }

        .chatArea {
          flex: 1;
          overflow-y: auto;
          padding: 24px;
        }

        .bubble {
          max-width: 780px;
          padding: 16px;
          border-radius: 18px;
          margin-bottom: 16px;
          line-height: 1.55;
          animation: fade 0.2s ease;
        }

        .bubble.ai {
          background: #101010;
          border: 1px solid #1a1a1a;
        }

        .bubble.user {
          background: #1b1b1b;
          margin-left: auto;
        }

        .tools {
          display: flex;
          gap: 8px;
          margin-top: 12px;
        }

        .inputWrap {
          padding: 16px;
        }

        .inputBox {
          background: #101010;
          border: 1px solid #1a1a1a;
          border-radius: 26px;
          padding: 14px;
        }

        .inputBox textarea {
          width: 100%;
          border: none;
          outline: none;
          background: transparent;
          color: #fff;
          resize: none;
          font-size: 16px;
          margin-bottom: 12px;
        }

        .inputTools {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
        }

        .sendBtn {
          background: #fff !important;
          color: #000 !important;
        }

        .voicePanel {
          position: fixed;
          right: 20px;
          top: 90px;
          width: 300px;
          height: 430px;
          background: #090909;
          border: 1px solid #1a1a1a;
          border-radius: 28px;
          padding: 18px;
        }

        .voiceTop {
          display: flex;
          justify-content: space-between;
        }

        .orb {
          width: 150px;
          height: 150px;
          border-radius: 50%;
          margin: 90px auto 0;
          background: radial-gradient(circle, #ffffff, #444);
          animation: pulse 1.8s infinite;
        }

        .voiceText {
          text-align: center;
          color: #aaa;
          margin-top: 20px;
        }

        .shimmer {
          opacity: 0.8;
        }

        @keyframes pulse {
          0% {
            transform: scale(1);
            opacity: 0.8;
          }
          50% {
            transform: scale(1.08);
            opacity: 1;
          }
          100% {
            transform: scale(1);
            opacity: 0.8;
          }
        }

        @keyframes fade {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 900px) {
          .sidebar {
            position: fixed;
            left: -280px;
            top: 0;
            bottom: 0;
            z-index: 100;
            transition: 0.25s;
          }

          .sidebar.show {
            left: 0;
          }

          .bubble {
            max-width: 100%;
          }

          .voicePanel {
            width: calc(100% - 20px);
            left: 10px;
            right: 10px;
            top: 80px;
          }
        }
      `}</style>
    </main>
  );
}
