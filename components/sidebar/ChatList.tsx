import ChatItem from "./ChatItem";

export default function ChatList({
  chats,
  activeId,
  setActiveId,
  renameChat,
  deleteChat,
}: any) {
  return (
    <div>
      {chats.map((chat: any) => (
        <ChatItem
          key={chat.id}
          chat={chat}
          active={chat.id === activeId}
          onClick={() => setActiveId(chat.id)}
          renameChat={renameChat}
          deleteChat={deleteChat}
        />
      ))}
    </div>
  );
}
