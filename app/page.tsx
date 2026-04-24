"use client";

import { useState } from "react";
import { useChats } from "@/hooks/useChats";
import { useStream } from "@/hooks/useStream";
import { useSpeechSynthesis } from "@/hooks/useSpeechSynthesis";

import Sidebar from "@/components/sidebar/Sidebar";
import ChatWindow from "@/components/chat/ChatWindow";
import ChatInput from "@/components/chat/ChatInput";
import TypingDots from "@/components/chat/TypingDots";

import VoiceToggle from "@/components/ui/VoiceToggle";
import VoiceSettings from "@/components/ui/VoiceSettings";

export default function Home() {
  const {
    chats,
    activeChat,
    activeId,
    setActiveId,
    addMessage,
    updateLastMessage,
    newChat,
    renameChat,
    deleteChat,
  } = useChats();

  const { startStream, stop, isStreaming } = useStream();

  const { enabled, setEnabled, speak } = useSpeechSynthesis();

  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);

  const [input, setInput] = useState("");

  const callAI = async (messages: any[]) => {
    const res = await fetch("/api/chat", {
      method: "POST",
      body: JSON.stringify({ messages }),
    });

    const data = await res.json();

    addMessage({ role: "assistant", content: "" });

    let finalText = "";

    await startStream(data.reply, (chunk: string) => {
      finalText = chunk;
      updateLastMessage(chunk);
    });

    // 🔊 Speak after full response
    speak(finalText, rate, pitch);
  };

  const send = async () => {
    if (!input || isStreaming) return;

    addMessage({ role: "user", content: input });

    await callAI(activeChat.messages);

    setInput("");
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar
        chats={chats}
        activeId={activeId}
        setActiveId={setActiveId}
        newChat={newChat}
        renameChat={renameChat}
        deleteChat={deleteChat}
      />

      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ padding: 5 }}>
          <VoiceToggle
            enabled={enabled}
            toggle={() => setEnabled(!enabled)}
          />
          <VoiceSettings
            rate={rate}
            setRate={setRate}
            pitch={pitch}
            setPitch={setPitch}
          />
        </div>

        <ChatWindow messages={activeChat?.messages || []} />

        {isStreaming && (
          <>
            <TypingDots />
            <button onClick={stop}>Stop</button>
          </>
        )}

        <ChatInput
          input={input}
          setInput={setInput}
          send={send}
        />
      </div>
    </div>
  );
}
