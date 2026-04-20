import { useState } from "react";
import Markdown from "../ui/Markdown";
import MessageActions from "./MessageActions";
import EditMessage from "./EditMessage";

export default function ChatMessage({
  role,
  content,
  index,
  onEdit,
  onRegenerate,
}: any) {
  const [editing, setEditing] = useState(false);
  const isUser = role === "user";

  return (
    <div
      style={{
        display: "flex",
        justifyContent: isUser ? "flex-end" : "flex-start",
        padding: "6px 12px",
      }}
    >
      <div
        style={{
          maxWidth: "70%",
          padding: "10px 14px",
          borderRadius: 12,
          background: isUser ? "#2563eb" : "#1e1e1e",
          color: "#fff",
        }}
      >
        {editing ? (
          <EditMessage
            content={content}
            onSave={(val: string) => {
              onEdit(index, val);
              setEditing(false);
            }}
          />
        ) : (
          <Markdown content={content} />
        )}

        <div style={{ marginTop: 5 }}>
          {isUser && (
            <button onClick={() => setEditing(true)}>Edit</button>
          )}

          {!isUser && (
            <button onClick={() => onRegenerate(index)}>
              Regenerate
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
