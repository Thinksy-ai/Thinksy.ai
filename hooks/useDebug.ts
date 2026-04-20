import { useState } from "react";

export function useDebug() {
  const [error, setError] = useState<string | null>(null);

  const wrap = async (fn: Function) => {
    try {
      await fn();
    } catch (e: any) {
      console.error(e);
      setError(e.message || "Unknown error");
    }
  };

  return { error, setError, wrap };
}
