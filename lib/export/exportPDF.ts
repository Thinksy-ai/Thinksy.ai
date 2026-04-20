export function exportPDF(messages: any[]) {
  const win = window.open("", "_blank");

  const content = messages
    .map((m) => `<p><b>${m.role}:</b> ${m.content}</p>`)
    .join("");

  win!.document.write(`
    <html>
      <head><title>Thinksy Chat</title></head>
      <body>${content}</body>
    </html>
  `);

  win!.print();
}
