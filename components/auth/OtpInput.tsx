"use client";

import { KeyboardEvent } from "react";
import { Input } from "@/components/ui/input";

interface OtpInputProps {
  otp: string[];
  setOtp: (otp: string[]) => void;
  isDisabled?: boolean;
  onComplete: (fullOtp: string) => void;
}

export function OtpInput({
  otp,
  setOtp,
  isDisabled,
  onComplete,
}: OtpInputProps) {
  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return; // Only allow digits

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // Take only the last digit
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }

    // Check if OTP is complete and trigger onComplete
    const fullOtp = newOtp.join("");
    if (fullOtp.length === 6) {
      onComplete(fullOtp);
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent) => {
    // Handle backspace to focus previous input
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  return (
    <div className="flex justify-center space-x-2">
      {otp.map((digit, index) => (
        <Input
          key={index}
          id={`otp-${index}`}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={(e) => handleOtpChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          className="w-12 h-14 text-center text-2xl font-semibold"
          autoComplete="one-time-code"
          disabled={isDisabled}
        />
      ))}
    </div>
  );
}
