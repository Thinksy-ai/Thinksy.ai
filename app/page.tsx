"use client";

import { useState, useEffect } from "react";
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
} from "lucide-react";

export default function Home() {
  const [input, setInput] = useState("");
  const [mobileMenu, setMobileMenu] = useState(false);
  const [voiceOpen, setVoiceOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Welcome to Thinksy. Ask anything.",
    },
  ]);

  const [typing, setTyping] = useState(false);

  const sendMessage = () => {
    if (!input.trim()) return;

    const userText = input;

    setMessages((prev) => [...prev, { role: "user", text: userText }]);
    setInput("");
    setTyping(true);

    setTimeout(() => {
      setTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text:
            "This is a demo AI response. Connect your API in lib/ai to make Thinksy fully live.",
        },
      ]);
    }, 1200);
  };

  return (
    <main className="thinksy-app">
      {/* SIDEBAR */}
      <aside className={`sidebar ${mobileMenu ? "show" : ""}`}>
        <div className="searchBox">
          <Search size={18} />
          <span>Search</span>
        </div>

        <nav>
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
        </nav>
      </aside>

      {/* MAIN */}
      <section className="mainPanel">
        {/* TOP BAR */}
        <header className="topBar">
          <button
            className="iconBtn"
            onClick={() => setMobileMenu(!mobileMenu)}
          >
            <Menu size={20} />
          </button>

          <div className="title">Chat</div>

          <button className="iconBtn">
            <PenSquare size={20} />
          </button>
        </header>

        {/* CHAT */}
        <div className="chatArea">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`bubble ${msg.role === "user" ? "user" : "ai"}`}
            >
              {msg.text}

              {msg.role === "assistant" && (
                <div className="tools">
                  <button><Copy size={16} /></button>
                  <button><Volume2 size={16} /></button>
                  <button><ThumbsUp size={16} /></button>
                  <button><ThumbsDown size={16} /></button>
                  <button><RotateCcw size={16} /></button>
                </div>
              )}
            </div>
          ))}

          {typing && (
            <div className="bubble ai">
              Thinking...
            </div>
          )}
        </div>

        {/* INPUT */}
        <div className="inputWrap">
          <div className="inputBox">
            <input
              placeholder="Ask anything"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />

            <div className="inputTools">
              <button><Paperclip size={18} /></button>
              <button><SlidersHorizontal size={18} /></button>
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
            <button><Video size={18} /></button>
            <button><Mic size={18} /></button>
            <button><MoreHorizontal size={18} /></button>
            <button onClick={() => setVoiceOpen(false)}>
              <X size={18} />
            </button>
          </div>

          <div className="orb"></div>
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
          overflow: hidden;
        }

        .thinksy-app {
          height: 100vh;
          display: flex;
          background: #000;
        }

        .sidebar {
          width: 260px;
          background: #0b0b0b;
          border-right: 1px solid #161616;
          padding: 14px;
        }

        .searchBox {
          height: 44px;
          border-radius: 14px;
          background: #151515;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 0 14px;
          color: #9e9e9e;
          margin-bottom: 16px;
        }

        .navBtn {
          width: 100%;
          height: 46px;
          border: none;
          background: transparent;
          color: #d7d7d7;
          display: flex;
          gap: 12px;
          align-items: center;
          padding: 0 14px;
          border-radius: 14px;
          margin-bottom: 8px;
        }

        .navBtn.active,
        .navBtn:hover {
          background: #171717;
        }

        .sectionTitle {
          color: #666;
          font-size: 13px;
          padding: 14px 10px 8px;
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
          font-weight: 600;
        }

        .iconBtn {
          width: 42px;
          height: 42px;
          border-radius: 14px;
          border: none;
          background: #111;
          color: #fff;
        }

        .chatArea {
          flex: 1;
          overflow-y: auto;
          padding: 20px;
        }

        .bubble {
          max-width: 760px;
          padding: 16px;
          border-radius: 18px;
          margin-bottom: 14px;
          line-height: 1.5;
        }

        .bubble.ai {
          background: #0f0f0f;
          border: 1px solid #181818;
        }

        .bubble.user {
          background: #181818;
          margin-left: auto;
        }

        .tools {
          display: flex;
          gap: 8px;
          margin-top: 12px;
        }

        .tools button,
        .inputTools button {
          width: 36px;
          height: 36px;
          border: none;
          border-radius: 50%;
          background: #151515;
          color: #fff;
        }

        .inputWrap {
          padding: 16px;
        }

        .inputBox {
          background: #101010;
          border: 1px solid #1a1a1a;
          border-radius: 24px;
          padding: 14px;
        }

        .inputBox input {
          width: 100%;
          background: transparent;
          border: none;
          color: #fff;
          font-size: 16px;
          outline: none;
          margin-bottom: 12px;
        }

        .inputTools {
          display: flex;
          gap: 10px;
          justify-content: flex-end;
        }

        .sendBtn {
          background: #fff !important;
          color: #000 !important;
        }

        .voicePanel {
          position: fixed;
          right: 20px;
          top: 90px;
          width: 290px;
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

        .voiceTop button {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: none;
          background: #151515;
          color: #fff;
        }

        .orb {
          width: 150px;
          height: 150px;
          border-radius: 50%;
          margin: 90px auto 0;
          background: radial-gradient(circle at 35% 30%, #fff, #1f8fff);
        }

        @media (max-width: 900px) {
          .sidebar {
            position: fixed;
            left: -280px;
            top: 0;
            bottom: 0;
            z-index: 20;
          }

          .sidebar.show {
            left: 0;
          }

          .voicePanel {
            left: 50%;
            transform: translateX(-50%);
            right: auto;
            width: calc(100% - 24px);
            max-width: 360px;
          }

          .title {
            font-size: 20px;
          }

          .bubble {
            max-width: 100%;
          }
        }
      `}</style>
    </main>
  );
}
