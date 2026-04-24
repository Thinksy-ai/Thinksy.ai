export default function VoiceSettings({
  rate,
  setRate,
  pitch,
  setPitch,
}: any) {
  return (
    <div style={{ padding: 5 }}>
      <div>
        Rate:
        <input
          type="range"
          min="0.5"
          max="2"
          step="0.1"
          value={rate}
          onChange={(e) => setRate(Number(e.target.value))}
        />
      </div>

      <div>
        Pitch:
        <input
          type="range"
          min="0"
          max="2"
          step="0.1"
          value={pitch}
          onChange={(e) => setPitch(Number(e.target.value))}
        />
      </div>
    </div>
  );
}
