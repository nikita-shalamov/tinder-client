// src/hooks/useProgress.ts
import { useState, useCallback } from "react";

const useProgress = (initialValue = 0) => {
  const [progress, setProgress] = useState(initialValue);

  const increaseProgress = useCallback(() => {
    setProgress((prev) => (prev < 3 ? prev + 1 : prev));
  }, []);

  const decreaseProgress = useCallback(() => {
    setProgress((prev) => (prev > 0 ? prev - 1 : prev));
  }, []);

  return { progress, increaseProgress, decreaseProgress };
};

export default useProgress;
