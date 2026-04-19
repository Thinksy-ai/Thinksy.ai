import Markdown from "../ui/Markdown";
import MessageActions from "./MessageActions";

export default function ChatMessage({ role, content }: any) {
  const isUser = role === "user";

  return (
    <div
      style={{
        display: "flex",
        justifyContent: isUser ? "flex-end" : "flex-start",
        padding: "6px 12px"
      }}
    >
      <div
        style={{
          maxWidth: "70%",
          padding: "10px 14px",
          borderRadius: 12,
          background: isUser
            ? "var(--chat-user)"
            : "var(--chat-ai)",
          color: isUser ? "#fff" : "var(--text)"
        }}
      >
        <Markdown content={content} />

        {!isUser && (
          <div style={{ marginTop: 5 }}>
            <MessageActions content={content} />
          </div>
        )}
      </div>
    </div>
  );
}
