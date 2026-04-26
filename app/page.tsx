// app/page.tsx
"use client";

import { useState } from "react";
import {
  Menu,
  Plus,
  Send,
  MessageSquare,
  Trash2,
  Mic,
} from "lucide-react";

type Msg = {
  role: "user" | "assistant";
  text: string;
};

type Chat = {
  id: number;
  title: string;
  messages: Msg[];
};

export default function Home() {
  const firstChat = {
    id: 1,
    title: "New Chat",
    messages: [
      {
        role: "assistant",
        text: "Welcome to Thinksy. Ask anything.",
      },
    ],
  };

  const [menu, setMenu] = useState(false);
  const [input, setInput] = useState("");
  const [chats, setChats] = useState<Chat[]>([firstChat]);
  const [activeId, setActiveId] = useState(1);

  const activeChat =
    chats.find((chat) => chat.id === activeId) || chats[0];

  function newChat() {
    const id = Date.now();

    const chat = {
      id,
      title: "New Chat",
      messages: [
        {
          role: "assistant",
          text: "New chat created.",
        },
      ],
    };

    setChats((prev) => [chat, ...prev]);
    setActiveId(id);
    setInput("");
  }

  function deleteChat(id: number) {
    const filtered = chats.filter((chat) => chat.id !== id);

    if (filtered.length === 0) {
      setChats([firstChat]);
      setActiveId(1);
      return;
    }

    setChats(filtered);

    if (activeId === id) {
      setActiveId(filtered[0].id);
    }
  }

  function sendMessage() {
    const text = input.trim();
    if (!text) return;

    const updated = chats.map((chat) => {
      if (chat.id !== activeId) return chat;

      return {
        ...chat,
        title:
          chat.title === "New Chat"
            ? text.slice(0, 20)
            : chat.title,
        messages: [
          ...chat.messages,
          { role: "user", text },
          {
            role: "assistant",
            text: `Thinksy reply to: ${text}`,
          },
        ],
      };
    });

    setChats(updated);
    setInput("");
  }

  return (
    <main className="appShell">
      {/* Sidebar */}
      <aside className={`sidebar ${menu ? "show" : ""}`}>
        <div className="brand">Thinksy</div>

        <button className="newChatBtn" onClick={newChat}>
          <Plus size={18} />
          <span>New Chat</span>
        </button>

        <div className="history">
          {chats.map((chat) => (
            <div
              key={chat.id}
              className={`historyRow ${
                activeId === chat.id ? "active" : ""
              }`}
            >
              <button
                className="historyBtn"
                onClick={() => setActiveId(chat.id)}
              >
                <MessageSquare size={16} />
                <span>{chat.title}</span>
              </button>

              <button
                className="deleteBtn"
                onClick={() => deleteChat(chat.id)}
              >
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </div>
      </aside>

      {/* Main */}
      <section className="mainPanel">
        <header className="topBar">
          <button
            className="iconBtn"
            onClick={() => setMenu(!menu)}
          >
            <Menu size={20} />
          </button>

          <h1>Thinksy</h1>

          <button className="iconBtn">
            <Mic size={18} />
          </button>
        </header>

        <div className="chatArea">
          {activeChat.messages.map((msg, i) => (
            <div
              key={i}
              className={`bubble ${
                msg.role === "user" ? "user" : "ai"
              }`}
            >
              {msg.text}
            </div>
          ))}
        </div>

        <div className="inputWrap">
          <div className="inputBox">
            <input
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
    </main>
  );
}
