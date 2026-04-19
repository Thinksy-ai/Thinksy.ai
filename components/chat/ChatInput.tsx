export default function ChatInput({ input, setInput, send }: any) {
  return (
    <div
      style={{
        display: "flex",
        padding: 10,
        borderTop: "1px solid #ccc"
      }}
    >
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Message Thinksy..."
        style={{
          flex: 1,
          padding: 10,
          borderRadius: 8,
          border: "1px solid #ccc"
        }}
      />

      <button
        onClick={send}
        style={{
          marginLeft: 10,
          padding: "10px 14px",
          borderRadius: 8,
          background: "#2563eb",
          color: "#fff"
        }}
      >
        Send
      </button>
    </div>
  );
}
