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
  Trash2,
} from "lucide-react";

type Role = "user" | "assistant";

type Msg = {
  id: number;
  role: Role;
  text: string;
  liked?: boolean | null;
};

type Chat = {
  id: number;
  title: string;
  messages: Msg[];
};

export default function Home() {
  const [input, setInput] = useState("");
  const [mobileMenu, setMobileMenu] = useState(false);
  const [voiceOpen, setVoiceOpen] = useState(false);
  const [typing, setTyping] = useState(false);
  const [popup, setPopup] = useState("");

  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const starter: Msg = {
    id: Date.now(),
    role: "assistant",
    text: "Welcome to Thinksy. Ask anything.",
  };

  const [chats, setChats] = useState<Chat[]>([
    { id: 1, title: "New Chat", messages: [starter] },
  ]);

  const [activeChatId, setActiveChatId] = useState(1);

  const activeChat =
    chats.find((chat) => chat.id === activeChatId) || chats[0];

  useEffect(() => {
    const saved = localStorage.getItem("thinksy-chats");
    if (saved) {
      const parsed = JSON.parse(saved);
      setChats(parsed);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("thinksy-chats", JSON.stringify(chats));
  }, [chats]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeChat.messages, typing]);

  function updateActiveMessages(messages: Msg[]) {
    setChats((prev) =>
      prev.map((chat) =>
        chat.id === activeChatId ? { ...chat, messages } : chat
      )
    );
  }

  function newChat() {
    const id = Date.now();

    const chat: Chat = {
      id,
      title: "New Chat",
      messages: [
        {
          id: id + 1,
          role: "assistant",
          text: "Fresh chat started.",
        },
      ],
    };

    setChats((prev) => [chat, ...prev]);
    setActiveChatId(id);
    setInput("");
    setMobileMenu(false);
  }

  function deleteChat(id: number) {
    const filtered = chats.filter((chat) => chat.id !== id);

    if (!filtered.length) {
      newChat();
      return;
    }

    setChats(filtered);
    setActiveChatId(filtered[0].id);
  }

  function renameChat(id: number) {
    const title = prompt("Rename chat");
    if (!title) return;

    setChats((prev) =>
      prev.map((chat) =>
        chat.id === id ? { ...chat, title } : chat
      )
    );
  }

  async function sendMessage() {
    const text = input.trim();
    if (!text) return;

    const userMsg: Msg = {
      id: Date.now(),
      role: "user",
      text,
    };

    const nextMessages = [...activeChat.messages, userMsg];

    updateActiveMessages(nextMessages);

    if (activeChat.title === "New Chat") {
      setChats((prev) =>
        prev.map((chat) =>
          chat.id === activeChatId
            ? { ...chat, title: text.slice(0, 24) }
            : chat
        )
      );
    }

    setInput("");
    setTyping(true);

    setTimeout(() => {
      const aiMsg: Msg = {
        id: Date.now() + 1,
        role: "assistant",
        text:
          "Real Groq AI can be connected here. Current demo reply: " +
          text,
      };

      updateActiveMessages([...nextMessages, aiMsg]);
      setTyping(false);
    }, 1000);
  }

  function copyText(text: string) {
    navigator.clipboard.writeText(text);
    setPopup("Copied");
    setTimeout(() => setPopup(""), 1500);
  }

  function speakText(text: string) {
    const utter = new SpeechSynthesisUtterance(text);
    speechSynthesis.speak(utter);
  }

  function rateMessage(id: number, liked: boolean) {
    const updated = activeChat.messages.map((msg) =>
      msg.id === id ? { ...msg, liked } : msg
    );

    updateActiveMessages(updated);
    setPopup(liked ? "Liked response" : "Feedback saved");
    setTimeout(() => setPopup(""), 1500);
  }

  function retryLast() {
    const lastUser = [...activeChat.messages]
      .reverse()
      .find((msg) => msg.role === "user");

    if (!lastUser) return;

    setInput(lastUser.text);
  }

  function uploadFile(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = e.target.files?.[0];
    if (!file) return;

    setPopup(`Uploaded: ${file.name}`);
    setTimeout(() => setPopup(""), 1500);
  }

  return (
    <main className="thinksy-app">
      {mobileMenu && (
        <div
          className="overlay"
          onClick={() => setMobileMenu(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside className={`sidebar ${mobileMenu ? "show" : ""}`}>
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

        <div className="sectionTitle">History</div>

        <button className="navBtn" onClick={newChat}>
          <PenSquare size={18} />
          <span>New Chat</span>
        </button>

        <div className="history">
          {chats.map((chat) => (
            <div
              key={chat.id}
              className={`historyItem ${
                chat.id === activeChatId ? "selected" : ""
              }`}
            >
              <button
                className="historyTitle"
                onClick={() => {
                  setActiveChatId(chat.id);
                  setMobileMenu(false);
                }}
              >
                {chat.title}
              </button>

              <div className="miniBtns">
                <button onClick={() => renameChat(chat.id)}>
                  <PenSquare size={14} />
                </button>

                <button onClick={() => deleteChat(chat.id)}>
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* MAIN */}
      <section className="mainPanel">
        <header className="topBar">
          <button
            className="iconBtn"
            onClick={() => setMobileMenu(true)}
          >
            <Menu size={20} />
          </button>

          <div className="title">Thinksy</div>

          <button className="iconBtn" onClick={newChat}>
            <PenSquare size={20} />
          </button>
        </header>

        {/* CHAT */}
        <div className="chatArea">
          {activeChat.messages.map((msg) => (
            <div
              key={msg.id}
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

                  <button onClick={() => speakText(msg.text)}>
                    <Volume2 size={15} />
                  </button>

                  <button
                    onClick={() =>
                      rateMessage(msg.id, true)
                    }
                  >
                    <ThumbsUp size={15} />
                  </button>

                  <button
                    onClick={() =>
                      rateMessage(msg.id, false)
                    }
                  >
                    <ThumbsDown size={15} />
                  </button>

                  <button onClick={retryLast}>
                    <RotateCcw size={15} />
                  </button>
                </div>
              )}
            </div>
          ))}

          {typing && (
            <div className="bubble ai">Thinking...</div>
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
              onKeyDown={(e) =>
                e.key === "Enter" && sendMessage()
              }
            />

            <div className="inputTools">
              <input
                ref={fileRef}
                hidden
                type="file"
                onChange={uploadFile}
              />

              <button
                onClick={() =>
                  fileRef.current?.click()
                }
              >
                <Paperclip size={18} />
              </button>

              <button>
                <SlidersHorizontal size={18} />
              </button>

              <button
                onClick={() => setVoiceOpen(true)}
              >
                <Mic size={18} />
              </button>

              <button
                className="sendBtn"
                onClick={sendMessage}
              >
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

            <button
              onClick={() => setVoiceOpen(false)}
            >
              <X size={18} />
            </button>
          </div>

          <div className="orb" />
        </div>
      )}

      {popup && <div className="popup">{popup}</div>}

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

        .overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 99;
        }

        .sidebar {
          width: 270px;
          background: #0b0b0b;
          border-right: 1px solid #181818;
          padding: 14px;
          overflow-y: auto;
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

        .searchBox,
        .navBtn,
        .historyItem,
        .iconBtn,
        .tools button,
        .inputTools button {
          display: flex;
          align-items: center;
        }

        .searchBox,
        .navBtn {
          width: 100%;
          gap: 10px;
          height: 44px;
          padding: 0 14px;
          border-radius: 14px;
          border: none;
          background: #151515;
          color: #fff;
          margin-bottom: 8px;
        }

        .navBtn {
          background: transparent;
        }

        .navBtn:hover,
        .navBtn.active {
          background: #171717;
        }

        .sectionTitle {
          color: #666;
          font-size: 12px;
          padding: 12px 6px;
        }

        .historyItem {
          justify-content: space-between;
          background: #101010;
          border-radius: 12px;
          margin-bottom: 8px;
          padding: 8px;
        }

        .historyItem.selected {
          border: 1px solid #2a2a2a;
        }

        .historyTitle {
          background: transparent;
          border: none;
          color: #fff;
          text-align: left;
          flex: 1;
        }

        .miniBtns,
        .tools,
        .inputTools {
          display: flex;
          gap: 8px;
        }

        .iconBtn,
        .tools button,
        .inputTools button,
        .miniBtns button {
          width: 38px;
          height: 38px;
          border-radius: 50%;
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
          background: #101010;
          border: 1px solid #181818;
        }

        .bubble.user {
          background: #181818;
          margin-left: auto;
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
          z-index: 101;
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
          background: radial-gradient(circle, #fff, #333);
        }

        .popup {
          position: fixed;
          bottom: 24px;
          left: 50%;
          transform: translateX(-50%);
          background: #111;
          border: 1px solid #222;
          padding: 10px 16px;
          border-radius: 12px;
          z-index: 200;
        }

        @media (max-width: 900px) {
          .sidebar {
            position: fixed;
            left: -290px;
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

          .voicePanel {
            left: 10px;
            right: 10px;
            width: auto;
          }
        }
      `}</style>
    </main>
  );
}
