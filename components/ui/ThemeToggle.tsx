export default function ThemeToggle({ toggle }: any) {
  return (
    <button
      onClick={toggle}
      style={{
        padding: "6px 10px",
        borderRadius: 6,
        cursor: "pointer"
      }}
    >
      🌙 / ☀️
    </button>
  );
}
