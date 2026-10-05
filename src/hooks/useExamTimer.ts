"use client";

import * as React from "react";

interface UseExamTimerProps {
  durationMinutes: number;
  onTimeUp?: () => void;
}

export function useExamTimer({ durationMinutes, onTimeUp }: UseExamTimerProps) {
  const [secondsRemaining, setSecondsRemaining] = React.useState(
    durationMinutes * 60
  );
  const [isRunning, setIsRunning] = React.useState(true);

  const onTimeUpRef = React.useRef(onTimeUp);
  React.useEffect(() => {
    onTimeUpRef.current = onTimeUp;
  }, [onTimeUp]);

  React.useEffect(() => {
    if (!isRunning || secondsRemaining <= 0) return;

    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsRunning(false);
          onTimeUpRef.current?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning, secondsRemaining]);

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const formattedTime = `${String(minutes).padStart(2, "0")}:${String(
    seconds
  ).padStart(2, "0")}`;

  const isLowTime = secondsRemaining <= 300; // <= 5 minutes

  const stop = () => setIsRunning(false);

  return {
    secondsRemaining,
    formattedTime,
    isLowTime,
    isRunning,
    stop,
  };
}
