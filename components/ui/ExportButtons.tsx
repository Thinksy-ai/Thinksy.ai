import { exportTXT } from "@/lib/export/exportTXT";
import { exportPDF } from "@/lib/export/exportPDF";

export default function ExportButtons({ messages }: any) {
  const copyAll = () => {
    const text = messages
      .map((m: any) => `${m.role}: ${m.content}`)
      .join("\n\n");

    navigator.clipboard.writeText(text);
    alert("Copied!");
  };

  return (
    <div style={{ padding: 5 }}>
      <button onClick={() => exportTXT(messages)}>TXT</button>
      <button onClick={() => exportPDF(messages)}>PDF</button>
      <button onClick={copyAll}>Copy</button>
    </div>
  );
}
