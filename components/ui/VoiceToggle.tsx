export default function VoiceToggle({ enabled, toggle }: any) {
  return (
    <button onClick={toggle}>
      {enabled ? "🔊 Voice ON" : "🔇 Voice OFF"}
    </button>
  );
}
