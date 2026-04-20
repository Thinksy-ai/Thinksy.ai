export default function ChatActions({
  chat,
  renameChat,
  deleteChat,
}: any) {
  const rename = (e: any) => {
    e.stopPropagation();
    const newName = prompt("Rename chat:", chat.title);
    if (newName) renameChat(chat.id, newName);
  };

  const del = (e: any) => {
    e.stopPropagation();
    deleteChat(chat.id);
  };

  return (
    <div style={{ fontSize: 10, marginTop: 5 }}>
      <button onClick={rename}>Rename</button>
      <button onClick={del} style={{ marginLeft: 5 }}>
        Delete
      </button>
    </div>
  );
}
