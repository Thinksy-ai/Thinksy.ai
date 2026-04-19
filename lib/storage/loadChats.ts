import { Chat, createNewChat } from "@/store/chatStore";

export function loadChats() {
  if (typeof window === "undefined") {
    return { chats: [createNewChat()], activeId: null };
  }

  const storedChats = localStorage.getItem("thinksy_chats");
  const activeId = localStorage.getItem("thinksy_active");

  if (!storedChats) {
    const chat = createNewChat();
    return { chats: [chat], activeId: chat.id };
  }

  const chats: Chat[] = JSON.parse(storedChats);

  return {
    chats,
    activeId: activeId || chats[0]?.id,
  };
}
