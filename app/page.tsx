"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Menu,
  X,
  Plus,
  Search,
  Send,
  Mic,
  Copy,
  ThumbsUp,
  ThumbsDown,
  Trash2,
  LogOut,
  Library,
  Compass,
  MessageSquare,
} from "lucide-react";
import { supabase } from "../lib/supabase";

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
  const bottomRef = useRef<HTMLDivElement>(null);

  const [ready, setReady] = useState(false);
  const [sidebar, setSidebar] = useState(false);
  const [tab, setTab] = useState<"chat" | "explore" | "library">("chat");

  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");
  const [typing, setTyping] = useState(false);

  const [chats, setChats] = useState<Chat[]>([]);
  const [activeId, setActiveId] = useState<number>(1);

  useEffect(() => {
    async function boot() {
      const { data } = await supabase.auth.getSession();

      if (!data.session) {
        router.push("/login");
        return;
      }

      const saved = localStorage.getItem("thinksy_chats");

      if (saved) {
        const parsed: Chat[] = JSON.parse(saved);
        setChats(parsed);
        setActiveId(parsed[0]?.id || 1);
      } else {
        const starter: Chat[] = [
          {
            id: 1,
            title: "New Chat",
            messages: [
              {
                role: "assistant",
                text: "Welcome to Thinksy. Ask anything.",
              },
            ],
          },
        ];

        setChats(starter);
      }

      setReady(true);
    }

    boot();
  }, [router]);

  useEffect(() => {
    if (chats.length > 0) {
      localStorage.setItem(
        "thinksy_chats",
        JSON.stringify(chats)
      );
    }
  }, [chats]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [chats, typing]);

  const active =
    chats.find((chat) => chat.id === activeId) ||
    chats[0];

  function newChat() {
    const id = Date.now();

    const item: Chat = {
      id,
      title: "New Chat",
      messages: [
        {
          role: "assistant",
          text: "Fresh chat started.",
        },
      ],
    };

    setChats((prev) => [item, ...prev]);
    setActiveId(id);
    setTab("chat");
    setSidebar(false);
  }

  function deleteChat(id: number) {
    const left = chats.filter((chat) => chat.id !== id);

    if (left.length === 0) {
      const fallback: Chat = {
        id: Date.now(),
        title: "New Chat",
        messages: [
          {
            role: "assistant",
            text: "Fresh chat started.",
          },
        ],
      };

      setChats([fallback]);
      setActiveId(fallback.id);
      return;
    }

    setChats(left);
    setActiveId(left[0].id);
  }

  async function sendMessage() {
    const text = input.trim();

    if (!text || !active) return;

    const updated: Chat[] = chats.map(
      (chat): Chat =>
        chat.id === active.id
          ? {
              ...chat,
              title:
                chat.title === "New Chat"
                  ? text.slice(0, 25)
                  : chat.title,

              messages: [
                ...chat.messages,
                {
                  role: "user" as Role,
                  text: text,
                },
              ],
            }
          : chat
    );

    setChats(updated);
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

      const reply =
        data.reply ||
        "No response.";

      setChats((prev) =>
        prev.map(
          (chat): Chat =>
            chat.id === active.id
              ? {
                  ...chat,
                  messages: [
                    ...chat.messages,
                    {
                      role:
                        "assistant" as Role,
                      text: reply,
                    },
                  ],
                }
              : chat
        )
      );
    } catch {
      setChats((prev) =>
        prev.map(
          (chat): Chat =>
            chat.id === active.id
              ? {
                  ...chat,
                  messages: [
                    ...chat.messages,
                    {
                      role:
                        "assistant" as Role,
                      text:
                        "Error reaching AI.",
                    },
                  ],
                }
              : chat
        )
      );
    }

    setTyping(false);
  }

  async function logout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  function copyText(text: string) {
    navigator.clipboard.writeText(text);
  }

  const filtered = chats.filter((chat) =>
    chat.title
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  if (!ready) return null;

  return (
    <main className="app">
      {/* SIDEBAR */}
      <aside
        className={`sidebar ${
          sidebar ? "show" : ""
        }`}
      >
        <div className="sideTop">
          <button
            className="icon"
            onClick={newChat}
          >
            <Plus size={18} />
          </button>

          <button
            className="icon mobileOnly"
            onClick={() =>
              setSidebar(false)
            }
          >
            <X size={18} />
          </button>
        </div>

        <div className="searchBox">
          <Search size={16} />
          <input
            placeholder="Search chats"
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
          />
        </div>

        <button
          className={`nav ${
            tab === "chat"
              ? "active"
              : ""
          }`}
          onClick={() =>
            setTab("chat")
          }
        >
          <MessageSquare size={18} />
          Chat
        </button>

        <button
          className={`nav ${
            tab === "explore"
              ? "active"
              : ""
          }`}
          onClick={() =>
            setTab("explore")
          }
        >
          <Compass size={18} />
          Explore
        </button>

        <button
          className={`nav ${
            tab === "library"
              ? "active"
              : ""
          }`}
          onClick={() =>
            setTab("library")
          }
        >
          <Library size={18} />
          Library
        </button>

        <div className="history">
          {filtered.map((chat) => (
            <div
              key={chat.id}
              className={`chatRow ${
                activeId === chat.id
                  ? "picked"
                  : ""
              }`}
            >
              <button
                className="chatBtn"
                onClick={() => {
                  setActiveId(chat.id);
                  setTab("chat");
                  setSidebar(false);
                }}
              >
                {chat.title}
              </button>

              <button
                className="trash"
                onClick={() =>
                  deleteChat(chat.id)
                }
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>

        <button
          className="logout"
          onClick={logout}
        >
          <LogOut size={18} />
          Logout
        </button>
      </aside>

      {/* MAIN */}
      <section className="main">
        <header className="topBar">
          <button
            className="icon"
            onClick={() =>
              setSidebar(true)
            }
          >
            <Menu size={18} />
          </button>

          <div className="logo">
            Thinksy
          </div>
        </header>

        {tab === "chat" && (
          <>
            <div className="chatArea">
              {active?.messages.map(
                (msg, i) => (
                  <div
                    key={i}
                    className={`bubble ${
                      msg.role === "user"
                        ? "user"
                        : "ai"
                    }`}
                  >
                    {msg.text}

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
                          <Copy size={14} />
                        </button>

                        <button>
                          <ThumbsUp
                            size={14}
                          />
                        </button>

                        <button>
                          <ThumbsDown
                            size={14}
                          />
                        </button>
                      </div>
                    )}
                  </div>
                )
              )}

              {typing && (
                <div className="bubble ai">
                  Thinking...
                </div>
              )}

              <div ref={bottomRef} />
            </div>

            <div className="inputWrap">
              <input
                placeholder="Ask anything"
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

              <button className="icon">
                <Mic size={18} />
              </button>

              <button
                className="sendBtn"
                onClick={sendMessage}
              >
                <Send size={18} />
              </button>
            </div>
          </>
        )}

        {tab === "explore" && (
          <div className="empty">
            Explore prompts, image
            generation and trending AI
            tools page.
          </div>
        )}

        {tab === "library" && (
          <div className="empty">
            {chats.length > 0
              ? `Saved Chats: ${chats.length}`
              : "No chats found."}
          </div>
        )}
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
          font-family: Inter,
            sans-serif;
        }

        .app {
          display: flex;
          height: 100vh;
          overflow: hidden;
        }

        .sidebar {
          width: 280px;
          background: #090909;
          border-right: 1px solid
            #151515;
          padding: 14px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .sideTop,
        .topBar {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .topBar {
          height: 64px;
          border-bottom: 1px solid
            #141414;
          padding: 0 14px;
        }

        .logo {
          font-size: 22px;
          font-weight: 700;
        }

        .icon,
        .sendBtn,
        .trash {
          width: 42px;
          height: 42px;
          border: none;
          border-radius: 14px;
          background: #131313;
          color: #fff;
          cursor: pointer;
        }

        .searchBox {
          height: 46px;
          background: #111;
          border-radius: 14px;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 0 14px;
        }

        .searchBox input,
        .inputWrap input {
          flex: 1;
          border: none;
          outline: none;
          background: transparent;
          color: #fff;
        }

        .nav,
        .chatBtn,
        .logout {
          width: 100%;
          height: 46px;
          border: none;
          border-radius: 14px;
          background: #111;
          color: #fff;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 0 14px;
          cursor: pointer;
        }

        .active,
        .picked {
          background: #1a1a1a;
        }

        .history {
          flex: 1;
          overflow-y: auto;
        }

        .chatRow {
          display: flex;
          gap: 8px;
          margin-bottom: 8px;
        }

        .chatBtn {
          justify-content: flex-start;
        }

        .logout {
          margin-top: auto;
        }

        .main {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .chatArea {
          flex: 1;
          overflow-y: auto;
          padding: 20px;
        }

        .bubble {
          max-width: 760px;
          padding: 16px;
          border-radius: 18px;
          margin-bottom: 14px;
          line-height: 1.5;
        }

        .bubble.ai {
          background: #101010;
          border: 1px solid #171717;
        }

        .bubble.user {
          background: #1a1a1a;
          margin-left: auto;
        }

        .tools {
          display: flex;
          gap: 8px;
          margin-top: 12px;
        }

        .tools button {
          width: 34px;
          height: 34px;
          border: none;
          border-radius: 50%;
          background: #181818;
          color: #fff;
        }

        .inputWrap {
          display: flex;
          gap: 10px;
          padding: 14px;
          border-top: 1px solid
            #151515;
        }

        .inputWrap input {
          height: 52px;
          background: #111;
          border-radius: 18px;
          padding: 0 16px;
        }

        .sendBtn {
          background: #fff;
          color: #000;
        }

        .empty {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #777;
          text-align: center;
          padding: 20px;
        }

        .mobileOnly {
          display: none;
        }

        @media (max-width: 900px) {
          .sidebar {
            position: fixed;
            top: 0;
            bottom: 0;
            left: -300px;
            z-index: 99;
            transition: 0.25s;
          }

          .sidebar.show {
            left: 0;
          }

          .mobileOnly {
            display: block;
          }

          .bubble {
            max-width: 100%;
          }

          .logo {
            font-size: 20px;
          }
        }
      `}</style>
    </main>
  );
}
