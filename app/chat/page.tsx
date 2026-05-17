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
  Copy,
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

import { createClient } from "@supabase/supabase-js";

import ReactMarkdown from "react-markdown";

import remarkGfm from "remark-gfm";

import remarkMath from "remark-math";

import rehypeKatex from "rehype-katex";

import "katex/dist/katex.min.css";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";

import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Role = "user" | "assistant";

type Message = {
  id: number;
  role: Role;
  text: string;
  time: string;
};

type Chat = {
  id: number;
  title: string;
  pinned?: boolean;
  project?: string;
  messages: Message[];
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

  const [darkMode, setDarkMode] =
    useState(true);

  const [settingsOpen, setSettingsOpen] =
    useState(false);

  const [menuOpen, setMenuOpen] =
    useState(false);

  const [currentChat, setCurrentChat] =
    useState(0);

  const [projects] = useState([
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
    useState<Chat[]>([]);

  useEffect(() => {
    const saved =
      localStorage.getItem(
        "thinksy_chats"
      );

    if (saved) {
      setChats(JSON.parse(saved));
    } else {
      setChats([
        {
          id: Date.now(),
          title: "Welcome",
          pinned: true,
          project: "Personal",
          messages: [],
        },
      ]);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    if (!loading) {
      localStorage.setItem(
        "thinksy_chats",
        JSON.stringify(chats)
      );
    }
  }, [chats, loading]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [typing, chats]);

  function toast(text: string) {
    setPopup(text);

    setTimeout(() => {
      setPopup("");
    }, 2000);
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
  }

  function deleteChat(id: number) {
    const filtered = chats.filter(
      (c) => c.id !== id
    );

    setChats(filtered);

    setCurrentChat(0);
  }

  function updateWorkingMemory(
    userText: string,
    aiText: string
  ) {
    const existing =
      localStorage.getItem(
        "thinksy_memory"
      ) || "";

    const updated = `
${existing}

USER: ${userText}

AI: ${aiText}
`;

    localStorage.setItem(
      "thinksy_memory",
      updated.slice(-12000)
    );
  }

  async function sendMessage() {
    if (!input.trim()) return;

    const userText = input;

    setInput("");

    setTyping(true);

    const userMessage: Message = {
      id: Date.now(),
      role: "user",
      text: userText,
      time: getTime(),
    };

    const updatedChats = chats.map(
      (chat, i) => {
        if (i !== currentChat)
          return chat;

        return {
          ...chat,
          title:
            chat.title === "New Chat"
              ? userText.slice(0, 30)
              : chat.title,

          messages: [
            ...chat.messages,
            userMessage,
          ],
        };
      }
    );

    setChats(updatedChats);

    try {
      const history =
        updatedChats[
          currentChat
        ].messages.slice(-15);

      const memory =
        localStorage.getItem(
          "thinksy_memory"
        ) || "";

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
            history,
            memory,
          }),
        }
      );

      const data =
        await response.json();

      const aiText =
        data.reply ||
        "No response.";

      const aiMessage: Message = {
        id: Date.now() + 1,
        role: "assistant",
        text: aiText,
        time: getTime(),
      };

      setChats((prev) =>
        prev.map((chat, i) => {
          if (i !== currentChat)
            return chat;

          return {
            ...chat,
            messages: [
              ...chat.messages,
              aiMessage,
            ],
          };
        })
      );

      updateWorkingMemory(
        userText,
        aiText
      );
    } catch {
      toast("Connection failed");
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
  }

  function startVoice() {
    const SpeechRecognition =
      (window as any)
        .webkitSpeechRecognition;

    if (!SpeechRecognition) {
      toast("Unsupported");
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
            placeholder="Search..."
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
                className="historyItem"
              >
                <button
                  className="historySelect"
                  onClick={() =>
                    setCurrentChat(
                      chats.findIndex(
                        (c) =>
                          c.id ===
                          chat.id
                      )
                    )
                  }
                >
                  <MessageSquare
                    size={15}
                  />

                  {chat.title}
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
              <button>
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
        </header>

        {chats[currentChat]
          ?.messages.length ===
          0 && (
          <div className="hero">
            <div className="heroBadge">
              <Stars size={15} />
              Futuristic AI
            </div>

            <h1>
              Think.
              <br />
              Build.
              <br />
              Create.
            </h1>

            <p>
              Smart AI with memory,
              markdown, code,
              LaTeX, projects and
              ultra-fast responses.
            </p>

            <div className="heroGrid">
              <div className="heroCard">
                <Zap size={20} />
                Fast
              </div>

              <div className="heroCard">
                <Bot size={20} />
                Memory
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
                      } = props;

                      const match =
                        /language-(\w+)/.exec(
                          className ||
                            ""
                        );

                      return match ? (
                        <SyntaxHighlighter
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
                        <code>
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
                  size={16}
                />
              </button>

              <button
                className="miniBtn"
                onClick={startVoice}
              >
                <Mic size={16} />
              </button>

              <button className="miniBtn">
                <ImageIcon
                  size={16}
                />
              </button>

              <button
                className="sendBtn"
                onClick={sendMessage}
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
