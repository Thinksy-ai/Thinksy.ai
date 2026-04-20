import { useState } from "react";

export default function EditMessage({ content, onSave }: any) {
  const [value, setValue] = useState(content);

  return (
    <div>
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        style={{ width: "100%", padding: 8 }}
      />

      <button onClick={() => onSave(value)}>Save</button>
    </div>
  );
}
