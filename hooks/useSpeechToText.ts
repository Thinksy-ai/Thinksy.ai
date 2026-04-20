import { useState } from "react";

export function useSpeechToText(setInput: any) {
  const [listening, setListening] = useState(false);

  const start = () => {
    const SpeechRecognition =
      (window as any).webkitSpeechRecognition ||
      (window as any).SpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech not supported in this browser");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";

    recognition.onstart = () => setListening(true);

    recognition.onresult = (event: any) => {
      const text = event.results[0][0].transcript;
      setInput((prev: string) => prev + " " + text);
    };

    recognition.onend = () => setListening(false);

    recognition.start();
  };

  return { start, listening };
}
