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
  Moon,
  Sun,
  PanelLeftClose,
  Bot,
  Stars,
  Zap,
  Check,
  Volume2,
  PenSquare,
  ImageIcon,
  Clock3,
  ChevronRight,
  Cpu,
  Shield,
  Wand2,
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
  time?: string;
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

  const [darkMode, setDarkMode] = useState(true);

  const [glowEffects, setGlowEffects] = useState(true);

  const [compactMode, setCompactMode] = useState(false);

  const [online, setOnline] = useState(true);

  const [currentChat, setCurrentChat] = useState(0);

  const [chats, setChats] = useState<Chat[]>([
    {
      id: 1,
      title: "Welcome",
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

    return () => subscription.unsubscribe();
  }, [router]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [chats, typing]);

  useEffect(() => {
    const updateOnline = () => {
      setOnline(navigator.onLine);
    };

    updateOnline();

    window.addEventListener(
      "online",
      updateOnline
    );

    window.addEventListener(
      "offline",
      updateOnline
    );

    return () => {
      window.removeEventListener(
        "online",
        updateOnline
      );

      window.removeEventListener(
        "offline",
        updateOnline
      );
    };
  }, []);

  useEffect(() => {
    const savedTheme =
      localStorage.getItem("lumina-theme");

    if (savedTheme === "light") {
      setDarkMode(false);
    }

    const savedGlow =
      localStorage.getItem("lumina-glow");

    if (savedGlow === "false") {
      setGlowEffects(false);
    }

    const savedCompact =
      localStorage.getItem("lumina-compact");

    if (savedCompact === "true") {
      setCompactMode(true);
    }

    const savedChats =
      localStorage.getItem("lumina-chats");

    if (savedChats) {
      setChats(JSON.parse(savedChats));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "lumina-theme",
      darkMode ? "dark" : "light"
    );
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem(
      "lumina-glow",
      glowEffects.toString()
    );
  }, [glowEffects]);

  useEffect(() => {
    localStorage.setItem(
      "lumina-compact",
      compactMode.toString()
    );
  }, [compactMode]);

  useEffect(() => {
    localStorage.setItem(
      "lumina-chats",
      JSON.stringify(chats)
    );
  }, [chats]);

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

    toast("New chat created");
  }

  function getTime() {
    return new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  async function sendMessage() {
    if (!input.trim()) return;

    const userText = input;

    const userMessage: Message = {
      id: Date.now(),
      role: "user",
      text: userText,
      time: getTime(),
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
        userText.slice(0, 24);
    }

    setChats(updatedChats);

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
          "Lumina AI could not respond.",
        time: getTime(),
      };

      updatedChats[currentChat].messages.push(
        aiMessage
      );

      setChats([...updatedChats]);
    } catch {
      updatedChats[currentChat].messages.push({
        id: Date.now() + 2,
        role: "assistant",
        text: "Connection failed.",
        time: getTime(),
      });

      setChats([...updatedChats]);
    }

    setTyping(false);
  }

  function copyText(text: string) {
    navigator.clipboard.writeText(text);

    toast("Copied");
  }

  function react(type: "up" | "down") {
    if (type === "up") {
      toast("Thanks for the feedback");
    } else {
      toast("Feedback submitted");
    }
  }

  function speak(text: string) {
    const utterance =
      new SpeechSynthesisUtterance(text);

    speechSynthesis.speak(utterance);

    toast("Reading response");
  }

  async function logout() {
    await supabase.auth.signOut();

    router.push("/login");
  }

  function deleteChat(id: number) {
    const filtered = chats.filter(
      (chat) => chat.id !== id
    );

    if (filtered.length === 0) {
      setChats([
        {
          id: 1,
          title: "Welcome",
          messages: [],
        },
      ]);

      setCurrentChat(0);
    } else {
      setChats(filtered);

      setCurrentChat(0);
    }

    toast("Chat deleted");
  }

  async function deleteAccount() {
    toast("Delete account backend pending");
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

    setVoiceOpen(true);

    const recognition =
      new SpeechRecognition();

    recognition.lang = "en-US";

    recognition.continuous = false;

    recognition.interimResults = false;

    recognition.start();

    recognition.onresult = (
      event: any
    ) => {
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
      <div className="loader">
        <div className="loaderOrb" />
      </div>
    );
  }

  return (
    <main
      className={`app ${
        darkMode ? "dark" : "light"
      }`}
    >
      {glowEffects && (
        <>
          <div className="glow glow1" />
          <div className="glow glow2" />
        </>
      )}

      <div className="bgGrid" />

      <div className="bgWord">
        LUMINA
      </div>

      <aside
        className={`sidebar ${
          sidebar ? "show" : ""
        }`}
      >
        <div className="sideTop">
          <div className="logo">
            <Sparkles size={18} />
            <span>Lumina AI</span>
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

        <div className="quickTools">
          <div className="toolCard">
            <Bot size={18} />
            Smart AI
          </div>

          <div className="toolCard">
            <Shield size={18} />
            Secure
          </div>

          <div className="toolCard">
            <Cpu size={18} />
            Fast
          </div>

          <div className="toolCard">
            <Wand2 size={18} />
            Creative
          </div>
        </div>

        <div className="history">
          {filteredChats.map(
            (chat) => (
              <div
                key={chat.id}
                className={`historyItem ${
                  chats[currentChat]?.id ===
                  chat.id
                    ? "active"
                    : ""
                }`}
              >
                <button
                  className="historySelect"
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

                <button
                  className="deleteMini"
                  onClick={() =>
                    deleteChat(chat.id)
                  }
                >
                  <Trash2 size={14} />
                </button>
              </div>
            )
          )}
        </div>

        <div className="sideBottom">
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

      <section className="main">
        <header className="topbar">
          <button
            className="circleBtn"
            onClick={() =>
              setSidebar(true)
            }
          >
            <Menu size={20} />
          </button>

          <div className="centerBrand">
            <span>Lumina Ultra</span>

            <div
              className={`status ${
                online
                  ? "online"
                  : "offline"
              }`}
            >
              {online
                ? "Online"
                : "Offline"}
            </div>
          </div>

          <button
            className="circleBtn"
            onClick={createChat}
          >
            <PenSquare size={18} />
          </button>
        </header>

        {chats[currentChat]?.messages
          .length === 0 && (
          <div className="hero">
            <div className="heroBadge">
              <Stars size={16} />
              Next Generation AI
            </div>

            <h1>
              Think smarter.
              <br />
              Build faster.
            </h1>

            <p>
              Voice AI, coding, writing,
              research, creativity and
              ultra-fast responses in one
              futuristic workspace.
            </p>

            <div className="heroGrid">
              <div className="heroCard">
                <Zap size={22} />
                <h3>Ultra Speed</h3>
                <span>
                  Faster AI responses
                </span>
              </div>

              <div className="heroCard">
                <Bot size={22} />
                <h3>Smart Assistant</h3>
                <span>
                  Human-like answers
                </span>
              </div>

              <div className="heroCard">
                <Mic size={22} />
                <h3>Voice Support</h3>
                <span>
                  Speak naturally
                </span>
              </div>

              <div className="heroCard">
                <ImageIcon size={22} />
                <h3>Creative AI</h3>
                <span>
                  Ideas and generation
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="chatArea">
          {chats[currentChat]?.messages.map(
            (msg) => (
              <div
                key={msg.id}
                className={`msg ${
                  msg.role === "user"
                    ? "user"
                    : "ai"
                } ${
                  compactMode
                    ? "compact"
                    : ""
                }`}
              >
                <div className="msgTop">
                  <div className="msgUser">
                    {msg.role === "assistant" ? (
                      <>
                        <Bot size={16} />
                        Lumina
                      </>
                    ) : (
                      <>
                        <User size={16} />
                        You
                      </>
                    )}
                  </div>

                  <div className="msgTime">
                    <Clock3 size={12} />
                    {msg.time}
                  </div>
                </div>

                <div className="msgText">
                  {msg.text}
                </div>

                {msg.role ===
                  "assistant" && (
                  <div className="msgActions">
                    <button
                      onClick={() =>
                        copyText(
                          msg.text
                        )
                      }
                    >
                      <Copy size={15} />
                    </button>

                    <button
                      onClick={() =>
                        speak(
                          msg.text
                        )
                      }
                    >
                      <Volume2
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

            <div className="inputButtons">
              <button
                className="miniBtn"
                onClick={startVoice}
              >
                <Mic size={18} />
              </button>

              <button className="miniBtn">
                <ImageIcon size={18} />
              </button>

              <button
                className="sendBtn"
                onClick={sendMessage}
              >
                <Send size={18} />
              </button>
            </div>
          </div>

          <div className="inputFooter">
            <span>
              Lumina Ultra AI
            </span>

            <ChevronRight size={14} />

            <span>
              Secure • Fast • Smart
            </span>
          </div>
        </div>
      </section>

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

            <div className="setting">
              <div>
                <h3>Dark Mode</h3>

                <p>
                  Toggle interface
                  appearance
                </p>
              </div>

              <button
                className="toggle"
                onClick={() =>
                  setDarkMode(
                    !darkMode
                  )
                }
              >
                {darkMode ? (
                  <Moon size={16} />
                ) : (
                  <Sun size={16} />
                )}
              </button>
            </div>

            <div className="setting">
              <div>
                <h3>Glow Effects</h3>

                <p>
                  Futuristic visual glow
                </p>
              </div>

              <button
                className="toggle"
                onClick={() =>
                  setGlowEffects(
                    !glowEffects
                  )
                }
              >
                <Check size={16} />
              </button>
            </div>

            <div className="setting">
              <div>
                <h3>Compact Mode</h3>

                <p>
                  Smaller message layout
                </p>
              </div>

              <button
                className="toggle"
                onClick={() =>
                  setCompactMode(
                    !compactMode
                  )
                }
              >
                <PanelLeftClose
                  size={16}
                />
              </button>
            </div>
          </div>
        </div>
      )}

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

            <button className="panelBtn premium">
              <Crown size={18} />
              Upgrade to Ultra+
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

      {voiceOpen && (
        <div className="voiceOverlay">
          <div className="voiceOrb" />

          <h2>Listening...</h2>
        </div>
      )}

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
          overflow-x: hidden;
          font-family: Inter,
            sans-serif;
          scroll-behavior: smooth;
        }

        body {
          background: #000;
        }

        button,
        input {
          font-family: inherit;
        }

        ::-webkit-scrollbar {
          width: 6px;
        }

        ::-webkit-scrollbar-thumb {
          background: #333;
          border-radius: 999px;
        }

        .app {
          width: 100%;
          min-height: 100vh;
          display: flex;
          overflow: hidden;
          position: relative;
        }

        .dark {
          background: #000;
          color: white;
        }

        .light {
          background: #f4f4f4;
          color: black;
        }

        .bgGrid {
          position: fixed;
          inset: 0;
          background-image: linear-gradient(
              rgba(255,255,255,0.03)
                1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(255,255,255,0.03)
                1px,
              transparent 1px
            );
          background-size: 40px 40px;
          pointer-events: none;
        }

        .bgWord {
          position: fixed;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18vw;
          font-weight: 900;
          opacity: 0.03;
          letter-spacing: 14px;
          pointer-events: none;
        }

        .glow {
          position: fixed;
          border-radius: 50%;
          filter: blur(120px);
          z-index: 0;
        }

        .glow1 {
          width: 350px;
          height: 350px;
          background: #222;
          top: -100px;
          left: -100px;
        }

        .glow2 {
          width: 320px;
          height: 320px;
          background: #111;
          bottom: -100px;
          right: -100px;
        }

        .sidebar {
          width: 300px;
          background: rgba(
            10,
            10,
            10,
            0.92
          );
          border-right: 1px solid
            #1d1d1d;
          padding: 18px;
          display: flex;
          flex-direction: column;
          z-index: 20;
          backdrop-filter: blur(18px);
        }

        .sideTop {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 22px;
          font-weight: 800;
        }

        .mobileClose {
          display: none;
        }

        .newChatBtn {
          margin-top: 22px;
          height: 58px;
          border-radius: 18px;
          border: none;
          background: white;
          color: black;
          font-weight: 700;
          cursor: pointer;
          transition: 0.2s;
        }

        .newChatBtn:hover {
          transform: scale(1.02);
        }

        .searchBox {
          height: 52px;
          border-radius: 16px;
          background: #101010;
          border: 1px solid #1f1f1f;
          margin-top: 16px;
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

        .quickTools {
          display: grid;
          grid-template-columns: repeat(
            2,
            1fr
          );
          gap: 10px;
          margin-top: 18px;
        }

        .toolCard {
          height: 70px;
          border-radius: 18px;
          background: #111;
          border: 1px solid #1c1c1c;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-size: 13px;
        }

        .history {
          flex: 1;
          overflow-y: auto;
          margin-top: 20px;
        }

        .historyItem {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 10px;
        }

        .historySelect {
          flex: 1;
          height: 52px;
          border-radius: 16px;
          border: none;
          background: #121212;
          color: white;
          padding: 0 16px;
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
        }

        .historyItem.active
          .historySelect {
          background: white;
          color: black;
        }

        .deleteMini {
          width: 44px;
          height: 44px;
          border-radius: 14px;
          border: none;
          background: #151515;
          color: white;
        }

        .sideBottom {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .sideBtn {
          height: 52px;
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
          min-width: 0;
          display: flex;
          flex-direction: column;
          position: relative;
        }

        .topbar {
          height: 72px;
          border-bottom: 1px solid
            #111;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 18px;
          backdrop-filter: blur(10px);
        }

        .centerBrand {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .centerBrand span {
          font-size: 24px;
          font-weight: 800;
        }

        .status {
          font-size: 12px;
          margin-top: 4px;
        }

        .online {
          color: #4ade80;
        }

        .offline {
          color: #f87171;
        }

        .circleBtn {
          width: 46px;
          height: 46px;
          border-radius: 50%;
          border: none;
          background: #111;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .hero {
          padding: 70px 28px 30px;
        }

        .heroBadge {
          width: fit-content;
          padding: 10px 16px;
          border-radius: 999px;
          background: #111;
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 24px;
        }

        .hero h1 {
          font-size: 64px;
          line-height: 1;
          font-weight: 900;
        }

        .hero p {
          margin-top: 18px;
          font-size: 18px;
          color: #9a9a9a;
          max-width: 700px;
          line-height: 1.7;
        }

        .heroGrid {
          margin-top: 34px;
          display: grid;
          grid-template-columns: repeat(
            2,
            minmax(0, 1fr)
          );
          gap: 16px;
          max-width: 800px;
        }

        .heroCard {
          min-height: 140px;
          border-radius: 24px;
          background: rgba(
            18,
            18,
            18,
            0.8
          );
          border: 1px solid #1d1d1d;
          padding: 24px;
          transition: 0.25s;
        }

        .heroCard:hover {
          transform: translateY(-4px);
        }

        .chatArea {
          flex: 1;
          overflow-y: auto;
          padding: 20px 24px 150px;
        }

        .msg {
          width: fit-content;
          max-width: min(
            860px,
            100%
          );
          padding: 22px;
          border-radius: 24px;
          margin-bottom: 18px;
          animation: fade 0.2s ease;
        }

        .compact {
          padding: 14px;
        }

        .msg.ai {
          background: rgba(
            12,
            12,
            12,
            0.9
          );
          border: 1px solid #1f1f1f;
        }

        .msg.user {
          margin-left: auto;
          background: white;
          color: black;
        }

        .msgTop {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
        }

        .msgUser {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 700;
        }

        .msgText {
          line-height: 1.9;
          white-space: pre-wrap;
        }

        .msgActions {
          display: flex;
          gap: 10px;
          margin-top: 18px;
        }

        .msgActions button {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: none;
          background: #111;
          color: white;
        }

        .typing {
          display: flex;
          gap: 8px;
          padding: 12px;
        }

        .typing span {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: white;
          animation: bounce 1s infinite;
        }

        .inputWrap {
          position: fixed;
          bottom: 0;
          left: 300px;
          right: 0;
          padding: 18px;
          background: linear-gradient(
            to top,
            rgba(0,0,0,0.95),
            transparent
          );
        }

        .inputBox {
          max-width: 950px;
          margin: auto;
          height: 74px;
          border-radius: 28px;
          border: 1px solid #1d1d1d;
          background: rgba(
            10,
            10,
            10,
            0.95
          );
          display: flex;
          align-items: center;
          padding: 0 14px 0 22px;
        }

        .inputBox input {
          flex: 1;
          border: none;
          background: transparent;
          color: white;
          font-size: 17px;
          outline: none;
        }

        .inputButtons {
          display: flex;
          gap: 10px;
        }

        .miniBtn,
        .sendBtn {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          border: none;
          cursor: pointer;
        }

        .miniBtn {
          background: #111;
          color: white;
        }

        .sendBtn {
          background: white;
          color: black;
        }

        .inputFooter {
          display: flex;
          justify-content: center;
          gap: 8px;
          margin-top: 12px;
          font-size: 12px;
          color: #7f7f7f;
        }

        .overlay {
          position: fixed;
          inset: 0;
          background: rgba(
            0,
            0,
            0,
            0.7
          );
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 100;
        }

        .panel {
          width: 420px;
          background: #090909;
          border: 1px solid #1d1d1d;
          border-radius: 28px;
          padding: 24px;
        }

        .panelTop {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .setting {
          margin-top: 24px;
          display: flex;
          justify-content: space-between;
        }

        .toggle {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          border: none;
          background: white;
        }

        .profile {
          display: flex;
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
          font-weight: 800;
        }

        .panelBtn {
          width: 100%;
          height: 56px;
          border-radius: 18px;
          border: none;
          margin-top: 16px;
          cursor: pointer;
        }

        .premium {
          background: white;
          color: black;
        }

        .danger {
          background: #260909;
          color: white;
        }

        .logout {
          background: #111;
          color: white;
        }

        .voiceOverlay {
          position: fixed;
          inset: 0;
          background: rgba(
            0,
            0,
            0,
            0.86
          );
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          z-index: 200;
        }

        .voiceOrb {
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

        .toast {
          position: fixed;
          bottom: 30px;
          left: 50%;
          transform: translateX(-50%);
          background: white;
          color: black;
          padding: 14px 24px;
          border-radius: 999px;
          font-weight: 700;
          z-index: 200;
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
          border: 6px solid #222;
          border-top: 6px solid white;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes pulse {
          50% {
            transform: scale(1.08);
          }
        }

        @keyframes bounce {
          50% {
            transform: translateY(-6px);
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
            left: -100%;
            top: 0;
            bottom: 0;
            transition: 0.3s;
          }

          .sidebar.show {
            left: 0;
          }

          .mobileClose {
            display: flex;
            width: 38px;
            height: 38px;
            border-radius: 50%;
            border: none;
            background: #111;
            color: white;
            align-items: center;
            justify-content: center;
          }

          .inputWrap {
            left: 0;
          }

          .hero {
            padding: 50px 18px 20px;
          }

          .hero h1 {
            font-size: 44px;
          }

          .heroGrid {
            grid-template-columns: 1fr;
          }

          .chatArea {
            padding: 18px 14px 150px;
          }

          .msg {
            max-width: 100%;
          }

          .bgWord {
            font-size: 30vw;
          }
        }
      `}</style>
    </main>
  );
}
