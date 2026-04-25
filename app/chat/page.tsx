"use client";

import { useState } from "react";

export default function Chat() {
  const [sidebar, setSidebar] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { role: "assistant", text: "Welcome to Thinksy." }
  ]);

  function send() {
    if (!input.trim()) return;

    setMessages((prev) => [
      ...prev,
      { role: "user", text: input },
      { role: "assistant", text: "AI reply coming next phase." }
    ]);

    setInput("");
  }

  return (
    <main className="chatWrap">
      <aside className={`sidebar ${sidebar ? "open" : ""}`}>
        <button onClick={() => setSidebar(false)}>Close</button>
        <h3>Thinksy</h3>
      </aside>

      <section className="chatMain">
        <header className="topbar">
          <button onClick={() => setSidebar(true)}>Menu</button>
          <h2>Chat</h2>
        </header>

        <div className="msgs">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`msg ${m.role === "user" ? "user" : "ai"}`}
            >
              {m.text}
            </div>
          ))}
        </div>

        <div className="inputArea">
          <input
            placeholder="Ask anything..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />

          <button onClick={send}>Send</button>
        </div>
      </section>
    </main>
  );
}
