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

  const [userReady, setUserReady] = useState(false);
  const [sidebar, setSidebar] = useState(false);

  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [search, setSearch] = useState("");

  const [tab, setTab] = useState<
    "chat" | "explore" | "library"
  >("chat");

  const [chats, setChats] = useState<Chat[]>([]);
  const [activeId, setActiveId] =
    useState<number>(1);

  /* AUTH CHECK */
  useEffect(() => {
    async function check() {
      const { data } =
        await supabase.auth.getSession();

      if (!data.session) {
        router.push("/login");
        return;
      }

      const saved =
        localStorage.getItem(
          "thinksy_chats"
        );

      if (saved) {
        const parsed: Chat[] =
          JSON.parse(saved);
        setChats(parsed);
        setActiveId(parsed[0]?.id || 1);
      } else {
        const first: Chat[] = [
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
        setChats(first);
      }

      setUserReady(true);
    }

    check();
  }, [router]);

  /* SAVE */
  useEffect(() => {
    if (chats.length) {
      localStorage.setItem(
        "thinksy_chats",
        JSON.stringify(chats)
      );
    }
  }, [chats]);

  /* AUTO SCROLL */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [chats, typing]);

  const active =
    chats.find(
      (c) => c.id === activeId
    ) || chats[0];

  /* NEW CHAT */
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

    setChats([item, ...chats]);
    setActiveId(id);
    setTab("chat");
    setSidebar(false);
  }

  /* DELETE CHAT */
  function deleteChat(id: number) {
    const left = chats.filter(
      (c) => c.id !== id
    );

    if (!left.length) {
      newChat();
      return;
    }

    setChats(left);
    setActiveId(left[0].id);
  }

  /* SEND MESSAGE */
  async function sendMessage() {
    const text = input.trim();
    if (!text || !active) return;

    const updated = chats.map((chat) =>
      chat.id === active.id
        ? {
            ...chat,
            title:
              chat.title ===
              "New Chat"
                ? text.slice(
                    0,
                    25
                  )
                : chat.title,
            messages: [
              ...chat.messages,
              {
                role: "user",
                text,
              },
            ],
          }
        : chat
    );

    setChats(updated);
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
            message: text,
          }),
        }
      );

      const data =
        await res.json();

      const reply =
        data.reply ||
        "No response.";

      setChats((prev) =>
        prev.map((chat) =>
          chat.id === active.id
            ? {
                ...chat,
                messages: [
                  ...chat.messages,
                  {
                    role: "assistant",
                    text: reply,
                  },
                ],
              }
            : chat
        )
      );
    } catch {
      setChats((prev) =>
        prev.map((chat) =>
          chat.id === active.id
            ? {
                ...chat,
                messages: [
                  ...chat.messages,
                  {
                    role: "assistant",
                    text: "Error reaching AI.",
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
    navigator.clipboard.writeText(
      text
    );
  }

  const filtered = chats.filter(
    (c) =>
      c.title
        .toLowerCase()
        .includes(
          search.toLowerCase()
        )
  );

  if (!userReady) return null;

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
              className={`chatItem ${
                activeId === chat.id
                  ? "picked"
                  : ""
              }`}
            >
              <button
                className="chatBtn"
                onClick={() => {
                  setActiveId(
                    chat.id
                  );
                  setTab(
                    "chat"
                  );
                  setSidebar(
                    false
                  );
                }}
              >
                {chat.title}
              </button>

              <button
                className="trash"
                onClick={() =>
                  deleteChat(
                    chat.id
                  )
                }
              >
                <Trash2
                  size={14}
                />
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
        <header className="top">
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

        {/* CHAT TAB */}
        {tab === "chat" && (
          <>
            <div className="msgs">
              {active?.messages.map(
                (
                  m,
                  i
                ) => (
                  <div
                    key={i}
                    className={`bubble ${
                      m.role ===
                      "user"
                        ? "user"
                        : "ai"
                    }`}
                  >
                    {m.text}

                    {m.role ===
                      "assistant" && (
                      <div className="tools">
                        <button
                          onClick={() =>
                            copyText(
                              m.text
                            )
                          }
                        >
                          <Copy
                            size={
                              14
                            }
                          />
                        </button>
                        <button>
                          <ThumbsUp
                            size={
                              14
                            }
                          />
                        </button>
                        <button>
                          <ThumbsDown
                            size={
                              14
                            }
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
                value={input}
                placeholder="Ask anything"
                onChange={(e) =>
                  setInput(
                    e.target.value
                  )
                }
                onKeyDown={(
                  e
                ) =>
                  e.key ===
                    "Enter" &&
                  sendMessage()
                }
              />

              <button className="icon">
                <Mic size={18} />
              </button>

              <button
                className="send"
                onClick={
                  sendMessage
                }
              >
                <Send size={18} />
              </button>
            </div>
          </>
        )}

        {/* EXPLORE */}
        {tab === "explore" && (
          <div className="empty">
            Explore page ready for prompts,
            images and trending AI tools.
          </div>
        )}

        {/* LIBRARY */}
        {tab === "library" && (
          <div className="empty">
            {chats.length
              ? `Saved chats: ${chats.length}`
              : "No chats yet"}
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
        .top {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .icon,
        .send,
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
          display: flex;
          align-items: center;
          gap: 10px;
          background: #121212;
          padding: 0 14px;
          height: 46px;
          border-radius: 14px;
        }

        .searchBox input,
        .inputWrap input {
          flex: 1;
          background: none;
          border: none;
          color: #fff;
          outline: none;
        }

        .nav,
        .chatBtn,
        .logout {
          border: none;
          background: #111;
          color: #fff;
          height: 46px;
          border-radius: 14px;
          padding: 0 14px;
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          width: 100%;
        }

        .active,
        .picked {
          background: #1a1a1a;
        }

        .history {
          flex: 1;
          overflow: auto;
        }

        .chatItem {
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

        .top {
          height: 64px;
          padding: 0 14px;
          border-bottom: 1px solid
            #151515;
        }

        .msgs {
          flex: 1;
          overflow: auto;
          padding: 20px;
        }

        .bubble {
          max-width: 760px;
          padding: 16px;
          border-radius: 18px;
          margin-bottom: 14px;
        }

        .ai {
          background: #101010;
        }

        .user {
          background: #1a1a1a;
          margin-left: auto;
        }

        .tools {
          display: flex;
          gap: 8px;
          margin-top: 10px;
        }

        .tools button {
          width: 34px;
          height: 34px;
          border: none;
          border-radius: 50%;
          background: #161616;
          color: #fff;
        }

        .inputWrap {
          padding: 14px;
          display: flex;
          gap: 10px;
          border-top: 1px solid
            #151515;
        }

        .inputWrap input {
          height: 52px;
          background: #111;
          border-radius: 18px;
          padding: 0 16px;
        }

        .send {
          background: #fff;
          color: #000;
        }

        .empty {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #888;
          padding: 20px;
          text-align: center;
        }

        .mobileOnly {
          display: none;
        }

        @media (max-width: 900px) {
          .sidebar {
            position: fixed;
            left: -300px;
            top: 0;
            bottom: 0;
            z-index: 100;
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
        }
      `}</style>
    </main>
  );
}
