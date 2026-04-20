export default function DebugPanel({ error }: any) {
  if (!error) return null;

  return (
    <div
      style={{
        background: "#300",
        color: "#fff",
        padding: 10,
        fontSize: 12,
      }}
    >
      ⚠ ERROR: {error}
    </div>
  );
}
