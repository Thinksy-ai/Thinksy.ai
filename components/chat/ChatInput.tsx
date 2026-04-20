import { useSpeechToText } from "@/hooks/useSpeechToText";

export default function ChatInput({ input, setInput, send }: any) {
  const { start, listening } = useSpeechToText(setInput);

  return (
    <div style={{ display: "flex", padding: 10 }}>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        style={{ flex: 1, padding: 10 }}
      />

      <button onClick={start}>
        {listening ? "🎙️..." : "🎤"}
      </button>

      <button onClick={send}>Send</button>
    </div>
  );
}
