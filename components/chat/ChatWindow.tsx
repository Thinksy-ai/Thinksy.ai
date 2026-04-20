import ChatMessage from "./ChatMessage";
import { useAutoScroll } from "@/hooks/useAutoScroll";

export default function ChatWindow({
  messages,
  onEdit,
  onRegenerate,
}: any) {
  const bottomRef = useAutoScroll(messages);

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: 10 }}>
      {messages.map((m: any, i: number) => (
        <ChatMessage
          key={i}
          index={i}
          {...m}
          onEdit={onEdit}
          onRegenerate={onRegenerate}
        />
      ))}

      <div ref={bottomRef} />
    </div>
  );
}
