import ChatActions from "./ChatActions";

export default function ChatItem({
  chat,
  active,
  onClick,
  renameChat,
  deleteChat
}: any) {
  return (
    <div
      onClick={onClick}
      style={{
        padding: 10,
        background: active ? "#333" : "transparent",
        cursor: "pointer"
      }}
    >
      <div>{chat.title}</div>

      <ChatActions
        chat={chat}
        renameChat={renameChat}
        deleteChat={deleteChat}
      />
    </div>
  );
}
