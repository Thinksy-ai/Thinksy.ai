"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Menu,
  X,
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
  Trash2,
} from "lucide-react";

/* =========================
   TYPES
========================= */

type Role = "user" | "assistant";

type Msg = {
  role: Role;
  text: string;
};

type Chat = {
  id: number;
  title: string;
  messages: Msg[];
};

/* =========================
   PAGE
========================= */

export default function Home() {
  const [mounted, setMounted] = useState(false);

  const [tab, setTab] = useState<"chat" | "explore" | "library">("chat");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [voiceOpen, setVoiceOpen] = useState(false);

  const [search, setSearch] = useState("");

  const [chats, setChats] = useState<Chat[]>([]);
  const [activeId, setActiveId] = useState<number>(1);

  const chatEndRef = useRef<HTMLDivElement | null>(null);

  /* =========================
     INIT
  ========================= */

  useEffect(() => {
    setMounted(true);

    const saved = localStorage.getItem("thinksy_chats");

    if (saved) {
      try {
        const parsed: Chat[] = JSON.parse(saved);
        if (parsed.length > 0) {
          setChats(parsed);
          setActiveId(parsed[0].id);
          return;
        }
      } catch {}
    }

    const first: Chat[] = [
      {
        id: 1,
        title: "New Chat",
        messages: [
          {
            role: "assistant",
            text: "Welcome to Thinksy. Ask anything.",
          },
        ],
      },
    ];

    setChats(first);
    setActiveId(1);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem("thinksy_chats", JSON.stringify(chats));
  }, [chats, mounted]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chats, typing, activeId]);

  /* =========================
     DATA
  ========================= */

  const activeChat = useMemo(() => {
    return chats.find((c) => c.id === activeId);
  }, [chats, activeId]);

  const filteredChats = useMemo(() => {
    if (!search.trim()) return chats;

    return chats.filter((c) =>
      c.title.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, chats]);

  /* =========================
     HELPERS
  ========================= */

  function updateActiveMessages(newMessages: Msg[]) {
    setChats((prev) =>
      prev.map((chat) =>
        chat.id === activeId ? { ...chat, messages: newMessages } : chat
      )
    );
  }

  function updateTitleFromFirstUser(text: string) {
    setChats((prev) =>
      prev.map((chat) =>
        chat.id === activeId && chat.title === "New Chat"
          ? {
              ...chat,
              title: text.slice(0, 24) || "Chat",
            }
          : chat
      )
    );
  }

  /* =========================
     CHAT ACTIONS
  ========================= */

  function newChat() {
    const id = Date.now();

    const fresh: Chat = {
      id,
      title: "New Chat",
      messages: [
        {
          role: "assistant",
          text: "Fresh chat created. Ask anything.",
        },
      ],
    };

    setChats((prev) => [fresh, ...prev]);
    setActiveId(id);
    setTab("chat");
    setSidebarOpen(false);
  }

  function deleteChat(id: number) {
    const next = chats.filter((c) => c.id !== id);

    if (next.length === 0) {
      const fallback: Chat = {
        id: 1,
        title: "New Chat",
        messages: [
          {
            role: "assistant",
            text: "Welcome to Thinksy.",
          },
        ],
      };

      setChats([fallback]);
      setActiveId(1);
      return;
    }

    setChats(next);

    if (activeId === id) {
      setActiveId(next[0].id);
    }
  }

  async function sendMessage() {
    const text = input.trim();
    if (!text || !activeChat) return;

    const userMsg: Msg = {
      role: "user",
      text,
    };

    const updatedMessages: Msg[] = [...activeChat.messages, userMsg];

    updateActiveMessages(updatedMessages);
    updateTitleFromFirstUser(text);

    setInput("");
    setTyping(true);

    setTimeout(() => {
      const aiMsg: Msg = {
        role: "assistant",
        text:
          "Thinksy AI reply: " +
          text +
          ". Connect Groq API route later for real live responses.",
      };

      setTyping(false);

      updateActiveMessages([...updatedMessages, aiMsg]);
    }, 1100);
  }

  function regenerate() {
    if (!activeChat) return;

    setTyping(true);

    setTimeout(() => {
      const aiMsg: Msg = {
        role: "assistant",
        text: "Regenerated response from Thinksy.",
      };

      setTyping(false);

      updateActiveMessages([...activeChat.messages, aiMsg]);
    }, 900);
  }

  function speak(text: string) {
    if (typeof window === "undefined") return;

    const utter = new SpeechSynthesisUtterance(text);
    speechSynthesis.speak(utter);
  }

  function copyText(text: string) {
    navigator.clipboard.writeText(text);
  }

  /* =========================
     RENDER
  ========================= */

  return (
    <main className="app">
      {/* SIDEBAR */}
      <aside className={`sidebar ${sidebarOpen ? "show" : ""}`}>
        <div className="sideTop">
          <button className="roundBtn" onClick={() => setSidebarOpen(false)}>
            <X size={18} />
          </button>

          <button className="newBtn" onClick={newChat}>
            <PenSquare size={16} />
            <span>New Chat</span>
          </button>
        </div>

        <div className="searchWrap">
          <Search size={16} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search chats"
          />
        </div>

        <button
          className={`navBtn ${tab === "chat" ? "active" : ""}`}
          onClick={() => setTab("chat")}
        >
          <MessageSquare size={18} />
          <span>Chat</span>
        </button>

        <button
          className={`navBtn ${tab === "explore" ? "active" : ""}`}
          onClick={() => setTab("explore")}
        >
          <Grid2X2 size={18} />
          <span>Explore</span>
        </button>

        <button
          className={`navBtn ${tab === "library" ? "active" : ""}`}
          onClick={() => setTab("library")}
        >
          <Folder size={18} />
          <span>Library</span>
        </button>

        <div className="sideLabel">Chat History</div>

        <div className="history">
          {filteredChats.map((chat) => (
            <div
              key={chat.id}
              className={`historyItem ${
                activeId === chat.id ? "historyActive" : ""
              }`}
              onClick={() => {
                setActiveId(chat.id);
                setTab("chat");
                setSidebarOpen(false);
              }}
            >
              <span>{chat.title}</span>

              <button
                className="miniBtn"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteChat(chat.id);
                }}
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </aside>

      {/* MAIN */}
      <section className="main">
        {/* TOPBAR */}
        <header className="topbar">
          <button
            className="roundBtn"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu size={18} />
          </button>

          <div className="brand">Thinksy</div>

          <button className="roundBtn" onClick={newChat}>
            <PenSquare size={18} />
          </button>
        </header>

        {/* CHAT TAB */}
        {tab === "chat" && (
          <>
            <div className="chatArea">
              {activeChat?.messages.map((msg, i) => (
                <div
                  key={i}
                  className={`bubble ${
                    msg.role === "user" ? "userBubble" : "aiBubble"
                  }`}
                >
                  {msg.text}

                  {msg.role === "assistant" && (
                    <div className="tools">
                      <button onClick={() => copyText(msg.text)}>
                        <Copy size={14} />
                      </button>

                      <button onClick={() => speak(msg.text)}>
                        <Volume2 size={14} />
                      </button>

                      <button>
                        <ThumbsUp size={14} />
                      </button>

                      <button>
                        <ThumbsDown size={14} />
                      </button>

                      <button onClick={regenerate}>
                        <RotateCcw size={14} />
                      </button>
                    </div>
                  )}
                </div>
              ))}

              {typing && <div className="bubble aiBubble">Thinking...</div>}

              <div ref={chatEndRef} />
            </div>

            <div className="inputWrap">
              <div className="inputBox">
                <input
                  value={input}
                  placeholder="Ask anything"
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                />

                <div className="inputTools">
                  <button>
                    <Paperclip size={16} />
                  </button>

                  <button>
                    <SlidersHorizontal size={16} />
                  </button>

                  <button onClick={() => setVoiceOpen(true)}>
                    <Mic size={16} />
                  </button>

                  <button className="sendBtn" onClick={sendMessage}>
                    <ArrowUp size={16} />
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {/* EXPLORE */}
        {tab === "explore" && (
          <div className="pageBox">
            <h2>Explore</h2>
            <p>Images, tools and prompts can appear here later.</p>
          </div>
        )}

        {/* LIBRARY */}
        {tab === "library" && (
          <div className="pageBox">
            <h2>Library</h2>

            {chats.length === 0 ? (
              <p>No chats yet.</p>
            ) : (
              chats.map((c) => (
                <div key={c.id} className="libItem">
                  {c.title}
                </div>
              ))
            )}
          </div>
        )}
      </section>

      {/* VOICE PANEL */}
      {voiceOpen && (
        <div className="voiceWrap" onClick={() => setVoiceOpen(false)}>
          <div
            className="voicePanel"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="voiceTitle">Voice Assistant</div>
            <div className="orb" />

            <button
              className="closeVoice"
              onClick={() => setVoiceOpen(false)}
            >
              Close
            </button>
          </div>
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

        .app {
          display: flex;
          height: 100vh;
          overflow: hidden;
        }

        .sidebar {
          width: 280px;
          background: #0b0b0b;
          border-right: 1px solid #181818;
          padding: 14px;
          overflow-y: auto;
        }

        .sideTop,
        .navBtn,
        .historyItem,
        .topbar,
        .tools,
        .inputTools {
          display: flex;
          align-items: center;
        }

        .sideTop {
          gap: 10px;
          margin-bottom: 14px;
        }

        .roundBtn,
        .miniBtn,
        .tools button,
        .inputTools button {
          width: 38px;
          height: 38px;
          border: none;
          border-radius: 50%;
          background: #151515;
          color: #fff;
        }

        .newBtn {
          flex: 1;
          height: 38px;
          border: none;
          border-radius: 14px;
          background: #151515;
          color: #fff;
        }

        .searchWrap {
          display: flex;
          gap: 8px;
          background: #121212;
          padding: 10px 12px;
          border-radius: 14px;
          margin-bottom: 12px;
        }

        .searchWrap input,
        .inputBox input {
          flex: 1;
          background: transparent;
          border: none;
          color: #fff;
          outline: none;
        }

        .navBtn {
          gap: 10px;
          width: 100%;
          height: 44px;
          border: none;
          background: transparent;
          color: #ddd;
          border-radius: 12px;
          padding: 0 12px;
          margin-bottom: 8px;
        }

        .active {
          background: #171717;
        }

        .sideLabel {
          color: #777;
          margin: 16px 0 10px;
          font-size: 13px;
        }

        .historyItem {
          justify-content: space-between;
          background: #101010;
          padding: 10px;
          border-radius: 12px;
          margin-bottom: 8px;
        }

        .historyActive {
          border: 1px solid #2a2a2a;
        }

        .main {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .topbar {
          justify-content: space-between;
          padding: 12px;
          border-bottom: 1px solid #141414;
        }

        .brand {
          font-size: 20px;
          font-weight: 700;
        }

        .chatArea {
          flex: 1;
          overflow-y: auto;
          padding: 18px;
        }

        .bubble {
          max-width: 760px;
          padding: 16px;
          border-radius: 18px;
          margin-bottom: 14px;
        }

        .aiBubble {
          background: #101010;
          border: 1px solid #1a1a1a;
        }

        .userBubble {
          background: #1a1a1a;
          margin-left: auto;
        }

        .tools {
          gap: 8px;
          margin-top: 12px;
        }

        .inputWrap {
          padding: 14px;
        }

        .inputBox {
          background: #101010;
          border: 1px solid #1a1a1a;
          border-radius: 24px;
          padding: 12px;
        }

        .inputTools {
          justify-content: flex-end;
          gap: 8px;
          margin-top: 10px;
        }

        .sendBtn {
          background: #fff !important;
          color: #000 !important;
        }

        .pageBox {
          padding: 24px;
        }

        .libItem {
          padding: 12px;
          background: #111;
          border-radius: 12px;
          margin-top: 10px;
        }

        .voiceWrap {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.65);
          display: grid;
          place-items: center;
        }

        .voicePanel {
          width: 320px;
          background: #090909;
          border: 1px solid #1a1a1a;
          border-radius: 24px;
          padding: 20px;
          text-align: center;
        }

        .voiceTitle {
          margin-bottom: 20px;
          font-weight: 700;
        }

        .orb {
          width: 140px;
          height: 140px;
          border-radius: 50%;
          margin: 0 auto 20px;
          background: radial-gradient(circle, #fff, #333);
        }

        .closeVoice {
          width: 100%;
          height: 42px;
          border: none;
          border-radius: 12px;
          background: #fff;
          color: #000;
        }

        @media (max-width: 900px) {
          .sidebar {
            position: fixed;
            left: -300px;
            top: 0;
            bottom: 0;
            z-index: 100;
            transition: 0.2s;
          }

          .sidebar.show {
            left: 0;
          }

          .bubble {
            max-width: 100%;
          }

          .brand {
            font-size: 18px;
          }
        }
      `}</style>
    </main>
  );
}
