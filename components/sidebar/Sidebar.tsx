import ChatList from "./ChatList";
import NewChatButton from "./NewChatButton";
import ThemeToggle from "../ui/ThemeToggle";
import { useTheme } from "@/hooks/useTheme";

export default function Sidebar({
  chats,
  activeId,
  setActiveId,
  newChat,
  renameChat,
  deleteChat,
}: any) {
  const { toggleTheme } = useTheme();

  return (
    <div
      style={{
        width: 260,
        background: "#111",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        padding: 10,
      }}
    >
      <ThemeToggle toggle={toggleTheme} />

      <NewChatButton newChat={newChat} />

      <ChatList
        chats={chats}
        activeId={activeId}
        setActiveId={setActiveId}
        renameChat={renameChat}
        deleteChat={deleteChat}
      />
    </div>
  );
}
