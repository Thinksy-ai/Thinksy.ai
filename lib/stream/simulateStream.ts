export async function simulateStream(
  text: string,
  onUpdate: (chunk: string) => void,
  signal: { stop: boolean }
) {
  let current = "";

  for (let i = 0; i < text.length; i++) {
    if (signal.stop) break;

    current += text[i];
    onUpdate(current);

    await new Promise((r) => setTimeout(r, 10));
  }
}
