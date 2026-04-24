import { useState } from "react";

export function useSpeechSynthesis() {
  const [enabled, setEnabled] = useState(false);

  const speak = (text: string, rate = 1, pitch = 1) => {
    if (!enabled) return;

    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = rate;
    utter.pitch = pitch;

    window.speechSynthesis.cancel(); // stop previous
    window.speechSynthesis.speak(utter);
  };

  const stop = () => {
    window.speechSynthesis.cancel();
  };

  return {
    enabled,
    setEnabled,
    speak,
    stop,
  };
}
