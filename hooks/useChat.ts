import { useState, useEffect } from "react";
import { Chat, createNewChat } from "@/store/chatStore";
import { saveChats } from "@/lib/storage/saveChats";
import { loadChats } from "@/lib/storage/loadChats";
import { generateTitle } from "@/lib/title/generateTitle";

export function useChats() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const { chats, activeId } = loadChats();
    setChats(chats);
    setActiveId(activeId);
  }, []);

  useEffect(() => {
    if (chats.length > 0 && activeId) {
      saveChats(chats, activeId);
    }
  }, [chats, activeId]);

  const activeChat = chats.find(c => c.id === activeId) || chats[0];

  const addMessage = (msg: any) => {
    setChats(prev =>
      prev.map(chat => {
        if (chat.id !== activeId) return chat;

        const updatedMessages = [...chat.messages, msg];

        let newTitle = chat.title;

        if (chat.messages.length === 0 && msg.role === "user") {
          newTitle = generateTitle(msg.content);
        }

        return {
          ...chat,
          messages: updatedMessages,
          title: newTitle,
        };
      })
    );
  };

  const updateLastMessage = (content: string) => {
    setChats(prev =>
      prev.map(chat => {
        if (chat.id !== activeId) return chat;

        const updated = [...chat.messages];
        updated[updated.length - 1] = {
          role: "assistant",
          content,
        };

        return { ...chat, messages: updated };
      })
    );
  };

  const newChat = () => {
    const chat = createNewChat();
    setChats(prev => [chat, ...prev]);
    setActiveId(chat.id);
  };

  const deleteChat = (id: string) => {
    const filtered = chats.filter(c => c.id !== id);
    setChats(filtered);

    if (id === activeId && filtered.length > 0) {
      setActiveId(filtered[0].id);
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
    updateLastMessage,
    newChat,
    deleteChat,
    renameChat,
  };
}
