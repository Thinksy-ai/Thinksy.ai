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
  LogOut,
  Crown,
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
  Check,
  Volume2,
  PenSquare,
  ImageIcon,
  Clock3,
  ChevronRight,
  Cpu,
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
  FileText,
} from "lucide-react";

import { createClient } from "@supabase/supabase-js";

import ReactMarkdown from "react-markdown";

import remarkGfm from "remark-gfm";

import remarkMath from "remark-math";

import rehypeKatex from "rehype-katex";

import "katex/dist/katex.min.css";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";

import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Role = "user" | "assistant";

type Message = {
  id: number;
  role: Role;
  text: string;
  time?: string;
  edited?: boolean;
};

type Chat = {
  id: number;
  title: string;
  pinned?: boolean;
  project?: string;
  messages: Message[];
};

type Project = {
  id: number;
  name: string;
};

export default function ThinksyUltra() {
  const bottomRef = useRef<HTMLDivElement>(null);

  const fileRef =
    useRef<HTMLInputElement>(null);

  const [loading, setLoading] =
    useState(true);

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

  const [user, setUser] =
    useState<any>(null);

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

  const [projects, setProjects] =
    useState<Project[]>([
      {
        id: 1,
        name: "Personal",
      },
      {
        id: 2,
        name: "Coding",
      },
    ]);

  const [chats, setChats] =
    useState<Chat[]>([
      {
        id: 1,
        title: "Welcome",
        pinned: true,
        project: "Personal",
        messages: [],
      },
    ]);

  useEffect(() => {
    async function checkUser() {
      const {
        data: { session },
      } =
        await supabase.auth.getSession();

      if (session) {
        setUser(session.user);
      }

      setLoading(false);
    }

    checkUser();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [typing, chats]);

  useEffect(() => {
    const handlePaste = (
      e: ClipboardEvent
    ) => {
      const items =
        e.clipboardData?.items;

      if (!items) return;

      for (const item of items) {
        if (
          item.type.includes("image")
        ) {
          toast("Image pasted");
        }
      }
    };

    window.addEventListener(
      "paste",
      handlePaste
    );

    return () =>
      window.removeEventListener(
        "paste",
        handlePaste
      );
  }, []);

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

    toast("New chat created");
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

    toast("Chat updated");
  }

  async function sendMessage() {
    if (!input.trim()) return;

    const userText = input;

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
        userText.slice(0, 30);
    }

    setChats(updatedChats);

    setInput("");

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
              ].messages,

            memory: memoryMode
              ? `
User likes futuristic design.
User likes long answers.
User likes coding.
User likes AI tools.
`
              : "",
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
          "No response generated.",
        time: getTime(),
      });

      setChats([...updatedChats]);
    } catch {
      updatedChats[
        currentChat
      ].messages.push({
        id: Date.now() + 2,
        role: "assistant",
        text: "Connection failed.",
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

    toast("Reading message");
  }

  function startVoice() {
    const SpeechRecognition =
      (window as any)
        .webkitSpeechRecognition;

    if (!SpeechRecognition) {
      toast("Voice unsupported");

      return;
    }

    const recognition =
      new SpeechRecognition();

    recognition.start();

    recognition.onresult = (
      event: any
    ) => {
      setInput(
        event.results[0][0].transcript
      );
    };
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

    a.download = "chat.txt";

    a.click();

    toast("Chat exported");
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

  if (loading) {
    return (
      <div className="loader">
        <div className="loaderOrb" />
      </div>
    );
  }

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
              <Folder size={16} />
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
                    size={16}
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
                  <Pin size={14} />
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
                    size={14}
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
                  Regenerate
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
              Coding, research,
              writing, memory,
              markdown, LaTeX,
              projects and advanced
              AI tools.
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

              <button
                className="miniBtn"
                onClick={startVoice}
              >
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
            <span>
              Memory:
              {memoryMode
                ? " ON"
                : " OFF"}
            </span>

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
        }

        .app {
          display: flex;
          min-height: 100vh;
          color: white;
        }

        .dark {
          background: #000;
        }

        .light {
          background: #f5f5f5;
          color: black;
        }

        .sidebar {
          width: 290px;
          border-right: 1px solid
            #1a1a1a;
          padding: 18px;
          display: flex;
          flex-direction: column;
          background: rgba(
            0,
            0,
            0,
            0.95
          );
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 22px;
          font-weight: 800;
        }

        .newChatBtn {
          height: 54px;
          border-radius: 18px;
          border: none;
          background: white;
          color: black;
          margin-top: 20px;
          font-weight: 700;
        }

        .searchBox {
          height: 52px;
          border-radius: 18px;
          background: #101010;
          margin-top: 16px;
          display: flex;
          align-items: center;
          padding: 0 16px;
          gap: 10px;
        }

        .searchBox input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          color: white;
        }

        .projects {
          margin-top: 20px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .project {
          height: 48px;
          border-radius: 14px;
          background: #101010;
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
          height: 50px;
          border-radius: 14px;
          background: #111;
          border: none;
          color: white;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 0 14px;
        }

        .mini {
          width: 42px;
          border-radius: 14px;
          background: #111;
          border: none;
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
            #141414;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 18px;
        }

        .circleBtn {
          width: 46px;
          height: 46px;
          border-radius: 50%;
          border: none;
          background: #111;
          color: white;
        }

        .topTitle {
          text-align: center;
        }

        .topTitle span {
          font-size: 22px;
          font-weight: 800;
        }

        .status {
          font-size: 12px;
          color: #4ade80;
        }

        .menu {
          position: absolute;
          right: 20px;
          top: 80px;
          background: #0f0f0f;
          border: 1px solid #222;
          border-radius: 18px;
          width: 220px;
          overflow: hidden;
        }

        .menu button {
          width: 100%;
          height: 50px;
          border: none;
          background: transparent;
          color: white;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 0 16px;
        }

        .hero {
          padding: 60px 30px;
        }

        .hero h1 {
          font-size: 74px;
          line-height: 0.95;
          font-weight: 900;
          margin-top: 20px;
        }

        .hero p {
          margin-top: 20px;
          color: #999;
          max-width: 700px;
          line-height: 1.8;
        }

        .heroBadge {
          width: fit-content;
          padding: 10px 16px;
          border-radius: 999px;
          background: #111;
          display: flex;
          gap: 8px;
          align-items: center;
        }

        .heroGrid {
          display: grid;
          grid-template-columns: repeat(
            2,
            1fr
          );
          gap: 16px;
          margin-top: 30px;
          max-width: 700px;
        }

        .heroCard {
          min-height: 120px;
          border-radius: 22px;
          background: #101010;
          border: 1px solid #1b1b1b;
          padding: 22px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 10px;
        }

        .chatArea {
          flex: 1;
          overflow-y: auto;
          padding: 20px 24px 170px;
        }

        .msg {
          max-width: 900px;
          padding: 22px;
          border-radius: 24px;
          margin-bottom: 18px;
        }

        .msg.ai {
          background: #0d0d0d;
          border: 1px solid #1a1a1a;
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
          font-size: 12px;
          opacity: 0.7;
        }

        .markdown {
          line-height: 1.9;
        }

        .markdown pre {
          border-radius: 18px;
          overflow: auto;
          margin-top: 18px;
        }

        .markdown code {
          font-size: 14px;
        }

        .markdown h1,
        .markdown h2,
        .markdown h3 {
          margin-top: 18px;
          margin-bottom: 10px;
        }

        .markdown ul {
          padding-left: 22px;
        }

        .msgActions {
          display: flex;
          gap: 10px;
          margin-top: 18px;
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
          bottom: 0;
          left: 290px;
          right: 0;
          padding: 18px;
          background: linear-gradient(
            to top,
            rgba(0, 0, 0, 0.98),
            transparent
          );
        }

        .inputBox {
          max-width: 980px;
          margin: auto;
          border-radius: 28px;
          background: #0d0d0d;
          border: 1px solid #1b1b1b;
          padding: 16px;
        }

        .inputBox textarea {
          width: 100%;
          min-height: 70px;
          resize: none;
          background: transparent;
          border: none;
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
          color: #777;
          font-size: 12px;
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
          width: 400px;
          background: #0b0b0b;
          border-radius: 24px;
          padding: 24px;
          border: 1px solid #1c1c1c;
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
          padding: 14px 24px;
          border-radius: 999px;
          font-weight: 700;
        }

        .loader {
          width: 100%;
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: black;
        }

        .loaderOrb {
          width: 90px;
          height: 90px;
          border-radius: 50%;
          border: 5px solid #222;
          border-top: 5px solid white;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(
              360deg
            );
          }
        }

        @keyframes bounce {
          50% {
            transform: translateY(
              -6px
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
            font-size: 48px;
          }

          .heroGrid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </main>
  );
}
