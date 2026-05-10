"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import {
  Menu,
  Plus,
  Send,
  Search,
  Mic,
  Sparkles,
  MessageSquare,
  Copy,
  ThumbsUp,
  ThumbsDown,
  Settings,
  User,
  X,
  Trash2,
  Moon,
  Sun,
  PanelLeftClose,
  LogOut,
  Crown,
  Image,
  Paperclip,
  Volume2,
  Bookmark,
  Bell,
  Edit3,
  Check,
} from "lucide-react";

type Role = "user" | "assistant";

type Message = {
  id: number;
  role: Role;
  text: string;
  pinned?: boolean;
};

type Chat = {
  id: number;
  title: string;
  messages: Message[];
};

export default function LuminaUltra() {
  const bottomRef = useRef<HTMLDivElement>(null);

  const [sidebar, setSidebar] = useState(false);

  const [input, setInput] = useState("");

  const [typing, setTyping] = useState(false);

  const [popup, setPopup] = useState("");

  const [settingsOpen, setSettingsOpen] =
    useState(false);

  const [accountOpen, setAccountOpen] =
    useState(false);

  const [search, setSearch] = useState("");

  const [voiceOpen, setVoiceOpen] =
    useState(false);

  const [dark, setDark] = useState(true);

  const [notifications, setNotifications] =
    useState(true);

  const [chatIndex, setChatIndex] =
    useState(0);

  const [editingTitle, setEditingTitle] =
    useState(false);

  const [tempTitle, setTempTitle] =
    useState("");

  const [savedMessages, setSavedMessages] =
    useState<number[]>([]);

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
    }, 2000);
  }

  function newChat() {
    const fresh: Chat = {
      id: Date.now(),
      title: "New Chat",
      messages: [],
    };

    setChats((prev) => [fresh, ...prev]);

    setChatIndex(0);

    setSidebar(false);

    toast("New chat created");
  }

  function deleteChat(index: number) {
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

      setChatIndex(0);
    } else {
      setChats(updated);

      setChatIndex(0);
    }

    toast("Chat deleted");
  }

  async function sendMessage() {
    if (!input.trim()) return;

    const updated = [...chats];

    updated[chatIndex].messages.push({
      id: Date.now(),
      role: "user",
      text: input,
    });

    if (
      updated[chatIndex].title ===
        "Welcome" ||
      updated[chatIndex].title ===
        "New Chat"
    ) {
      updated[chatIndex].title =
        input.slice(0, 24);
    }

    setChats(updated);

    const current = input;

    setInput("");

    setTyping(true);

    try {
      const res = await fetch(
        "/api/chat",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            message: current,
          }),
        }
      );

      const data = await res.json();

      updated[chatIndex].messages.push(
        {
          id: Date.now() + 1,
          role: "assistant",
          text:
            data.reply ||
            "Lumina AI unavailable.",
        }
      );

      setChats([...updated]);
    } catch {
      updated[chatIndex].messages.push(
        {
          id: Date.now() + 2,
          role: "assistant",
          text: "Connection failed.",
        }
      );

      setChats([...updated]);
    }

    setTyping(false);
  }

  function copy(text: string) {
    navigator.clipboard.writeText(text);

    toast("Copied");
  }

  function react(type: string) {
    if (type === "up") {
      toast("Thanks for feedback");
    } else {
      toast("Feedback received");
    }
  }

  function saveMessage(id: number) {
    if (savedMessages.includes(id)) {
      setSavedMessages((prev) =>
        prev.filter((x) => x !== id)
      );

      toast("Removed");
    } else {
      setSavedMessages((prev) => [
        ...prev,
        id,
      ]);

      toast("Saved");
    }
  }

  function startVoice() {
    const SpeechRecognition =
      (window as any)
        .SpeechRecognition ||
      (window as any)
        .webkitSpeechRecognition;

    if (!SpeechRecognition) {
      toast("Voice unsupported");
      return;
    }

    setVoiceOpen(true);

    const recognition =
      new SpeechRecognition();

    recognition.start();

    recognition.onresult = (
      e: any
    ) => {
      setInput(
        e.results[0][0].transcript
      );

      setVoiceOpen(false);

      toast("Voice captured");
    };

    recognition.onerror = () => {
      setVoiceOpen(false);

      toast("Voice failed");
    };
  }

  function renameChat() {
    const updated = [...chats];

    updated[chatIndex].title =
      tempTitle || "Untitled";

    setChats(updated);

    setEditingTitle(false);

    toast("Renamed");
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
    <main
      className={`app ${
        dark ? "dark" : "light"
      }`}
    >
      {/* BACKGROUND */}

      <div className="bgText">
        LUMINA
      </div>

      {/* SIDEBAR */}

      <aside
        className={`sidebar ${
          sidebar ? "show" : ""
        }`}
      >
        <div className="topSide">
          <div className="logo">
            <Sparkles size={18} />
            Lumina AI
          </div>

          <button
            className="circle"
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
          className="newBtn"
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
          {filteredChats.map(
            (chat) => {
              const real =
                chats.findIndex(
                  (x) =>
                    x.id ===
                    chat.id
                );

              return (
                <div
                  className={`chatCard ${
                    real ===
                    chatIndex
                      ? "active"
                      : ""
                  }`}
                  key={chat.id}
                >
                  <button
                    className="chatSelect"
                    onClick={() => {
                      setChatIndex(
                        real
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
                    className="miniDelete"
                    onClick={() =>
                      deleteChat(
                        real
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

        <div className="bottomSide">
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
        {/* TOPBAR */}

        <header className="topbar">
          <button
            className="circle"
            onClick={() =>
              setSidebar(true)
            }
          >
            <Menu size={18} />
          </button>

          <div className="titleArea">
            {editingTitle ? (
              <div className="renameBox">
                <input
                  value={tempTitle}
                  onChange={(e) =>
                    setTempTitle(
                      e.target.value
                    )
                  }
                />

                <button
                  onClick={
                    renameChat
                  }
                >
                  <Check
                    size={16}
                  />
                </button>
              </div>
            ) : (
              <>
                <h2>
                  {
                    chats[
                      chatIndex
                    ].title
                  }
                </h2>

                <button
                  className="editBtn"
                  onClick={() => {
                    setTempTitle(
                      chats[
                        chatIndex
                      ].title
                    );

                    setEditingTitle(
                      true
                    );
                  }}
                >
                  <Edit3
                    size={14}
                  />
                </button>
              </>
            )}
          </div>

          <button className="premium">
            <Crown size={18} />
          </button>
        </header>

        {/* HERO */}

        {chats[chatIndex]
          .messages.length ===
          0 && (
          <div className="hero">
            <h1>
              Lumina Ultra
            </h1>

            <p>
              Your futuristic AI
              assistant
            </p>

            <div className="heroGrid">
              <div className="heroCard">
                Build Websites
              </div>

              <div className="heroCard">
                Generate Code
              </div>

              <div className="heroCard">
                Study Smarter
              </div>

              <div className="heroCard">
                AI Research
              </div>
            </div>
          </div>
        )}

        {/* CHAT */}

        <div className="chatArea">
          {chats[
            chatIndex
          ].messages.map((msg) => (
            <div
              key={msg.id}
              className={`bubble ${
                msg.role
              }`}
            >
              <div>
                {msg.text}
              </div>

              {msg.role ===
                "assistant" && (
                <div className="tools">
                  <button
                    onClick={() =>
                      copy(
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
                      react(
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
                      react(
                        "down"
                      )
                    }
                  >
                    <ThumbsDown
                      size={14}
                    />
                  </button>

                  <button
                    onClick={() =>
                      saveMessage(
                        msg.id
                      )
                    }
                  >
                    <Bookmark
                      size={14}
                    />
                  </button>
                </div>
              )}
            </div>
          ))}

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

            <div className="inputBtns">
              <button className="circle">
                <Paperclip
                  size={18}
                />
              </button>

              <button className="circle">
                <Image
                  size={18}
                />
              </button>

              <button
                className="circle"
                onClick={
                  startVoice
                }
              >
                <Mic size={18} />
              </button>

              <button
                className="sendBtn"
                onClick={
                  sendMessage
                }
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

            <button
              className="setting"
              onClick={() =>
                setDark(
                  !dark
                )
              }
            >
              {dark ? (
                <Sun size={18} />
              ) : (
                <Moon
                  size={18}
                />
              )}

              Toggle Theme
            </button>

            <button
              className="setting"
              onClick={() =>
                setNotifications(
                  !notifications
                )
              }
            >
              <Bell size={18} />
              Notifications
            </button>
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
                L
              </div>

              <div>
                <h3>
                  Lumina User
                </h3>

                <p>
                  user@lumina.ai
                </p>
              </div>
            </div>

            <button className="setting premiumBtn">
              <Crown size={18} />
              Upgrade Premium
            </button>

            <button className="setting">
              <Trash2 size={18} />
              Delete Account
            </button>

            <button className="setting">
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      )}

      {/* VOICE */}

      {voiceOpen && (
        <div className="voiceOverlay">
          <div className="orb" />

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
          width: 100%;
          height: 100%;
          overflow: hidden;
          font-family: Inter,
            sans-serif;
        }

        .dark {
          background: #000;
          color: white;
        }

        .light {
          background: #f4f4f4;
          color: black;
        }

        .app {
          display: flex;
          width: 100%;
          height: 100vh;
          overflow: hidden;
          position: relative;
        }

        .bgText {
          position: absolute;
          font-size: 220px;
          font-weight: 900;
          opacity: 0.03;
          left: 50%;
          top: 50%;
          transform: translate(
            -50%,
            -50%
          );
          pointer-events: none;
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
            #1b1b1b;
          display: flex;
          flex-direction: column;
          padding: 16px;
          flex-shrink: 0;
        }

        .topSide {
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

        .circle {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          border: none;
          background: #111;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .newBtn {
          margin-top: 20px;
          height: 56px;
          border-radius: 18px;
          border: none;
          background: white;
          color: black;
          font-weight: 700;
        }

        .searchBox {
          height: 52px;
          background: #101010;
          border-radius: 16px;
          margin-top: 16px;
          display: flex;
          align-items: center;
          padding: 0 14px;
          gap: 10px;
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

        .chatCard {
          display: flex;
          align-items: center;
          border-radius: 14px;
          margin-bottom: 10px;
        }

        .chatCard.active {
          background: #151515;
        }

        .chatSelect {
          flex: 1;
          height: 52px;
          background: transparent;
          border: none;
          color: white;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 0 14px;
        }

        .miniDelete {
          width: 40px;
          height: 40px;
          border: none;
          background: transparent;
          color: #777;
        }

        .bottomSide {
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
          gap: 10px;
          padding: 0 14px;
        }

        .main {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .topbar {
          height: 72px;
          border-bottom: 1px solid
            #151515;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 20px;
          flex-shrink: 0;
        }

        .titleArea {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .editBtn {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          border: none;
          background: #111;
          color: white;
        }

        .renameBox {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .renameBox input {
          width: 180px;
          height: 40px;
          border-radius: 12px;
          border: none;
          background: #111;
          color: white;
          padding: 0 12px;
        }

        .hero {
          padding: 60px 20px
            20px;
          text-align: center;
        }

        .hero h1 {
          font-size: 54px;
        }

        .hero p {
          margin-top: 10px;
          color: #999;
        }

        .heroGrid {
          display: grid;
          grid-template-columns:
            repeat(2, 1fr);
          gap: 14px;
          max-width: 700px;
          margin: 30px auto 0;
        }

        .heroCard {
          padding: 24px;
          border-radius: 24px;
          background: #111;
        }

        .chatArea {
          flex: 1;
          overflow-y: auto;
          padding: 20px;
        }

        .bubble {
          max-width: 760px;
          padding: 18px;
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
          background: #111;
          border: 1px solid
            #1b1b1b;
        }

        .tools {
          display: flex;
          gap: 10px;
          margin-top: 16px;
        }

        .tools button {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          border: none;
          background: #1b1b1b;
          color: white;
        }

        .typing {
          display: flex;
          gap: 8px;
          padding: 10px;
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
          padding: 18px;
          border-top: 1px solid
            #151515;
          flex-shrink: 0;
        }

        .inputBox {
          height: 70px;
          border-radius: 24px;
          background: #111;
          display: flex;
          align-items: center;
          padding: 0 16px;
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

        .inputBtns {
          display: flex;
          gap: 10px;
        }

        .sendBtn {
          width: 46px;
          height: 46px;
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
          padding: 24px;
        }

        .panelTop {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .setting {
          width: 100%;
          height: 54px;
          border-radius: 16px;
          border: none;
          background: #111;
          color: white;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 0 16px;
          margin-top: 16px;
        }

        .premiumBtn {
          background: white;
          color: black;
          font-weight: 700;
        }

        .profile {
          display: flex;
          align-items: center;
          gap: 16px;
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
          font-size: 30px;
          font-weight: 800;
        }

        .popup {
          position: fixed;
          bottom: 24px;
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
            0.8
          );
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          z-index: 150;
        }

        .orb {
          width: 180px;
          height: 180px;
          border-radius: 50%;
          background: radial-gradient(
            circle,
            white,
            #444
          );
          animation: pulse 1.2s
            infinite;
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
            z-index: 200;
            transition: 0.3s;
          }

          .sidebar.show {
            left: 0;
          }

          .heroGrid {
            grid-template-columns:
              1fr;
          }

          .hero h1 {
            font-size: 42px;
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
