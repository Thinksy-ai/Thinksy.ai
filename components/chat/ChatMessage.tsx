import Markdown from "../ui/Markdown";
import MessageActions from "./MessageActions";

export default function ChatMessage({ role, content }: any) {
  return (
    <div style={{
      padding: 10,
      textAlign: role === "user" ? "right" : "left"
    }}>
      <div style={{
        display: "inline-block",
        background: role === "user" ? "#4a90e2" : "#eee",
        color: role === "user" ? "#fff" : "#000",
        padding: 10,
        borderRadius: 8
      }}>
        <Markdown content={content} />
      </div>

      {role === "assistant" && (
        <MessageActions content={content} />
      )}
    </div>
  );
}
