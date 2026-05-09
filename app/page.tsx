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
  Crown,
  User,
  Shield,
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

  const [mobileSidebar, setMobileSidebar] = useState(false);

  const [voiceOpen, setVoiceOpen] = useState(false);

  const [typing, setTyping] = useState(false);

  const [search, setSearch] = useState("");

  const [input, setInput] = useState("");

  const [popup, setPopup] = useState("");

  const [accountOpen, setAccountOpen] = useState(false);

  const [premiumOpen, setPremiumOpen] = useState(false);

  const [activeChatId, setActiveChatId] = useState(1);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const chatEndRef = useRef<HTMLDivElement>(null);

  const [uploadedImages, setUploadedImages] = useState<string[]>([]);

  const [chats, setChats] = useState<Chat[]>([
    {
      id: 1,
      title: "Lumina AI",
      pinned: true,
      messages: [
        {
          id: 1,
          role: "assistant",
          text:
            "Welcome to Lumina AI Ultra. Ask anything and explore the future.",
        },
      ],
    },
  ]);

  useEffect(() => {
    setMounted(true);

    const auth = localStorage.getItem("lumina-auth");

    if (!auth) {
      router.push("/login");
    }
  }, [router]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [chats, typing]);

  function showPopup(text: string) {
    setPopup(text);

    setTimeout(() => {
      setPopup("");
    }, 2400);
  }

  const activeChat =
    chats.find((c) => c.id === activeChatId) || chats[0];

  const filteredChats = useMemo(() => {
    return chats.filter((chat) =>
      chat.title.toLowerCase().includes(search.toLowerCase())
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
          text: "New Lumina AI conversation started.",
        },
      ],
    };

    setChats((prev) => [newChat, ...prev]);

    setActiveChatId(newChat.id);

    setMobileSidebar(false);

    showPopup("Fresh chat created");
  }

  function deleteChat(id: number) {
    const updated = chats.filter((chat) => chat.id !== id);

    setChats(updated);

    if (updated.length > 0) {
      setActiveChatId(updated[0].id);
    }

    showPopup("Chat deleted");
  }

  function renameChat(id: number) {
    const value = prompt("Rename your chat");

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

    showPopup("Chat renamed");
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

    showPopup("Chat updated");
  }

  async function sendMessage() {
    const text = input.trim();

    if (!text || typing) return;

    const userMessage: Message = {
      id: Date.now(),
      role: "user",
      text,
    };

    const updated = chats.map((chat) => {
      if (chat.id !== activeChatId) return chat;

      return {
        ...chat,
        title:
          chat.title === "Untitled Chat"
            ? text.slice(0, 22)
            : chat.title,
        messages: [...chat.messages, userMessage],
      };
    });

    setChats(updated);

    setInput("");

    setTyping(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
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
          "Lumina AI temporarily unavailable.",
      };

      setChats((prev) =>
        prev.map((chat) =>
          chat.id === activeChatId
            ? {
                ...chat,
                messages: [...chat.messages, aiMessage],
              }
            : chat
        )
      );
    } catch {
      const aiMessage: Message = {
        id: Date.now() + 1,
        role: "assistant",
        text:
          "AI temporarily unavailable. Check API key.",
      };

      setChats((prev) =>
        prev.map((chat) =>
          chat.id === activeChatId
            ? {
                ...chat,
                messages: [...chat.messages, aiMessage],
              }
            : chat
        )
      );
    }

    setTyping(false);
  }

  function reactMessage(id: number, value: boolean) {
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

    showPopup("Thank you for the feedback");
  }

  function copyMessage(text: string) {
    navigator.clipboard.writeText(text);

    showPopup("Copied to clipboard");
  }

  function speakMessage(text: string) {
    const speech = new SpeechSynthesisUtterance(text);

    window.speechSynthesis.speak(speech);

    showPopup("Voice playback started");
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

      showPopup("Image uploaded");
    };

    reader.readAsDataURL(file);
  }

  async function startVoiceInput() {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      showPopup("Voice unsupported");

      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "en-US";

    recognition.start();

    recognition.onresult = (e: any) => {
      const transcript = e.results[0][0].transcript;

      setInput(transcript);

      showPopup("Voice captured");
    };
  }

  function logout() {
    localStorage.removeItem("lumina-auth");

    router.push("/login");
  }

  if (!mounted) return null;

  return (
    <main className="lumina">
      {/* POPUP */}
      {popup && <div className="popup">{popup}</div>}

      {/* MOBILE OVERLAY */}
      {mobileSidebar && (
        <div
          className="overlay"
          onClick={() => setMobileSidebar(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`sidebar ${
          sidebarOpen ? "" : "collapsed"
        } ${mobileSidebar ? "mobileShow" : ""}`}
      >
        <div className="sidebarTop">
          <div className="logo">
            <Sparkles size={18} />
            {sidebarOpen && <span>Lumina AI</span>}
          </div>

          <button
            className="iconBtn"
            onClick={() => setSidebarOpen(!sidebarOpen)}
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
          {sidebarOpen && <span>New Chat</span>}
        </button>

        {sidebarOpen && (
          <div className="searchBox">
            <Search size={16} />

            <input
              placeholder="Search chats"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        )}

        <div className="navSection">
          <Link href="/chat">
            <button className="navBtn active">
              <MessageSquare size={18} />
              {sidebarOpen && <span>Chat</span>}
            </button>
          </Link>

          <Link href="/explore">
            <button className="navBtn">
              <Compass size={18} />
              {sidebarOpen && <span>Explore</span>}
            </button>
          </Link>

          <Link href="/library">
            <button className="navBtn">
              <Library size={18} />
              {sidebarOpen && <span>Library</span>}
            </button>
          </Link>

          <Link href="/settings">
            <button className="navBtn">
              <Settings size={18} />
              {sidebarOpen && <span>Settings</span>}
            </button>
          </Link>
        </div>

        {sidebarOpen && (
          <>
            <div className="sectionLabel">Chats</div>

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
                      setActiveChatId(chat.id);

                      setMobileSidebar(false);
                    }}
                  >
                    <MessageSquare size={15} />

                    <span>{chat.title}</span>
                  </button>

                  <div className="chatActions">
                    <button onClick={() => pinChat(chat.id)}>
                      <Pin size={13} />
                    </button>

                    <button
                      onClick={() => renameChat(chat.id)}
                    >
                      <Edit3 size={13} />
                    </button>

                    <button
                      onClick={() => deleteChat(chat.id)}
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
          className="accountBtn"
          onClick={() => setAccountOpen(true)}
        >
          <User size={18} />
          {sidebarOpen && <span>Account</span>}
        </button>

        <button className="logoutBtn" onClick={logout}>
          <LogOut size={18} />
          {sidebarOpen && <span>Logout</span>}
        </button>
      </aside>

      {/* MAIN */}
      <section className="mainPanel">
        <header className="topBar">
          <div className="topLeft">
            <button
              className="iconBtn mobileOnly"
              onClick={() => setMobileSidebar(true)}
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
              onClick={() => setVoiceOpen(true)}
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
                msg.role === "user" ? "userRow" : ""
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

                {msg.role === "assistant" && (
                  <div className="messageTools">
                    <button
                      onClick={() => copyMessage(msg.text)}
                    >
                      <Copy size={15} />
                    </button>

                    <button
                      onClick={() => speakMessage(msg.text)}
                    >
                      <Volume2 size={15} />
                    </button>

                    <button
                      onClick={() =>
                        reactMessage(msg.id, true)
                      }
                    >
                      <ThumbsUp size={15} />
                    </button>

                    <button
                      onClick={() =>
                        reactMessage(msg.id, false)
                      }
                    >
                      <ThumbsDown size={15} />
                    </button>

                    <button>
                      <RotateCcw size={15} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {typing && (
            <div className="messageRow">
              <div className="bubble assistant">
                Thinking...
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* UPLOADED IMAGES */}
        {uploadedImages.length > 0 && (
          <div className="imageStrip">
            {uploadedImages.map((img, i) => (
              <img key={i} src={img} alt="" />
            ))}
          </div>
        )}

        {/* INPUT */}
        <div className="inputWrap">
          <div className="inputBox">
            <textarea
              placeholder="Message Lumina AI..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
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
                <button onClick={startVoiceInput}>
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

      {/* VOICE */}
      {voiceOpen && (
        <div className="voicePanel">
          <div className="voiceHeader">
            <div>Voice Assistant</div>

            <button
              className="iconBtn"
              onClick={() => setVoiceOpen(false)}
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
              onClick={startVoiceInput}
            >
              <Mic size={24} />
            </button>
          </div>
        </div>
      )}

      {/* ACCOUNT MENU */}
      {accountOpen && (
        <div className="accountModal">
          <div className="accountCard">
            <div className="accountTop">
              <div>
                <h2>Account</h2>

                <p>Manage your Lumina AI profile</p>
              </div>

              <button
                className="iconBtn"
                onClick={() => setAccountOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <div className="accountMenu">
              <button className="accountItem">
                <User size={18} />

                <div>
                  <h4>Profile</h4>

                  <p>Edit account details</p>
                </div>

                <ChevronRight size={16} />
              </button>

              <button className="accountItem">
                <Shield size={18} />

                <div>
                  <h4>Privacy</h4>

                  <p>Security and permissions</p>
                </div>

                <ChevronRight size={16} />
              </button>

              <button
                className="accountItem premium"
                onClick={() => setPremiumOpen(true)}
              >
                <Crown size={18} />

                <div>
                  <h4>Lumina Premium</h4>

                  <p>Unlock Ultra features</p>
                </div>

                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PREMIUM */}
      {premiumOpen && (
        <div className="premiumModal">
          <div className="premiumCard">
            <div className="premiumGlow" />

            <h1>Lumina Premium</h1>

            <p>
              Unlock advanced AI features and next-level
              experiences.
            </p>

            <div className="premiumFeatures">
              <div>✓ Faster AI responses</div>

              <div>✓ Unlimited chats</div>

              <div>✓ Ultra voice assistant</div>

              <div>✓ Premium AI models</div>

              <div>✓ Advanced image uploads</div>
            </div>

            <button className="upgradeBtn">
              Upgrade Now
            </button>

            <button
              className="closePremium"
              onClick={() => setPremiumOpen(false)}
            >
              Maybe Later
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
          font-family: Inter, sans-serif;
          overflow: hidden;
        }

        .lumina {
          height: 100vh;
          display: flex;
          background: #000;
        }

        .popup {
          position: fixed;
          top: 24px;
          right: 24px;
          background: #fff;
          color: #000;
          padding: 14px 20px;
          border-radius: 16px;
          z-index: 999;
          font-weight: 600;
        }

        .overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 50;
        }

        .sidebar {
          width: 300px;
          background: #090909;
          border-right: 1px solid #181818;
          padding: 14px;
          display: flex;
          flex-direction: column;
          transition: 0.25s;
          z-index: 60;
        }

        .collapsed {
          width: 82px;
        }

        .sidebarTop {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 18px;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 20px;
          font-weight: 700;
        }

        .iconBtn {
          width: 42px;
          height: 42px;
          border-radius: 14px;
          border: none;
          background: #111;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .newChatBtn,
        .navBtn,
        .logoutBtn,
        .accountBtn {
          width: 100%;
          height: 50px;
          border: none;
          border-radius: 16px;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 0 16px;
          background: transparent;
          color: white;
          cursor: pointer;
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
          height: 48px;
          background: #111;
          border-radius: 16px;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 0 14px;
          margin: 14px 0;
        }

        .searchBox input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          color: white;
        }

        .sectionLabel {
          color: #666;
          font-size: 13px;
          margin: 14px 0 10px;
        }

        .chatList {
          flex: 1;
          overflow-y: auto;
        }

        .chatItem {
          border-radius: 16px;
          margin-bottom: 8px;
        }

        .chatSelect {
          width: 100%;
          border: none;
          background: transparent;
          color: white;
          padding: 12px;
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
        }

        .chatActions {
          display: flex;
          gap: 6px;
          padding: 0 12px 10px;
        }

        .chatActions button {
          width: 30px;
          height: 30px;
          border-radius: 10px;
          border: none;
          background: #181818;
          color: white;
          cursor: pointer;
        }

        .selected {
          background: #111;
        }

        .mainPanel {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .topBar {
          height: 72px;
          border-bottom: 1px solid #181818;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 20px;
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

        .chatArea {
          flex: 1;
          overflow-y: auto;
          padding: 24px;
        }

        .messageRow {
          display: flex;
          margin-bottom: 20px;
        }

        .userRow {
          justify-content: flex-end;
        }

        .bubble {
          max-width: 760px;
          padding: 18px;
          border-radius: 24px;
        }

        .assistant {
          background: #101010;
          border: 1px solid #1b1b1b;
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
          background: #171717;
          color: white;
          cursor: pointer;
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
          min-height: 80px;
          resize: none;
          background: transparent;
          border: none;
          outline: none;
          color: white;
          font-size: 16px;
        }

        .inputBottom {
          display: flex;
          justify-content: space-between;
          margin-top: 12px;
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
          background: #171717;
          color: white;
          cursor: pointer;
        }

        .sendBtn {
          background: white !important;
          color: black !important;
        }

        .voicePanel,
        .accountModal,
        .premiumModal {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 120;
        }

        .voicePanel {
          flex-direction: column;
        }

        .voiceHeader {
          width: 360px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .voiceCenter {
          width: 360px;
          height: 480px;
          background: #090909;
          border: 1px solid #1a1a1a;
          border-radius: 32px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .orb {
          width: 170px;
          height: 170px;
          border-radius: 50%;
          background: radial-gradient(circle, #fff, #444);
          animation: pulse 2s infinite;
        }

        .voiceText {
          margin-top: 20px;
          color: #aaa;
        }

        .voiceMic {
          width: 70px;
          height: 70px;
          border-radius: 50%;
          border: none;
          background: white;
          color: black;
          margin-top: 24px;
          cursor: pointer;
        }

        .accountCard,
        .premiumCard {
          width: 420px;
          background: #090909;
          border: 1px solid #1a1a1a;
          border-radius: 32px;
          padding: 26px;
          position: relative;
          overflow: hidden;
        }

        .accountTop {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .accountTop p {
          color: #777;
          margin-top: 4px;
        }

        .accountMenu {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .accountItem {
          width: 100%;
          border: none;
          background: #111;
          border-radius: 20px;
          padding: 16px;
          display: flex;
          align-items: center;
          gap: 14px;
          color: white;
          cursor: pointer;
        }

        .accountItem div {
          flex: 1;
          text-align: left;
        }

        .accountItem p {
          color: #888;
          margin-top: 4px;
          font-size: 13px;
        }

        .premium {
          background: linear-gradient(
            135deg,
            #171717,
            #0c0c0c
          );
        }

        .premiumGlow {
          position: absolute;
          width: 220px;
          height: 220px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 50%;
          top: -80px;
          right: -80px;
          filter: blur(60px);
        }

        .premiumCard h1 {
          font-size: 38px;
          margin-bottom: 10px;
        }

        .premiumCard p {
          color: #999;
          line-height: 1.6;
        }

        .premiumFeatures {
          margin-top: 26px;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .upgradeBtn {
          width: 100%;
          height: 56px;
          border-radius: 18px;
          border: none;
          background: white;
          color: black;
          font-weight: 700;
          margin-top: 30px;
          cursor: pointer;
        }

        .closePremium {
          width: 100%;
          height: 52px;
          border-radius: 18px;
          border: none;
          background: #141414;
          color: white;
          margin-top: 14px;
          cursor: pointer;
        }

        @keyframes pulse {
          0% {
            transform: scale(1);
          }

          50% {
            transform: scale(1.08);
          }

          100% {
            transform: scale(1);
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

          .chatArea {
            padding: 18px 14px;
          }

          .inputWrap {
            padding: 12px;
          }

          .voiceCenter,
          .accountCard,
          .premiumCard {
            width: calc(100% - 20px);
          }
        }
      `}</style>
    </main>
  );
}
