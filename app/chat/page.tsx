// app/chat/page.tsx

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
  Paperclip,
  Globe,
  Brain,
  RefreshCw,
  Bookmark,
  Command,
  Download,
  Share2,
  ArrowDown,
  StopCircle,
  MoreHorizontal,
} from "lucide-react";

import { createClient } from "@supabase/supabase-js";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter }
from "react-syntax-highlighter";

import { oneDark }
from "react-syntax-highlighter/dist/esm/styles/prism";
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Role =
  | "user"
  | "assistant"
  | "system";

type Message = {
  id: number;
  role: Role;
  text: string;
  time?: string;
  bookmarked?: boolean;
  loading?: boolean;
};

type Chat = {
  id: number;
  title: string;
  pinned?: boolean;
  model?: string;
  messages: Message[];
};

const models = [
  "GPT-4.1",
  "Claude Sonnet",
  "Gemini 2.5",
  "DeepSeek",
  "Mistral",
];

export default function LuminaUltraX() {
  const router = useRouter();

  const bottomRef =
    useRef<HTMLDivElement>(null);

  const textareaRef =
    useRef<HTMLTextAreaElement>(null);

  const abortRef =
    useRef<AbortController | null>(
      null
    );

  const [loading, setLoading] =
    useState(true);

  const [user, setUser] =
    useState<any>(null);

  const [sidebar, setSidebar] =
    useState(false);

  const [settingsOpen,
    setSettingsOpen] =
    useState(false);

  const [accountOpen,
    setAccountOpen] =
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

  const [glowEffects,
    setGlowEffects] =
    useState(true);

  const [compactMode,
    setCompactMode] =
    useState(false);

  const [online, setOnline] =
    useState(true);

  const [currentChatId,
    setCurrentChatId] =
    useState<number>(1);

  const [streaming,
    setStreaming] =
    useState(false);

  const [webMode, setWebMode] =
    useState(true);

  const [voiceMode,
    setVoiceMode] =
    useState(false);

  const [selectedModel,
    setSelectedModel] =
    useState("GPT-4.1");

  const [showScroll,
    setShowScroll] =
    useState(false);

  const [chats, setChats] =
    useState<Chat[]>([
      {
        id: 1,
        title: "Lumina Ultra",
        pinned: true,
        model: "GPT-4.1",
        messages: [],
      },
    ]);

  const currentChat = useMemo(() => {
    return chats.find(
      (c) => c.id === currentChatId
    );
  }, [chats, currentChatId]);

  useEffect(() => {
    async function init() {
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

    init();
  }, [router]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [chats, typing]);

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
    const handleScroll = () => {
      setShowScroll(
        window.scrollY > 300
      );
    };

    window.addEventListener(
      "scroll",
      handleScroll
    );

    return () =>
      window.removeEventListener(
        "scroll",
        handleScroll
      );
  }, []);

  useEffect(() => {
    if (!textareaRef.current) return;

    textareaRef.current.style.height =
      "0px";

    textareaRef.current.style.height =
      textareaRef.current.scrollHeight +
      "px";
  }, [input]);

  function toast(text: string) {
    setPopup(text);

    setTimeout(() => {
      setPopup("");
    }, 2400);
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
      pinned: false,
      model: selectedModel,
      messages: [],
    };

    setChats((prev) => [
      newChat,
      ...prev,
    ]);

    setCurrentChatId(newChat.id);

    toast("New chat created");
  }

  function updateChat(
    chatId: number,
    updater: (chat: Chat) => Chat
  ) {
    setChats((prev) =>
      prev.map((chat) =>
        chat.id === chatId
          ? updater(chat)
          : chat
      )
    );
  }

  async function sendMessage() {
    if (!input.trim()) return;

    if (!currentChat) return;

    const userMessage: Message = {
      id: Date.now(),
      role: "user",
      text: input,
      time: getTime(),
    };

    const aiId = Date.now() + 1;

    const aiMessage: Message = {
      id: aiId,
      role: "assistant",
      text: "",
      time: getTime(),
      loading: true,
    };

    updateChat(currentChat.id, (chat) => ({
      ...chat,
      title:
        chat.title === "New Chat"
          ? input.slice(0, 32)
          : chat.title,
      messages: [
        ...chat.messages,
        userMessage,
        aiMessage,
      ],
    }));

    const prompt = input;

    setInput("");

    setTyping(true);

    setStreaming(true);

    const controller =
      new AbortController();

    abortRef.current = controller;

    try {
      const res = await fetch(
        "/api/chat",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          signal: controller.signal,
          body: JSON.stringify({
            message: prompt,
            model: selectedModel,
            webMode,
          }),
        }
      );

      const reader =
        res.body?.getReader();

      const decoder =
        new TextDecoder();

      let done = false;

      let fullText = "";

      while (!done) {
        const result =
          await reader?.read();

        done = !!result?.done;

        const chunk =
          decoder.decode(
            result?.value || new Uint8Array()
          );

        fullText += chunk;

        updateChat(
          currentChat.id,
          (chat) => ({
            ...chat,
            messages:
              chat.messages.map((m) =>
                m.id === aiId
                  ? {
                      ...m,
                      text: fullText,
                      loading: false,
                    }
                  : m
              ),
          })
        );
      }
    } catch {
      updateChat(currentChat.id, (chat) => ({
        ...chat,
        messages: chat.messages.map((m) =>
          m.id === aiId
            ? {
                ...m,
                text: "Generation stopped or failed.",
                loading: false,
              }
            : m
        ),
      }));
    }

    setTyping(false);

    setStreaming(false);
  }

  function stopGeneration() {
    abortRef.current?.abort();

    setStreaming(false);

    setTyping(false);

    toast("Generation stopped");
  }

  function deleteChat(id: number) {
    const filtered = chats.filter(
      (c) => c.id !== id
    );

    setChats(filtered);

    if (filtered.length > 0) {
      setCurrentChatId(filtered[0].id);
    }

    toast("Chat deleted");
  }

  function copyText(text: string) {
    navigator.clipboard.writeText(text);

    toast("Copied");
  }

  function speak(text: string) {
    const utterance =
      new SpeechSynthesisUtterance(text);

    speechSynthesis.speak(utterance);

    toast("Reading...");
  }

  function startVoice() {
    const SpeechRecognition =
      (window as any)
        .SpeechRecognition ||
      (window as any)
        .webkitSpeechRecognition;

    if (!SpeechRecognition) {
      toast("Voice unsupported");
      return;
    }

    const recognition =
      new SpeechRecognition();

    recognition.lang = "en-US";

    recognition.start();

    recognition.onresult = (
      e: any
    ) => {
      const transcript =
        e.results[0][0].transcript;

      setInput(transcript);

      toast("Voice captured");
    };
  }

  function bookmarkMessage(
    msgId: number
  ) {
    if (!currentChat) return;

    updateChat(currentChat.id, (chat) => ({
      ...chat,
      messages: chat.messages.map((m) =>
        m.id === msgId
          ? {
              ...m,
              bookmarked: !m.bookmarked,
            }
          : m
      ),
    }));

    toast("Bookmarked");
  }

  function regenerate(msg: Message) {
    setInput(msg.text);

    toast("Prompt restored");
  }

  async function logout() {
    await supabase.auth.signOut();

    router.push("/login");
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
      className={`app ${
        darkMode ? "dark" : "light"
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

      {/* SIDEBAR */}

      <aside
        className={`sidebar ${
          sidebar ? "show" : ""
        }`}
      >
        <div className="sideTop">
          <div className="logo">
            <Sparkles size={18} />
            <span>Lumina Ultra X</span>
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
              setSearch(e.target.value)
            }
          />
        </div>

        <div className="quickTools">
          <div className="toolCard">
            <Brain size={18} />
            Reasoning
          </div>

          <div className="toolCard">
            <Globe size={18} />
            Web Search
          </div>

          <div className="toolCard">
            <ImageIcon size={18} />
            Vision AI
          </div>

          <div className="toolCard">
            <Mic size={18} />
            Voice Mode
          </div>
        </div>

        <div className="modelSelector">
          {models.map((model) => (
            <button
              key={model}
              className={`modelBtn ${
                selectedModel === model
                  ? "activeModel"
                  : ""
              }`}
              onClick={() =>
                setSelectedModel(model)
              }
            >
              {model}
            </button>
          ))}
        </div>

        <div className="history">
          {filteredChats.map((chat) => (
            <div
              key={chat.id}
              className={`historyItem ${
                currentChatId ===
                chat.id
                  ? "active"
                  : ""
              }`}
            >
              <button
                className="historySelect"
                onClick={() => {
                  setCurrentChatId(
                    chat.id
                  );

                  setSidebar(false);
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
                className="deleteMini"
                onClick={() =>
                  deleteChat(chat.id)
                }
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>

        <div className="sideBottom">
          <button
            className="sideBtn"
            onClick={() =>
              setSettingsOpen(true)
            }
          >
            <Settings size={18} />
            Settings
          </button>

          <button
            className="sideBtn"
            onClick={() =>
              setAccountOpen(true)
            }
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
            className="circleBtn"
            onClick={() =>
              setSidebar(true)
            }
          >
            <Menu size={20} />
          </button>

          <div className="centerBrand">
            <span>
              Lumina Ultra X
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

          <div className="topRight">
            <button
              className={`circleBtn ${
                webMode
                  ? "enabled"
                  : ""
              }`}
              onClick={() =>
                setWebMode(!webMode)
              }
            >
              <Globe size={18} />
            </button>

            <button
              className={`circleBtn ${
                voiceMode
                  ? "enabled"
                  : ""
              }`}
              onClick={() =>
                setVoiceMode(
                  !voiceMode
                )
              }
            >
              <Mic size={18} />
            </button>

            <button
              className="circleBtn"
              onClick={createChat}
            >
              <PenSquare size={18} />
            </button>
          </div>
        </header>

        {currentChat?.messages.length ===
          0 && (
          <div className="hero">
            <div className="heroBadge">
              <Stars size={16} />
              Lumina Ultra Intelligence
            </div>

            <h1>
              Think smarter.
              <br />
              Create faster.
            </h1>

            <p>
              Streaming AI, memory,
              vision, voice, reasoning,
              coding, creativity and
              intelligent conversations.
            </p>

            <div className="heroGrid">
              <div className="heroCard">
                <Zap size={22} />
                <h3>Streaming</h3>
                <span>
                  Real-time AI responses
                </span>
              </div>

              <div className="heroCard">
                <Brain size={22} />
                <h3>Reasoning</h3>
                <span>
                  Advanced intelligence
                </span>
              </div>

              <div className="heroCard">
                <ImageIcon size={22} />
                <h3>Vision</h3>
                <span>
                  Analyze images
                </span>
              </div>

              <div className="heroCard">
                <Globe size={22} />
                <h3>Web AI</h3>
                <span>
                  Live information
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="chatArea">
          {currentChat?.messages.map(
            (msg) => (
              <div
                key={msg.id}
                className={`msg ${
                  msg.role === "user"
                    ? "user"
                    : "ai"
                } ${
                  compactMode
                    ? "compact"
                    : ""
                }`}
              >
                <div className="msgTop">
                  <div className="msgUser">
                    {msg.role ===
                    "assistant" ? (
                      <>
                        <Bot size={16} />
                        Lumina
                      </>
                    ) : (
                      <>
                        <User size={16} />
                        You
                      </>
                    )}
                  </div>

                  <div className="msgTime">
                    <Clock3 size={12} />
                    {msg.time}
                  </div>
                </div>

                <div className="msgText">
                  <ReactMarkdown
                    remarkPlugins={[
                      remarkGfm,
                    ]}
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
                      <Copy size={15} />
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

                    <button
                      onClick={() =>
                        bookmarkMessage(
                          msg.id
                        )
                      }
                    >
                      <Bookmark
                        size={15}
                      />
                    </button>

                    <button
                      onClick={() =>
                        regenerate(msg)
                      }
                    >
                      <RefreshCw
                        size={15}
                      />
                    </button>

                    <button>
                      <Share2
                        size={15}
                      />
                    </button>

                    <button>
                      <Download
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

                    <button>
                      <MoreHorizontal
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

        {/* INPUT */}

        <div className="inputWrap">
          <div className="inputBox">
            <textarea
              ref={textareaRef}
              placeholder="Ask Lumina anything..."
              value={input}
              rows={1}
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

            <div className="inputButtons">
              <button
                className="miniBtn"
                onClick={startVoice}
              >
                <Mic size={18} />
              </button>

              <button className="miniBtn">
                <Paperclip
                  size={18}
                />
              </button>

              <button className="miniBtn">
                <ImageIcon
                  size={18}
                />
              </button>

              {streaming ? (
                <button
                  className="stopBtn"
                  onClick={
                    stopGeneration
                  }
                >
                  <StopCircle
                    size={18}
                  />
                </button>
              ) : (
                <button
                  className="sendBtn"
                  onClick={sendMessage}
                >
                  <Send size={18} />
                </button>
              )}
            </div>
          </div>

          <div className="inputFooter">
            <span>
              {selectedModel}
            </span>

            <ChevronRight size={14} />

            <span>
              Secure • Streaming •
              Smart
            </span>
          </div>
        </div>
      </section>

      {/* SETTINGS */}

      {settingsOpen && (
        <div className="overlay">
          <div className="panel">
            <div className="panelTop">
              <h2>Settings</h2>

              <button
                onClick={() =>
                  setSettingsOpen(false)
                }
              >
                <X size={18} />
              </button>
            </div>

            <div className="setting">
              <div>
                <h3>Dark Mode</h3>
                <p>
                  Futuristic dark UI
                </p>
              </div>

              <button
                className="toggle"
                onClick={() =>
                  setDarkMode(
                    !darkMode
                  )
                }
              >
                {darkMode ? (
                  <Moon size={16} />
                ) : (
                  <Sun size={16} />
                )}
              </button>
            </div>

            <div className="setting">
              <div>
                <h3>Glow Effects</h3>
                <p>
                  Visual ambient glow
                </p>
              </div>

              <button
                className="toggle"
                onClick={() =>
                  setGlowEffects(
                    !glowEffects
                  )
                }
              >
                <Sparkles
                  size={16}
                />
              </button>
            </div>

            <div className="setting">
              <div>
                <h3>Compact Mode</h3>
                <p>
                  Smaller message layout
                </p>
              </div>

              <button
                className="toggle"
                onClick={() =>
                  setCompactMode(
                    !compactMode
                  )
                }
              >
                <PanelLeftClose
                  size={16}
                />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ACCOUNT */}

      {accountOpen && (
        <div className="overlay">
          <div className="panel">
            <div className="panelTop">
              <h2>Account</h2>

              <button
                onClick={() =>
                  setAccountOpen(false)
                }
              >
                <X size={18} />
              </button>
            </div>

            <div className="profile">
              <div className="avatar">
                {user?.email?.[0]}
              </div>

              <div>
                <h3>
                  {user?.email}
                </h3>

                <p>
                  Lumina Ultra+
                </p>
              </div>
            </div>

            <button className="panelBtn premium">
              <Crown size={18} />
              Upgrade Ultra Max
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

      {/* TOAST */}

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

        html,
        body {
          width: 100%;
          overflow-x: hidden;
          font-family: Inter,
            sans-serif;
        }

        body {
          background: #000;
        }

        .app {
          width: 100%;
          min-height: 100vh;
          display: flex;
          background: #000;
          color: white;
        }

        .dark {
          background: #000;
          color: white;
        }

        .light {
          background: #f5f5f5;
          color: black;
        }

        .sidebar {
          width: 310px;
          background: rgba(
            10,
            10,
            10,
            0.92
          );
          border-right: 1px solid
            #1c1c1c;
          padding: 18px;
          display: flex;
          flex-direction: column;
          z-index: 50;
        }

        .main {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-width: 0;
        }

        .chatArea {
          flex: 1;
          overflow-y: auto;
          padding: 24px 24px 180px;
        }

        .msg {
          max-width: 900px;
          border-radius: 26px;
          padding: 22px;
          margin-bottom: 20px;
          animation: fade 0.2s ease;
        }

        .msg.ai {
          background: #0d0d0d;
          border: 1px solid #1d1d1d;
        }

        .msg.user {
          margin-left: auto;
          background: white;
          color: black;
        }

        .msgText {
          line-height: 1.8;
        }

        .msgText pre {
          overflow-x: auto;
          background: #050505;
          padding: 18px;
          border-radius: 16px;
          margin-top: 16px;
        }

        .msgText code {
          font-family: monospace;
        }

        .inputWrap {
          position: fixed;
          bottom: 0;
          left: 310px;
          right: 0;
          padding: 18px;
          background: linear-gradient(
            to top,
            rgba(0, 0, 0, 0.96),
            transparent
          );
          backdrop-filter: blur(16px);
        }

        .inputBox {
          max-width: 980px;
          margin: auto;
          min-height: 76px;
          border-radius: 28px;
          border: 1px solid #1d1d1d;
          background: rgba(
            10,
            10,
            10,
            0.96
          );
          display: flex;
          align-items: flex-end;
          padding: 16px;
          gap: 12px;
        }

        textarea {
          flex: 1;
          background: transparent;
          border: none;
          resize: none;
          color: white;
          outline: none;
          font-size: 16px;
          max-height: 220px;
        }

        .inputButtons {
          display: flex;
          gap: 10px;
        }

        .miniBtn,
        .sendBtn,
        .stopBtn,
        .circleBtn {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          border: none;
          background: #111;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .sendBtn {
          background: white;
          color: black;
        }

        .stopBtn {
          background: #450d0d;
        }

        .topbar {
          height: 74px;
          border-bottom: 1px solid
            #111;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 18px;
        }

        .typing {
          display: flex;
          gap: 8px;
          padding: 10px;
        }

        .typing span {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: white;
          animation: bounce 1s infinite;
        }

        .toast {
          position: fixed;
          bottom: 24px;
          left: 50%;
          transform: translateX(-50%);
          background: white;
          color: black;
          padding: 14px 24px;
          border-radius: 999px;
          font-weight: 700;
          z-index: 999;
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
          border: 6px solid #222;
          border-top: 6px solid white;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes bounce {
          50% {
            transform: translateY(-6px);
          }
        }

        @keyframes fade {
          from {
            opacity: 0;
            transform: translateY(8px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 900px) {
          .sidebar {
            position: fixed;
            left: -100%;
            top: 0;
            bottom: 0;
            transition: 0.3s;
          }

          .sidebar.show {
            left: 0;
          }

          .inputWrap {
            left: 0;
          }

          .msg {
            max-width: 100%;
          }
        }
      `}</style>
    </main>
  );
}
