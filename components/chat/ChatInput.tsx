import { useState } from "react";
import FileUpload from "./FileUpload";
import FilePreview from "./FilePreview";
import { useSpeechToText } from "@/hooks/useSpeechToText";

export default function ChatInput({ input, setInput, send }: any) {
  const { start, listening } = useSpeechToText(setInput);
  const [file, setFile] = useState<any>(null);

  const handleSend = () => {
    send(file);
    setFile(null);
  };

  return (
    <div style={{ padding: 10 }}>
      <FileUpload onFile={setFile} />
      <FilePreview file={file} />

      <div style={{ display: "flex" }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{ flex: 1 }}
        />

        <button onClick={start}>
          {listening ? "🎙️..." : "🎤"}
        </button>

        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
}
