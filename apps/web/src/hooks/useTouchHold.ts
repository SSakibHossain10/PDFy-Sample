import { useCallback, useState } from "react";

type UseTouchHoldOptions = {
  onHold: () => void; // Function to call repeatedly
  holdStartDelay?: number; // Initial delay before the first call (default 500ms)
  holdInterval?: number; // Interval for subsequent calls (default 200ms)
};

const useTouchHold = ({ onHold, holdStartDelay = 500, holdInterval = 100 }: UseTouchHoldOptions) => {
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
  const [startTimeoutId, setStartTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const handleholdStart = useCallback(() => {
    // First, delay for `holdStartDelay` before setting up the repeated `holdInterval`
    const startId = setTimeout(() => {
      onHold(); // Call immediately after `holdStartDelay`

      // Begin repeated calls after `holdInterval`
      const repeatId = setInterval(() => {
        onHold();
      }, holdInterval);
      setIntervalId(repeatId);
    }, holdStartDelay);

    setStartTimeoutId(startId);
  }, [onHold, holdStartDelay, holdInterval]);

  const handleholdEnd = useCallback(() => {
    // Clear both the initial timeout and the interval
    if (startTimeoutId) {
      clearTimeout(startTimeoutId);
      setStartTimeoutId(null);
    }
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
  }, [startTimeoutId, intervalId]);

  return {
    handleholdStart,
    handleholdEnd,
  };
};

export default useTouchHold;
