"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { useRouter } from "next/navigation";

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
  PanelLeftClose,
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
  MoreHorizontal,
  FolderPlus,
  Share2,
  Upload,
  Paperclip,
  FileText,
  Code2,
  Globe,
  BrainCircuit,
  Terminal,
  Palette,
  Bookmark,
  Layers3,
  RotateCcw,
  Download,
  Bell,
  BookmarkPlus,
  ArrowUp,
} from "lucide-react";

import { createClient } from "@supabase/supabase-js";

import ReactMarkdown from "react-markdown";

import remarkGfm from "remark-gfm";

import rehypeKatex from "rehype-katex";

import "katex/dist/katex.min.css";

import {
  Prism as SyntaxHighlighter,
} from "react-syntax-highlighter";

import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

import { Aptos } from "next/font/google";

const aptos = Aptos({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Role = "user" | "assistant";

type Attachment = {
  id: number;
  name: string;
  type: string;
};

type Message = {
  id: number;
  role: Role;
  text: string;
  time?: string;
  attachments?: Attachment[];
};

type Chat = {
  id: number;
  title: string;
  pinned?: boolean;
  messages: Message[];
};

type Project = {
  id: number;
  name: string;
};

export default function LuminaUltra() {
  const router = useRouter();

  const bottomRef =
    useRef<HTMLDivElement>(null);

  const fileInputRef =
    useRef<HTMLInputElement>(null);

  const textareaRef =
    useRef<HTMLTextAreaElement>(null);

  const [loading, setLoading] =
    useState(true);

  const [user, setUser] =
    useState<any>(null);

  const [sidebar, setSidebar] =
    useState(false);

  const [settingsOpen, setSettingsOpen] =
    useState(false);

  const [accountOpen, setAccountOpen] =
    useState(false);

  const [menuOpen, setMenuOpen] =
    useState(false);

  const [typing, setTyping] =
    useState(false);

  const [popup, setPopup] =
    useState("");

  const [input, setInput] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [darkMode, setDarkMode] =
    useState(true);

  const [compactMode, setCompactMode] =
    useState(false);

  const [online, setOnline] =
    useState(true);

  const [glowEffects, setGlowEffects] =
    useState(true);

  const [currentChat, setCurrentChat] =
    useState(0);

  const [attachments, setAttachments] =
    useState<Attachment[]>([]);

  const [projects, setProjects] =
    useState<Project[]>([
      {
        id: 1,
        name: "Thinksy AI",
      },
      {
        id: 2,
        name: "Research",
      },
      {
        id: 3,
        name: "Code Lab",
      },
    ]);

  const [chats, setChats] =
    useState<Chat[]>([
      {
        id: 1,
        title: "Welcome",
        pinned: true,
        messages: [],
      },
    ]);

  useEffect(() => {
    async function checkUser() {
      const {
        data: { session },
      } =
        await supabase.auth.getSession();

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
    } =
      supabase.auth.onAuthStateChange(
        (_event, session) => {
          if (!session) {
            router.push("/login");
          } else {
            setUser(session.user);
          }
        }
      );

    return () =>
      subscription.unsubscribe();
  }, [router]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [typing, chats]);

  useEffect(() => {
    const updateOnline = () => {
      setOnline(navigator.onLine);
    };

    updateOnline();

    window.addEventListener(
      "online",
      updateOnline
    );

    window.addEventListener(
      "offline",
      updateOnline
    );

    return () => {
      window.removeEventListener(
        "online",
        updateOnline
      );

      window.removeEventListener(
        "offline",
        updateOnline
      );
    };
  }, []);

  useEffect(() => {
    const handlePaste = (
      e: ClipboardEvent
    ) => {
      const items =
        e.clipboardData?.items;

      if (!items) return;

      for (const item of items) {
        if (
          item.type.startsWith("image/")
        ) {
          const file =
            item.getAsFile();

          if (file) {
            const imageAttachment = {
              id: Date.now(),
              name: file.name || "Image",
              type: "image",
            };

            setAttachments((prev) => [
              ...prev,
              imageAttachment,
            ]);

            toast(
              "Image pasted successfully"
            );
          }
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
      (chat) => chat.id !== id
    );

    if (filtered.length === 0) {
      setChats([
        {
          id: 1,
          title: "Welcome",
          messages: [],
        },
      ]);

      setCurrentChat(0);
    } else {
      setChats(filtered);
      setCurrentChat(0);
    }

    toast("Chat deleted");
  }

  function copyText(text: string) {
    navigator.clipboard.writeText(text);

    toast("Copied");
  }

  function speak(text: string) {
    const utterance =
      new SpeechSynthesisUtterance(
        text
      );

    speechSynthesis.speak(
      utterance
    );

    toast("Reading response");
  }

  async function logout() {
    await supabase.auth.signOut();

    router.push("/login");
  }

  async function sendMessage() {
    if (
      !input.trim() &&
      attachments.length === 0
    )
      return;

    const userText = input;

    const userMessage: Message = {
      id: Date.now(),
      role: "user",
      text: userText,
      time: getTime(),
      attachments,
    };

    const updatedChats = [...chats];

    updatedChats[currentChat].messages.push(
      userMessage
    );

    if (
      updatedChats[currentChat].title ===
        "New Chat" ||
      updatedChats[currentChat].title ===
        "Welcome"
    ) {
      updatedChats[currentChat].title =
        userText.slice(0, 28);
    }

    setChats(updatedChats);

    setInput("");

    setAttachments([]);

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
            message: userText,
          }),
        }
      );

      const data =
        await res.json();

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
        text:
          "Connection failed.",
        time: getTime(),
      });

      setChats([...updatedChats]);
    }

    setTyping(false);
  }

  const filteredChats = useMemo(() => {
    return chats.filter((chat) =>
      chat.title
        .toLowerCase()
        .includes(search.toLowerCase())
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
      className={`${aptos.className} app ${
        darkMode
          ? "dark"
          : "light"
      }`}
    >
      {glowEffects && (
        <>
          <div className="glow glow1" />
          <div className="glow glow2" />
        </>
      )}

      <div className="bgWord">
        LUMINA
      </div>

      <aside
        className={`sidebar ${
          sidebar ? "show" : ""
        }`}
      >
        <div className="sideTop">
          <div className="logo">
            <Sparkles size={18} />
            <span>
              Lumina Ultra
            </span>
          </div>

          <button
            className="mobileClose"
            onClick={() =>
              setSidebar(false)
            }
          >
            <X size={18} />
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

        <div className="projects">
          <div className="sectionTitle">
            <span>
              Projects
            </span>

            <button>
              <Plus size={14} />
            </button>
          </div>

          {projects.map((project) => (
            <div
              className="projectCard"
              key={project.id}
            >
              <FolderPlus size={16} />
              {project.name}
            </div>
          ))}
        </div>

        <div className="quickTools">
          <div className="toolCard">
            <Bot size={18} />
            Smart AI
          </div>

          <div className="toolCard">
            <Shield size={18} />
            Secure
          </div>

          <div className="toolCard">
            <Code2 size={18} />
            Coding
          </div>

          <div className="toolCard">
            <BrainCircuit
              size={18}
            />
            Research
          </div>

          <div className="toolCard">
            <Palette size={18} />
            Design
          </div>

          <div className="toolCard">
            <Globe size={18} />
            Web Search
          </div>
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
                    const realIndex =
                      chats.findIndex(
                        (c) =>
                          c.id ===
                          chat.id
                      );

                    setCurrentChat(
                      realIndex
                    );

                    setSidebar(false);
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
                  className="deleteMini"
                  onClick={() =>
                    deleteChat(
                      chat.id
                    )
                  }
                >
                  <Trash2 size={14} />
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
              setSidebar(true)
            }
          >
            <Menu size={18} />
          </button>

          <div className="centerBrand">
            <span>
              Lumina Ultra
            </span>

            <div
              className={`status ${
                online
                  ? "online"
                  : "offline"
              }`}
            >
              {online
                ? "Online"
                : "Offline"}
            </div>
          </div>

          <div className="topActions">
            <button
              className="circleBtn"
              onClick={createChat}
            >
              <PenSquare
                size={18}
              />
            </button>

            <button
              className="circleBtn"
              onClick={() =>
                setMenuOpen(
                  !menuOpen
                )
              }
            >
              <MoreHorizontal
                size={18}
              />
            </button>

            {menuOpen && (
              <div className="menuPopup">
                <button
                  onClick={() =>
                    fileInputRef.current?.click()
                  }
                >
                  <Upload
                    size={16}
                  />
                  Upload File
                </button>

                <button>
                  <FolderPlus
                    size={16}
                  />
                  Add To Project
                </button>

                <button>
                  <Share2
                    size={16}
                  />
                  Share Chat
                </button>

                <button>
                  <BookmarkPlus
                    size={16}
                  />
                  Save
                </button>

                <button>
                  <Download
                    size={16}
                  />
                  Export
                </button>

                <button
                  onClick={() =>
                    deleteChat(
                      chats[
                        currentChat
                      ].id
                    )
                  }
                >
                  <Trash2
                    size={16}
                  />
                  Delete Chat
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
              <Stars size={16} />
              AI Workspace
            </div>

            <h1>
              Build.
              <br />
              Create.
              <br />
              Think.
            </h1>

            <p>
              Premium AI for coding,
              learning, research,
              writing, mathematics,
              productivity and
              creative work.
            </p>

            <div className="heroGrid">
              <div className="heroCard">
                <Terminal
                  size={22}
                />
                <h3>
                  Coding
                </h3>

                <span>
                  Syntax
                  highlighting &
                  markdown
                </span>
              </div>

              <div className="heroCard">
                <BrainCircuit
                  size={22}
                />
                <h3>
                  Smart AI
                </h3>

                <span>
                  Fast reasoning &
                  detailed answers
                </span>
              </div>

              <div className="heroCard">
                <ImageIcon
                  size={22}
                />
                <h3>
                  Vision
                </h3>

                <span>
                  Upload and paste
                  images
                </span>
              </div>

              <div className="heroCard">
                <FileText
                  size={22}
                />
                <h3>
                  Documents
                </h3>

                <span>
                  Project workspace
                  support
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="chatArea">
          {chats[currentChat]?.messages.map(
            (msg) => (
              <div
                key={msg.id}
                className={`msg ${
                  msg.role ===
                  "user"
                    ? "user"
                    : "ai"
                }`}
              >
                <div className="msgTop">
                  <div className="msgUser">
                    {msg.role ===
                    "assistant" ? (
                      <>
                        <Bot
                          size={16}
                        />
                        Lumina
                      </>
                    ) : (
                      <>
                        <User
                          size={16}
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

                {msg.attachments &&
                  msg.attachments
                    .length >
                    0 && (
                    <div className="attachmentWrap">
                      {msg.attachments.map(
                        (
                          file
                        ) => (
                          <div
                            key={
                              file.id
                            }
                            className="attachmentCard"
                          >
                            <Paperclip
                              size={
                                14
                              }
                            />
                            {
                              file.name
                            }
                          </div>
                        )
                      )}
                    </div>
                  )}

                <div className="msgText markdown">
                  <ReactMarkdown
                    remarkPlugins={[
                      remarkGfm,
                    ]}
                    rehypePlugins={[
                      rehypeKatex,
                    ]}
                    components={{
                      code({
                        inline,
                        className,
                        children,
                        ...props
                      }: any) {
                        const match =
                          /language-(\w+)/.exec(
                            className ||
                              ""
                          );

                        return !inline ? (
                          <SyntaxHighlighter
                            style={
                              vscDarkPlus
                            }
                            language={
                              match?.[1] ||
                              "tsx"
                            }
                            PreTag="div"
                            {...props}
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
                        size={15}
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
                        size={15}
                      />
                    </button>

                    <button>
                      <Bookmark
                        size={15}
                      />
                    </button>

                    <button>
                      <RotateCcw
                        size={15}
                      />
                    </button>

                    <button>
                      <ThumbsUp
                        size={15}
                      />
                    </button>

                    <button>
                      <ThumbsDown
                        size={15}
                      />
                    </button>
                  </div>
                )}
              </div>
            )
          )}

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
          {attachments.length >
            0 && (
            <div className="attachmentPreview">
              {attachments.map(
                (file) => (
                  <div
                    key={file.id}
                    className="attachmentChip"
                  >
                    <FileText
                      size={14}
                    />
                    {file.name}

                    <button
                      onClick={() =>
                        setAttachments(
                          (
                            prev
                          ) =>
                            prev.filter(
                              (
                                f
                              ) =>
                                f.id !==
                                file.id
                            )
                        )
                      }
                    >
                      <X
                        size={12}
                      />
                    </button>
                  </div>
                )
              )}
            </div>
          )}

          <div className="inputBox">
            <textarea
              ref={textareaRef}
              placeholder="Message Lumina Ultra..."
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
              <button
                className="miniBtn"
                onClick={() =>
                  fileInputRef.current?.click()
                }
              >
                <Paperclip
                  size={17}
                />
              </button>

              <button className="miniBtn">
                <Mic size={17} />
              </button>

              <button
                className="miniBtn"
                onClick={() =>
                  fileInputRef.current?.click()
                }
              >
                <ImageIcon
                  size={17}
                />
              </button>

              <button
                className="sendBtn"
                onClick={sendMessage}
              >
                <ArrowUp
                  size={18}
                />
              </button>
            </div>
          </div>

          <div className="inputFooter">
            <span>
              Lumina Ultra
            </span>

            <ChevronRight
              size={14}
            />

            <span>
              Markdown • Latex •
              AI Workspace
            </span>
          </div>
        </div>
      </section>

      <input
        ref={fileInputRef}
        type="file"
        hidden
        multiple
        onChange={(e) => {
          const files =
            e.target.files;

          if (!files) return;

          const mapped =
            Array.from(files).map(
              (file) => ({
                id: Date.now() +
                  Math.random(),
                name: file.name,
                type: file.type,
              })
            );

          setAttachments(
            (prev) => [
              ...prev,
              ...mapped,
            ]
          );

          toast(
            `${files.length} file(s) added`
          );
        }}
      />

      <style jsx global>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        html,
        body {
          background: black;
          color: white;
          overflow-x: hidden;
        }

        body {
          font-family: Aptos,
            sans-serif;
        }

        .app {
          min-height: 100vh;
          display: flex;
          position: relative;
          overflow: hidden;
        }

        .dark {
          background: #000;
          color: white;
        }

        .bgWord {
          position: fixed;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18vw;
          opacity: 0.03;
          font-weight: 900;
          pointer-events: none;
        }

        .sidebar {
          width: 300px;
          background: rgba(
            8,
            8,
            8,
            0.96
          );
          border-right: 1px solid
            #1b1b1b;
          padding: 18px;
          display: flex;
          flex-direction: column;
          z-index: 10;
        }

        .main {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .topbar {
          height: 72px;
          border-bottom: 1px solid
            #111;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 18px;
          backdrop-filter: blur(12px);
        }

        .chatArea {
          flex: 1;
          overflow-y: auto;
          padding: 24px 24px 180px;
        }

        .msg {
          max-width: 900px;
          padding: 22px;
          border-radius: 28px;
          margin-bottom: 18px;
        }

        .msg.ai {
          background: #0b0b0b;
          border: 1px solid #1c1c1c;
        }

        .msg.user {
          background: white;
          color: black;
          margin-left: auto;
        }

        .markdown pre {
          border-radius: 18px;
          overflow: hidden;
          margin-top: 16px;
          border: 1px solid #222;
        }

        .markdown code {
          font-family: monospace;
        }

        .inputWrap {
          position: fixed;
          bottom: 0;
          left: 300px;
          right: 0;
          padding: 18px;
          background: linear-gradient(
            to top,
            rgba(0, 0, 0, 0.96),
            transparent
          );
          backdrop-filter: blur(20px);
        }

        .inputBox {
          max-width: 1000px;
          margin: auto;
          min-height: 74px;
          border-radius: 28px;
          background: #0a0a0a;
          border: 1px solid #1d1d1d;
          display: flex;
          align-items: flex-end;
          padding: 14px;
          gap: 12px;
        }

        .inputBox textarea {
          flex: 1;
          background: transparent;
          border: none;
          resize: none;
          outline: none;
          color: white;
          font-size: 16px;
          min-height: 40px;
          max-height: 200px;
        }

        .inputButtons {
          display: flex;
          gap: 10px;
        }

        .miniBtn,
        .sendBtn {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .miniBtn {
          background: #111;
          color: white;
        }

        .sendBtn {
          background: white;
          color: black;
        }

        .hero {
          padding: 60px 28px;
        }

        .hero h1 {
          font-size: 72px;
          line-height: 1;
          font-weight: 900;
        }

        .heroGrid {
          display: grid;
          grid-template-columns: repeat(
            2,
            1fr
          );
          gap: 16px;
          margin-top: 34px;
          max-width: 820px;
        }

        .heroCard {
          min-height: 140px;
          border-radius: 24px;
          border: 1px solid #1c1c1c;
          background: #0d0d0d;
          padding: 22px;
        }

        @media (max-width: 900px) {
          .sidebar {
            position: fixed;
            left: -100%;
          }

          .sidebar.show {
            left: 0;
          }

          .inputWrap {
            left: 0;
          }

          .heroGrid {
            grid-template-columns: 1fr;
          }

          .hero h1 {
            font-size: 48px;
          }
        }
      `}</style>
    </main>
  );
}
