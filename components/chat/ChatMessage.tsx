import Markdown from "../ui/Markdown";

export default function ChatMessage({ role, content }: any) {
  return (
    <div style={{ padding: 10, textAlign: role === "user" ? "right" : "left" }}>
      <div style={{ display: "inline-block", background: "#eee", padding: 10 }}>
        <Markdown content={content} />
      </div>
    </div>
  );
}
