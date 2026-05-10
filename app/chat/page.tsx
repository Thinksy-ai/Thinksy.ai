"use client";

import { useEffect, useRef, useState } from "react";

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
  Crown,
  PanelLeftClose,
} from "lucide-react";

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

export default function ChatPage() {
  const bottomRef =
    useRef<HTMLDivElement>(null);

  const [sidebar, setSidebar] =
    useState(false);

  const [input, setInput] =
    useState("");

  const [typing, setTyping] =
    useState(false);

  const [popup, setPopup] =
    useState("");

  const [settingsOpen, setSettingsOpen] =
    useState(false);

  const [accountOpen, setAccountOpen] =
    useState(false);

  const [search, setSearch] =
    useState("");

  const [voiceOpen, setVoiceOpen] =
    useState(false);

  const [chatIndex, setChatIndex] =
    useState(0);

  const [chats, setChats] =
    useState<Chat[]>([
      {
        id: 1,
        title: "Welcome",
        messages: [],
      },
    ]);

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
    const fresh: Chat = {
      id: Date.now(),
      title: "New Chat",
      messages: [],
    };

    setChats((prev) => [fresh, ...prev]);

    setChatIndex(0);

    setSidebar(false);
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
          text:
            "Connection failed.",
        }
      );

      setChats([...updated]);
    }

    setTyping(false);
  }

  function copyText(text: string) {
    navigator.clipboard.writeText(
      text
    );

    toast("Copied");
  }

  function react(type: string) {
    if (type === "up") {
      toast("Thanks for feedback");
    } else {
      toast("Feedback saved");
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

  const filteredChats = chats.filter(
    (chat) =>
      chat.title
        .toLowerCase()
        .includes(
          search.toLowerCase()
        )
  );

  return (
    <main className="app">
      {/* SIDEBAR */}

      <aside
        className={`sidebar ${
          sidebar ? "show" : ""
        }`}
      >
        <div className="sidebarTop">
          <div className="logo">
            <Sparkles size={18} />
            Lumina AI
          </div>

          <button
            className="iconBtn"
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
              setSearch(
                e.target.value
              )
            }
          />
        </div>

        <div className="chatHistory">
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
                  key={chat.id}
                  className={`chatCard ${
                    chatIndex ===
                    real
                      ? "active"
                      : ""
                  }`}
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
                    className="deleteBtn"
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

        <div className="sidebarBottom">
          <button
            className="sideAction"
            onClick={() =>
              setSettingsOpen(true)
            }
          >
            <Settings size={18} />
            Settings
          </button>

          <button
            className="sideAction"
            onClick={() =>
              setAccountOpen(true)
            }
          >
            <User size={18} />
            Account
          </button>
        </div>
      </aside>

      {sidebar && (
        <div
          className="overlayBg"
          onClick={() =>
            setSidebar(false)
          }
        />
      )}

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
            <Menu size={18} />
          </button>

          <div className="topTitle">
            Lumina Ultra
          </div>

          <button className="premiumBtn">
            <Crown size={18} />
          </button>
        </header>

        {/* HERO */}

        {chats[chatIndex].messages
          .length === 0 && (
          <div className="hero">
            <h1>
              What can I help with?
            </h1>

            <p>
              Chat • Coding • AI •
              Writing • Research
            </p>

            <div className="heroGrid">
              <div className="heroCard">
                Build Websites
              </div>

              <div className="heroCard">
                Explain Science
              </div>

              <div className="heroCard">
                Generate Code
              </div>

              <div className="heroCard">
                Creative Writing
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
              <div>{msg.text}</div>

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
              <button
                className="iconBtn"
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
        <div className="modalWrap">
          <div className="modal">
            <div className="modalTop">
              <h2>Settings</h2>

              <button
                className="iconBtn"
                onClick={() =>
                  setSettingsOpen(
                    false
                  )
                }
              >
                <X size={18} />
              </button>
            </div>

            <button className="modalBtn">
              Theme Settings
            </button>

            <button className="modalBtn">
              Notifications
            </button>
          </div>
        </div>
      )}

      {/* ACCOUNT */}

      {accountOpen && (
        <div className="modalWrap">
          <div className="modal">
            <div className="modalTop">
              <h2>Account</h2>

              <button
                className="iconBtn"
                onClick={() =>
                  setAccountOpen(
                    false
                  )
                }
              >
                <X size={18} />
              </button>
            </div>

            <button className="modalBtn">
              Premium Plan
            </button>

            <button className="modalBtn delete">
              Delete Account
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
          background: #000;
          color: white;
          font-family: Inter,
            sans-serif;
        }

        .app {
          width: 100%;
          height: 100vh;
          display: flex;
          overflow: hidden;
          background: #000;
        }

        /* SIDEBAR */

        .sidebar {
          width: 290px;
          height: 100vh;
          background: #0b0b0b;
          border-right: 1px solid
            #161616;

          display: flex;
          flex-direction: column;

          padding: 16px;

          flex-shrink: 0;

          z-index: 100;

          transition: 0.3s ease;
        }

        .sidebarTop {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 22px;
          font-weight: 800;
        }

        .iconBtn {
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
        }

        .searchBox {
          margin-top: 16px;

          height: 52px;

          border-radius: 16px;

          background: #111;

          display: flex;
          align-items: center;
          gap: 10px;

          padding: 0 14px;
        }

        .searchBox input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          color: white;
        }

        .chatHistory {
          flex: 1;
          overflow-y: auto;
          margin-top: 16px;
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

          border: none;

          background: transparent;

          color: white;

          display: flex;
          align-items: center;

          gap: 10px;

          padding: 0 14px;
        }

        .deleteBtn {
          width: 40px;
          height: 40px;

          border: none;

          background: transparent;

          color: #777;
        }

        .sidebarBottom {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .sideAction {
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

        /* MAIN */

        .main {
          flex: 1;

          height: 100vh;

          display: flex;

          flex-direction: column;

          overflow: hidden;
        }

        .topbar {
          height: 72px;

          border-bottom: 1px solid
            #161616;

          display: flex;

          align-items: center;

          justify-content: space-between;

          padding: 0 18px;

          flex-shrink: 0;
        }

        .topTitle {
          font-size: 20px;
          font-weight: 700;
        }

        .premiumBtn {
          width: 42px;
          height: 42px;

          border-radius: 50%;

          border: none;

          background: white;

          color: black;

          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* HERO */

        .hero {
          padding: 60px 20px
            20px;

          text-align: center;
        }

        .hero h1 {
          font-size: 52px;
          font-weight: 800;
        }

        .hero p {
          margin-top: 10px;
          color: #888;
        }

        .heroGrid {
          max-width: 700px;

          margin: 28px auto 0;

          display: grid;

          grid-template-columns:
            repeat(2, 1fr);

          gap: 14px;
        }

        .heroCard {
          background: #111;

          border: 1px solid
            #1a1a1a;

          border-radius: 22px;

          padding: 24px;

          transition: 0.2s ease;
        }

        .heroCard:hover {
          transform: translateY(
            -4px
          );
        }

        /* CHAT */

        .chatArea {
          flex: 1;

          overflow-y: auto;

          padding: 20px;

          display: flex;

          flex-direction: column;
        }

        .bubble {
          max-width: 760px;

          padding: 18px;

          border-radius: 24px;

          margin-bottom: 16px;

          animation: fade 0.2s ease;
        }

        .bubble.user {
          align-self: flex-end;

          background: white;

          color: black;
        }

        .bubble.assistant {
          background: #111;

          border: 1px solid
            #1a1a1a;
        }

        .tools {
          display: flex;
          gap: 10px;

          margin-top: 14px;
        }

        .tools button {
          width: 34px;
          height: 34px;

          border-radius: 50%;

          border: none;

          background: #1a1a1a;

          color: white;

          display: flex;
          align-items: center;
          justify-content: center;
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

        /* INPUT */

        .inputWrap {
          padding: 16px;

          border-top: 1px solid
            #161616;

          flex-shrink: 0;
        }

        .inputBox {
          min-height: 68px;

          border-radius: 24px;

          background: #111;

          border: 1px solid
            #1a1a1a;

          display: flex;

          align-items: center;

          gap: 12px;

          padding: 12px 14px;
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

          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* MODALS */

        .modalWrap {
          position: fixed;
          inset: 0;

          background: rgba(
            0,
            0,
            0,
            0.6
          );

          display: flex;
          align-items: center;
          justify-content: center;

          z-index: 200;
        }

        .modal {
          width: 420px;

          background: #0b0b0b;

          border: 1px solid
            #1a1a1a;

          border-radius: 28px;

          padding: 24px;
        }

        .modalTop {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .modalBtn {
          width: 100%;

          height: 54px;

          border-radius: 16px;

          border: none;

          background: #111;

          color: white;

          margin-top: 16px;
        }

        .delete {
          background: #2a1010;
        }

        /* POPUP */

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

          z-index: 300;
        }

        /* VOICE */

        .voiceOverlay {
          position: fixed;
          inset: 0;

          background: rgba(
            0,
            0,
            0,
            0.82
          );

          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;

          z-index: 250;
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

        /* MOBILE */

        .overlayBg {
          display: none;
        }

        @media (max-width: 900px) {
          .sidebar {
            position: fixed;

            left: -320px;

            top: 0;

            bottom: 0;

            z-index: 400;
          }

          .sidebar.show {
            left: 0;
          }

          .overlayBg {
            display: block;

            position: fixed;

            inset: 0;

            background: rgba(
              0,
              0,
              0,
              0.5
            );

            z-index: 300;
          }

          .hero {
            padding-top: 40px;
          }

          .hero h1 {
            font-size: 36px;
          }

          .heroGrid {
            grid-template-columns:
              1fr;
          }

          .bubble {
            max-width: 100%;
          }

          .modal {
            width: calc(
              100% - 20px
            );
          }

          .topTitle {
            font-size: 18px;
          }

          .inputBox {
            min-height: 64px;
          }

          .inputBox input {
            font-size: 15px;
          }
        }

        /* ANIMATION */

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
              -7px
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
      `}</style>
    </main>
  );
}
