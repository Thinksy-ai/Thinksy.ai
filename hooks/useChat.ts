import { useState } from "react";
import { Chat, createNewChat } from "@/store/chatStore";

export function useChats() {
  const [chats, setChats] = useState<Chat[]>([createNewChat()]);
  const [activeId, setActiveId] = useState(chats[0].id);

  const activeChat = chats.find(c => c.id === activeId)!;

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
