"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
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
  ChevronLeft,
} from "lucide-react";

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

export default function Home() {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [voiceOpen, setVoiceOpen] = useState(false);
  const [typing, setTyping] = useState(false);
  const [input, setInput] = useState("");

  const [chats, setChats] = useState<Chat[]>([]);
  const [activeId, setActiveId] = useState<number>(1);

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem("thinksy_chats");

    if (saved) {
      const parsed = JSON.parse(saved);
      setChats(parsed);
      setActiveId(parsed[0]?.id || 1);
    } else {
      const first = [
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
    }
  }, []);

  useEffect(() => {
    if (chats.length > 0) {
      localStorage.setItem("thinksy_chats", JSON.stringify(chats));
    }
  }, [chats]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chats, typing]);

  const activeChat =
    chats.find((chat) => chat.id === activeId) || chats[0];

  function newChat() {
    const id = Date.now();

    const chat: Chat = {
      id,
      title: "Fresh Chat",
      messages: [
        {
          role: "assistant",
          text: "New chat ready.",
        },
      ],
    };

    setChats((prev) => [chat, ...prev]);
    setActiveId(id);
    setMobileMenu(false);
  }

  function deleteChat(id: number) {
    const filtered = chats.filter((c) => c.id !== id);

    if (filtered.length === 0) {
      newChat();
      return;
    }

    setChats(filtered);
    setActiveId(filtered[0].id);
  }

  function copyText(text: string) {
    navigator.clipboard.writeText(text);
  }

  function speakText(text: string) {
    const utter = new SpeechSynthesisUtterance(text);
    speechSynthesis.speak(utter);
  }

  async function sendMessage() {
    const text = input.trim();
    if (!text) return;

    const updated = chats.map((chat) =>
      chat.id === activeId
        ? {
            ...chat,
            title:
              chat.title === "New Chat" ||
              chat.title === "Fresh Chat"
                ? text.slice(0, 25)
                : chat.title,
            messages: [
              ...chat.messages,
              { role: "user", text },
            ],
          }
        : chat
    );

    setChats(updated);
    setInput("");
    setTyping(true);

    setTimeout(() => {
      const reply = `Thinksy response: ${text}`;

      setChats((prev) =>
        prev.map((chat) =>
          chat.id === activeId
            ? {
                ...chat,
                messages: [
                  ...chat.messages,
                  {
                    role: "assistant",
                    text: reply,
                  },
                ],
              }
            : chat
        )
      );

      setTyping(false);
    }, 1200);
  }

  return (
    <main className="app">
      {mobileMenu && (
        <div
          className="overlay"
          onClick={() => setMobileMenu(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside className={`sidebar ${mobileMenu ? "show" : ""}`}>
        <div className="sideTop">
          <button
            className="iconBtn"
            onClick={() => setMobileMenu(false)}
          >
            <ChevronLeft size={18} />
          </button>

          <button className="newBtn" onClick={newChat}>
            <PenSquare size={16} />
            New Chat
          </button>
        </div>

        <button
          className="searchBox"
          onClick={() => setSearchOpen(true)}
        >
          <Search size={17} />
          Search
        </button>

        <Link href="/" className="navBtn active">
          <MessageSquare size={18} />
          Chat
        </Link>

        <Link href="/explore" className="navBtn">
          <Grid2X2 size={18} />
          Explore
        </Link>

        <Link href="/library" className="navBtn">
          <Folder size={18} />
          Library
        </Link>

        <div className="historyTitle">Chat History</div>

        <div className="historyList">
          {chats.map((chat) => (
            <div
              key={chat.id}
              className={`historyItem ${
                chat.id === activeId ? "activeRow" : ""
              }`}
            >
              <button
                className="historyBtn"
                onClick={() => {
                  setActiveId(chat.id);
                  setMobileMenu(false);
                }}
              >
                {chat.title}
              </button>

              <button
                className="miniBtn"
                onClick={() => deleteChat(chat.id)}
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </aside>

      {/* MAIN */}
      <section className="main">
        <header className="topBar">
          <button
            className="iconBtn"
            onClick={() => setMobileMenu(true)}
          >
            <Menu size={19} />
          </button>

          <div className="logo">Thinksy</div>

          <button
            className="iconBtn"
            onClick={newChat}
          >
            <PenSquare size={18} />
          </button>
        </header>

        {/* CHAT */}
        <div className="chatArea">
          {activeChat?.messages.map((msg, i) => (
            <div
              key={i}
              className={`bubble ${
                msg.role === "user" ? "user" : "ai"
              }`}
            >
              {msg.text}

              {msg.role === "assistant" && (
                <div className="tools">
                  <button
                    onClick={() => copyText(msg.text)}
                  >
                    <Copy size={15} />
                  </button>

                  <button
                    onClick={() => speakText(msg.text)}
                  >
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
          ))}

          {typing && (
            <div className="bubble ai">
              Thinking...
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* INPUT */}
        <div className="inputWrap">
          <div className="inputBox">
            <input
              placeholder="Ask anything"
              value={input}
              onChange={(e) =>
                setInput(e.target.value)
              }
              onKeyDown={(e) =>
                e.key === "Enter" && sendMessage()
              }
            />

            <div className="inputTools">
              <button>
                <Paperclip size={17} />
              </button>

              <button>
                <SlidersHorizontal size={17} />
              </button>

              <button
                onClick={() => setVoiceOpen(true)}
              >
                <Mic size={17} />
              </button>

              <button
                className="sendBtn"
                onClick={sendMessage}
              >
                <ArrowUp size={17} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SEARCH */}
      {searchOpen && (
        <div
          className="popupWrap"
          onClick={() => setSearchOpen(false)}
        >
          <div
            className="popup"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="popupTitle">
              Search Chats
            </div>

            <input
              className="popupInput"
              placeholder="Type to search..."
            />
          </div>
        </div>
      )}

      {/* VOICE */}
      {voiceOpen && (
        <div
          className="popupWrap"
          onClick={() => setVoiceOpen(false)}
        >
          <div
            className="voicePanel"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="voiceTop">
              <button className="iconBtn">
                <Mic size={16} />
              </button>

              <button
                className="iconBtn"
                onClick={() => setVoiceOpen(false)}
              >
                <X size={16} />
              </button>
            </div>

            <div className="orb" />
            <p>Voice Ready</p>
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

        .overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,.6);
          z-index: 20;
        }

        .sidebar {
          width: 280px;
          background: #0b0b0b;
          border-right: 1px solid #181818;
          padding: 14px;
          overflow-y: auto;
        }

        .sideTop {
          display: flex;
          gap: 10px;
          margin-bottom: 14px;
        }

        .main {
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

        .logo {
          font-size: 22px;
          font-weight: 700;
        }

        .iconBtn,
        .miniBtn,
        .tools button,
        .inputTools button {
          width: 40px;
          height: 40px;
          border: none;
          border-radius: 50%;
          background: #111;
          color: #fff;
        }

        .miniBtn {
          width: 30px;
          height: 30px;
        }

        .newBtn,
        .searchBox,
        .navBtn,
        .historyBtn {
          width: 100%;
          border: none;
          color: #fff;
          background: #111;
          border-radius: 14px;
          padding: 12px;
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 10px;
          text-decoration: none;
        }

        .navBtn.active,
        .navBtn:hover {
          background: #1a1a1a;
        }

        .historyTitle {
          color: #777;
          margin: 16px 0 10px;
          font-size: 13px;
        }

        .historyItem {
          display: flex;
          gap: 8px;
          margin-bottom: 8px;
        }

        .historyBtn {
          margin: 0;
          justify-content: flex-start;
        }

        .activeRow .historyBtn {
          background: #1a1a1a;
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
          background: #101010;
          border: 1px solid #181818;
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
          border: none;
          outline: none;
          background: transparent;
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

        .popupWrap {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,.65);
          display: grid;
          place-items: center;
          z-index: 50;
        }

        .popup,
        .voicePanel {
          width: min(92vw, 360px);
          background: #090909;
          border: 1px solid #1b1b1b;
          border-radius: 24px;
          padding: 18px;
        }

        .popupTitle {
          margin-bottom: 14px;
          font-size: 18px;
          font-weight: 700;
        }

        .popupInput {
          width: 100%;
          height: 46px;
          border-radius: 14px;
          border: none;
          background: #111;
          color: #fff;
          padding: 0 14px;
        }

        .voiceTop {
          display: flex;
          justify-content: space-between;
        }

        .orb {
          width: 150px;
          height: 150px;
          border-radius: 50%;
          margin: 40px auto 18px;
          background: radial-gradient(circle, #fff, #333);
        }

        .voicePanel p {
          text-align: center;
          color: #aaa;
        }

        @media (max-width: 900px) {
          .sidebar {
            position: fixed;
            left: -300px;
            top: 0;
            bottom: 0;
            z-index: 30;
            transition: 0.25s;
          }

          .sidebar.show {
            left: 0;
          }

          .bubble {
            max-width: 100%;
          }
        }
      `}</style>
    </main>
  );
}
