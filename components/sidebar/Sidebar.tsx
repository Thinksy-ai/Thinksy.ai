import ChatList from "./ChatList";
import NewChatButton from "./NewChatButton";

export default function Sidebar() {
  return (
    <div style={{
      width: 260,
      background: "#111",
      color: "#fff",
      display: "flex",
      flexDirection: "column"
    }}>
      <NewChatButton />
      <ChatList />
    </div>
  );
}
