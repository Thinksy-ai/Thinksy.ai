"use client";

/*
THINKSY - FULL app/page.tsx
Uses:
- Same black premium layout
- Mobile responsive
- Groq API backend (/api/chat)
- ElevenLabs browser TTS route (/api/tts optional)
- Typing states
- Copy messages
- Clear chat
- Voice panel
- Better scrolling
- Cleaner structure

Put this in: app/page.tsx
*/

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
  Trash2,
  Plus,
} from "lucide-react";

type Msg = {
  role: "user" | "assistant";
  text: string;
};

export default function Home() {
  const [input, setInput] = useState("");
  const [mobileMenu, setMobileMenu] = useState(false);
  const [voiceOpen, setVoiceOpen] = useState(false);
  const [typing, setTyping] = useState(false);
  const [loadingVoice, setLoadingVoice] = useState(false);

  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      text: "Welcome to Thinksy. I am ready.",
    },
  ]);

  const chatRef = useRef<HTMLDivElement>(null);

  /* auto scroll */
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages, typing]);

  /* SEND MESSAGE */
  const sendMessage = async () => {
    const text = input.trim();
    if (!text) return;

    const updated = [...messages, { role: "user", text }];
    setMessages(updated);
    setInput("");
    setTyping(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: text,
          history: updated,
        }),
      });

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text:
            data.reply ||
            "No response returned from Thinksy AI.",
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text:
            "Connection failed. Check your Groq key or API route.",
        },
      ]);
    }

    setTyping(false);
  };

  /* ENTER SEND */
  const onEnter = (e: any) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  /* COPY */
  const copyText = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {}
  };

  /* CLEAR */
  const clearChat = () => {
    setMessages([
      {
        role: "assistant",
        text: "New chat started.",
      },
    ]);
  };

  /* TTS */
  const speak = async (text: string) => {
    try {
      setLoadingVoice(true);

      const res = await fetch("/api/tts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audio.play();
    } catch {}

    setLoadingVoice(false);
  };

  return (
    <main className="app">
      {/* SIDEBAR */}
      <aside className={`sidebar ${mobileMenu ? "show" : ""}`}>
        <div className="brand">
          <div className="brandDot" />
          <span>Thinksy</span>
        </div>

        <button className="searchBox">
          <Search size={17} />
          Search
        </button>

        <button className="nav active">
          <MessageSquare size={18} />
          Chat
        </button>

        <button className="nav">
          <Grid2X2 size={18} />
          Explore
        </button>

        <button className="nav">
          <Folder size={18} />
          Library
        </button>

        <div className="label">Projects</div>

        <button className="nav">
          <Briefcase size={18} />
          Work
        </button>

        <button className="nav" onClick={clearChat}>
          <Plus size={18} />
          New Chat
        </button>
      </aside>

      {/* MAIN */}
      <section className="main">
        {/* HEADER */}
        <header className="topbar">
          <button
            className="icon"
            onClick={() => setMobileMenu(!mobileMenu)}
          >
            <Menu size={20} />
          </button>

          <div className="title">Chat</div>

          <div className="row">
            <button className="icon" onClick={clearChat}>
              <Trash2 size={18} />
            </button>

            <button className="icon">
              <PenSquare size={18} />
            </button>
          </div>
        </header>

        {/* CHAT */}
        <div className="chat" ref={chatRef}>
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`wrap ${
                msg.role === "user" ? "right" : "left"
              }`}
            >
              <div
                className={`bubble ${
                  msg.role === "user" ? "user" : "ai"
                }`}
              >
                {msg.text}

                {msg.role === "assistant" && (
                  <div className="tools">
                    <button onClick={() => copyText(msg.text)}>
                      <Copy size={15} />
                    </button>

                    <button onClick={() => speak(msg.text)}>
                      <Volume2 size={15} />
                    </button>

                    <button>
                      <ThumbsUp size={15} />
                    </button>

                    <button>
                      <ThumbsDown size={15} />
                    </button>

                    <button>
                      <RotateCcw size={15} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {typing && (
            <div className="wrap left">
              <div className="bubble ai">
                Thinking...
              </div>
            </div>
          )}
        </div>

        {/* INPUT */}
        <div className="composer">
          <div className="box">
            <textarea
              rows={1}
              placeholder="Ask anything"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onEnter}
            />

            <div className="bottomRow">
              <div className="leftTools">
                <button className="mini">
                  <Paperclip size={17} />
                </button>

                <button className="mini">
                  <SlidersHorizontal size={17} />
                </button>

                <button
                  className="mini"
                  onClick={() => setVoiceOpen(true)}
                >
                  <Mic size={17} />
                </button>
              </div>

              <button className="send" onClick={sendMessage}>
                <ArrowUp size={18} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* VOICE PANEL */}
      {voiceOpen && (
        <div className="voiceCard">
          <div className="voiceHead">
            <button className="mini">
              <Video size={16} />
            </button>

            <button className="mini">
              <Mic size={16} />
            </button>

            <button className="mini">
              <MoreHorizontal size={16} />
            </button>

            <button
              className="mini"
              onClick={() => setVoiceOpen(false)}
            >
              <X size={16} />
            </button>
          </div>

          <div className="orb" />

          <div className="voiceText">
            {loadingVoice ? "Speaking..." : "Voice Ready"}
          </div>
        </div>
      )}

      <style jsx global>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        html,
        body {
          background: #000;
          color: #fff;
          font-family: Inter, Arial, sans-serif;
          overflow: hidden;
        }

        button,
        textarea {
          font-family: inherit;
        }

        .app {
          height: 100vh;
          display: flex;
          background: #000;
        }

        .sidebar {
          width: 260px;
          background: #0a0a0a;
          border-right: 1px solid #161616;
          padding: 14px;
        }

        .brand {
          height: 44px;
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 14px;
          padding: 0 10px;
          font-weight: 600;
        }

        .brandDot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #fff;
        }

        .searchBox,
        .nav {
          width: 100%;
          height: 44px;
          border: none;
          border-radius: 14px;
          margin-bottom: 8px;
          background: #111;
          color: #ddd;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 0 14px;
        }

        .nav.active {
          background: #171717;
        }

        .label {
          color: #666;
          font-size: 13px;
          padding: 12px 8px 8px;
        }

        .main {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .topbar {
          height: 64px;
          border-bottom: 1px solid #151515;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 14px;
        }

        .title {
          font-size: 22px;
          font-weight: 600;
        }

        .row {
          display: flex;
          gap: 8px;
        }

        .icon,
        .mini {
          width: 40px;
          height: 40px;
          border: none;
          border-radius: 14px;
          background: #111;
          color: #fff;
        }

        .chat {
          flex: 1;
          overflow-y: auto;
          padding: 22px;
        }

        .wrap {
          display: flex;
          margin-bottom: 14px;
        }

        .left {
          justify-content: flex-start;
        }

        .right {
          justify-content: flex-end;
        }

        .bubble {
          max-width: 760px;
          padding: 16px;
          border-radius: 20px;
          line-height: 1.55;
          white-space: pre-wrap;
        }

        .bubble.ai {
          background: #0f0f0f;
          border: 1px solid #1b1b1b;
        }

        .bubble.user {
          background: #171717;
        }

        .tools {
          margin-top: 12px;
          display: flex;
          gap: 8px;
        }

        .tools button {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          border: none;
          background: #151515;
          color: #fff;
        }

        .composer {
          padding: 16px;
        }

        .box {
          background: #0f0f0f;
          border: 1px solid #1a1a1a;
          border-radius: 26px;
          padding: 14px;
        }

        textarea {
          width: 100%;
          resize: none;
          border: none;
          outline: none;
          background: transparent;
          color: #fff;
          font-size: 16px;
          min-height: 32px;
        }

        .bottomRow {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 12px;
        }

        .leftTools {
          display: flex;
          gap: 8px;
        }

        .send {
          width: 42px;
          height: 42px;
          border: none;
          border-radius: 50%;
          background: #fff;
          color: #000;
        }

        .voiceCard {
          position: fixed;
          top: 90px;
          right: 18px;
          width: 290px;
          height: 420px;
          border-radius: 28px;
          background: #0a0a0a;
          border: 1px solid #1a1a1a;
          padding: 18px;
        }

        .voiceHead {
          display: flex;
          justify-content: space-between;
        }

        .orb {
          width: 150px;
          height: 150px;
          border-radius: 50%;
          margin: 95px auto 20px;
          background: radial-gradient(circle at 35% 30%, #fff, #1787ff);
        }

        .voiceText {
          text-align: center;
          color: #cfcfcf;
        }

        @media (max-width: 900px) {
          .sidebar {
            position: fixed;
            left: -280px;
            top: 0;
            bottom: 0;
            z-index: 50;
          }

          .sidebar.show {
            left: 0;
          }

          .voiceCard {
            width: calc(100% - 24px);
            max-width: 360px;
            left: 50%;
            transform: translateX(-50%);
            right: auto;
          }

          .bubble {
            max-width: 100%;
          }

          .title {
            font-size: 20px;
          }
        }
      `}</style>
    </main>
  );
}
