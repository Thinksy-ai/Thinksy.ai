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

  const [typing, setTyping] = useState(false);
  const [voiceOpen, setVoiceOpen] = useState(false);

  const [popup, setPopup] = useState("");

  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");

  const [currentChat, setCurrentChat] = useState(0);

  const [chats, setChats] = useState<Chat[]>([
    {
      id: 1,
      title: "New Chat",
      messages: [],
    },
  ]);

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

    if (window.innerWidth < 900) {
      setSidebar(false);
    }
  }

  async function sendMessage() {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      role: "user",
      text: input,
    };

    const updated = [...chats];

    updated[currentChat].messages.push(userMessage);

    if (
      updated[currentChat].title === "New Chat"
    ) {
      updated[currentChat].title =
        input.slice(0, 22);
    }

    setChats(updated);

    const userText = input;

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
          message: userText,
        }),
      });

      const data = await res.json();

      const aiMessage: Message = {
        id: Date.now() + 1,
        role: "assistant",
        text:
          data.reply ||
          "Lumina AI is thinking...",
      };

      updated[currentChat].messages.push(
        aiMessage
      );

      setChats([...updated]);
    } catch {
      updated[currentChat].messages.push({
        id: Date.now() + 2,
        role: "assistant",
        text:
          "AI temporarily unavailable.",
      });

      setChats([...updated]);
    }

    setTyping(false);
  }

  function copy(text: string) {
    navigator.clipboard.writeText(text);

    toast("Copied");
  }

  function reaction(type: "up" | "down") {
    if (type === "up") {
      toast("Thanks for feedback");
    } else {
      toast("Response reported");
    }
  }

  async function logout() {
    await supabase.auth.signOut();

    router.push("/login");
  }

  function deleteAccount() {
    toast("Delete account coming soon");
  }

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

    setVoiceOpen(true);

    recognition.lang = "en-US";

    recognition.start();

    recognition.onresult = (event: any) => {
      setInput(
        event.results[0][0].transcript
      );

      setVoiceOpen(false);

      toast("Voice captured");
    };

    recognition.onerror = () => {
      setVoiceOpen(false);
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
      <div className="loader">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <main className="app">
      <div className="bg" />

      {/* SIDEBAR */}

      <aside
        className={`sidebar ${
          sidebar ? "show" : ""
        }`}
      >
        <div className="sidebarTop">
          <div className="logo">
            <Sparkles size={18} />
            Lumina
          </div>

          <button
            className="iconBtn mobileOnly"
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
                className={`chatItem ${
                  currentChat === index
                    ? "active"
                    : ""
                }`}
                onClick={() => {
                  const realIndex =
                    chats.findIndex(
                      (c) =>
                        c.id === chat.id
                    );

                  setCurrentChat(
                    realIndex
                  );

                  setSidebar(false);
                }}
              >
                <MessageSquare size={16} />
                {chat.title}
              </button>
            )
          )}
        </div>

        <div className="sidebarBottom">
          <button
            className="sideBtn"
            onClick={() =>
              setSettingsOpen(true)
            }
          >
            <Settings size={18} />
            Settings
          </button>

          <button
            className="sideBtn"
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
        <header className="topbar">
          <button
            className="iconBtn"
            onClick={() =>
              setSidebar(true)
            }
          >
            <Menu size={20} />
          </button>

          <h1>Lumina Ultra</h1>

          <button className="premium">
            <Crown size={18} />
          </button>
        </header>

        {chats[currentChat].messages
          .length === 0 && (
          <div className="hero">
            <h2>
              Ask anything.
            </h2>

            <p>
              Fast AI assistant with
              futuristic intelligence.
            </p>
          </div>
        )}

        <div className="messages">
          {chats[currentChat].messages.map(
            (msg) => (
              <div
                key={msg.id}
                className={`message ${
                  msg.role
                }`}
              >
                <div className="bubble">
                  {msg.text}

                  {msg.role ===
                    "assistant" && (
                    <div className="actions">
                      <button
                        onClick={() =>
                          copy(
                            msg.text
                          )
                        }
                      >
                        <Copy size={14} />
                      </button>

                      <button
                        onClick={() =>
                          reaction(
                            "up"
                          )
                        }
                      >
                        <ThumbsUp
                          size={14}
                        />
                      </button>

                      <button
                        onClick={() =>
                          reaction(
                            "down"
                          )
                        }
                      >
                        <ThumbsDown
                          size={14}
                        />
                      </button>
                    </div>
                  )}
                </div>
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

        <div className="inputArea">
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
      </section>

      {/* ACCOUNT */}

      {accountOpen && (
        <div className="overlay">
          <div className="panel">
            <div className="panelHead">
              <h2>Account</h2>

              <button
                className="iconBtn"
                onClick={() =>
                  setAccountOpen(false)
                }
              >
                <X size={18} />
              </button>
            </div>

            <div className="profile">
              <div className="avatar">
                {user?.email?.[0]}
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

      {/* SETTINGS */}

      {settingsOpen && (
        <div className="overlay">
          <div className="panel">
            <div className="panelHead">
              <h2>Settings</h2>

              <button
                className="iconBtn"
                onClick={() =>
                  setSettingsOpen(false)
                }
              >
                <X size={18} />
              </button>
            </div>

            <div className="setting">
              Futuristic animations enabled
            </div>
          </div>
        </div>
      )}

      {/* VOICE */}

      {voiceOpen && (
        <div className="voice">
          <div className="orb" />

          <h2>Listening...</h2>
        </div>
      )}

      {/* POPUP */}

      {popup && (
        <div className="toast">
          {popup}
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
          width: 100%;
          overflow: hidden;
          background: #000;
          color: white;
          font-family: Inter,
            sans-serif;
        }

        .app {
          display: flex;
          width: 100%;
          height: 100dvh;
          overflow: hidden;
          position: relative;
          background: black;
        }

        .bg {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(
              circle at top left,
              rgba(
                255,
                255,
                255,
                0.08
              ),
              transparent 30%
            ),
            radial-gradient(
              circle at bottom right,
              rgba(
                255,
                255,
                255,
                0.05
              ),
              transparent 30%
            );
          pointer-events: none;
        }

        .sidebar {
          width: 290px;
          background: #090909;
          border-right: 1px solid #171717;
          padding: 18px;
          display: flex;
          flex-direction: column;
          z-index: 50;
        }

        .sidebarTop {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .logo {
          font-size: 22px;
          font-weight: 800;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .newChat {
          margin-top: 20px;
          height: 54px;
          border: none;
          border-radius: 18px;
          background: white;
          color: black;
          font-weight: 700;
          cursor: pointer;
        }

        .searchBox {
          margin-top: 16px;
          height: 52px;
          border-radius: 16px;
          background: #121212;
          border: 1px solid #1f1f1f;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 0 14px;
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

        .chatItem {
          width: 100%;
          min-height: 50px;
          border-radius: 16px;
          border: none;
          background: transparent;
          color: white;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 14px;
          cursor: pointer;
          margin-bottom: 10px;
        }

        .chatItem.active,
        .chatItem:hover {
          background: #141414;
        }

        .sidebarBottom {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .sideBtn {
          height: 50px;
          border: none;
          border-radius: 16px;
          background: #121212;
          color: white;
          cursor: pointer;
        }

        .main {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-width: 0;
          overflow: hidden;
        }

        .topbar {
          height: 72px;
          border-bottom: 1px solid #111;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 18px;
          flex-shrink: 0;
        }

        .topbar h1 {
          font-size: 22px;
        }

        .hero {
          padding: 70px 24px 20px;
          text-align: center;
        }

        .hero h2 {
          font-size: 54px;
          font-weight: 900;
        }

        .hero p {
          color: #888;
          margin-top: 14px;
        }

        .messages {
          flex: 1;
          overflow-y: auto;
          width: 100%;
          padding: 20px 16px 140px;
        }

        .message {
          width: 100%;
          display: flex;
          margin-bottom: 18px;
        }

        .message.user {
          justify-content: flex-end;
        }

        .message.assistant {
          justify-content: flex-start;
        }

        .bubble {
          width: fit-content;
          max-width: min(820px, 100%);
          padding: 18px;
          border-radius: 24px;
          word-break: break-word;
          overflow-wrap: break-word;
          line-height: 1.7;
        }

        .message.user .bubble {
          background: white;
          color: black;
        }

        .message.assistant .bubble {
          background: #101010;
          border: 1px solid #1b1b1b;
        }

        .actions {
          display: flex;
          gap: 10px;
          margin-top: 16px;
        }

        .actions button,
        .iconBtn,
        .premium,
        .sendBtn {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          border: none;
          background: #141414;
          color: white;
          cursor: pointer;
        }

        .sendBtn {
          background: white;
          color: black;
        }

        .typing {
          display: flex;
          gap: 8px;
          padding: 20px;
        }

        .typing span {
          width: 10px;
          height: 10px;
          background: white;
          border-radius: 50%;
          animation: bounce 1s infinite;
        }

        .inputArea {
          position: fixed;
          bottom: 0;
          right: 0;
          left: 290px;
          padding: 16px;
          background: linear-gradient(
            to top,
            black,
            transparent
          );
        }

        .inputBox {
          max-width: 900px;
          margin: auto;
          height: 72px;
          border-radius: 28px;
          background: #0d0d0d;
          border: 1px solid #1d1d1d;
          display: flex;
          align-items: center;
          padding: 0 14px 0 22px;
          gap: 10px;
        }

        .inputBox input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          color: white;
          font-size: 16px;
        }

        .overlay,
        .voice {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.82);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 200;
        }

        .panel {
          width: min(420px, 95%);
          background: #0b0b0b;
          border-radius: 28px;
          border: 1px solid #1c1c1c;
          padding: 24px;
        }

        .panelHead {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .profile {
          display: flex;
          gap: 16px;
          align-items: center;
          margin-top: 24px;
        }

        .avatar {
          width: 70px;
          height: 70px;
          border-radius: 50%;
          background: white;
          color: black;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28px;
          font-weight: 800;
        }

        .panelBtn {
          width: 100%;
          height: 54px;
          border: none;
          border-radius: 18px;
          margin-top: 16px;
          background: #131313;
          color: white;
          cursor: pointer;
        }

        .danger {
          background: #250b0b;
        }

        .logout {
          background: white;
          color: black;
        }

        .toast {
          position: fixed;
          bottom: 100px;
          left: 50%;
          transform: translateX(-50%);
          background: white;
          color: black;
          padding: 14px 20px;
          border-radius: 999px;
          z-index: 400;
          font-weight: 700;
        }

        .orb {
          width: 180px;
          height: 180px;
          border-radius: 50%;
          background: radial-gradient(
            circle,
            white,
            #333
          );
          animation: pulse 1.2s infinite;
        }

        .voice {
          flex-direction: column;
          gap: 24px;
        }

        .loader {
          width: 100%;
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: black;
        }

        .spinner {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          border: 5px solid #222;
          border-top: 5px solid white;
          animation: spin 1s linear infinite;
        }

        @keyframes bounce {
          50% {
            transform: translateY(-6px);
          }
        }

        @keyframes pulse {
          50% {
            transform: scale(1.08);
          }
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        @media (max-width: 900px) {
          .sidebar {
            position: fixed;
            left: -100%;
            top: 0;
            bottom: 0;
            transition: 0.3s;
          }

          .sidebar.show {
            left: 0;
          }

          .mobileOnly {
            display: flex;
          }

          .inputArea {
            left: 0;
            padding-bottom: max(
              16px,
              env(
                safe-area-inset-bottom
              )
            );
          }

          .hero h2 {
            font-size: 38px;
          }

          .messages {
            padding: 16px 12px 140px;
          }

          .bubble {
            max-width: 100%;
          }
        }
      `}</style>
    </main>
  );
}
