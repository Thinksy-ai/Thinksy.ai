export default function ChatInput({ input, setInput, send }: any) {
  return (
    <div style={{ display: "flex", padding: 10 }}>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        style={{ flex: 1 }}
      />
      <button onClick={send}>Send</button>
    </div>
  );
}
