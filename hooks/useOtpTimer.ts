"use client";

import { useState, useEffect, useCallback } from "react";

export function useOtpTimer(initialTime: number = 60) {
  const [countdown, setCountdown] = useState(initialTime);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (countdown === 0) {
      setCanResend(true);
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  const resetTimer = useCallback(() => {
    setCountdown(initialTime);
    setCanResend(false);
  }, [initialTime]);

  return { countdown, canResend, resetTimer };
}
