"use client";

import { useEffect, useRef, useState } from "react";
import {
  Menu,
  Search,
  MessageSquare,
  Grid2X2,
  Folder,
  PenSquare,
  Mic,
  Paperclip,
  SlidersHorizontal,
  ArrowUp,
  Copy,
  Volume2,
  ThumbsUp,
  ThumbsDown,
  RotateCcw,
  Video,
  MoreHorizontal,
  X,
  Trash2,
  History,
  Square,
} from "lucide-react";

type Role = "user" | "assistant";

type Msg = {
  role: Role;
  text: string;
};

type ChatItem = {
  id: number;
  title: string;
  messages: Msg[];
};

type Tab = "chat" | "explore" | "library";

export default function Home() {
  const [input, setInput] = useState("");
  const [mobileMenu, setMobileMenu] = useState(false);
  const [voiceOpen, setVoiceOpen] = useState(false);
  const [typing, setTyping] = useState(false);
  const [listening, setListening] = useState(false);
  const [tab, setTab] = useState<Tab>("chat");

  const [chats, setChats] = useState<ChatItem[]>([
    {
      id: Date.now(),
      title: "New Chat",
      messages: [
        {
          role: "assistant",
          text: "Welcome to Thinksy. Ask anything.",
        },
      ],
    },
  ]);

  const [activeChatId, setActiveChatId] = useState<number>(chats[0].id);

  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const recognitionRef = useRef<any>(null);

  const activeChat =
    chats.find((chat) => chat.id === activeChatId) || chats[0];

  const messages = activeChat.messages;

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  function updateChatMessages(newMessages: Msg[]) {
    setChats((prev) =>
      prev.map((chat) =>
        chat.id === activeChatId
          ? {
              ...chat,
              messages: newMessages,
              title:
                chat.title === "New Chat" && newMessages[1]
                  ? newMessages[1].text.slice(0, 24)
                  : chat.title,
            }
          : chat
      )
    );
  }

  async function sendMessage() {
    const text = input.trim();
    if (!text || typing) return;

    const updated: Msg[] = [...messages, { role: "user", text }];
    updateChatMessages(updated);

    setInput("");
    setTyping(true);
    setTab("chat");

    setTimeout(() => {
      const aiReply =
        "This is your upgraded Thinksy response. Connect Groq for real streaming AI.";

      updateChatMessages([
        ...updated,
        {
          role: "assistant",
          text: aiReply,
        },
      ]);

      setTyping(false);
    }, 1000);
  }

  function newChat() {
    const id = Date.now();

    const fresh = {
      id,
      title: "New Chat",
      messages: [
        {
          role: "assistant" as Role,
          text: "Fresh chat started. Ask anything.",
        },
      ],
    };

    setChats((prev) => [fresh, ...prev]);
    setActiveChatId(id);
    setTab("chat");
    setMobileMenu(false);
  }

  function deleteChat(id: number) {
    const filtered = chats.filter((c) => c.id !== id);

    if (!filtered.length) {
      newChat();
      return;
    }

    setChats(filtered);

    if (activeChatId === id) {
      setActiveChatId(filtered[0].id);
    }
  }

  function copyText(text: string) {
    navigator.clipboard.writeText(text);
  }

  function speak(text: string) {
    if (!("speechSynthesis" in window)) return;

    speechSynthesis.cancel();

    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = 1;
    utter.pitch = 1;
    speechSynthesis.speak(utter);
  }

  function stopSpeak() {
    if ("speechSynthesis" in window) {
      speechSynthesis.cancel();
    }
  }

  function startVoice() {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Voice recognition not supported on this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = true;
    recognition.continuous = false;

    recognition.onstart = () => setListening(true);

    recognition.onresult = (event: any) => {
      let transcript = "";

      for (let i = 0; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }

      setInput(transcript);
    };

    recognition.onend = () => setListening(false);

    recognition.onerror = () => setListening(false);

    recognition.start();
    recognitionRef.current = recognition;
  }

  function stopVoice() {
    recognitionRef.current?.stop?.();
    setListening(false);
  }

  return (
    <main className="thinksy-app">
      {/* SIDEBAR */}
      <aside className={`sidebar ${mobileMenu ? "show" : ""}`}>
        <div className="sideTop">
          <div className="brand">Thinksy</div>

          <button
            className="closeBtn"
            onClick={() => setMobileMenu(false)}
          >
            <X size={18} />
          </button>
        </div>

        <button className="searchBox">
          <Search size={18} />
          <span>Search</span>
        </button>

        <button
          className={`navBtn ${tab === "chat" ? "active" : ""}`}
          onClick={() => {
            setTab("chat");
            setMobileMenu(false);
          }}
        >
          <MessageSquare size={18} />
          <span>Chat</span>
        </button>

        <button
          className={`navBtn ${tab === "explore" ? "active" : ""}`}
          onClick={() => {
            setTab("explore");
            setMobileMenu(false);
          }}
        >
          <Grid2X2 size={18} />
          <span>Explore</span>
        </button>

        <button
          className={`navBtn ${tab === "library" ? "active" : ""}`}
          onClick={() => {
            setTab("library");
            setMobileMenu(false);
          }}
        >
          <Folder size={18} />
          <span>Library</span>
        </button>

        {/* HISTORY */}
        <div className="historyHead">
          <History size={16} />
          <span>Chat History</span>
        </div>

        <div className="historyList">
          {chats.map((chat) => (
            <div
              key={chat.id}
              className={`historyItem ${
                activeChatId === chat.id ? "selected" : ""
              }`}
            >
              <button
                className="historyBtn"
                onClick={() => {
                  setActiveChatId(chat.id);
                  setTab("chat");
                  setMobileMenu(false);
                }}
              >
                {chat.title}
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

        <div className="bottomSide">
          <button className="navBtn" onClick={newChat}>
            <PenSquare size={18} />
            <span>New Chat</span>
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <section className="mainPanel">
        <header className="topBar">
          <button
            className="iconBtn"
            onClick={() => setMobileMenu(true)}
          >
            <Menu size={20} />
          </button>

          <div className="title">Thinksy</div>

          <button className="iconBtn" onClick={newChat}>
            <PenSquare size={18} />
          </button>
        </header>

        {/* CHAT */}
        {tab === "chat" && (
          <>
            <div className="chatArea">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`bubble ${
                    msg.role === "user" ? "user" : "ai"
                  }`}
                >
                  {msg.text}

                  {msg.role === "assistant" && (
                    <div className="tools">
                      <button onClick={() => copyText(msg.text)}>
                        <Copy size={15} />
                      </button>

                      <button onClick={() => speak(msg.text)}>
                        <Volume2 size={15} />
                      </button>

                      <button>
                        <ThumbsUp size={15} />
                      </button>

                      <button>
                        <ThumbsDown size={15} />
                      </button>

                      <button onClick={newChat}>
                        <RotateCcw size={15} />
                      </button>
                    </div>
                  )}
                </div>
              ))}

              {typing && (
                <div className="bubble ai">Thinking...</div>
              )}

              <div ref={chatEndRef} />
            </div>

            <div className="inputWrap">
              <div className="inputBox">
                <input
                  placeholder="Ask anything"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && sendMessage()
                  }
                />

                <div className="inputTools">
                  <button>
                    <Paperclip size={18} />
                  </button>

                  <button>
                    <SlidersHorizontal size={18} />
                  </button>

                  <button onClick={() => setVoiceOpen(true)}>
                    <Mic size={18} />
                  </button>

                  <button
                    className="sendBtn"
                    onClick={sendMessage}
                  >
                    <ArrowUp size={18} />
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {/* EXPLORE */}
        {tab === "explore" && (
          <div className="pageBox">Explore page ready</div>
        )}

        {/* LIBRARY */}
        {tab === "library" && (
          <div className="pageBox">Library page ready</div>
        )}
      </section>

      {/* VOICE PANEL */}
      {voiceOpen && (
        <div className="voicePanel">
          <div className="voiceTop">
            <button>
              <Video size={18} />
            </button>

            <button
              onClick={listening ? stopVoice : startVoice}
            >
              <Mic size={18} />
            </button>

            <button onClick={stopSpeak}>
              <Square size={18} />
            </button>

            <button onClick={() => setVoiceOpen(false)}>
              <X size={18} />
            </button>
          </div>

          <div className={`orb ${listening ? "live" : ""}`} />

          <p className="voiceText">
            {listening
              ? "Listening..."
              : "Tap mic to speak"}
          </p>

          <button
            className="voiceSend"
            onClick={() => {
              setVoiceOpen(false);
              sendMessage();
            }}
          >
            Send Voice Message
          </button>
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
          background: #000;
          color: #fff;
          font-family: Inter, sans-serif;
          overflow: hidden;
        }

        .thinksy-app {
          display: flex;
          height: 100vh;
        }

        .sidebar {
          width: 270px;
          background: #0a0a0a;
          border-right: 1px solid #151515;
          padding: 14px;
          display: flex;
          flex-direction: column;
        }

        .sideTop {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 14px;
        }

        .brand {
          font-size: 22px;
          font-weight: 700;
        }

        .closeBtn,
        .iconBtn,
        .tools button,
        .inputTools button,
        .voiceTop button,
        .trashBtn {
          width: 38px;
          height: 38px;
          border: none;
          border-radius: 50%;
          background: #121212;
          color: #fff;
        }

        .searchBox,
        .navBtn,
        .historyBtn {
          width: 100%;
          border: none;
          background: transparent;
          color: #ddd;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 0 14px;
          height: 46px;
          border-radius: 14px;
        }

        .searchBox {
          background: #151515;
          color: #888;
          margin-bottom: 8px;
        }

        .navBtn:hover,
        .navBtn.active,
        .historyBtn:hover {
          background: #171717;
        }

        .historyHead {
          display: flex;
          gap: 8px;
          align-items: center;
          color: #888;
          font-size: 13px;
          margin: 14px 8px 8px;
        }

        .historyList {
          flex: 1;
          overflow-y: auto;
        }

        .historyItem {
          display: flex;
          gap: 6px;
          margin-bottom: 6px;
        }

        .historyBtn {
          flex: 1;
          justify-content: flex-start;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .selected .historyBtn {
          background: #171717;
        }

        .bottomSide {
          margin-top: auto;
        }

        .mainPanel {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .topBar {
          height: 64px;
          border-bottom: 1px solid #151515;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 14px;
        }

        .title {
          font-size: 20px;
          font-weight: 700;
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
          border: 1px solid #1a1a1a;
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

        .inputWrap {
          padding: 16px;
        }

        .inputBox {
          background: #101010;
          border: 1px solid #1a1a1a;
          border-radius: 24px;
          padding: 14px;
        }

        .inputBox input {
          width: 100%;
          background: transparent;
          border: none;
          outline: none;
          color: #fff;
          font-size: 16px;
          margin-bottom: 12px;
        }

        .inputTools {
          display: flex;
          gap: 10px;
          justify-content: flex-end;
        }

        .sendBtn {
          background: #fff !important;
          color: #000 !important;
        }

        .pageBox {
          padding: 20px;
        }

        .voicePanel {
          position: fixed;
          right: 20px;
          top: 90px;
          width: 310px;
          background: #090909;
          border: 1px solid #1a1a1a;
          border-radius: 28px;
          padding: 18px;
        }

        .voiceTop {
          display: flex;
          justify-content: space-between;
        }

        .orb {
          width: 150px;
          height: 150px;
          border-radius: 50%;
          margin: 40px auto 18px;
          background: radial-gradient(circle, #fff, #333);
        }

        .orb.live {
          animation: pulse 1s infinite;
        }

        .voiceText {
          text-align: center;
          color: #aaa;
          margin-bottom: 16px;
        }

        .voiceSend {
          width: 100%;
          height: 46px;
          border: none;
          border-radius: 16px;
          background: #fff;
          color: #000;
          font-weight: 700;
        }

        @keyframes pulse {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.08);
            opacity: 0.7;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        @media (max-width: 900px) {
          .sidebar {
            position: fixed;
            left: -280px;
            top: 0;
            bottom: 0;
            z-index: 100;
            transition: 0.25s;
          }

          .sidebar.show {
            left: 0;
          }

          .bubble {
            max-width: 100%;
          }

          .voicePanel {
            left: 10px;
            right: 10px;
            width: auto;
          }
        }
      `}</style>
    </main>
  );
}
