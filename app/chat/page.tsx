// app/chat/page.tsx

"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  ChangeEvent,
} from "react";

import Image from "next/image";
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
  FileText,
  Download,
  RefreshCcw,
  Paperclip,
  Maximize2,
  Minimize2,
  Palette,
  Brain,
  Globe,
  Code2,
  CheckCheck,
} from "lucide-react";

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Role = "user" | "assistant";

type Attachment = {
  id: number;
  type: "image" | "pdf";
  name: string;
  url: string;
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
  messages: Message[];
};

export default function LuminaUltra() {
  const router = useRouter();

  const bottomRef = useRef<HTMLDivElement>(null);

  const imageInputRef =
    useRef<HTMLInputElement>(null);

  const pdfInputRef =
    useRef<HTMLInputElement>(null);

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

  const [voiceOpen, setVoiceOpen] =
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

  const [glowEffects, setGlowEffects] =
    useState(true);

  const [compactMode, setCompactMode] =
    useState(false);

  const [online, setOnline] =
    useState(true);

  const [fullscreen, setFullscreen] =
    useState(false);

  const [autoSpeak, setAutoSpeak] =
    useState(false);

  const [gradientUI, setGradientUI] =
    useState(true);

  const [currentChat, setCurrentChat] =
    useState(0);

  const [attachments, setAttachments] =
    useState<Attachment[]>([]);

  const [chats, setChats] = useState<
    Chat[]
  >([
    {
      id: 1,
      title: "Welcome",
      messages: [],
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
    } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!session) {
          router.push("/login");
        } else {
          setUser(session.user);
        }
      }
    );

    return () => subscription.unsubscribe();
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

  function toast(text: string) {
    setPopup(text);

    setTimeout(() => {
      setPopup("");
    }, 2200);
  }

  function getTime() {
    return new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function createChat() {
    const newChat: Chat = {
      id: Date.now(),
      title: "New Chat",
      messages: [],
    };

    setChats((prev) => [newChat, ...prev]);

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
    } else {
      setChats(filtered);
    }

    setCurrentChat(0);

    toast("Chat deleted");
  }

  function copyText(text: string) {
    navigator.clipboard.writeText(text);

    toast("Copied");
  }

  function react(type: "up" | "down") {
    toast(
      type === "up"
        ? "Feedback saved"
        : "Improvement noted"
    );
  }

  function speak(text: string) {
    const utterance =
      new SpeechSynthesisUtterance(text);

    utterance.rate = 1;

    speechSynthesis.speak(utterance);

    toast("Reading response");
  }

  async function logout() {
    await supabase.auth.signOut();

    router.push("/login");
  }

  function handleFiles(
    e: ChangeEvent<HTMLInputElement>,
    type: "image" | "pdf"
  ) {
    const files = e.target.files;

    if (!files) return;

    const newFiles: Attachment[] =
      Array.from(files).map((file) => ({
        id: Date.now() + Math.random(),
        type,
        name: file.name,
        url: URL.createObjectURL(file),
      }));

    setAttachments((prev) => [
      ...prev,
      ...newFiles,
    ]);

    toast(
      `${newFiles.length} file added`
    );
  }

  function removeAttachment(id: number) {
    setAttachments((prev) =>
      prev.filter((a) => a.id !== id)
    );
  }

  async function sendMessage() {
    if (
      !input.trim() &&
      attachments.length === 0
    )
      return;

    const userMessage: Message = {
      id: Date.now(),
      role: "user",
      text: input,
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
        input.slice(0, 28) || "Files";
    }

    setChats(updatedChats);

    const currentInput = input;

    setInput("");
    setAttachments([]);
    setTyping(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          message: currentInput,
        }),
      });

      const data = await res.json();

      const aiMessage: Message = {
        id: Date.now() + 1,
        role: "assistant",
        text:
          data.reply ||
          "Lumina AI response unavailable.",
        time: getTime(),
      };

      updatedChats[currentChat].messages.push(
        aiMessage
      );

      setChats([...updatedChats]);

      if (autoSpeak) {
        speak(aiMessage.text);
      }
    } catch {
      updatedChats[currentChat].messages.push({
        id: Date.now() + 2,
        role: "assistant",
        text: "Connection failed.",
        time: getTime(),
      });

      setChats([...updatedChats]);
    }

    setTyping(false);
  }

  function startVoice() {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any)
        .webkitSpeechRecognition;

    if (!SpeechRecognition) {
      toast("Voice unsupported");
      return;
    }

    setVoiceOpen(true);

    const recognition =
      new SpeechRecognition();

    recognition.lang = "en-US";

    recognition.start();

    recognition.onresult = (
      event: any
    ) => {
      setInput(
        event.results[0][0].transcript
      );

      setVoiceOpen(false);

      toast("Voice captured");
    };

    recognition.onend = () => {
      setVoiceOpen(false);
    };
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
      } ${
        fullscreen ? "fullscreen" : ""
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
            <div className="logoIcon">
              <Sparkles size={18} />
            </div>

            <div className="logoText">
              <span>Lumina AI</span>

              <small>
                ULTRA ENGINE
              </small>
            </div>
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
            <Brain size={20} />
            AI Brain
          </div>

          <div className="toolCard">
            <Code2 size={20} />
            Coding
          </div>

          <div className="toolCard">
            <Globe size={20} />
            Research
          </div>

          <div className="toolCard">
            <Palette size={20} />
            Design
          </div>
        </div>

        <div className="history">
          {filteredChats.map(
            (chat) => (
              <div
                key={chat.id}
                className={`historyItem ${
                  chats[currentChat]?.id ===
                  chat.id
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
            )
          )}
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
            <div className="brandRow">
              <span>Lumina Ultra</span>

              <div className="proTag">
                PRO
              </div>
            </div>

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
              onClick={() =>
                setFullscreen(
                  !fullscreen
                )
              }
            >
              {fullscreen ? (
                <Minimize2 size={18} />
              ) : (
                <Maximize2 size={18} />
              )}
            </button>

            <button
              className="circleBtn"
              onClick={createChat}
            >
              <PenSquare size={18} />
            </button>
          </div>
        </header>

        {chats[currentChat]?.messages
          .length === 0 && (
          <div className="hero">
            <div className="heroBadge">
              <Stars size={16} />
              AI Workspace 2026
            </div>

            <h1>
              Smarter.
              <br />
              Cleaner.
              <br />
              More Powerful.
            </h1>

            <p>
              Upload PDFs, images,
              generate ideas, code,
              research, voice chat and
              futuristic AI tools in one
              premium interface.
            </p>

            <div className="heroGrid">
              <div className="heroCard">
                <Zap size={24} />
                <h3>Ultra Fast</h3>
                <span>
                  Real-time responses
                </span>
              </div>

              <div className="heroCard">
                <Bot size={24} />
                <h3>AI Assistant</h3>
                <span>
                  Human-like answers
                </span>
              </div>

              <div className="heroCard">
                <FileText size={24} />
                <h3>PDF Uploads</h3>
                <span>
                  Read documents instantly
                </span>
              </div>

              <div className="heroCard">
                <ImageIcon size={24} />
                <h3>Image Uploads</h3>
                <span>
                  Analyze visuals
                </span>
              </div>
            </div>
          </div>
        )}

        {/* CHAT */}

        <div className="chatArea">
          {chats[currentChat]?.messages.map(
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
                        <div className="avatarMini aiMini">
                          <Bot size={14} />
                        </div>

                        Lumina
                      </>
                    ) : (
                      <>
                        <div className="avatarMini">
                          <User size={14} />
                        </div>

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
                  {msg.text}
                </div>

                {msg.attachments &&
                  msg.attachments.length >
                    0 && (
                    <div className="attachmentGrid">
                      {msg.attachments.map(
                        (file) => (
                          <div
                            key={file.id}
                            className="attachmentCard"
                          >
                            {file.type ===
                            "image" ? (
                              <Image
                                src={file.url}
                                alt={
                                  file.name
                                }
                                width={200}
                                height={140}
                                className="attachmentImg"
                              />
                            ) : (
                              <div className="pdfBox">
                                <FileText
                                  size={
                                    30
                                  }
                                />
                              </div>
                            )}

                            <div className="attachmentName">
                              {file.name}
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  )}

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
                        react("up")
                      }
                    >
                      <ThumbsUp
                        size={15}
                      />
                    </button>

                    <button
                      onClick={() =>
                        react("down")
                      }
                    >
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

        {/* INPUT */}

        <div className="inputWrap">
          {attachments.length > 0 && (
            <div className="uploadPreview">
              {attachments.map((file) => (
                <div
                  key={file.id}
                  className="uploadCard"
                >
                  <div className="uploadLeft">
                    {file.type ===
                    "image" ? (
                      <ImageIcon
                        size={16}
                      />
                    ) : (
                      <FileText
                        size={16}
                      />
                    )}

                    <span>
                      {file.name}
                    </span>
                  </div>

                  <button
                    onClick={() =>
                      removeAttachment(
                        file.id
                      )
                    }
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="inputBox">
            <input
              placeholder="Ask Lumina AI..."
              value={input}
              onChange={(e) =>
                setInput(e.target.value)
              }
              onKeyDown={(e) =>
                e.key === "Enter" &&
                sendMessage()
              }
            />

            <div className="inputButtons">
              <button
                className="miniBtn"
                onClick={startVoice}
              >
                <Mic size={18} />
              </button>

              <button
                className="miniBtn"
                onClick={() =>
                  imageInputRef.current?.click()
                }
              >
                <ImageIcon size={18} />
              </button>

              <button
                className="miniBtn"
                onClick={() =>
                  pdfInputRef.current?.click()
                }
              >
                <Paperclip size={18} />
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
            multiple
            type="file"
            accept="image/*"
            ref={imageInputRef}
            onChange={(e) =>
              handleFiles(
                e,
                "image"
              )
            }
          />

          <input
            hidden
            multiple
            type="file"
            accept=".pdf"
            ref={pdfInputRef}
            onChange={(e) =>
              handleFiles(e, "pdf")
            }
          />

          <div className="inputFooter">
            <span>
              Lumina Ultra AI
            </span>

            <ChevronRight size={14} />

            <span>
              Smart • Secure • AI Vision
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
                  Toggle interface
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
                  Premium glow visuals
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
                <Sparkles size={16} />
              </button>
            </div>

            <div className="setting">
              <div>
                <h3>Compact Mode</h3>

                <p>
                  Smaller chat layout
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

            <div className="setting">
              <div>
                <h3>Auto Speak</h3>

                <p>
                  Read AI replies aloud
                </p>
              </div>

              <button
                className="toggle"
                onClick={() =>
                  setAutoSpeak(
                    !autoSpeak
                  )
                }
              >
                <Volume2 size={16} />
              </button>
            </div>

            <div className="setting">
              <div>
                <h3>Gradient UI</h3>

                <p>
                  Premium gradients
                </p>
              </div>

              <button
                className="toggle"
                onClick={() =>
                  setGradientUI(
                    !gradientUI
                  )
                }
              >
                <Palette size={16} />
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
                  Lumina Premium
                </p>
              </div>
            </div>

            <button className="panelBtn premium">
              <Crown size={18} />
              Upgrade to Ultra+
            </button>

            <button className="panelBtn">
              <Download size={18} />
              Export Chats
            </button>

            <button className="panelBtn">
              <RefreshCcw size={18} />
              Sync Data
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

      {voiceOpen && (
        <div className="voiceOverlay">
          <div className="voiceOrb" />

          <h2>Listening...</h2>
        </div>
      )}

      {/* TOAST */}

      {popup && (
        <div className="toast">
          <CheckCheck size={16} />
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
          overflow: hidden;
          position: relative;
        }

        .dark {
          background: #000;
          color: white;
        }

        .light {
          background: #f5f5f5;
          color: black;
        }

        .bgWord {
          position: fixed;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18vw;
          font-weight: 900;
          opacity: 0.03;
          pointer-events: none;
          letter-spacing: 14px;
        }

        .glow {
          position: fixed;
          border-radius: 50%;
          filter: blur(120px);
        }

        .glow1 {
          width: 350px;
          height: 350px;
          background: #1f1f1f;
          top: -100px;
          left: -100px;
        }

        .glow2 {
          width: 320px;
          height: 320px;
          background: #101010;
          bottom: -100px;
          right: -100px;
        }

        .sidebar {
          width: 300px;
          background: rgba(
            8,
            8,
            8,
            0.95
          );
          border-right: 1px solid
            #1d1d1d;
          padding: 18px;
          display: flex;
          flex-direction: column;
          z-index: 30;
        }

        .sideTop {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .logoIcon {
          width: 44px;
          height: 44px;
          border-radius: 16px;
          background: white;
          color: black;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .logoText span {
          font-weight: 900;
          font-size: 22px;
          display: block;
        }

        .logoText small {
          opacity: 0.6;
          letter-spacing: 2px;
          font-size: 10px;
        }

        .newChatBtn {
          margin-top: 22px;
          height: 60px;
          border-radius: 20px;
          border: none;
          background: white;
          color: black;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          cursor: pointer;
        }

        .searchBox {
          margin-top: 16px;
          height: 52px;
          border-radius: 16px;
          background: #111;
          display: flex;
          align-items: center;
          padding: 0 16px;
          gap: 10px;
        }

        .searchBox input {
          flex: 1;
          border: none;
          outline: none;
          background: transparent;
          color: white;
        }

        .quickTools {
          display: grid;
          grid-template-columns: repeat(
            2,
            1fr
          );
          gap: 12px;
          margin-top: 18px;
        }

        .toolCard {
          min-height: 80px;
          border-radius: 22px;
          background: #101010;
          border: 1px solid #1f1f1f;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-weight: 700;
        }

        .history {
          flex: 1;
          overflow-y: auto;
          margin-top: 20px;
        }

        .historyItem {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 10px;
        }

        .historySelect {
          flex: 1;
          height: 54px;
          border-radius: 16px;
          background: #121212;
          border: none;
          color: white;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 0 16px;
          font-weight: 700;
        }

        .historyItem.active
          .historySelect {
          background: white;
          color: black;
        }

        .deleteMini {
          width: 44px;
          height: 44px;
          border-radius: 14px;
          border: none;
          background: #111;
          color: white;
        }

        .sideBottom {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .sideBtn {
          height: 52px;
          border-radius: 16px;
          border: none;
          background: #111;
          color: white;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 0 16px;
          font-weight: 700;
        }

        .main {
          flex: 1;
          display: flex;
          flex-direction: column;
          position: relative;
        }

        .topbar {
          height: 74px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 18px;
          border-bottom: 1px solid
            #121212;
          backdrop-filter: blur(12px);
        }

        .circleBtn {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          border: none;
          background: #101010;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .topActions {
          display: flex;
          gap: 10px;
        }

        .centerBrand {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .brandRow {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .brandRow span {
          font-size: 28px;
          font-weight: 900;
        }

        .proTag {
          padding: 4px 10px;
          border-radius: 999px;
          background: white;
          color: black;
          font-size: 11px;
          font-weight: 800;
        }

        .status {
          font-size: 12px;
          margin-top: 4px;
        }

        .online {
          color: #4ade80;
        }

        .offline {
          color: #f87171;
        }

        .hero {
          padding: 70px 30px;
        }

        .heroBadge {
          width: fit-content;
          padding: 10px 18px;
          border-radius: 999px;
          background: #101010;
          display: flex;
          align-items: center;
          gap: 10px;
          font-weight: 700;
        }

        .hero h1 {
          font-size: 72px;
          line-height: 1;
          margin-top: 26px;
          font-weight: 900;
          letter-spacing: -3px;
        }

        .hero p {
          margin-top: 22px;
          max-width: 760px;
          line-height: 1.8;
          font-size: 18px;
          color: #a0a0a0;
        }

        .heroGrid {
          display: grid;
          grid-template-columns: repeat(
            2,
            1fr
          );
          gap: 16px;
          margin-top: 34px;
          max-width: 900px;
        }

        .heroCard {
          min-height: 150px;
          border-radius: 28px;
          background: rgba(
            16,
            16,
            16,
            0.9
          );
          border: 1px solid #1d1d1d;
          padding: 24px;
          transition: 0.25s;
        }

        .heroCard:hover {
          transform: translateY(-5px);
        }

        .heroCard h3 {
          margin-top: 22px;
          font-size: 22px;
          font-weight: 900;
        }

        .heroCard span {
          margin-top: 10px;
          display: block;
          color: #989898;
        }

        .chatArea {
          flex: 1;
          overflow-y: auto;
          padding: 20px 24px 180px;
        }

        .msg {
          width: fit-content;
          max-width: min(
            860px,
            100%
          );
          padding: 24px;
          border-radius: 28px;
          margin-bottom: 18px;
          animation: fade 0.2s ease;
        }

        .msg.user {
          margin-left: auto;
          background: white;
          color: black;
        }

        .msg.ai {
          background: rgba(
            12,
            12,
            12,
            0.92
          );
          border: 1px solid #1f1f1f;
        }

        .compact {
          padding: 16px;
        }

        .msgTop {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 16px;
        }

        .msgUser {
          display: flex;
          align-items: center;
          gap: 10px;
          font-weight: 800;
        }

        .avatarMini {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: #111;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .aiMini {
          background: white;
          color: black;
        }

        .msgText {
          line-height: 1.9;
          font-size: 16px;
          font-weight: 500;
          white-space: pre-wrap;
        }

        .msgActions {
          display: flex;
          gap: 10px;
          margin-top: 20px;
        }

        .msgActions button {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          border: none;
          background: #101010;
          color: white;
        }

        .attachmentGrid {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          margin-top: 18px;
        }

        .attachmentCard {
          width: 200px;
          background: #111;
          border-radius: 18px;
          overflow: hidden;
          border: 1px solid #1d1d1d;
        }

        .attachmentImg {
          width: 100%;
          height: 140px;
          object-fit: cover;
        }

        .pdfBox {
          height: 140px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .attachmentName {
          padding: 12px;
          font-size: 13px;
          font-weight: 700;
        }

        .typing {
          display: flex;
          gap: 8px;
          padding: 12px;
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
          left: 300px;
          right: 0;
          padding: 18px;
          background: linear-gradient(
            to top,
            rgba(0, 0, 0, 0.96),
            transparent
          );
          backdrop-filter: blur(14px);
        }

        .uploadPreview {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-bottom: 12px;
          max-width: 950px;
          margin-inline: auto;
        }

        .uploadCard {
          background: #111;
          border: 1px solid #1d1d1d;
          border-radius: 14px;
          padding: 10px 14px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
        }

        .uploadLeft {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 13px;
          font-weight: 700;
        }

        .uploadCard button {
          border: none;
          background: transparent;
          color: white;
        }

        .inputBox {
          max-width: 950px;
          margin: auto;
          min-height: 76px;
          border-radius: 28px;
          border: 1px solid #1d1d1d;
          background: rgba(
            10,
            10,
            10,
            0.95
          );
          display: flex;
          align-items: center;
          padding: 0 14px 0 22px;
        }

        .inputBox input {
          flex: 1;
          border: none;
          background: transparent;
          color: white;
          font-size: 17px;
          outline: none;
          min-width: 0;
          font-weight: 600;
        }

        .inputButtons {
          display: flex;
          gap: 10px;
        }

        .miniBtn,
        .sendBtn {
          width: 50px;
          height: 50px;
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

        .inputFooter {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-top: 12px;
          font-size: 12px;
          color: #8a8a8a;
          font-weight: 700;
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
          z-index: 100;
          padding: 20px;
        }

        .panel {
          width: 420px;
          max-width: 100%;
          background: #090909;
          border-radius: 30px;
          border: 1px solid #1d1d1d;
          padding: 24px;
        }

        .panelTop {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .panelTop button {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: none;
          background: #111;
          color: white;
        }

        .setting {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 24px;
        }

        .setting h3 {
          font-weight: 800;
        }

        .setting p {
          color: #8b8b8b;
          font-size: 14px;
          margin-top: 4px;
        }

        .toggle {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          border: none;
          background: white;
          color: black;
        }

        .profile {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-top: 24px;
        }

        .avatar {
          width: 70px;
          height: 70px;
          border-radius: 50%;
          background: white;
          color: black;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28px;
          font-weight: 900;
        }

        .panelBtn {
          width: 100%;
          height: 56px;
          border-radius: 18px;
          border: none;
          margin-top: 16px;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 0 18px;
          font-weight: 800;
          background: #111;
          color: white;
        }

        .premium {
          background: white;
          color: black;
        }

        .logout {
          background: #1b0d0d;
        }

        .voiceOverlay {
          position: fixed;
          inset: 0;
          background: rgba(
            0,
            0,
            0,
            0.86
          );
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          z-index: 200;
        }

        .voiceOrb {
          width: 180px;
          height: 180px;
          border-radius: 50%;
          background: radial-gradient(
            circle,
            white,
            #333
          );
          animation: pulse 1.2s infinite;
        }

        .voiceOverlay h2 {
          margin-top: 24px;
          font-size: 34px;
          font-weight: 900;
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
          font-weight: 800;
          z-index: 200;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .loader {
          width: 100%;
          height: 100vh;
          background: black;
          display: flex;
          align-items: center;
          justify-content: center;
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

        @keyframes pulse {
          50% {
            transform: scale(1.08);
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

          .mobileClose {
            display: flex;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            border: none;
            background: #111;
            color: white;
            align-items: center;
            justify-content: center;
          }

          .inputWrap {
            left: 0;
          }

          .hero {
            padding: 50px 18px;
          }

          .hero h1 {
            font-size: 48px;
          }

          .heroGrid {
            grid-template-columns: 1fr;
          }

          .chatArea {
            padding: 18px 14px 180px;
          }

          .msg {
            max-width: 100%;
          }

          .bgWord {
            font-size: 30vw;
          }
        }
      `}</style>
    </main>
  );
}
