import ChatMessage from "./ChatMessage";

export default function ChatWindow({ messages }: any) {
  return (
    <div style={{ flex: 1, overflowY: "auto" }}>
      {messages.map((m: any, i: number) => (
        <ChatMessage key={i} {...m} />
      ))}
    </div>
  );
}
