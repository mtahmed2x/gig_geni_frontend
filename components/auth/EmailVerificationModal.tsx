"use client";

import { useState, useEffect, KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  CheckCircle,
  Clock,
  RefreshCw,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";
import { useVerifyOtpMutation } from "@/store/api/authApi";

interface EmailVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
  tempToken: string | null;
  onBackToAuth?: () => void;
}

export function EmailVerificationModal({
  isOpen,
  onClose,
  email,
  tempToken,
  onBackToAuth,
}: EmailVerificationModalProps) {
  const router = useRouter();

  const [verifyOtp, { isLoading }] = useVerifyOtpMutation();

  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [error, setError] = useState("");
  const [isVerified, setIsVerified] = useState(false);

  // All useEffect hooks for local state management remain the same
  useEffect(() => {
    if (countdown > 0 && !canResend) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && !canResend) {
      setCanResend(true);
    }
  }, [countdown, canResend]);

  useEffect(() => {
    if (isOpen) {
      setOtp(Array(6).fill(""));
      setError("");
      setIsVerified(false);
      setCountdown(60);
      setCanResend(false);
    }
  }, [isOpen]);

  // UI interaction handlers remain the same
  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return; // Only allow digits
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setError("");
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
    const fullOtp = newOtp.join("");
    if (fullOtp.length === 6) {
      handleVerify(fullOtp);
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  // --- STEP 3: Refactor the handleVerify function ---
  const handleVerify = async (otpCode?: string) => {
    const code = otpCode || otp.join("");
    if (code.length !== 6) {
      setError("Please enter the complete 6-digit code");
      return;
    }
    if (!tempToken) {
      setError("Verification session expired. Please register again.");
      return;
    }
    setError("");

    try {
      // Use the 'verifyOtp' trigger from the hook and .unwrap() the result
      const result = await verifyOtp({
        payload: { otp: code },
        tempToken,
      }).unwrap();

      // On success, 'result' is the fulfilled payload
      setIsVerified(true);
      setTimeout(() => {
        onClose();
        const userRole = result.user.role;
        switch (userRole) {
          case "admin":
            router.push("/admin/dashboard");
            break;
          case "employer":
            router.push("/employer/dashboard");
            break;
          case "employee":
            router.push("/employee/dashboard");
            break;
          default:
            router.push("/");
        }
      }, 2000);
    } catch (err: any) {
      // On failure, .unwrap() throws, and we catch the error here
      setError(err.data?.message || "Invalid verification code.");
    }
  };

  const handleResend = async () => {
    // Implement resend logic here. You would likely have another mutation
    // like `useResendOtpMutation` and call it here in a try/catch block.
    // For now, it resets the timer as a placeholder.
    console.log("Resending OTP for:", email);
    setCanResend(false);
    setCountdown(60);
    setError("");
  };

  // --- No changes needed to the JSX, it already uses the 'isLoading' variable ---

  if (isVerified) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center p-8"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle className="h-10 w-10 text-green-600" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-2xl font-bold mb-3">Email Verified!</h2>
              <p className="text-muted-foreground mb-6">
                Redirecting you to your dashboard...
              </p>
              <Badge variant="outline">
                <CheckCircle className="h-3 w-3 mr-1" />
                Verification Complete
              </Badge>
            </motion.div>
          </motion.div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader className="text-center">
          <DialogTitle className="text-3xl font-bold">
            Verify Your Email
          </DialogTitle>
          <p className="text-muted-foreground">
            We've sent a 6-digit code to{" "}
            <span className="font-semibold text-primary">{email}</span>
          </p>
        </DialogHeader>
        <div className="p-8 space-y-6">
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
                autoComplete="off"
                disabled={isLoading}
              />
            ))}
          </div>
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <Button
            onClick={() => handleVerify()}
            disabled={isLoading || otp.join("").length !== 6}
            className="w-full h-12"
          >
            {isLoading ? "Verifying..." : "Verify & Sign In"}
          </Button>
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>
                {canResend
                  ? "You can now resend the code"
                  : `Resend code in ${countdown}s`}
              </span>
            </div>
            <Button
              variant="outline"
              onClick={handleResend}
              disabled={!canResend || isLoading}
              className="w-full"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Resend Code
            </Button>
          </div>
          {onBackToAuth && (
            <div className="text-center pt-4 border-t">
              <Button
                variant="ghost"
                onClick={onBackToAuth}
                disabled={isLoading}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Login
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
