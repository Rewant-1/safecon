"use client";

import { useState, useCallback } from "react";

interface ProcessorState<T> {
  status: "idle" | "processing" | "done" | "error";
  progress: number; // 0–100
  result: T | null;
  error: string | null;
}

export function useFileProcessor<T>() {
  const [state, setState] = useState<ProcessorState<T>>({
    status: "idle",
    progress: 0,
    result: null,
    error: null,
  });

  const process = useCallback(
    async (processFn: (onProgress: (pct: number) => void) => Promise<T>) => {
      setState({ status: "processing", progress: 0, result: null, error: null });

      try {
        const result = await processFn((pct) => {
          setState((prev) => ({ ...prev, progress: pct }));
        });
        setState({ status: "done", progress: 100, result, error: null });
        return result;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "An unknown error occurred";
        setState({ status: "error", progress: 0, result: null, error: message });
        throw err;
      }
    },
    []
  );

  const reset = useCallback(() => {
    setState({ status: "idle", progress: 0, result: null, error: null });
  }, []);

  return { ...state, process, reset };
}
