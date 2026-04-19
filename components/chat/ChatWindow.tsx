import ChatMessage from "./ChatMessage";
import { useAutoScroll } from "@/hooks/useAutoScroll";

export default function ChatWindow({ messages }: any) {
  const bottomRef = useAutoScroll(messages);

  return (
    <div style={{
      flex: 1,
      overflowY: "auto",
      padding: 10
    }}>
      {messages.map((m: any, i: number) => (
        <ChatMessage key={i} {...m} />
      ))}

      <div ref={bottomRef} />
    </div>
  );
}
