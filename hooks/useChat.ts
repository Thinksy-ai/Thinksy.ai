import { useState, useEffect } from "react";
import { Chat, createNewChat } from "@/store/chatStore";
import { saveChats } from "@/lib/storage/saveChats";
import { loadChats } from "@/lib/storage/loadChats";

export function useChats() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  // Load on start
  useEffect(() => {
    const { chats, activeId } = loadChats();
    setChats(chats);
    setActiveId(activeId);
  }, []);

  // Save whenever chats change
  useEffect(() => {
    if (chats.length > 0 && activeId) {
      saveChats(chats, activeId);
    }
  }, [chats, activeId]);

  const activeChat = chats.find(c => c.id === activeId) || chats[0];

  const addMessage = (msg: any) => {
    setChats(prev =>
      prev.map(chat =>
        chat.id === activeId
          ? { ...chat, messages: [...chat.messages, msg] }
          : chat
      )
    );
  };

  const newChat = () => {
    const chat = createNewChat();
    setChats(prev => [chat, ...prev]);
    setActiveId(chat.id);
  };

  const deleteChat = (id: string) => {
    setChats(prev => prev.filter(c => c.id !== id));
    if (id === activeId && chats.length > 1) {
      setActiveId(chats[0].id);
    }
  };

  const renameChat = (id: string, title: string) => {
    setChats(prev =>
      prev.map(c => (c.id === id ? { ...c, title } : c))
    );
  };

  return {
    chats,
    activeChat,
    activeId,
    setActiveId,
    addMessage,
    newChat,
    deleteChat,
    renameChat,
  };
}
