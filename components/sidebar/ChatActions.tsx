export default function ChatActions({ chat }: any) {
  const rename = () => {
    const newName = prompt("Rename chat:", chat.title);
    if (newName) chat.rename(chat.id, newName);
  };

  const del = () => {
    chat.delete(chat.id);
  };

  return (
    <div style={{ fontSize: 10 }}>
      <button onClick={rename}>Rename</button>
      <button onClick={del}>Delete</button>
    </div>
  );
}
