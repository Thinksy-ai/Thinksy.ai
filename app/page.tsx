"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Menu,
  Plus,
  Search,
  Settings,
  Crown,
  LogOut,
  User,
  Trash2,
  Copy,
  ThumbsUp,
  ThumbsDown,
  Mic,
  Send,
  MessageSquare,
  X,
  Sparkles,
} from "lucide-react";

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Role = "user" | "assistant";

type Message = {
  role: Role;
  text: string;
};

type Chat = {
  id: number;
  title: string;
  messages: Message[];
};

export default function ChatPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  const [sidebar, setSidebar] = useState(false);
  const [input, setInput] = useState("");

  const [typing, setTyping] = useState(false);

  const [accountOpen, setAccountOpen] = useState(false);

  const [popup, setPopup] = useState("");

  const [voiceMode, setVoiceMode] = useState(false);

  const [currentChat, setCurrentChat] = useState(0);

  const [chats, setChats] = useState<Chat[]>([
    {
      id: 0,
      title: "New Chat",
      messages: [
        {
          role: "assistant",
          text: "Welcome to Lumina AI Ultra.",
        },
      ],
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
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.push("/login");
      } else {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  function showPopup(text: string) {
    setPopup(text);

    setTimeout(() => {
      setPopup("");
    }, 2200);
  }

  function newChat() {
    const fresh: Chat = {
      id: Date.now(),
      title: "New Chat",
      messages: [
        {
          role: "assistant",
          text: "Fresh Lumina AI chat started.",
        },
      ],
    };

    setChats((prev) => [fresh, ...prev]);

    setCurrentChat(0);

    showPopup("New chat created");
  }

  async function sendMessage() {
    if (!input.trim()) return;

    const userMsg: Message = {
      role: "user",
      text: input,
    };

    const updatedChats = [...chats];

    updatedChats[currentChat].messages.push(userMsg);

    if (updatedChats[currentChat].title === "New Chat") {
      updatedChats[currentChat].title = input.slice(0, 20);
    }

    setChats(updatedChats);

    const question = input;

    setInput("");

    setTyping(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: question,
        }),
      });

      const data = await res.json();

      const aiMsg: Message = {
        role: "assistant",
        text: data.reply || "AI unavailable.",
      };

      updatedChats[currentChat].messages.push(aiMsg);

      setChats([...updatedChats]);
    } catch {
      updatedChats[currentChat].messages.push({
        role: "assistant",
        text: "Something went wrong.",
      });

      setChats([...updatedChats]);
    }

    setTyping(false);
  }

  function copyText(text: string) {
    navigator.clipboard.writeText(text);

    showPopup("Copied to clipboard");
  }

  function react(type: string) {
    showPopup(
      type === "up"
        ? "Thanks for the feedback"
        : "We will improve the response"
    );
  }

  async function logout() {
    await supabase.auth.signOut();

    router.push("/login");
  }

  async function deleteAccount() {
    showPopup("Account deletion system coming soon");
  }

  function startVoice() {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      showPopup("Voice not supported");
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "en-US";

    recognition.start();

    setVoiceMode(true);

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;

      setInput(transcript);

      setVoiceMode(false);

      showPopup("Voice captured");
    };

    recognition.onerror = () => {
      setVoiceMode(false);
    };

    recognition.onend = () => {
      setVoiceMode(false);
    };
  }

  if (loading) {
    return (
      <div className="loadingScreen">
        <div className="loader" />
      </div>
    );
  }

  return (
    <main className="app">
      {/* SIDEBAR */}

      <aside className={`sidebar ${sidebar ? "show" : ""}`}>
        <div className="sidebarTop">
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

        <button className="newChatBtn" onClick={newChat}>
          <Plus size={18} />
          New Chat
        </button>

        <div className="searchBox">
          <Search size={16} />

          <input placeholder="Search chats..." />
        </div>

        <div className="chatHistory">
          {chats.map((chat, index) => (
            <button
              key={chat.id}
              className={`historyItem ${
                currentChat === index ? "active" : ""
              }`}
              onClick={() => {
                setCurrentChat(index);

                setSidebar(false);
              }}
            >
              <MessageSquare size={16} />
              {chat.title}
            </button>
          ))}
        </div>

        <div className="bottomSidebar">
          <button
            className="accountBtn"
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
            className="menuBtn"
            onClick={() => setSidebar(true)}
          >
            <Menu size={20} />
          </button>

          <div className="topTitle">Lumina AI Ultra</div>

          <button
            className="premiumBtn"
            onClick={() => showPopup("Lumina Ultra Premium")}
          >
            <Crown size={18} />
          </button>
        </header>

        {/* CHAT */}

        <div className="chatArea">
          {chats[currentChat]?.messages.map((msg, index) => (
            <div
              key={index}
              className={`message ${
                msg.role === "user" ? "user" : "ai"
              }`}
            >
              <div className="msgText">{msg.text}</div>

              {msg.role === "assistant" && (
                <div className="actions">
                  <button onClick={() => copyText(msg.text)}>
                    <Copy size={15} />
                  </button>

                  <button onClick={() => react("up")}>
                    <ThumbsUp size={15} />
                  </button>

                  <button onClick={() => react("down")}>
                    <ThumbsDown size={15} />
                  </button>
                </div>
              )}
            </div>
          ))}

          {typing && (
            <div className="typing">
              <div className="dot" />
              <div className="dot" />
              <div className="dot" />
            </div>
          )}
        </div>

        {/* INPUT */}

        <div className="inputWrap">
          <div className="inputBox">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Lumina anything..."
              onKeyDown={(e) =>
                e.key === "Enter" && sendMessage()
              }
            />

            <div className="inputButtons">
              <button onClick={startVoice}>
                <Mic size={18} />
              </button>

              <button className="sendBtn" onClick={sendMessage}>
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ACCOUNT */}

      {accountOpen && (
        <div className="overlay">
          <div className="accountPanel">
            <div className="panelTop">
              <h2>Account</h2>

              <button
                onClick={() => setAccountOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <div className="userInfo">
              <div className="avatar">
                {user?.email?.charAt(0)}
              </div>

              <div>
                <h3>{user?.email}</h3>
                <p>Logged in</p>
              </div>
            </div>

            <button className="panelBtn">
              <Settings size={18} />
              Settings
            </button>

            <button className="panelBtn">
              <Crown size={18} />
              Lumina Premium
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

      {voiceMode && (
        <div className="voicePopup">
          <div className="voiceOrb" />

          <h2>Listening...</h2>
        </div>
      )}

      {/* POPUP */}

      {popup && <div className="popup">{popup}</div>}

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
        }

        .app {
          display: flex;
          height: 100vh;
          background: #000;
        }

        .sidebar {
          width: 280px;
          background: #090909;
          border-right: 1px solid #161616;
          display: flex;
          flex-direction: column;
          padding: 18px;
        }

        .sidebarTop {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 20px;
          font-weight: 700;
        }

        .closeBtn {
          display: none;
        }

        .newChatBtn {
          margin-top: 24px;
          height: 52px;
          border-radius: 18px;
          border: none;
          background: white;
          color: black;
          font-size: 15px;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          cursor: pointer;
        }

        .searchBox {
          margin-top: 18px;
          height: 48px;
          border-radius: 16px;
          background: #111;
          border: 1px solid #1d1d1d;
          display: flex;
          align-items: center;
          padding: 0 14px;
          gap: 10px;
        }

        .searchBox input {
          background: transparent;
          border: none;
          outline: none;
          color: white;
          width: 100%;
        }

        .chatHistory {
          flex: 1;
          margin-top: 20px;
          overflow-y: auto;
        }

        .historyItem {
          width: 100%;
          min-height: 50px;
          border-radius: 16px;
          border: none;
          background: transparent;
          color: #ddd;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 0 14px;
          margin-bottom: 10px;
          cursor: pointer;
          text-align: left;
        }

        .historyItem:hover,
        .historyItem.active {
          background: #141414;
        }

        .bottomSidebar {
          margin-top: 20px;
        }

        .accountBtn {
          width: 100%;
          height: 52px;
          border-radius: 16px;
          border: none;
          background: #141414;
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
        }

        .topbar {
          height: 70px;
          border-bottom: 1px solid #111;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 20px;
        }

        .menuBtn,
        .premiumBtn,
        .actions button,
        .inputButtons button,
        .panelTop button {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          border: none;
          background: #111;
          color: white;
          cursor: pointer;
        }

        .topTitle {
          font-size: 22px;
          font-weight: 700;
        }

        .chatArea {
          flex: 1;
          overflow-y: auto;
          padding: 30px;
        }

        .message {
          max-width: 760px;
          padding: 18px;
          border-radius: 22px;
          margin-bottom: 18px;
        }

        .message.ai {
          background: #0f0f0f;
          border: 1px solid #1a1a1a;
        }

        .message.user {
          background: white;
          color: black;
          margin-left: auto;
        }

        .msgText {
          line-height: 1.6;
        }

        .actions {
          display: flex;
          gap: 10px;
          margin-top: 14px;
        }

        .typing {
          display: flex;
          gap: 8px;
          padding: 20px;
        }

        .dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: white;
          animation: bounce 1s infinite;
        }

        .inputWrap {
          padding: 18px;
        }

        .inputBox {
          background: #0f0f0f;
          border: 1px solid #1c1c1c;
          border-radius: 26px;
          min-height: 74px;
          display: flex;
          align-items: center;
          padding: 0 18px;
        }

        .inputBox input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          color: white;
          font-size: 16px;
        }

        .inputButtons {
          display: flex;
          gap: 10px;
        }

        .sendBtn {
          background: white !important;
          color: black !important;
        }

        .overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 100;
        }

        .accountPanel {
          width: 400px;
          background: #090909;
          border: 1px solid #1d1d1d;
          border-radius: 28px;
          padding: 24px;
        }

        .panelTop {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .userInfo {
          margin-top: 24px;
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .avatar {
          width: 62px;
          height: 62px;
          border-radius: 50%;
          background: white;
          color: black;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          font-weight: 700;
        }

        .panelBtn {
          width: 100%;
          height: 54px;
          border-radius: 16px;
          border: none;
          background: #111;
          color: white;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 0 16px;
          margin-top: 14px;
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
          bottom: 24px;
          left: 50%;
          transform: translateX(-50%);
          background: white;
          color: black;
          padding: 14px 22px;
          border-radius: 999px;
          font-weight: 600;
          z-index: 200;
        }

        .voicePopup {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,.82);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          z-index: 200;
        }

        .voiceOrb {
          width: 170px;
          height: 170px;
          border-radius: 50%;
          background: radial-gradient(circle, white, #333);
          animation: pulse 1.4s infinite;
        }

        .voicePopup h2 {
          margin-top: 24px;
          font-size: 28px;
        }

        .loadingScreen {
          height: 100vh;
          background: black;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .loader {
          width: 70px;
          height: 70px;
          border-radius: 50%;
          border: 5px solid #222;
          border-top: 5px solid white;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes pulse {
          0% {
            transform: scale(1);
          }

          50% {
            transform: scale(1.1);
          }

          100% {
            transform: scale(1);
          }
        }

        @keyframes bounce {
          50% {
            transform: translateY(-8px);
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
            background: #151515;
            color: white;
          }

          .chatArea {
            padding: 16px;
          }

          .message {
            max-width: 100%;
          }

          .accountPanel {
            width: calc(100% - 20px);
          }
        }
      `}</style>
    </main>
  );
}
