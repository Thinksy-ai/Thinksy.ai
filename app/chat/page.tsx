// app/chat/page.tsx

"use client";

import {
  Menu,
  Search,
  Plus,
  Send,
  Mic,
  Sparkles,
  Copy,
  ThumbsUp,
  ThumbsDown,
  Trash2,
  Crown,
  Settings,
  User,
  LogOut,
  X,
  MessageSquare,
  PanelLeftClose,
  Volume2,
  Image as ImageIcon,
  Paperclip,
  Bot,
} from "lucide-react";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type Role = "user" | "assistant";

type Message = {
  id: number;
  role: Role;
  text: string;
  time: string;
};

type Chat = {
  id: number;
  title: string;
  messages: Message[];
};

export default function LuminaUltraChat() {
  const bottomRef = useRef<HTMLDivElement>(null);

  const [sidebar, setSidebar] = useState(false);

  const [voiceOpen, setVoiceOpen] =
    useState(false);

  const [settingsOpen, setSettingsOpen] =
    useState(false);

  const [accountOpen, setAccountOpen] =
    useState(false);

  const [typing, setTyping] = useState(false);

  const [popup, setPopup] = useState("");

  const [search, setSearch] = useState("");

  const [input, setInput] = useState("");

  const [theme, setTheme] = useState("Ultra");

  const [currentChat, setCurrentChat] =
    useState(0);

  const [user] = useState({
    name: "Lumina User",
    email: "user@lumina.ai",
  });

  const [chats, setChats] = useState<Chat[]>(
    [
      {
        id: 1,
        title: "Welcome",
        messages: [],
      },
    ]
  );

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

  function getTime() {
    return new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function newChat() {
    const created: Chat = {
      id: Date.now(),
      title: "New Chat",
      messages: [],
    };

    setChats((prev) => [created, ...prev]);

    setCurrentChat(0);

    toast("New chat created");
  }

  async function sendMessage() {
    if (!input.trim()) return;

    const message: Message = {
      id: Date.now(),
      role: "user",
      text: input,
      time: getTime(),
    };

    const updated = [...chats];

    updated[currentChat].messages.push(
      message
    );

    if (
      updated[currentChat].title ===
        "Welcome" ||
      updated[currentChat].title ===
        "New Chat"
    ) {
      updated[currentChat].title =
        input.slice(0, 30);
    }

    setChats(updated);

    const currentInput = input;

    setInput("");

    setTyping(true);

    try {
      const response = await fetch(
        "/api/chat",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            message: currentInput,
          }),
        }
      );

      const data = await response.json();

      updated[currentChat].messages.push(
        {
          id: Date.now() + 1,
          role: "assistant",
          text:
            data.reply ||
            "Lumina AI unavailable.",
          time: getTime(),
        }
      );

      setChats([...updated]);
    } catch {
      updated[currentChat].messages.push(
        {
          id: Date.now() + 2,
          role: "assistant",
          text:
            "Connection failed.",
          time: getTime(),
        }
      );

      setChats([...updated]);
    }

    setTyping(false);
  }

  function copyText(text: string) {
    navigator.clipboard.writeText(text);

    toast("Copied");
  }

  function reaction(type: string) {
    if (type === "up") {
      toast(
        "Thank you for the feedback"
      );
    } else {
      toast("Feedback submitted");
    }
  }

  function removeChat(index: number) {
    const updated = chats.filter(
      (_, i) => i !== index
    );

    if (updated.length === 0) {
      setChats([
        {
          id: 1,
          title: "Welcome",
          messages: [],
        },
      ]);

      setCurrentChat(0);
    } else {
      setChats(updated);

      setCurrentChat(0);
    }

    toast("Chat deleted");
  }

  function logout() {
    localStorage.removeItem("logged");

    window.location.href = "/login";
  }

  function deleteAccount() {
    toast(
      "Delete account system connected later"
    );
  }

  function startVoice() {
    const SpeechRecognition =
      (window as any)
        .SpeechRecognition ||
      (window as any)
        .webkitSpeechRecognition;

    if (!SpeechRecognition) {
      toast(
        "Voice unsupported on device"
      );
      return;
    }

    setVoiceOpen(true);

    const recognition =
      new SpeechRecognition();

    recognition.lang = "en-US";

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

      toast("Voice failed");
    };

    recognition.onend = () => {
      setVoiceOpen(false);
    };
  }

  const filteredChats = useMemo(() => {
    return chats.filter((chat) =>
      chat.title
        .toLowerCase()
        .includes(
          search.toLowerCase()
        )
    );
  }, [search, chats]);

  return (
    <main className="app">
      {/* BACKGROUND */}

      <div className="bgText">
        LUMINA
      </div>

      <div className="glow glow1" />
      <div className="glow glow2" />

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
            className="closeSide"
            onClick={() =>
              setSidebar(false)
            }
          >
            <PanelLeftClose
              size={18}
            />
          </button>
        </div>

        <button
          className="newChatBtn"
          onClick={newChat}
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
              setSearch(
                e.target.value
              )
            }
          />
        </div>

        <div className="history">
          {filteredChats.length ===
            0 && (
            <div className="empty">
              No chats found
            </div>
          )}

          {filteredChats.map(
            (chat, index) => {
              const realIndex =
                chats.findIndex(
                  (c) =>
                    c.id ===
                    chat.id
                );

              return (
                <div
                  className={`historyWrap ${
                    currentChat ===
                    realIndex
                      ? "active"
                      : ""
                  }`}
                  key={chat.id}
                >
                  <button
                    className="historyBtn"
                    onClick={() => {
                      setCurrentChat(
                        realIndex
                      );

                      setSidebar(
                        false
                      );
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
                      removeChat(
                        realIndex
                      )
                    }
                  >
                    <Trash2
                      size={14}
                    />
                  </button>
                </div>
              );
            }
          )}
        </div>

        <div className="bottomMenu">
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
            className="iconBtn"
            onClick={() =>
              setSidebar(true)
            }
          >
            <Menu size={20} />
          </button>

          <div className="topTitle">
            <Bot size={18} />

            Lumina Ultra
          </div>

          <button
            className="premiumBtn"
            onClick={() =>
              toast(
                "Premium coming soon"
              )
            }
          >
            <Crown size={18} />
          </button>
        </header>

        {/* HERO */}

        {chats[currentChat]
          .messages.length ===
          0 && (
          <div className="hero">
            <h1>
              What can I help with?
            </h1>

            <p>
              AI Chat • Coding •
              Study • Research •
              Creativity
            </p>

            <div className="cards">
              <div className="card">
                Build websites
              </div>

              <div className="card">
                Generate code
              </div>

              <div className="card">
                Explain science
              </div>

              <div className="card">
                Create content
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
                className={`bubble ${
                  msg.role
                }`}
              >
                <div className="msgText">
                  {msg.text}
                </div>

                <div className="msgBottom">
                  <span className="time">
                    {msg.time}
                  </span>

                  {msg.role ===
                    "assistant" && (
                    <div className="tools">
                      <button
                        onClick={() =>
                          copyText(
                            msg.text
                          )
                        }
                      >
                        <Copy
                          size={14}
                        />
                      </button>

                      <button>
                        <Volume2
                          size={14}
                        />
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

            <div className="inputTools">
              <button className="toolBtn">
                <Paperclip
                  size={18}
                />
              </button>

              <button className="toolBtn">
                <ImageIcon
                  size={18}
                />
              </button>

              <button
                className="toolBtn"
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
                  setSettingsOpen(
                    false
                  )
                }
              >
                <X size={18} />
              </button>
            </div>

            <div className="settingItem">
              Theme: {theme}
            </div>

            <div className="settingItem">
              Voice Input Enabled
            </div>

            <div className="settingItem">
              Smooth Animations
            </div>

            <div className="settingItem">
              AI Streaming Mode
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
                {user.name.charAt(0)}
              </div>

              <div>
                <h3>{user.name}</h3>

                <p>
                  {user.email}
                </p>
              </div>
            </div>

            <button className="panelBtn premium">
              <Crown size={18} />
              Upgrade Premium
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

      <style jsx global>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        html,
        body {
          background: #000;
          color: white;
          font-family: Inter,
            sans-serif;
          overflow: hidden;
        }

        .app {
          display: flex;
          height: 100vh;
          overflow: hidden;
          position: relative;
          background: black;
        }

        .bgText {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(
            -50%,
            -50%
          );
          font-size: 220px;
          font-weight: 900;
          opacity: 0.03;
          letter-spacing: 20px;
          pointer-events: none;
        }

        .glow {
          position: absolute;
          border-radius: 50%;
          filter: blur(140px);
        }

        .glow1 {
          width: 340px;
          height: 340px;
          background: #222;
          top: -100px;
          left: -100px;
        }

        .glow2 {
          width: 300px;
          height: 300px;
          background: #111;
          bottom: -100px;
          right: -100px;
        }

        .sidebar {
          width: 290px;
          background: rgba(
            10,
            10,
            10,
            0.95
          );
          border-right: 1px solid
            #1a1a1a;
          padding: 18px;
          display: flex;
          flex-direction: column;
          z-index: 10;
          backdrop-filter: blur(
            20px
          );
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
          font-size: 24px;
          font-weight: 800;
        }

        .closeSide {
          display: none;
        }

        .newChatBtn {
          margin-top: 20px;
          height: 56px;
          border-radius: 18px;
          border: none;
          background: white;
          color: black;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          cursor: pointer;
        }

        .searchBox {
          margin-top: 18px;
          height: 52px;
          border-radius: 16px;
          background: #101010;
          border: 1px solid
            #1d1d1d;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 0 14px;
        }

        .searchBox input {
          flex: 1;
          border: none;
          outline: none;
          background: transparent;
          color: white;
        }

        .history {
          flex: 1;
          overflow-y: auto;
          margin-top: 20px;
        }

        .historyWrap {
          display: flex;
          align-items: center;
          margin-bottom: 10px;
          border-radius: 16px;
        }

        .historyWrap.active {
          background: #151515;
        }

        .historyBtn {
          flex: 1;
          height: 52px;
          border: none;
          background: transparent;
          color: white;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 0 14px;
        }

        .deleteMini {
          width: 40px;
          height: 40px;
          border: none;
          background: transparent;
          color: #777;
        }

        .empty {
          color: #666;
          text-align: center;
          margin-top: 30px;
        }

        .bottomMenu {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .menuBtn {
          height: 52px;
          border-radius: 16px;
          border: none;
          background: #101010;
          color: white;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 0 14px;
        }

        .main {
          flex: 1;
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
          padding: 0 20px;
        }

        .topTitle {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 24px;
          font-weight: 800;
        }

        .iconBtn,
        .premiumBtn,
        .toolBtn,
        .tools button {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          border: none;
          background: #111;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .hero {
          padding: 70px 30px
            20px;
        }

        .hero h1 {
          font-size: 52px;
          font-weight: 800;
        }

        .hero p {
          margin-top: 12px;
          color: #999;
        }

        .cards {
          display: grid;
          grid-template-columns:
            repeat(2, 1fr);
          gap: 14px;
          margin-top: 28px;
          max-width: 780px;
        }

        .card {
          padding: 24px;
          border-radius: 24px;
          background: rgba(
            15,
            15,
            15,
            0.9
          );
          border: 1px solid
            #1d1d1d;
        }

        .chatArea {
          flex: 1;
          overflow-y: auto;
          padding: 20px 30px
            140px;
        }

        .bubble {
          max-width: 780px;
          padding: 20px;
          border-radius: 24px;
          margin-bottom: 18px;
          animation: fade 0.2s
            ease;
        }

        .bubble.user {
          background: white;
          color: black;
          margin-left: auto;
        }

        .bubble.assistant {
          background: rgba(
            12,
            12,
            12,
            0.95
          );
          border: 1px solid
            #1d1d1d;
        }

        .msgBottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 16px;
        }

        .time {
          color: #777;
          font-size: 13px;
        }

        .tools {
          display: flex;
          gap: 10px;
        }

        .typing {
          display: flex;
          gap: 8px;
          padding: 14px;
        }

        .typing span {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: white;
          animation: bounce 1s
            infinite;
        }

        .inputWrap {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 18px;
          background: rgba(
            0,
            0,
            0,
            0.8
          );
          backdrop-filter: blur(
            20px
          );
        }

        .inputBox {
          max-width: 950px;
          margin: auto;
          min-height: 76px;
          border-radius: 30px;
          background: rgba(
            10,
            10,
            10,
            0.95
          );
          border: 1px solid
            #1d1d1d;
          display: flex;
          align-items: center;
          padding: 0 18px 0
            24px;
        }

        .inputBox input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          color: white;
          font-size: 17px;
        }

        .inputTools {
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
          background: #0b0b0b;
          border-radius: 28px;
          border: 1px solid
            #1d1d1d;
          padding: 24px;
        }

        .panelTop {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .settingItem {
          height: 56px;
          border-radius: 18px;
          background: #101010;
          display: flex;
          align-items: center;
          padding: 0 18px;
          margin-top: 16px;
        }

        .profile {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-top: 24px;
        }

        .avatar {
          width: 72px;
          height: 72px;
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
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 0 18px;
          margin-top: 16px;
          background: #101010;
          color: white;
        }

        .premium {
          background: white;
          color: black;
          font-weight: 700;
        }

        .danger {
          background: #220909;
        }

        .logout {
          background: #151515;
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
            0.85
          );
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          z-index: 150;
        }

        .voiceOrb {
          width: 190px;
          height: 190px;
          border-radius: 50%;
          background: radial-gradient(
            circle,
            white,
            #444
          );
          animation: pulse 1.2s
            infinite;
        }

        .voiceOverlay h2 {
          margin-top: 24px;
          font-size: 34px;
        }

        @keyframes pulse {
          50% {
            transform: scale(
              1.08
            );
          }
        }

        @keyframes bounce {
          50% {
            transform: translateY(
              -8px
            );
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
            left: -100%;
            top: 0;
            bottom: 0;
            transition: 0.3s;
          }

          .sidebar.show {
            left: 0;
          }

          .closeSide {
            display: flex;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            border: none;
            background: #111;
            color: white;
            align-items: center;
            justify-content: center;
          }

          .hero {
            padding: 40px 20px
              10px;
          }

          .hero h1 {
            font-size: 38px;
          }

          .cards {
            grid-template-columns:
              1fr;
          }

          .chatArea {
            padding: 20px 16px
              140px;
          }

          .bubble {
            max-width: 100%;
          }

          .panel {
            width: calc(
              100% - 20px
            );
          }

          .bgText {
            font-size: 120px;
          }
        }
      `}</style>
    </main>
  );
}
