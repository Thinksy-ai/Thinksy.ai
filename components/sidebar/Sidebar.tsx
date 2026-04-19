import ChatList from "./ChatList";
import NewChatButton from "./NewChatButton";

export default function Sidebar({
  chats,
  activeId,
  setActiveId,
  newChat
}: any) {
  return (
    <div style={{ width: 260, background: "#111", color: "#fff" }}>
      <NewChatButton newChat={newChat} />
      <ChatList
        chats={chats}
        activeId={activeId}
        setActiveId={setActiveId}
      />
    </div>
  );
}
