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
  Volume2,
  Moon,
  Shield,
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

  const [currentChat, setCurrentChat] = useState(0);

  const [glowEnabled, setGlowEnabled] = useState(true);

  const [chats, setChats] = useState<Chat[]>([
    {
      id: 1,
      title: "Welcome",
      messages: [],
    },
  ]);

  // ---------------- AUTH ----------------

  useEffect(() => {
    async function checkUser() {
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

    checkUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!session) {
          router.push("/login");
        } else {
          setUser(session.user);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  // ---------------- SCROLL ----------------

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [chats, typing]);

  // ---------------- TOAST ----------------

  function toast(text: string) {
    setPopup(text);

    setTimeout(() => {
      setPopup("");
    }, 2400);
  }

  // ---------------- NEW CHAT ----------------

  function createChat() {
    const newChat: Chat = {
      id: Date.now(),
      title: "New Chat",
      messages: [],
    };

    setChats((prev) => [newChat, ...prev]);

    setCurrentChat(0);

    toast("New chat started");
  }

  // ---------------- SEND ----------------

  async function sendMessage() {
    if (!input.trim()) return;

    const messageText = input;

    const userMessage: Message = {
      id: Date.now(),
      role: "user",
      text: messageText,
    };

    const updatedChats = [...chats];

    updatedChats[currentChat].messages.push(
      userMessage
    );

    if (
      updatedChats[currentChat].title ===
        "New Chat" ||
      updatedChats[currentChat].title ===
        "Welcome"
    ) {
      updatedChats[currentChat].title =
        messageText.slice(0, 24);
    }

    setChats([...updatedChats]);

    setInput("");

    setTyping(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          message: messageText,
        }),
      });

      const data = await res.json();

      const aiMessage: Message = {
        id: Date.now() + 1,
        role: "assistant",
        text:
          data.reply ||
          "Lumina AI is unavailable right now.",
      };

      updatedChats[currentChat].messages.push(
        aiMessage
      );

      setChats([...updatedChats]);
    } catch {
      updatedChats[currentChat].messages.push(
        {
          id: Date.now() + 2,
          role: "assistant",
          text:
            "Connection failed. Try again.",
        }
      );

      setChats([...updatedChats]);
    }

    setTyping(false);
  }

  // ---------------- SEARCH ----------------

  const filteredChats = useMemo(() => {
    return chats.filter((chat) =>
      chat.title
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [search, chats]);

  // ---------------- COPY ----------------

  function copy(text: string) {
    navigator.clipboard.writeText(text);

    toast("Copied");
  }

  // ---------------- REACTION ----------------

  function react(type: "up" | "down") {
    if (type === "up") {
      toast("Thanks for the feedback");
    } else {
      toast("Feedback submitted");
    }
  }

  // ---------------- LOGOUT ----------------

  async function logout() {
    await supabase.auth.signOut();

    router.push("/login");
  }

  // ---------------- DELETE ACCOUNT ----------------

  async function deleteAccount() {
    toast("Delete system coming soon");
  }

  // ---------------- VOICE ----------------

  function startVoice() {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any)
        .webkitSpeechRecognition;

    if (!SpeechRecognition) {
      toast("Voice unsupported");
      return;
    }

    const recognition =
      new SpeechRecognition();

    recognition.lang = "en-US";

    recognition.continuous = false;

    recognition.interimResults = false;

    setVoiceOpen(true);

    recognition.start();

    recognition.onresult = (event: any) => {
      const transcript =
        event.results[0][0].transcript;

      setInput(transcript);

      toast("Voice captured");

      setVoiceOpen(false);
    };

    recognition.onerror = () => {
      setVoiceOpen(false);

      toast("Voice cancelled");
    };

    recognition.onend = () => {
      setVoiceOpen(false);
    };
  }

  // ---------------- LOADER ----------------

  if (loading) {
    return (
      <div className="loader">
        <div className="loaderOrb" />
      </div>
    );
  }

  return (
    <main className="app">
      {/* BACKGROUND */}

      <div className="bgText">
        LUMINA
      </div>

      {glowEnabled && (
        <>
          <div className="glow glow1" />
          <div className="glow glow2" />
        </>
      )}

      {/* SIDEBAR */}

      <aside
        className={`sidebar ${
          sidebar ? "show" : ""
        }`}
      >
        <div className="sideTop">
          <div className="logo">
            <Sparkles size={18} />
            Lumina AI
          </div>

          <button
            className="mobileClose"
            onClick={() =>
              setSidebar(false)
            }
          >
            <X size={18} />
          </button>
        </div>

        <button
          className="newChat"
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
          {filteredChats.map(
            (chat, index) => (
              <button
                key={chat.id}
                className={`historyItem ${
                  currentChat === index
                    ? "active"
                    : ""
                }`}
                onClick={() => {
                  const realIndex =
                    chats.findIndex(
                      (c) =>
                        c.id ===
                        chat.id
                    );

                  setCurrentChat(
                    realIndex
                  );

                  setSidebar(false);
                }}
              >
                <MessageSquare
                  size={16}
                />

                <span>
                  {chat.title}
                </span>
              </button>
            )
          )}
        </div>

        <div className="sidebarBottom">
          <button
            className="menuBtn"
            onClick={() =>
              setSettingsOpen(true)
            }
          >
            <Settings size={18} />
            Settings
          </button>

          <button
            className="menuBtn"
            onClick={() =>
              setAccountOpen(true)
            }
          >
            <User size={18} />
            Account
          </button>
        </div>
      </aside>

      {/* MAIN */}

      <section className="main">
        {/* TOPBAR */}

        <header className="topbar">
          <button
            className="circleBtn"
            onClick={() =>
              setSidebar(true)
            }
          >
            <Menu size={20} />
          </button>

          <div className="brand">
            Lumina Ultra
          </div>

          <button
            className="premium"
            onClick={() =>
              toast(
                "Premium launching soon"
              )
            }
          >
            <Crown size={18} />
          </button>
        </header>

        {/* HERO */}

        {chats[currentChat].messages
          .length === 0 && (
          <div className="hero">
            <h1>
              What can I help you
              with?
            </h1>

            <p>
              Fast AI • Voice •
              Research • Creativity
            </p>

            <div className="heroGrid">
              <div className="heroCard">
                Generate code
              </div>

              <div className="heroCard">
                Study smarter
              </div>

              <div className="heroCard">
                Create content
              </div>

              <div className="heroCard">
                Research topics
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

                {msg.role ===
                  "assistant" && (
                  <div className="actions">
                    <button
                      onClick={() =>
                        copy(msg.text)
                      }
                    >
                      <Copy
                        size={15}
                      />
                    </button>

                    <button
                      onClick={() =>
                        react("up")
                      }
                    >
                      <ThumbsUp
                        size={15}
                      />
                    </button>

                    <button
                      onClick={() =>
                        react("down")
                      }
                    >
                      <ThumbsDown
                        size={15}
                      />
                    </button>

                    <button>
                      <Volume2
                        size={15}
                      />
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
                setInput(
                  e.target.value
                )
              }
              onKeyDown={(e) =>
                e.key === "Enter" &&
                sendMessage()
              }
            />

            <div className="inputButtons">
              <button
                className="circleBtn"
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
                className="circleBtn"
                onClick={() =>
                  setSettingsOpen(
                    false
                  )
                }
              >
                <X size={18} />
              </button>
            </div>

            <div className="settingRow">
              <div>
                <h3>
                  Glow Effects
                </h3>

                <p>
                  Futuristic visual
                  glow
                </p>
              </div>

              <button
                className={`toggle ${
                  glowEnabled
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  setGlowEnabled(
                    !glowEnabled
                  )
                }
              >
                <div />
              </button>
            </div>

            <div className="settingCard">
              <Moon size={18} />
              Dark Ultra Theme
            </div>

            <div className="settingCard">
              <Shield size={18} />
              Secure Encryption
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
                className="circleBtn"
                onClick={() =>
                  setAccountOpen(
                    false
                  )
                }
              >
                <X size={18} />
              </button>
            </div>

            <div className="profile">
              <div className="avatar">
                {user?.email?.charAt(
                  0
                )}
              </div>

              <div>
                <h3>
                  {user?.email}
                </h3>

                <p>
                  Lumina Premium
                </p>
              </div>
            </div>

            <button className="panelBtn">
              <Crown size={18} />
              Upgrade Plan
            </button>

            <button
              className="panelBtn danger"
              onClick={
                deleteAccount
              }
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

      {/* STYLES */}

      <style jsx global>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

    html,
  body {
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #000;
}

body {
  color: white;
  font-family: Inter, sans-serif;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}

.app {
  display: flex;
  width: 100%;
  height: 100dvh;
  min-height: 100dvh;
  position: relative;
  background: #000;
  overflow: hidden;
}

        .bgText {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(
            -50%,
            -50%
          );
          font-size: 240px;
          font-weight: 900;
          opacity: 0.03;
          letter-spacing: 18px;
          pointer-events: none;
        }

        .glow {
          position: absolute;
          border-radius: 50%;
          filter: blur(120px);
        }

        .glow1 {
          width: 350px;
          height: 350px;
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
          background: rgba(
            10,
            10,
            10,
            0.94
          );
          border-right: 1px solid
            #181818;
          padding: 18px;
          display: flex;
          flex-direction: column;
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

        .mobileClose {
          display: none;
        }

        .newChat {
          height: 56px;
          border-radius: 18px;
          border: none;
          background: white;
          color: black;
          font-weight: 700;
          margin-top: 20px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }

        .searchBox {
          height: 50px;
          border-radius: 16px;
          background: #101010;
          border: 1px solid
            #1e1e1e;
          margin-top: 18px;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 0 16px;
        }

        .searchBox input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          color: white;
        }

        .history {
          flex: 1;
          overflow-y: auto;
          margin-top: 18px;
        }

        .historyItem {
          width: 100%;
          height: 52px;
          border: none;
          border-radius: 16px;
          background: transparent;
          color: white;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 0 16px;
          margin-bottom: 10px;
          cursor: pointer;
        }

        .historyItem:hover,
        .historyItem.active {
          background: #141414;
        }

        .sidebarBottom {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .menuBtn {
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
          overflow: hidden;
        }

        .topbar {
          height: 72px;
          border-bottom: 1px solid
            #111;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 20px;
          z-index: 5;
        }

        .brand {
          font-size: 24px;
          font-weight: 800;
        }

        .circleBtn,
        .premium,
        .actions button {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          border: none;
          background: #111;
          color: white;
          cursor: pointer;
        }

        .hero {
          padding: 60px 30px 20px;
        }

        .hero h1 {
          font-size: 52px;
          font-weight: 800;
        }

        .hero p {
          margin-top: 14px;
          color: #888;
          font-size: 18px;
        }

        .heroGrid {
          display: grid;
          grid-template-columns: repeat(
            2,
            1fr
          );
          gap: 14px;
          margin-top: 30px;
          max-width: 800px;
        }

        .heroCard {
          background: rgba(
            14,
            14,
            14,
            0.9
          );
          border: 1px solid
            #1e1e1e;
          border-radius: 24px;
          padding: 24px;
          font-size: 17px;
          transition: 0.2s;
        }

        .heroCard:hover {
          transform: translateY(
            -4px
          );
        }

        .chatArea {
          flex: 1;
          overflow-y: auto;
          padding: 20px 20px 140px;
          width: 100%;
        }

        .msg {
          width: fit-content;
          max-width: min(
            760px,
            100%
          );
          padding: 18px;
          border-radius: 24px;
          margin-bottom: 18px;
          animation: fade 0.25s ease;
          word-wrap: break-word;
          overflow-wrap: break-word;
        }

        .msg.ai {
          background: rgba(
            12,
            12,
            12,
            0.96
          );
          border: 1px solid
            #1c1c1c;
        }

        .msg.user {
          margin-left: auto;
          background: white;
          color: black;
        }

        .msgText {
          line-height: 1.7;
          font-size: 16px;
          white-space: pre-wrap;
        }

        .actions {
          display: flex;
          gap: 10px;
          margin-top: 16px;
        }

        .typing {
          display: flex;
          gap: 8px;
          padding: 8px 0;
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
          background: linear-gradient(
            to top,
            black,
            transparent
          );
        }

        .inputBox {
          max-width: 950px;
          width: 100%;
          margin: auto;
          min-height: 72px;
          border-radius: 30px;
          background: rgba(
            12,
            12,
            12,
            0.96
          );
          border: 1px solid
            #1e1e1e;
          display: flex;
          align-items: center;
          padding: 0 14px 0 22px;
        }

        .inputBox input {
          flex: 1;
          min-width: 0;
          background: transparent;
          border: none;
          outline: none;
          color: white;
          font-size: 17px;
        }

        .inputButtons {
          display: flex;
          gap: 10px;
          margin-left: 10px;
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
          background: rgba(
            0,
            0,
            0,
            0.75
          );
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 120;
        }

        .panel {
          width: 420px;
          max-width: calc(
            100vw - 20px
          );
          background: #0b0b0b;
          border: 1px solid
            #1e1e1e;
          border-radius: 28px;
          padding: 24px;
        }

        .panelTop {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .settingRow {
          margin-top: 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .settingCard {
          height: 54px;
          border-radius: 18px;
          background: #111;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 0 16px;
          margin-top: 14px;
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
          transition: 0.2s;
        }

        .toggle.active div {
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
          font-size: 28px;
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
          background: #240909;
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
          transform: translateX(
            -50%
          );
          background: white;
          color: black;
          padding: 14px 22px;
          border-radius: 999px;
          font-weight: 700;
          z-index: 200;
        }

        .voiceOverlay {
          position: fixed;
          inset: 0;
          background: rgba(
            0,
            0,
            0,
            0.88
          );
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          z-index: 150;
        }

        .voiceOrb {
          width: 180px;
          height: 180px;
          border-radius: 50%;
          background: radial-gradient(
            circle,
            white,
            #444
          );
          animation: pulse 1.2s infinite;
        }

        .voiceOverlay h2 {
          margin-top: 26px;
          font-size: 34px;
        }

        .loader {
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
          border: 5px solid #222;
          border-top: 5px solid white;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(
              360deg
            );
          }
        }

        @keyframes bounce {
          50% {
            transform: translateY(
              -6px
            );
          }
        }

        @keyframes pulse {
          50% {
            transform: scale(1.08);
          }
        }

        @keyframes fade {
          from {
            opacity: 0;
            transform: translateY(
              10px
            );
          }

          to {
            opacity: 1;
            transform: translateY(
              0
            );
          }
        }

        @media (max-width: 900px) {
          .sidebar {
            position: fixed;
            top: 0;
            bottom: 0;
            left: -100%;
            transition: 0.3s;
          }

          .sidebar.show {
            left: 0;
          }

          .mobileClose {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            border: none;
            background: #111;
            color: white;
          }

          .bgText {
            font-size: 120px;
          }

          .hero {
            padding: 40px 20px 10px;
          }

          .hero h1 {
            font-size: 36px;
          }

          .heroGrid {
            grid-template-columns: 1fr;
          }

          .chatArea {
            padding: 16px 14px 140px;
          }

          .msg {
            max-width: 100%;
          }

          .inputWrap {
            padding: 12px;
          }

          .inputBox {
            min-height: 64px;
            border-radius: 24px;
            padding: 0 10px 0 16px;
          }

          .inputBox input {
            font-size: 16px;
          }

          .voiceOrb {
            width: 140px;
            height: 140px;
          }

          .voiceOverlay h2 {
            font-size: 28px;
          }
        }
      `}</style>
    </main>
  );
}
