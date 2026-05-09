"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import {
  Menu,
  Search,
  MessageSquare,
  Compass,
  Library,
  Settings,
  Plus,
  Trash2,
  Edit3,
  Copy,
  Volume2,
  ThumbsUp,
  ThumbsDown,
  RotateCcw,
  Send,
  Mic,
  X,
  Paperclip,
  Sparkles,
  PanelLeftClose,
  PanelLeftOpen,
  LogOut,
  Image as ImageIcon,
  Pin,
  ChevronRight,
} from "lucide-react";

type Role = "user" | "assistant";

type Message = {
  id: number;
  role: Role;
  text: string;
  liked?: boolean | null;
};

type Chat = {
  id: number;
  title: string;
  pinned?: boolean;
  messages: Message[];
};

export default function ChatPage() {
  const router = useRouter();

  const [mounted, setMounted] = useState(false);

  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [voiceOpen, setVoiceOpen] = useState(false);

  const [typing, setTyping] = useState(false);

  const [search, setSearch] = useState("");

  const [input, setInput] = useState("");

  const [activeChatId, setActiveChatId] =
    useState<number>(1);

  const [showMobileSidebar, setShowMobileSidebar] =
    useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const chatEndRef = useRef<HTMLDivElement>(null);

  const [uploadedImages, setUploadedImages] = useState<
    string[]
  >([]);

  const [chats, setChats] = useState<Chat[]>([
    {
      id: 1,
      title: "New Chat",
      pinned: true,
      messages: [
        {
          id: 1,
          role: "assistant",
          text:
            "Welcome to Lumina AI. Ask anything.",
        },
      ],
    },
  ]);

  useEffect(() => {
    setMounted(true);

    const auth =
      localStorage.getItem("lumina-auth");

    if (!auth) {
      router.push("/login");
    }
  }, [router]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [chats, typing]);

  const activeChat =
    chats.find((c) => c.id === activeChatId) ||
    chats[0];

  const filteredChats = useMemo(() => {
    return chats.filter((chat) =>
      chat.title
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [search, chats]);

  function createNewChat() {
    const newChat: Chat = {
      id: Date.now(),
      title: "Untitled Chat",
      messages: [
        {
          id: Date.now(),
          role: "assistant",
          text:
            "Fresh Lumina AI chat created.",
        },
      ],
    };

    setChats((prev) => [newChat, ...prev]);

    setActiveChatId(newChat.id);

    setShowMobileSidebar(false);
  }

  function deleteChat(id: number) {
    const updated = chats.filter(
      (chat) => chat.id !== id
    );

    setChats(updated);

    if (activeChatId === id && updated.length) {
      setActiveChatId(updated[0].id);
    }
  }

  function renameChat(id: number) {
    const value = prompt("Rename chat");

    if (!value) return;

    setChats((prev) =>
      prev.map((chat) =>
        chat.id === id
          ? {
              ...chat,
              title: value,
            }
          : chat
      )
    );
  }

  function pinChat(id: number) {
    setChats((prev) =>
      prev.map((chat) =>
        chat.id === id
          ? {
              ...chat,
              pinned: !chat.pinned,
            }
          : chat
      )
    );
  }

  async function sendMessage() {
    const text = input.trim();

    if (!text || typing) return;

    const userMessage: Message = {
      id: Date.now(),
      role: "user",
      text,
    };

    const updatedChats = chats.map((chat) => {
      if (chat.id !== activeChatId) return chat;

      return {
        ...chat,
        title:
          chat.title === "Untitled Chat"
            ? text.slice(0, 24)
            : chat.title,
        messages: [...chat.messages, userMessage],
      };
    });

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
          message: text,
        }),
      });

      const data = await res.json();

      const aiMessage: Message = {
        id: Date.now() + 1,
        role: "assistant",
        text:
          data.reply ||
          "Lumina AI unavailable.",
      };

      setChats((prev) =>
        prev.map((chat) =>
          chat.id === activeChatId
            ? {
                ...chat,
                messages: [
                  ...chat.messages,
                  aiMessage,
                ],
              }
            : chat
        )
      );
    } catch {
      const aiMessage: Message = {
        id: Date.now() + 1,
        role: "assistant",
        text:
          "AI temporarily unavailable.",
      };

      setChats((prev) =>
        prev.map((chat) =>
          chat.id === activeChatId
            ? {
                ...chat,
                messages: [
                  ...chat.messages,
                  aiMessage,
                ],
              }
            : chat
        )
      );
    }

    setTyping(false);
  }

  function copyMessage(text: string) {
    navigator.clipboard.writeText(text);
  }

  function speakMessage(text: string) {
    const speech =
      new SpeechSynthesisUtterance(text);

    speech.rate = 1;

    speech.pitch = 1;

    window.speechSynthesis.speak(speech);
  }

  function reactMessage(
    id: number,
    value: boolean
  ) {
    setChats((prev) =>
      prev.map((chat) => ({
        ...chat,
        messages: chat.messages.map((msg) =>
          msg.id === id
            ? {
                ...msg,
                liked: value,
              }
            : msg
        ),
      }))
    );
  }

  function uploadImage(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = e.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      setUploadedImages((prev) => [
        String(reader.result),
        ...prev,
      ]);
    };

    reader.readAsDataURL(file);
  }

  async function startVoiceInput() {
    // @ts-ignore
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert(
        "Speech recognition unsupported."
      );
      return;
    }

    const recognition =
      new SpeechRecognition();

    recognition.lang = "en-US";

    recognition.start();

    recognition.onresult = (e: any) => {
      const transcript =
        e.results[0][0].transcript;

      setInput(transcript);
    };
  }

  function logout() {
    localStorage.removeItem("lumina-auth");

    router.push("/login");
  }

  if (!mounted) return null;

  return (
    <main className="lumina">
      {/* MOBILE OVERLAY */}
      {showMobileSidebar && (
        <div
          className="overlay"
          onClick={() =>
            setShowMobileSidebar(false)
          }
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`sidebar ${
          sidebarOpen ? "" : "collapsed"
        } ${
          showMobileSidebar ? "mobileShow" : ""
        }`}
      >
        <div className="sidebarTop">
          <div className="logo">
            <Sparkles size={18} />
            {sidebarOpen && (
              <span>Lumina AI</span>
            )}
          </div>

          <button
            className="iconBtn"
            onClick={() =>
              setSidebarOpen(!sidebarOpen)
            }
          >
            {sidebarOpen ? (
              <PanelLeftClose size={18} />
            ) : (
              <PanelLeftOpen size={18} />
            )}
          </button>
        </div>

        <button
          className="newChatBtn"
          onClick={createNewChat}
        >
          <Plus size={18} />
          {sidebarOpen && (
            <span>New Chat</span>
          )}
        </button>

        {sidebarOpen && (
          <div className="searchBox">
            <Search size={16} />
            <input
              placeholder="Search chats"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />
          </div>
        )}

        <div className="navSection">
          <Link href="/chat">
            <button className="navBtn active">
              <MessageSquare size={18} />
              {sidebarOpen && (
                <span>Chat</span>
              )}
            </button>
          </Link>

          <Link href="/explore">
            <button className="navBtn">
              <Compass size={18} />
              {sidebarOpen && (
                <span>Explore</span>
              )}
            </button>
          </Link>

          <Link href="/library">
            <button className="navBtn">
              <Library size={18} />
              {sidebarOpen && (
                <span>Library</span>
              )}
            </button>
          </Link>

          <Link href="/settings">
            <button className="navBtn">
              <Settings size={18} />
              {sidebarOpen && (
                <span>Settings</span>
              )}
            </button>
          </Link>
        </div>

        {sidebarOpen && (
          <>
            <div className="sectionLabel">
              Chats
            </div>

            <div className="chatList">
              {filteredChats.map((chat) => (
                <div
                  key={chat.id}
                  className={`chatItem ${
                    activeChatId === chat.id
                      ? "selected"
                      : ""
                  }`}
                >
                  <button
                    className="chatSelect"
                    onClick={() => {
                      setActiveChatId(
                        chat.id
                      );

                      setShowMobileSidebar(
                        false
                      );
                    }}
                  >
                    <MessageSquare size={15} />

                    <span>
                      {chat.title}
                    </span>
                  </button>

                  <div className="chatActions">
                    <button
                      onClick={() =>
                        pinChat(chat.id)
                      }
                    >
                      <Pin size={13} />
                    </button>

                    <button
                      onClick={() =>
                        renameChat(chat.id)
                      }
                    >
                      <Edit3 size={13} />
                    </button>

                    <button
                      onClick={() =>
                        deleteChat(chat.id)
                      }
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        <button
          className="logoutBtn"
          onClick={logout}
        >
          <LogOut size={18} />
          {sidebarOpen && (
            <span>Logout</span>
          )}
        </button>
      </aside>

      {/* MAIN */}
      <section className="mainPanel">
        {/* TOPBAR */}
        <header className="topBar">
          <div className="topLeft">
            <button
              className="iconBtn mobileOnly"
              onClick={() =>
                setShowMobileSidebar(true)
              }
            >
              <Menu size={20} />
            </button>

            <div className="chatTitle">
              {activeChat.title}
            </div>
          </div>

          <div className="topRight">
            <button
              className="iconBtn"
              onClick={() =>
                setVoiceOpen(true)
              }
            >
              <Mic size={18} />
            </button>
          </div>
        </header>

        {/* CHAT */}
        <div className="chatArea">
          {activeChat.messages.map((msg) => (
            <div
              key={msg.id}
              className={`messageRow ${
                msg.role === "user"
                  ? "userRow"
                  : ""
              }`}
            >
              <div
                className={`bubble ${
                  msg.role === "assistant"
                    ? "assistant"
                    : "user"
                }`}
              >
                <div className="messageText">
                  {msg.text}
                </div>

                {msg.role ===
                  "assistant" && (
                  <div className="messageTools">
                    <button
                      onClick={() =>
                        copyMessage(
                          msg.text
                        )
                      }
                    >
                      <Copy size={15} />
                    </button>

                    <button
                      onClick={() =>
                        speakMessage(
                          msg.text
                        )
                      }
                    >
                      <Volume2 size={15} />
                    </button>

                    <button
                      onClick={() =>
                        reactMessage(
                          msg.id,
                          true
                        )
                      }
                    >
                      <ThumbsUp
                        size={15}
                      />
                    </button>

                    <button
                      onClick={() =>
                        reactMessage(
                          msg.id,
                          false
                        )
                      }
                    >
                      <ThumbsDown
                        size={15}
                      />
                    </button>

                    <button>
                      <RotateCcw
                        size={15}
                      />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {typing && (
            <div className="messageRow">
              <div className="bubble assistant">
                <div className="typing">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* IMAGE PREVIEW */}
        {uploadedImages.length > 0 && (
          <div className="imageStrip">
            {uploadedImages.map(
              (img, i) => (
                <img
                  key={i}
                  src={img}
                  alt=""
                />
              )
            )}
          </div>
        )}

        {/* INPUT */}
        <div className="inputWrap">
          <div className="inputBox">
            <textarea
              placeholder="Message Lumina AI..."
              value={input}
              onChange={(e) =>
                setInput(e.target.value)
              }
              onKeyDown={(e) => {
                if (
                  e.key === "Enter" &&
                  !e.shiftKey
                ) {
                  e.preventDefault();

                  sendMessage();
                }
              }}
            />

            <div className="inputBottom">
              <div className="leftTools">
                <button
                  onClick={() =>
                    fileInputRef.current?.click()
                  }
                >
                  <Paperclip size={18} />
                </button>

                <button>
                  <ImageIcon size={18} />
                </button>
              </div>

              <div className="rightTools">
                <button
                  onClick={
                    startVoiceInput
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

            <input
              hidden
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={uploadImage}
            />
          </div>
        </div>
      </section>

      {/* VOICE PANEL */}
      {voiceOpen && (
        <div className="voicePanel">
          <div className="voiceHeader">
            <div>
              Voice Conversation
            </div>

            <button
              className="iconBtn"
              onClick={() =>
                setVoiceOpen(false)
              }
            >
              <X size={18} />
            </button>
          </div>

          <div className="voiceCenter">
            <div className="orb" />

            <div className="voiceText">
              Listening...
            </div>

            <button
              className="voiceMic"
              onClick={
                startVoiceInput
              }
            >
              <Mic size={26} />
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
          color: white;
          font-family:
            Inter,
            sans-serif;
          overflow: hidden;
        }

        button,
        input,
        textarea {
          font-family:
            Inter,
            sans-serif;
        }

        .lumina {
          height: 100vh;
          display: flex;
          background: #000;
        }

        .overlay {
          position: fixed;
          inset: 0;
          background: rgba(
            0,
            0,
            0,
            0.5
          );
          z-index: 40;
        }

        .sidebar {
          width: 300px;
          background: #090909;
          border-right: 1px solid #151515;
          padding: 14px;
          display: flex;
          flex-direction: column;
          transition: 0.25s;
          z-index: 50;
        }

        .sidebar.collapsed {
          width: 82px;
        }

        .sidebarTop {
          display: flex;
          align-items: center;
          justify-content:
            space-between;
          margin-bottom: 18px;
        }

        .logo {
          display: flex;
          gap: 10px;
          align-items: center;
          font-weight: 700;
          font-size: 20px;
        }

        .iconBtn {
          width: 42px;
          height: 42px;
          border: none;
          border-radius: 14px;
          background: #121212;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .newChatBtn,
        .navBtn,
        .logoutBtn {
          width: 100%;
          height: 50px;
          border: none;
          border-radius: 16px;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 0 16px;
          cursor: pointer;
          background: transparent;
          color: white;
          margin-bottom: 8px;
        }

        .newChatBtn {
          background: white;
          color: black;
          font-weight: 700;
        }

        .navBtn:hover,
        .chatItem:hover {
          background: #121212;
        }

        .active {
          background: #151515;
        }

        .searchBox {
          margin: 14px 0;
          height: 48px;
          background: #111;
          border-radius: 16px;
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

        .sectionLabel {
          color: #777;
          font-size: 13px;
          margin: 16px 0 10px;
        }

        .chatList {
          flex: 1;
          overflow-y: auto;
        }

        .chatItem {
          border-radius: 14px;
          margin-bottom: 8px;
          overflow: hidden;
        }

        .chatSelect {
          width: 100%;
          background: transparent;
          border: none;
          color: white;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px;
          cursor: pointer;
        }

        .chatActions {
          display: flex;
          padding: 0 12px 10px;
          gap: 6px;
        }

        .chatActions button {
          width: 30px;
          height: 30px;
          border-radius: 10px;
          border: none;
          background: #161616;
          color: white;
          cursor: pointer;
        }

        .selected {
          background: #121212;
        }

        .logoutBtn {
          margin-top: auto;
          background: #101010;
        }

        .mainPanel {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .topBar {
          height: 72px;
          border-bottom: 1px solid #151515;
          display: flex;
          align-items: center;
          justify-content:
            space-between;
          padding: 0 18px;
        }

        .topLeft,
        .topRight {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .chatTitle {
          font-size: 20px;
          font-weight: 700;
        }

        .mobileOnly {
          display: none;
        }

        .chatArea {
          flex: 1;
          overflow-y: auto;
          padding: 30px 22px;
        }

        .messageRow {
          display: flex;
          margin-bottom: 22px;
        }

        .userRow {
          justify-content: flex-end;
        }

        .bubble {
          max-width: 760px;
          border-radius: 24px;
          padding: 18px;
        }

        .assistant {
          background: #0f0f0f;
          border: 1px solid #181818;
        }

        .user {
          background: white;
          color: black;
        }

        .messageText {
          line-height: 1.7;
          white-space: pre-wrap;
        }

        .messageTools {
          display: flex;
          gap: 8px;
          margin-top: 14px;
        }

        .messageTools button {
          width: 36px;
          height: 36px;
          border-radius: 12px;
          border: none;
          background: #161616;
          color: white;
          cursor: pointer;
        }

        .typing {
          display: flex;
          gap: 6px;
        }

        .typing span {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: white;
          animation:
            bounce 1s infinite;
        }

        .typing span:nth-child(2) {
          animation-delay: 0.2s;
        }

        .typing span:nth-child(3) {
          animation-delay: 0.4s;
        }

        .imageStrip {
          display: flex;
          gap: 12px;
          overflow-x: auto;
          padding: 0 20px 14px;
        }

        .imageStrip img {
          width: 110px;
          height: 110px;
          object-fit: cover;
          border-radius: 18px;
          border: 1px solid #222;
        }

        .inputWrap {
          padding: 18px;
        }

        .inputBox {
          background: #0d0d0d;
          border: 1px solid #181818;
          border-radius: 30px;
          padding: 16px;
        }

        .inputBox textarea {
          width: 100%;
          resize: none;
          min-height: 80px;
          max-height: 180px;
          background: transparent;
          border: none;
          outline: none;
          color: white;
          font-size: 16px;
        }

        .inputBottom {
          margin-top: 12px;
          display: flex;
          align-items: center;
          justify-content:
            space-between;
        }

        .leftTools,
        .rightTools {
          display: flex;
          gap: 10px;
        }

        .leftTools button,
        .rightTools button {
          width: 42px;
          height: 42px;
          border-radius: 14px;
          border: none;
          background: #161616;
          color: white;
          cursor: pointer;
        }

        .sendBtn {
          background: white !important;
          color: black !important;
        }

        .voicePanel {
          position: fixed;
          width: 360px;
          height: 520px;
          right: 24px;
          top: 90px;
          border-radius: 32px;
          background: #090909;
          border: 1px solid #181818;
          z-index: 80;
          padding: 20px;
        }

        .voiceHeader {
          display: flex;
          align-items: center;
          justify-content:
            space-between;
        }

        .voiceCenter {
          height: calc(100% - 60px);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .orb {
          width: 180px;
          height: 180px;
          border-radius: 50%;
          background:
            radial-gradient(
              circle,
              #fff,
              #444
            );
          animation:
            pulse 2s infinite;
        }

        .voiceText {
          margin-top: 26px;
          color: #aaa;
        }

        .voiceMic {
          margin-top: 24px;
          width: 72px;
          height: 72px;
          border-radius: 50%;
          border: none;
          background: white;
          color: black;
          cursor: pointer;
        }

        @keyframes pulse {
          0% {
            transform: scale(1);
            opacity: 0.7;
          }

          50% {
            transform: scale(1.08);
            opacity: 1;
          }

          100% {
            transform: scale(1);
            opacity: 0.7;
          }
        }

        @keyframes bounce {
          0%,
          80%,
          100% {
            transform: scale(0.8);
            opacity: 0.5;
          }

          40% {
            transform: scale(1);
            opacity: 1;
          }
        }

        @media (max-width: 900px) {
          .sidebar {
            position: fixed;
            top: 0;
            left: -320px;
            bottom: 0;
          }

          .mobileShow {
            left: 0;
          }

          .mobileOnly {
            display: flex;
          }

          .bubble {
            max-width: 100%;
          }

          .voicePanel {
            width: calc(100% - 24px);
            right: 12px;
            left: 12px;
            top: 80px;
          }

          .chatArea {
            padding: 20px 14px;
          }

          .inputWrap {
            padding: 12px;
          }

          .chatTitle {
            font-size: 17px;
          }
        }
      `}</style>
    </main>
  );
}
