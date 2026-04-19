export default function CodeBlock({ code }: { code: string }) {
  return (
    <div>
      <button onClick={() => navigator.clipboard.writeText(code)}>
        Copy
      </button>
      <pre style={{ background: "#111", color: "#0f0", padding: 10 }}>
        <code>{code}</code>
      </pre>
    </div>
  );
}
