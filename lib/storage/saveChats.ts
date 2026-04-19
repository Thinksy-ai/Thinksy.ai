import { Chat } from "@/store/chatStore";

export function saveChats(chats: Chat[], activeId: string) {
  if (typeof window === "undefined") return;

  localStorage.setItem("thinksy_chats", JSON.stringify(chats));
  localStorage.setItem("thinksy_active", activeId);
}
