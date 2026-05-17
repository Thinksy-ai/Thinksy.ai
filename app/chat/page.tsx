"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  Menu,
  Search,
  Plus,
  Send,
  Mic,
  Settings,
  User,
  Trash2,
  X,
  Copy,
  ThumbsUp,
  ThumbsDown,
  Sparkles,
  MessageSquare,
  Moon,
  Sun,
  Bot,
  Stars,
  Zap,
  Volume2,
  ImageIcon,
  Clock3,
  Shield,
  Wand2,
  MoreVertical,
  Folder,
  Share2,
  Paperclip,
  RotateCcw,
  Download,
  Pin,
  Edit3,
} from "lucide-react";

import ReactMarkdown from "react-markdown";

import remarkGfm from "remark-gfm";

import remarkMath from "remark-math";

import rehypeKatex from "rehype-katex";

import "katex/dist/katex.min.css";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";

import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

type Role = "user" | "assistant";

type Message = {
  id: number;
  role: Role;
  text: string;
  time?: string;
};

type Chat = {
  id: number;
  title: string;
  pinned?: boolean;
  project?: string;
  messages: Message[];
};

type Memory = {
  summary: string;
};

export default function ThinksyUltra() {
  const bottomRef = useRef<HTMLDivElement>(null);

  const fileRef =
    useRef<HTMLInputElement>(null);

  const [sidebar, setSidebar] =
    useState(true);

  const [typing, setTyping] =
    useState(false);

  const [popup, setPopup] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [input, setInput] =
    useState("");

  const [darkMode, setDarkMode] =
    useState(true);

  const [settingsOpen, setSettingsOpen] =
    useState(false);

  const [menuOpen, setMenuOpen] =
    useState(false);

  const [memoryMode, setMemoryMode] =
    useState(true);

  const [currentChat, setCurrentChat] =
    useState(0);

  const [memory, setMemory] =
    useState<Memory>({
      summary: "",
    });

  const [projects] = useState([
    {
      id: 1,
      name: "Personal",
    },
    {
      id: 2,
      name: "Coding",
    },
    {
      id: 3,
      name: "Ideas",
    },
  ]);

  const [chats, setChats] =
    useState<Chat[]>([
      {
        id: 1,
        title: "Welcome",
        pinned: true,
        project: "Personal",
        messages: [
          {
            id: 1,
            role: "assistant",
            text: "Welcome to Thinksy Ultra.",
            time: getTime(),
          },
        ],
      },
    ]);

  useEffect(() => {
    const savedChats =
      localStorage.getItem(
        "thinksy_chats"
      );

    const savedMemory =
      localStorage.getItem(
        "thinksy_memory"
      );

    if (savedChats) {
      setChats(JSON.parse(savedChats));
    }

    if (savedMemory) {
      setMemory(
        JSON.parse(savedMemory)
      );
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "thinksy_chats",
      JSON.stringify(chats)
    );
  }, [chats]);

  useEffect(() => {
    localStorage.setItem(
      "thinksy_memory",
      JSON.stringify(memory)
    );
  }, [memory]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [typing, chats]);

  function toast(text: string) {
    setPopup(text);

    setTimeout(() => {
      setPopup("");
    }, 2200);
  }

  function getTime() {
    return new Date().toLocaleTimeString(
      [],
      {
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  }

  function createChat() {
    const newChat: Chat = {
      id: Date.now(),
      title: "New Chat",
      project: "Personal",
      messages: [],
    };

    setChats((prev) => [
      newChat,
      ...prev,
    ]);

    setCurrentChat(0);

    toast("Fresh chat created");
  }

  function deleteChat(id: number) {
    const filtered = chats.filter(
      (c) => c.id !== id
    );

    setChats(filtered);

    setCurrentChat(0);

    toast("Chat deleted");
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

  function learnMemory(text: string) {
    if (!memoryMode) return;

    const lower =
      text.toLowerCase();

    let newFacts = "";

    if (
      lower.includes("i like")
    ) {
      newFacts += text + "\n";
    }

    if (
      lower.includes("my name")
    ) {
      newFacts += text + "\n";
    }

    if (
      lower.includes("remember")
    ) {
      newFacts += text + "\n";
    }

    if (newFacts) {
      setMemory((prev) => ({
        summary:
          prev.summary +
          "\n" +
          newFacts,
      }));
    }
  }

  async function sendMessage() {
    if (!input.trim()) return;

    const userText = input;

    setInput("");

    learnMemory(userText);

    const userMessage: Message = {
      id: Date.now(),
      role: "user",
      text: userText,
      time: getTime(),
    };

    const updatedChats = [...chats];

    updatedChats[currentChat].messages.push(
      userMessage
    );

    if (
      updatedChats[currentChat].title ===
      "New Chat"
    ) {
      updatedChats[currentChat].title =
        userText.slice(0, 32);
    }

    setChats(updatedChats);

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
            message: userText,

            history:
              updatedChats[
                currentChat
              ].messages.slice(-15),

            memory:
              memory.summary,
          }),
        }
      );

      const data =
        await response.json();

      updatedChats[
        currentChat
      ].messages.push({
        id: Date.now() + 1,
        role: "assistant",
        text:
          data.reply ||
          "No response.",
        time: getTime(),
      });

      setChats([...updatedChats]);
    } catch {
      updatedChats[
        currentChat
      ].messages.push({
        id: Date.now() + 2,
        role: "assistant",
        text: "API connection failed.",
        time: getTime(),
      });

      setChats([...updatedChats]);
    }

    setTyping(false);
  }

  function speak(text: string) {
    const utterance =
      new SpeechSynthesisUtterance(
        text
      );

    speechSynthesis.speak(
      utterance
    );

    toast("Speaking");
  }

  function copyText(text: string) {
    navigator.clipboard.writeText(
      text
    );

    toast("Copied");
  }

  function exportChat() {
    const text =
      chats[
        currentChat
      ].messages
        .map(
          (m) =>
            `${m.role}: ${m.text}`
        )
        .join("\n\n");

    const blob = new Blob([text], {
      type: "text/plain",
    });

    const url =
      URL.createObjectURL(blob);

    const a =
      document.createElement("a");

    a.href = url;

    a.download = "thinksy-chat.txt";

    a.click();

    toast("Exported");
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
        darkMode
          ? "dark"
          : "light"
      }`}
    >
      <aside
        className={`sidebar ${
          sidebar ? "show" : ""
        }`}
      >
        <div className="logo">
          <Sparkles size={18} />
          Thinksy Ultra
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

        <div className="projects">
          {projects.map((project) => (
            <div
              className="project"
              key={project.id}
            >
              <Folder size={15} />
              {project.name}
            </div>
          ))}
        </div>

        <div className="history">
          {filteredChats.map(
            (chat) => (
              <div
                key={chat.id}
                className={`historyItem ${
                  chats[currentChat]
                    ?.id === chat.id
                    ? "active"
                    : ""
                }`}
              >
                <button
                  className="historySelect"
                  onClick={() => {
                    const index =
                      chats.findIndex(
                        (c) =>
                          c.id ===
                          chat.id
                      );

                    setCurrentChat(
                      index
                    );
                  }}
                >
                  <MessageSquare
                    size={15}
                  />

                  <span>
                    {chat.title}
                  </span>
                </button>

                <button
                  className="mini"
                  onClick={() =>
                    pinChat(chat.id)
                  }
                >
                  <Pin size={13} />
                </button>

                <button
                  className="mini"
                  onClick={() =>
                    deleteChat(
                      chat.id
                    )
                  }
                >
                  <Trash2
                    size={13}
                  />
                </button>
              </div>
            )
          )}
        </div>
      </aside>

      <section className="main">
        <header className="topbar">
          <button
            className="circleBtn"
            onClick={() =>
              setSidebar(!sidebar)
            }
          >
            <Menu size={18} />
          </button>

          <div className="topTitle">
            <span>
              Thinksy Ultra
            </span>

            <div className="status">
              Online
            </div>
          </div>

          <div className="topActions">
            <button
              className="circleBtn"
              onClick={() =>
                setMenuOpen(
                  !menuOpen
                )
              }
            >
              <MoreVertical
                size={18}
              />
            </button>

            {menuOpen && (
              <div className="menu">
                <button
                  onClick={
                    exportChat
                  }
                >
                  <Download
                    size={16}
                  />
                  Export
                </button>

                <button>
                  <Share2
                    size={16}
                  />
                  Share
                </button>

                <button
                  onClick={() =>
                    setSettingsOpen(
                      true
                    )
                  }
                >
                  <Settings
                    size={16}
                  />
                  Settings
                </button>

                <button>
                  <RotateCcw
                    size={16}
                  />
                  Retry
                </button>
              </div>
            )}
          </div>
        </header>

        {chats[currentChat]
          ?.messages.length ===
          0 && (
          <div className="hero">
            <div className="heroBadge">
              <Stars size={15} />
              Futuristic AI Workspace
            </div>

            <h1>
              Think.
              <br />
              Build.
              <br />
              Create.
            </h1>

            <p>
              Smart memory, coding,
              markdown, AI tools,
              projects and futuristic
              conversations.
            </p>

            <div className="heroGrid">
              <div className="heroCard">
                <Zap size={20} />
                Ultra Fast
              </div>

              <div className="heroCard">
                <Bot size={20} />
                Smart Memory
              </div>

              <div className="heroCard">
                <Shield
                  size={20}
                />
                Secure
              </div>

              <div className="heroCard">
                <Wand2 size={20} />
                Creative
              </div>
            </div>
          </div>
        )}

        <div className="chatArea">
          {chats[
            currentChat
          ]?.messages.map((msg) => (
            <div
              key={msg.id}
              className={`msg ${
                msg.role ===
                "assistant"
                  ? "ai"
                  : "user"
              }`}
            >
              <div className="msgTop">
                <div className="msgUser">
                  {msg.role ===
                  "assistant" ? (
                    <>
                      <Bot size={15} />
                      Thinksy
                    </>
                  ) : (
                    <>
                      <User
                        size={15}
                      />
                      You
                    </>
                  )}
                </div>

                <div className="msgTime">
                  <Clock3
                    size={12}
                  />
                  {msg.time}
                </div>
              </div>

              <div className="markdown">
                <ReactMarkdown
                  remarkPlugins={[
                    remarkGfm,
                    remarkMath,
                  ]}
                  rehypePlugins={[
                    rehypeKatex,
                  ]}
                  components={{
                    code(props) {
                      const {
                        children,
                        className,
                        ...rest
                      } = props;

                      const match =
                        /language-(\w+)/.exec(
                          className ||
                            ""
                        );

                      return match ? (
                        <SyntaxHighlighter
                          PreTag="div"
                          language={
                            match[1]
                          }
                          style={
                            oneDark
                          }
                        >
                          {String(
                            children
                          ).replace(
                            /\n$/,
                            ""
                          )}
                        </SyntaxHighlighter>
                      ) : (
                        <code
                          className={
                            className
                          }
                          {...rest}
                        >
                          {
                            children
                          }
                        </code>
                      );
                    },
                  }}
                >
                  {msg.text}
                </ReactMarkdown>
              </div>

              {msg.role ===
                "assistant" && (
                <div className="msgActions">
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
                      speak(
                        msg.text
                      )
                    }
                  >
                    <Volume2
                      size={14}
                    />
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

                  <button>
                    <Edit3
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

        <div className="inputWrap">
          <div className="inputBox">
            <textarea
              placeholder="Message Thinksy..."
              value={input}
              onChange={(e) =>
                setInput(
                  e.target.value
                )
              }
              onKeyDown={(e) => {
                if (
                  e.key ===
                    "Enter" &&
                  !e.shiftKey
                ) {
                  e.preventDefault();

                  sendMessage();
                }
              }}
            />

            <div className="inputButtons">
              <input
                type="file"
                hidden
                ref={fileRef}
              />

              <button
                className="miniBtn"
                onClick={() =>
                  fileRef.current?.click()
                }
              >
                <Paperclip
                  size={17}
                />
              </button>

              <button className="miniBtn">
                <Mic size={17} />
              </button>

              <button className="miniBtn">
                <ImageIcon
                  size={17}
                />
              </button>

              <button
                className="sendBtn"
                onClick={sendMessage}
              >
                <Send size={17} />
              </button>
            </div>
          </div>

          <div className="footer">
            Memory:
            {memoryMode
              ? " ON"
              : " OFF"}

            <button
              onClick={() =>
                setMemoryMode(
                  !memoryMode
                )
              }
            >
              Toggle
            </button>
          </div>
        </div>
      </section>

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

            <div className="setting">
              <span>
                Dark Mode
              </span>

              <button
                onClick={() =>
                  setDarkMode(
                    !darkMode
                  )
                }
              >
                {darkMode ? (
                  <Moon
                    size={16}
                  />
                ) : (
                  <Sun
                    size={16}
                  />
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {popup && (
        <div className="toast">
          {popup}
        </div>
      )}

      <style jsx global>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: Inter,
            sans-serif;
          background: #000;
          overflow: hidden;
        }

        .app {
          display: flex;
          min-height: 100vh;
          color: white;
          background: radial-gradient(
            circle at top,
            #151515,
            #000
          );
        }

        .sidebar {
          width: 290px;
          background: rgba(
            10,
            10,
            10,
            0.92
          );
          border-right: 1px solid
            #1c1c1c;
          backdrop-filter: blur(30px);
          padding: 18px;
          display: flex;
          flex-direction: column;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 24px;
          font-weight: 800;
        }

        .newChatBtn {
          margin-top: 20px;
          height: 54px;
          border-radius: 18px;
          border: none;
          background: white;
          color: black;
          font-weight: 700;
          cursor: pointer;
        }

        .searchBox {
          margin-top: 18px;
          background: #111;
          border: 1px solid #222;
          border-radius: 18px;
          height: 52px;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 0 14px;
        }

        .searchBox input {
          flex: 1;
          background: transparent;
          border: none;
          color: white;
          outline: none;
        }

        .projects {
          margin-top: 20px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .project {
          height: 48px;
          background: #101010;
          border-radius: 14px;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 0 14px;
        }

        .history {
          flex: 1;
          overflow-y: auto;
          margin-top: 20px;
        }

        .historyItem {
          display: flex;
          gap: 8px;
          margin-bottom: 10px;
        }

        .historySelect {
          flex: 1;
          border: none;
          height: 50px;
          background: #101010;
          border-radius: 14px;
          color: white;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 0 14px;
        }

        .mini {
          width: 42px;
          border: none;
          border-radius: 14px;
          background: #111;
          color: white;
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
            #1b1b1b;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 20px;
          backdrop-filter: blur(20px);
        }

        .circleBtn {
          width: 46px;
          height: 46px;
          border-radius: 50%;
          border: none;
          background: #101010;
          color: white;
        }

        .topTitle {
          text-align: center;
        }

        .topTitle span {
          font-size: 24px;
          font-weight: 800;
        }

        .status {
          color: #4ade80;
          font-size: 12px;
        }

        .menu {
          position: absolute;
          top: 80px;
          right: 20px;
          width: 220px;
          background: #0d0d0d;
          border-radius: 20px;
          border: 1px solid #222;
          overflow: hidden;
          z-index: 20;
        }

        .menu button {
          width: 100%;
          height: 52px;
          border: none;
          background: transparent;
          color: white;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 0 16px;
        }

        .hero {
          padding: 60px 40px;
        }

        .heroBadge {
          width: fit-content;
          background: #111;
          border: 1px solid #222;
          padding: 10px 16px;
          border-radius: 999px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .hero h1 {
          margin-top: 24px;
          font-size: 88px;
          line-height: 0.9;
          font-weight: 900;
        }

        .hero p {
          margin-top: 20px;
          color: #8d8d8d;
          max-width: 720px;
          line-height: 1.8;
          font-size: 17px;
        }

        .heroGrid {
          margin-top: 34px;
          display: grid;
          grid-template-columns: repeat(
            2,
            1fr
          );
          gap: 18px;
          max-width: 720px;
        }

        .heroCard {
          min-height: 120px;
          border-radius: 24px;
          background: linear-gradient(
            180deg,
            #121212,
            #0b0b0b
          );
          border: 1px solid #202020;
          padding: 22px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 10px;
          font-weight: 700;
        }

        .chatArea {
          flex: 1;
          overflow-y: auto;
          padding: 30px 26px 180px;
        }

        .msg {
          max-width: 920px;
          border-radius: 28px;
          padding: 24px;
          margin-bottom: 20px;
        }

        .msg.ai {
          background: rgba(
            14,
            14,
            14,
            0.95
          );
          border: 1px solid #1f1f1f;
        }

        .msg.user {
          margin-left: auto;
          background: white;
          color: black;
        }

        .msgTop {
          display: flex;
          justify-content: space-between;
          margin-bottom: 14px;
        }

        .msgUser {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 700;
        }

        .msgTime {
          display: flex;
          align-items: center;
          gap: 6px;
          opacity: 0.7;
          font-size: 12px;
        }

        .markdown {
          line-height: 1.9;
        }

        .markdown pre {
          margin-top: 18px;
          border-radius: 18px;
          overflow: auto;
        }

        .msgActions {
          margin-top: 18px;
          display: flex;
          gap: 10px;
        }

        .msgActions button {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: none;
          background: #111;
          color: white;
        }

        .typing {
          display: flex;
          gap: 8px;
          padding: 20px;
        }

        .typing span {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: white;
          animation: bounce 1s infinite;
        }

        .inputWrap {
          position: fixed;
          left: 290px;
          right: 0;
          bottom: 0;
          padding: 20px;
          background: linear-gradient(
            to top,
            rgba(0, 0, 0, 0.98),
            transparent
          );
        }

        .inputBox {
          max-width: 980px;
          margin: auto;
          border-radius: 30px;
          background: rgba(
            10,
            10,
            10,
            0.95
          );
          border: 1px solid #1e1e1e;
          backdrop-filter: blur(20px);
          padding: 16px;
        }

        .inputBox textarea {
          width: 100%;
          min-height: 70px;
          background: transparent;
          border: none;
          resize: none;
          outline: none;
          color: white;
          font-size: 16px;
        }

        .inputButtons {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          margin-top: 12px;
        }

        .miniBtn,
        .sendBtn {
          width: 46px;
          height: 46px;
          border-radius: 50%;
          border: none;
        }

        .miniBtn {
          background: #111;
          color: white;
        }

        .sendBtn {
          background: white;
          color: black;
        }

        .footer {
          margin-top: 12px;
          text-align: center;
          color: #7d7d7d;
          font-size: 12px;
        }

        .footer button {
          margin-left: 10px;
          border: none;
          background: white;
          color: black;
          padding: 6px 12px;
          border-radius: 999px;
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
        }

        .panel {
          width: 420px;
          border-radius: 28px;
          background: #0d0d0d;
          border: 1px solid #1e1e1e;
          padding: 24px;
        }

        .panelTop {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .setting {
          margin-top: 24px;
          display: flex;
          justify-content: space-between;
        }

        .toast {
          position: fixed;
          bottom: 30px;
          left: 50%;
          transform: translateX(-50%);
          background: white;
          color: black;
          padding: 14px 22px;
          border-radius: 999px;
          font-weight: 700;
        }

        @keyframes bounce {
          50% {
            transform: translateY(
              -5px
            );
          }
        }

        @media (max-width: 900px) {
          .sidebar {
            position: fixed;
            left: -100%;
            top: 0;
            bottom: 0;
            z-index: 100;
            transition: 0.3s;
          }

          .sidebar.show {
            left: 0;
          }

          .inputWrap {
            left: 0;
          }

          .hero h1 {
            font-size: 56px;
          }

          .heroGrid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </main>
  );
}
