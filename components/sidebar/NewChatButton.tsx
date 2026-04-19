export default function NewChatButton({ newChat }: any) {
  return (
    <button onClick={newChat} style={{ margin: 10 }}>
      + New Chat
    </button>
  );
}
