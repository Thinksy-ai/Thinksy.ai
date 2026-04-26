"use client";

import { useState, useRef, useEffect } from "react";
import {
  Menu,
  Search,
  MessageSquare,
  Grid2X2,
  Folder,
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
  Clock3,
  BookOpen,
} from "lucide-react";

type Role = "user" | "assistant";

type Msg = {
  role: Role;
  text: string;
};

type Tab = "chat" | "explore" | "library";

export default function Home() {
  const [input, setInput] = useState("");
  const [mobileMenu, setMobileMenu] = useState(false);
  const [voiceOpen, setVoiceOpen] = useState(false);
  const [typing, setTyping] = useState(false);
  const [tab, setTab] = useState<Tab>("chat");

  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      text: "Welcome to Thinksy. Ask anything.",
    },
  ]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  async function sendMessage() {
    const text = input.trim();

    if (!text || typing) return;

    const updated: Msg[] = [...messages, { role: "user", text }];

    setMessages(updated);
    setInput("");
    setTyping(true);
    setTab("chat");

    setTimeout(() => {
      setTyping(false);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text:
            "This is your upgraded Thinksy demo response. Connect Groq API for real intelligence and streaming replies.",
        },
      ]);
    }, 900);
  }

  function newChat() {
    setMessages([
      {
        role: "assistant",
        text: "Fresh chat started. Ask anything.",
      },
    ]);
    setTab("chat");
    setMobileMenu(false);
  }

  function copyText(text: string) {
    navigator.clipboard.writeText(text);
  }

  function speak(text: string) {
    if ("speechSynthesis" in window) {
      const utter = new SpeechSynthesisUtterance(text);
      speechSynthesis.cancel();
      speechSynthesis.speak(utter);
    }
  }

  function rate(type: "up" | "down") {
    alert(type === "up" ? "Thanks for the feedback." : "Feedback saved.");
  }

  return (
    <main className="thinksy-app">
      {/* SIDEBAR */}
      <aside className={`sidebar ${mobileMenu ? "show" : ""}`}>
        <div className="brand">Thinksy</div>

        <button className="searchBox">
          <Search size={18} />
          <span>Search</span>
        </button>

        <button
          className={`navBtn ${tab === "chat" ? "active" : ""}`}
          onClick={() => {
            setTab("chat");
            setMobileMenu(false);
          }}
        >
          <MessageSquare size={18} />
          <span>Chat</span>
        </button>

        <button
          className={`navBtn ${tab === "explore" ? "active" : ""}`}
          onClick={() => {
            setTab("explore");
            setMobileMenu(false);
          }}
        >
          <Grid2X2 size={18} />
          <span>Explore</span>
        </button>

        <button
          className={`navBtn ${tab === "library" ? "active" : ""}`}
          onClick={() => {
            setTab("library");
            setMobileMenu(false);
          }}
        >
          <Folder size={18} />
          <span>Library</span>
        </button>

        <div className="bottomSide">
          <button className="navBtn" onClick={newChat}>
            <PenSquare size={18} />
            <span>New Chat</span>
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <section className="mainPanel">
        {/* TOPBAR */}
        <header className="topBar">
          <button
            className="iconBtn"
            onClick={() => setMobileMenu(!mobileMenu)}
          >
            <Menu size={20} />
          </button>

          <div className="title">
            {tab === "chat"
              ? "Thinksy"
              : tab === "explore"
              ? "Explore"
              : "Library"}
          </div>

          <button className="iconBtn" onClick={newChat}>
            <PenSquare size={18} />
          </button>
        </header>

        {/* CONTENT */}
        {tab === "chat" && (
          <>
            <div className="chatArea">
              {messages.map((msg, i) => (
                <div
                  key={i}
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

                      <button onClick={() => rate("up")}>
                        <ThumbsUp size={15} />
                      </button>

                      <button onClick={() => rate("down")}>
                        <ThumbsDown size={15} />
                      </button>

                      <button onClick={newChat}>
                        <RotateCcw size={15} />
                      </button>
                    </div>
                  )}
                </div>
              ))}

              {typing && (
                <div className="bubble ai">
                  Thinking...
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* INPUT */}
            <div className="inputWrap">
              <div className="inputBox">
                <input
                  placeholder="Ask anything"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
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

                  <button
                    className="sendBtn"
                    onClick={sendMessage}
                    disabled={!input.trim() || typing}
                  >
                    <ArrowUp size={18} />
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {/* EXPLORE */}
        {tab === "explore" && (
          <div className="pageBox">
            <div className="card">
              <Sparkles size={20} />
              <h3>Trending Prompts</h3>
              <p>Discover ideas, tasks, coding help, writing, study tools.</p>
            </div>

            <div className="card">
              <Search size={20} />
              <h3>Search Ideas</h3>
              <p>Find prompts for business, AI, design and learning.</p>
            </div>

            <div className="card">
              <Grid2X2 size={20} />
              <h3>Tools</h3>
              <p>Use image, voice, research and productivity tools.</p>
            </div>
          </div>
        )}

        {/* LIBRARY */}
        {tab === "library" && (
          <div className="pageBox">
            <div className="card">
              <Clock3 size={20} />
              <h3>Recent Chats</h3>
              <p>Your conversations can appear here.</p>
            </div>

            <div className="card">
              <BookOpen size={20} />
              <h3>Saved Outputs</h3>
              <p>Store notes, answers and generated content.</p>
            </div>

            <div className="card">
              <Folder size={20} />
              <h3>Collections</h3>
              <p>Organize chats by category.</p>
            </div>
          </div>
        )}
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
          <p className="voiceText">Voice Assistant Ready</p>
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
          font-family: Inter, sans-serif;
          overflow: hidden;
        }

        button,
        input {
          font-family: inherit;
        }

        .thinksy-app {
          display: flex;
          height: 100vh;
          background: #000;
        }

        .sidebar {
          width: 260px;
          background: #0a0a0a;
          border-right: 1px solid #161616;
          padding: 14px;
          display: flex;
          flex-direction: column;
        }

        .brand {
          font-size: 22px;
          font-weight: 700;
          margin-bottom: 16px;
          padding: 8px;
        }

        .bottomSide {
          margin-top: auto;
        }

        .searchBox,
        .navBtn {
          width: 100%;
          height: 46px;
          border: none;
          border-radius: 14px;
          background: transparent;
          color: #dcdcdc;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 0 14px;
          margin-bottom: 8px;
          cursor: pointer;
        }

        .searchBox {
          background: #141414;
          color: #888;
        }

        .navBtn:hover,
        .navBtn.active {
          background: #171717;
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
          font-size: 20px;
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
          padding: 20px;
        }

        .bubble {
          max-width: 760px;
          padding: 16px;
          border-radius: 18px;
          margin-bottom: 14px;
          line-height: 1.55;
        }

        .bubble.ai {
          background: #0f0f0f;
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
          border-radius: 24px;
          padding: 14px;
        }

        .inputBox input {
          width: 100%;
          background: transparent;
          border: none;
          outline: none;
          color: #fff;
          font-size: 16px;
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

        .sendBtn:disabled {
          opacity: 0.45;
          cursor: not-allowed;
        }

        .pageBox {
          padding: 20px;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 14px;
        }

        .card {
          background: #101010;
          border: 1px solid #1a1a1a;
          border-radius: 20px;
          padding: 18px;
        }

        .card h3 {
          margin-top: 12px;
          margin-bottom: 8px;
        }

        .card p {
          color: #999;
          line-height: 1.5;
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

        .orb {
          width: 150px;
          height: 150px;
          border-radius: 50%;
          margin: 90px auto 20px;
          background: radial-gradient(circle, #ffffff, #333333);
        }

        .voiceText {
          text-align: center;
          color: #aaa;
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
