export default function MessageActions({ content }: any) {
  const copy = () => navigator.clipboard.writeText(content);

  return (
    <div style={{ marginTop: 5, fontSize: 12 }}>
      <button onClick={copy}>Copy</button>
      <button style={{ marginLeft: 10 }}>Regenerate</button>
    </div>
  );
}
