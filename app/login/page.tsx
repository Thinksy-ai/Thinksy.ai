"use client";

/*
FULL REPLACE FILE
app/page.tsx

Thinksy Phase 19 Core Chat Window
- Auth check
- Redirect if not logged in
- Real API chat call (/api/chat)
- New chat works
- Search works
- Sidebar close works
- Chat history works
- Logout works
- Mobile ready
- Premium black UI
*/

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Menu,
  X,
  Search,
  Plus,
  Send,
  LogOut,
  MessageSquare,
  Trash2,
} from "lucide-react";

type Role = "user" | "assistant";

type Msg = {
  role: Role;
  text: string;
};

type Chat = {
  id: number;
  title: string;
  messages: Msg[];
};

export default function Home() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const [ready, setReady] = useState(false);
  const [menu, setMenu] = useState(false);
  const [loading, setLoading] = useState(false);
  const [typing, setTyping] = useState(false);

  const [search, setSearch] = useState("");
  const [input, setInput] = useState("");

  const [chats, setChats] = useState<Chat[]>([]);
  const [activeId, setActiveId] = useState<number>(1);

  /* ---------------- AUTH CHECK ---------------- */
  useEffect(() => {
    const user = localStorage.getItem("thinksy_user");

    if (!user) {
      router.push("/login");
      return;
    }

    const saved = localStorage.getItem("thinksy_chats");

    if (saved) {
      setChats(JSON.parse(saved));
    } else {
      const first: Chat[] = [
        {
          id: 1,
          title: "New Chat",
          messages: [
            {
              role: "assistant",
              text: "Welcome to Lumina. Ask anything.",
            },
          ],
        },
      ];

      setChats(first);
      localStorage.setItem("thinksy_chats", JSON.stringify(first));
    }

    setReady(true);
  }, [router]);

  useEffect(() => {
    if (ready) {
      localStorage.setItem("thinksy_chats", JSON.stringify(chats));
    }
  }, [chats, ready]);

  const activeChat =
    chats.find((chat) => chat.id === activeId) || chats[0];

  /* ---------------- NEW CHAT ---------------- */
  function newChat() {
    const id = Date.now();

    const fresh: Chat = {
      id,
      title: "New Chat",
      messages: [
        {
          role: "assistant",
          text: "Fresh chat ready.",
        },
      ],
    };

    setChats((prev) => [fresh, ...prev]);
    setActiveId(id);
    setMenu(false);

    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  }

  /* ---------------- DELETE CHAT ---------------- */
  function deleteChat(id: number) {
    const updated = chats.filter((c) => c.id !== id);

    if (updated.length === 0) {
      newChat();
      return;
    }

    setChats(updated);
    setActiveId(updated[0].id);
  }

  /* ---------------- LOGOUT ---------------- */
  function logout() {
    localStorage.removeItem("thinksy_user");
    router.push("/login");
  }

  /* ---------------- SEND ---------------- */
  async function sendMessage() {
    const text = input.trim();
    if (!text || !activeChat || loading) return;

    const userMsg: Msg = {
      role: "user",
      text,
    };

    const updatedMessages = [...activeChat.messages, userMsg];

    const updatedChats = chats.map((chat) =>
      chat.id === activeId
        ? {
            ...chat,
            title:
              chat.title === "New Chat"
                ? text.slice(0, 25)
                : chat.title,
            messages: updatedMessages,
          }
        : chat
    );

    setChats(updatedChats);
    setInput("");
    setTyping(true);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: updatedMessages,
        }),
      });

      const data = await res.json();

      const aiMsg: Msg = {
        role: "assistant",
        text:
          data.reply ||
          "Unable to generate response right now.",
      };

      setChats((prev) =>
        prev.map((chat) =>
          chat.id === activeId
            ? {
                ...chat,
                messages: [...chat.messages, aiMsg],
              }
            : chat
        )
      );
    } catch {
      setChats((prev) =>
        prev.map((chat) =>
          chat.id === activeId
            ? {
                ...chat,
                messages: [
                  ...chat.messages,
                  {
                    role: "assistant",
                    text: "Connection error.",
                  },
                ],
              }
            : chat
        )
      );
    }

    setTyping(false);
    setLoading(false);
  }

  /* ---------------- SEARCH ---------------- */
  const filteredChats = chats.filter((chat) =>
    chat.title.toLowerCase().includes(search.toLowerCase())
  );

  if (!ready) return null;

  return (
    <main className="app">
      {/* SIDEBAR */}
      <aside className={`sidebar ${menu ? "show" : ""}`}>
        <div className="sideTop">
          <div className="logo">Thinksy</div>

          <button
            className="iconBtn mobileOnly"
            onClick={() => setMenu(false)}
          >
            <X size={18} />
          </button>
        </div>

        <button className="newBtn" onClick={newChat}>
          <Plus size={18} />
          New Chat
        </button>

        <div className="searchWrap">
          <Search size={16} />
          <input
            placeholder="Search chats"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="chatList">
          {filteredChats.map((chat) => (
            <div
              key={chat.id}
              className={`chatItem ${
                activeId === chat.id ? "active" : ""
              }`}
            >
              <button
                className="chatSelect"
                onClick={() => {
                  setActiveId(chat.id);
                  setMenu(false);
                }}
              >
                <MessageSquare size={16} />
                <span>{chat.title}</span>
              </button>

              <button
                className="trashBtn"
                onClick={() => deleteChat(chat.id)}
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>

        <button className="logoutBtn" onClick={logout}>
          <LogOut size={16} />
          Logout
        </button>
      </aside>

      {/* MAIN */}
      <section className="main">
        <header className="topbar">
          <button
            className="iconBtn"
            onClick={() => setMenu(true)}
          >
            <Menu size={18} />
          </button>

          <div className="title">
            {activeChat?.title || "Thinksy"}
          </div>

          <div />
        </header>

        {/* CHAT AREA */}
        <div className="chatArea">
          {activeChat?.messages.map((msg, i) => (
            <div
              key={i}
              className={`bubble ${
                msg.role === "user" ? "user" : "ai"
              }`}
            >
              {msg.text}
            </div>
          ))}

          {typing && (
            <div className="bubble ai">
              Thinking...
            </div>
          )}
        </div>

        {/* INPUT */}
        <div className="inputWrap">
          <div className="inputBox">
            <input
              ref={inputRef}
              placeholder="Ask anything..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && sendMessage()
              }
            />

            <button
              className="sendBtn"
              onClick={sendMessage}
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </section>

      <style jsx global>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          background: #000;
          color: #fff;
          font-family: Inter, sans-serif;
        }

        .app {
          height: 100vh;
          display: flex;
          background: #000;
        }

        .sidebar {
          width: 290px;
          background: #0b0b0b;
          border-right: 1px solid #171717;
          padding: 14px;
          display: flex;
          flex-direction: column;
        }

        .sideTop,
        .chatItem,
        .chatSelect,
        .topbar,
        .inputBox {
          display: flex;
          align-items: center;
        }

        .sideTop,
        .topbar {
          justify-content: space-between;
        }

        .logo {
          font-size: 22px;
          font-weight: 800;
        }

        .iconBtn,
        .sendBtn,
        .trashBtn {
          width: 42px;
          height: 42px;
          border: none;
          border-radius: 12px;
          background: #151515;
          color: #fff;
        }

        .newBtn,
        .logoutBtn {
          height: 48px;
          border: none;
          border-radius: 14px;
          background: #fff;
          color: #000;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          margin-top: 14px;
        }

        .logoutBtn {
          margin-top: auto;
          background: #151515;
          color: #fff;
        }

        .searchWrap {
          height: 46px;
          margin-top: 14px;
          background: #121212;
          border-radius: 14px;
          padding: 0 12px;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .searchWrap input,
        .inputBox input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          color: #fff;
        }

        .chatList {
          margin-top: 14px;
          overflow-y: auto;
        }

        .chatItem {
          gap: 8px;
          margin-bottom: 8px;
        }

        .chatSelect {
          flex: 1;
          gap: 10px;
          border: none;
          height: 46px;
          border-radius: 14px;
          padding: 0 12px;
          background: #111;
          color: #fff;
          justify-content: flex-start;
        }

        .chatItem.active .chatSelect {
          background: #1c1c1c;
        }

        .main {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .topbar {
          height: 64px;
          border-bottom: 1px solid #161616;
          padding: 0 14px;
        }

        .title {
          font-size: 18px;
          font-weight: 700;
        }

        .chatArea {
          flex: 1;
          overflow-y: auto;
          padding: 20px;
        }

        .bubble {
          max-width: 760px;
          padding: 14px 16px;
          border-radius: 18px;
          margin-bottom: 14px;
          line-height: 1.5;
        }

        .bubble.ai {
          background: #101010;
          border: 1px solid #181818;
        }

        .bubble.user {
          background: #1a1a1a;
          margin-left: auto;
        }

        .inputWrap {
          padding: 16px;
        }

        .inputBox {
          background: #101010;
          border: 1px solid #1b1b1b;
          border-radius: 20px;
          padding: 8px;
          gap: 10px;
        }

        .sendBtn {
          background: #fff;
          color: #000;
        }

        .mobileOnly {
          display: none;
        }

        @media (max-width: 900px) {
          .sidebar {
            position: fixed;
            left: -320px;
            top: 0;
            bottom: 0;
            z-index: 100;
            transition: 0.25s;
          }

          .sidebar.show {
            left: 0;
          }

          .mobileOnly {
            display: flex;
          }

          .bubble {
            max-width: 100%;
          }
        }
      `}</style>
    </main>
  );
}
