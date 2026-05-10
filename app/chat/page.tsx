// app/chat/page.tsx

"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Menu,
  Search,
  Plus,
  Send,
  Mic,
  Settings,
  User,
  Trash2,
  LogOut,
  Crown,
  X,
  Copy,
  ThumbsUp,
  ThumbsDown,
  Sparkles,
  MessageSquare,
} from "lucide-react";

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Role = "user" | "assistant";

type Message = {
  id: number;
  role: Role;
  text: string;
};

type Chat = {
  id: number;
  title: string;
  messages: Message[];
};

export default function LuminaUltra() {
  const router = useRouter();

  const bottomRef = useRef<HTMLDivElement>(null);

  const [loading, setLoading] = useState(true);

  const [user, setUser] = useState<any>(null);

  const [sidebar, setSidebar] = useState(false);

  const [settingsOpen, setSettingsOpen] = useState(false);

  const [accountOpen, setAccountOpen] = useState(false);

  const [voiceOpen, setVoiceOpen] = useState(false);

  const [typing, setTyping] = useState(false);

  const [popup, setPopup] = useState("");

  const [input, setInput] = useState("");

  const [search, setSearch] = useState("");

  const [themeGlow, setThemeGlow] = useState(true);

  const [currentChat, setCurrentChat] = useState(0);

  const [chats, setChats] = useState<Chat[]>([
    {
      id: 1,
      title: "Lumina Welcome",
      messages: [],
    },
  ]);

  useEffect(() => {
    async function getUser() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push("/login");
      } else {
        setUser(session.user);
      }

      setLoading(false);
    }

    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.push("/login");
      } else {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [chats, typing]);

  function toast(text: string) {
    setPopup(text);

    setTimeout(() => {
      setPopup("");
    }, 2200);
  }

  function createChat() {
    const newChat: Chat = {
      id: Date.now(),
      title: "New Chat",
      messages: [],
    };

    setChats((prev) => [newChat, ...prev]);

    setCurrentChat(0);

    toast("Fresh chat created");
  }

  async function sendMessage() {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      role: "user",
      text: input,
    };

    const updatedChats = [...chats];

    updatedChats[currentChat].messages.push(userMessage);

    if (
      updatedChats[currentChat].title === "New Chat" ||
      updatedChats[currentChat].title === "Lumina Welcome"
    ) {
      updatedChats[currentChat].title = input.slice(0, 22);
    }

    setChats(updatedChats);

    const userText = input;

    setInput("");

    setTyping(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userText,
        }),
      });

      const data = await res.json();

      const aiMessage: Message = {
        id: Date.now() + 1,
        role: "assistant",
        text:
          data.reply ||
          "Lumina AI is temporarily unavailable.",
      };

      updatedChats[currentChat].messages.push(aiMessage);

      setChats([...updatedChats]);
    } catch {
      updatedChats[currentChat].messages.push({
        id: Date.now() + 2,
        role: "assistant",
        text: "AI request failed.",
      });

      setChats([...updatedChats]);
    }

    setTyping(false);
  }

  function copy(text: string) {
    navigator.clipboard.writeText(text);

    toast("Copied");
  }

  function reaction(type: "up" | "down") {
    if (type === "up") {
      toast("Thanks for the feedback");
    } else {
      toast("Response reported");
    }
  }

  async function logout() {
    await supabase.auth.signOut();

    router.push("/login");
  }

  async function deleteAccount() {
    toast("Delete system connected later");
  }

  function startVoice() {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      toast("Voice unsupported");
      return;
    }

    setVoiceOpen(true);

    const recognition = new SpeechRecognition();

    recognition.lang = "en-US";

    recognition.continuous = false;

    recognition.interimResults = false;

    recognition.start();

    recognition.onresult = (event: any) => {
      const transcript =
        event.results[0][0].transcript;

      setInput(transcript);

      setVoiceOpen(false);

      toast("Voice captured");
    };

    recognition.onerror = () => {
      setVoiceOpen(false);

      toast("Voice cancelled");
    };

    recognition.onend = () => {
      setVoiceOpen(false);
    };
  }

  const filteredChats = useMemo(() => {
    return chats.filter((chat) =>
      chat.title
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [search, chats]);

  if (loading) {
    return (
      <div className="loaderScreen">
        <div className="loaderOrb" />
      </div>
    );
  }

  return (
    <main className="app">
      {/* BG */}

      <div className="bgText">LUMINA</div>

      <div className="glow glow1" />
      <div className="glow glow2" />

      {/* SIDEBAR */}

      <aside className={`sidebar ${sidebar ? "show" : ""}`}>
        <div className="sideTop">
          <div className="logo">
            <Sparkles size={18} />
            Lumina AI
          </div>

          <button
            className="closeBtn"
            onClick={() => setSidebar(false)}
          >
            <X size={18} />
          </button>
        </div>

        <button
          className="newChatBtn"
          onClick={createChat}
        >
          <Plus size={18} />
          New Chat
        </button>

        <div className="searchBox">
          <Search size={16} />

          <input
            placeholder="Search chats..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />
        </div>

        <div className="history">
          {filteredChats.length === 0 && (
            <div className="emptyHistory">
              No chats found
            </div>
          )}

          {filteredChats.map((chat, index) => (
            <button
              key={chat.id}
              className={`historyItem ${
                currentChat === index
                  ? "active"
                  : ""
              }`}
              onClick={() => {
                const realIndex = chats.findIndex(
                  (c) => c.id === chat.id
                );

                setCurrentChat(realIndex);

                setSidebar(false);
              }}
            >
              <MessageSquare size={16} />

              <span>{chat.title}</span>
            </button>
          ))}
        </div>

        <div className="bottomMenu">
          <button
            className="bottomBtn"
            onClick={() => setSettingsOpen(true)}
          >
            <Settings size={18} />
            Settings
          </button>

          <button
            className="bottomBtn"
            onClick={() => setAccountOpen(true)}
          >
            <User size={18} />
            Account
          </button>
        </div>
      </aside>

      {/* MAIN */}

      <section className="main">
        <header className="topbar">
          <button
            className="iconBtn"
            onClick={() => setSidebar(true)}
          >
            <Menu size={20} />
          </button>

          <div className="brand">
            Lumina Ultra
          </div>

          <button
            className="premiumBtn"
            onClick={() =>
              toast("Lumina Premium Coming Soon")
            }
          >
            <Crown size={18} />
          </button>
        </header>

        {/* HERO */}

        {chats[currentChat].messages.length === 0 && (
          <div className="hero">
            <h1>
              What can I help with today?
            </h1>

            <p>
              Ultra fast AI • Voice • Files •
              Premium Intelligence
            </p>

            <div className="heroCards">
              <div className="heroCard">
                Create ideas
              </div>

              <div className="heroCard">
                Generate code
              </div>

              <div className="heroCard">
                Research anything
              </div>

              <div className="heroCard">
                Study smarter
              </div>
            </div>
          </div>
        )}

        {/* CHAT */}

        <div className="chatArea">
          {chats[currentChat].messages.map(
            (msg) => (
              <div
                key={msg.id}
                className={`msg ${
                  msg.role === "user"
                    ? "user"
                    : "ai"
                }`}
              >
                <div className="msgText">
                  {msg.text}
                </div>

                {msg.role === "assistant" && (
                  <div className="actions">
                    <button
                      onClick={() =>
                        copy(msg.text)
                      }
                    >
                      <Copy size={15} />
                    </button>

                    <button
                      onClick={() =>
                        reaction("up")
                      }
                    >
                      <ThumbsUp size={15} />
                    </button>

                    <button
                      onClick={() =>
                        reaction("down")
                      }
                    >
                      <ThumbsDown size={15} />
                    </button>
                  </div>
                )}
              </div>
            )
          )}

          {typing && (
            <div className="typing">
              <span />
              <span />
              <span />
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* INPUT */}

        <div className="inputWrap">
          <div className="inputBox">
            <input
              placeholder="Ask Lumina AI..."
              value={input}
              onChange={(e) =>
                setInput(e.target.value)
              }
              onKeyDown={(e) =>
                e.key === "Enter" &&
                sendMessage()
              }
            />

            <div className="inputActions">
              <button
                className="iconBtn"
                onClick={startVoice}
              >
                <Mic size={18} />
              </button>

              <button
                className="sendBtn"
                onClick={sendMessage}
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SETTINGS */}

      {settingsOpen && (
        <div className="overlay">
          <div className="panel">
            <div className="panelTop">
              <h2>Settings</h2>

              <button
                onClick={() =>
                  setSettingsOpen(false)
                }
              >
                <X size={18} />
              </button>
            </div>

            <div className="settingRow">
              <div>
                <h3>Glow Effects</h3>

                <p>
                  Toggle futuristic effects
                </p>
              </div>

              <button
                className={`toggle ${
                  themeGlow
                    ? "toggleOn"
                    : ""
                }`}
                onClick={() =>
                  setThemeGlow(!themeGlow)
                }
              >
                <div />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ACCOUNT */}

      {accountOpen && (
        <div className="overlay">
          <div className="panel">
            <div className="panelTop">
              <h2>Account</h2>

              <button
                onClick={() =>
                  setAccountOpen(false)
                }
              >
                <X size={18} />
              </button>
            </div>

            <div className="profile">
              <div className="avatar">
                {user?.email?.charAt(0)}
              </div>

              <div>
                <h3>{user?.email}</h3>

                <p>Premium User</p>
              </div>
            </div>

            <button className="panelBtn">
              <Crown size={18} />
              Upgrade Plan
            </button>

            <button
              className="panelBtn danger"
              onClick={deleteAccount}
            >
              <Trash2 size={18} />
              Delete Account
            </button>

            <button
              className="panelBtn logout"
              onClick={logout}
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      )}

      {/* VOICE */}

      {voiceOpen && (
        <div className="voiceOverlay">
          <div className="voiceOrb" />

          <h2>Listening...</h2>
        </div>
      )}

      {/* POPUP */}

      {popup && (
        <div className="popup">
          {popup}
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
          color: white;
          font-family: Inter, sans-serif;
          overflow: hidden;
        }

        .app {
          display: flex;
          height: 100vh;
          position: relative;
          overflow: hidden;
          background: #000;
        }

        .bgText {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: 220px;
          font-weight: 900;
          opacity: 0.03;
          pointer-events: none;
          letter-spacing: 20px;
        }

        .glow {
          position: absolute;
          border-radius: 50%;
          filter: blur(120px);
          z-index: 0;
        }

        .glow1 {
          width: 400px;
          height: 400px;
          background: #222;
          top: -100px;
          left: -100px;
        }

        .glow2 {
          width: 300px;
          height: 300px;
          background: #111;
          right: -100px;
          bottom: -100px;
        }

        .sidebar {
          width: 290px;
          background: rgba(10, 10, 10, 0.85);
          backdrop-filter: blur(20px);
          border-right: 1px solid #171717;
          display: flex;
          flex-direction: column;
          padding: 18px;
          z-index: 10;
        }

        .sideTop {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 21px;
          font-weight: 700;
        }

        .closeBtn {
          display: none;
        }

        .newChatBtn {
          height: 56px;
          border-radius: 18px;
          border: none;
          background: white;
          color: black;
          font-weight: 700;
          margin-top: 22px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          cursor: pointer;
          transition: 0.25s;
        }

        .newChatBtn:hover {
          transform: scale(1.02);
        }

        .searchBox {
          height: 50px;
          border-radius: 16px;
          background: #101010;
          border: 1px solid #1c1c1c;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 0 14px;
          margin-top: 18px;
        }

        .searchBox input {
          background: transparent;
          border: none;
          outline: none;
          color: white;
          width: 100%;
        }

        .history {
          flex: 1;
          overflow-y: auto;
          margin-top: 20px;
        }

        .emptyHistory {
          color: #666;
          text-align: center;
          margin-top: 40px;
        }

        .historyItem {
          width: 100%;
          height: 52px;
          border: none;
          border-radius: 16px;
          background: transparent;
          color: #ddd;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 0 16px;
          margin-bottom: 10px;
          cursor: pointer;
          transition: 0.25s;
        }

        .historyItem:hover,
        .historyItem.active {
          background: #151515;
        }

        .bottomMenu {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .bottomBtn {
          height: 50px;
          border-radius: 16px;
          border: none;
          background: #111;
          color: white;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 0 16px;
          cursor: pointer;
        }

        .main {
          flex: 1;
          display: flex;
          flex-direction: column;
          position: relative;
          z-index: 2;
        }

        .topbar {
          height: 72px;
          border-bottom: 1px solid #111;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 20px;
          backdrop-filter: blur(10px);
        }

        .brand {
          font-size: 24px;
          font-weight: 800;
        }

        .iconBtn,
        .premiumBtn,
        .actions button,
        .panelTop button {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          border: none;
          background: #111;
          color: white;
          cursor: pointer;
        }

        .hero {
          padding: 60px 30px 20px;
          animation: fade 0.5s ease;
        }

        .hero h1 {
          font-size: 48px;
          font-weight: 800;
        }

        .hero p {
          margin-top: 14px;
          color: #999;
          font-size: 18px;
        }

        .heroCards {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 14px;
          margin-top: 30px;
          max-width: 800px;
        }

        .heroCard {
          background: rgba(18, 18, 18, 0.8);
          border: 1px solid #1c1c1c;
          border-radius: 22px;
          padding: 24px;
          font-size: 17px;
          transition: 0.25s;
        }

        .heroCard:hover {
          transform: translateY(-4px);
          border-color: #444;
        }

        .chatArea {
          flex: 1;
          overflow-y: auto;
          padding: 20px 30px 120px;
        }

        .msg {
          max-width: 780px;
          padding: 20px;
          border-radius: 24px;
          margin-bottom: 18px;
          animation: fade 0.25s ease;
        }

        .msg.ai {
          background: rgba(12, 12, 12, 0.9);
          border: 1px solid #1a1a1a;
        }

        .msg.user {
          margin-left: auto;
          background: white;
          color: black;
        }

        .msgText {
          line-height: 1.7;
          font-size: 16px;
        }

        .actions {
          display: flex;
          gap: 10px;
          margin-top: 16px;
        }

        .typing {
          display: flex;
          gap: 8px;
          padding: 10px 0;
        }

        .typing span {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: white;
          animation: bounce 1s infinite;
        }

        .inputWrap {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 18px;
          backdrop-filter: blur(18px);
          background: rgba(0, 0, 0, 0.6);
        }

        .inputBox {
          max-width: 950px;
          margin: auto;
          height: 72px;
          background: rgba(12, 12, 12, 0.9);
          border: 1px solid #1d1d1d;
          border-radius: 28px;
          display: flex;
          align-items: center;
          padding: 0 16px 0 24px;
        }

        .inputBox input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          color: white;
          font-size: 17px;
        }

        .inputActions {
          display: flex;
          gap: 10px;
        }

        .sendBtn {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          border: none;
          background: white;
          color: black;
          cursor: pointer;
        }

        .overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 100;
        }

        .panel {
          width: 420px;
          background: #0b0b0b;
          border: 1px solid #1d1d1d;
          border-radius: 28px;
          padding: 24px;
          animation: fade 0.2s ease;
        }

        .panelTop {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .settingRow {
          margin-top: 26px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .toggle {
          width: 58px;
          height: 32px;
          border-radius: 999px;
          border: none;
          background: #222;
          position: relative;
          cursor: pointer;
        }

        .toggle div {
          width: 24px;
          height: 24px;
          background: white;
          border-radius: 50%;
          position: absolute;
          top: 4px;
          left: 4px;
          transition: 0.25s;
        }

        .toggleOn div {
          left: 30px;
        }

        .profile {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-top: 24px;
        }

        .avatar {
          width: 68px;
          height: 68px;
          border-radius: 50%;
          background: white;
          color: black;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 26px;
          font-weight: 700;
        }

        .panelBtn {
          width: 100%;
          height: 56px;
          border-radius: 18px;
          border: none;
          background: #111;
          color: white;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 0 18px;
          margin-top: 16px;
          cursor: pointer;
        }

        .danger {
          background: #220808;
        }

        .logout {
          background: white;
          color: black;
          font-weight: 700;
        }

        .popup {
          position: fixed;
          bottom: 30px;
          left: 50%;
          transform: translateX(-50%);
          background: white;
          color: black;
          padding: 14px 22px;
          border-radius: 999px;
          font-weight: 700;
          z-index: 200;
          animation: fade 0.2s ease;
        }

        .voiceOverlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.84);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          z-index: 120;
        }

        .voiceOrb {
          width: 190px;
          height: 190px;
          border-radius: 50%;
          background: radial-gradient(
            circle,
            #fff,
            #444
          );
          animation: pulse 1.2s infinite;
        }

        .voiceOverlay h2 {
          margin-top: 26px;
          font-size: 34px;
        }

        .loaderScreen {
          width: 100%;
          height: 100vh;
          background: black;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .loaderOrb {
          width: 90px;
          height: 90px;
          border-radius: 50%;
          border: 6px solid #222;
          border-top: 6px solid white;
          animation: spin 1s linear infinite;
        }

        @keyframes pulse {
          50% {
            transform: scale(1.1);
          }
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes bounce {
          50% {
            transform: translateY(-8px);
          }
        }

        @keyframes fade {
          from {
            opacity: 0;
            transform: translateY(10px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 900px) {
          .sidebar {
            position: fixed;
            left: -100%;
            top: 0;
            bottom: 0;
            z-index: 120;
            transition: 0.3s;
          }

          .sidebar.show {
            left: 0;
          }

          .closeBtn {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 38px;
            height: 38px;
            border-radius: 50%;
            border: none;
            background: #111;
            color: white;
          }

          .hero {
            padding: 40px 20px 10px;
          }

          .hero h1 {
            font-size: 34px;
          }

          .heroCards {
            grid-template-columns: 1fr;
          }

          .chatArea {
            padding: 18px 18px 120px;
          }

          .msg {
            max-width: 100%;
          }

          .panel {
            width: calc(100% - 20px);
          }

          .bgText {
            font-size: 110px;
          }
        }
      `}</style>
    </main>
  );
}
