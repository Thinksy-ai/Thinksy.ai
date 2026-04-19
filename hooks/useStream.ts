import { useState } from "react";
import { simulateStream } from "@/lib/stream/simulateStream";

export function useStream() {
  const [isStreaming, setIsStreaming] = useState(false);
  const [stopSignal, setStopSignal] = useState({ stop: false });

  const startStream = async (text: string, onUpdate: any) => {
    setIsStreaming(true);
    const signal = { stop: false };
    setStopSignal(signal);

    await simulateStream(text, onUpdate, signal);

    setIsStreaming(false);
  };

  const stop = () => {
    stopSignal.stop = true;
    setIsStreaming(false);
  };

  return { startStream, stop, isStreaming };
}
