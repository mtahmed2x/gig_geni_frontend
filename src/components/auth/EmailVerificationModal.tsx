"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Clock, RefreshCw, AlertCircle, ArrowLeft } from "lucide-react";
import { useVerifyOtpMutation } from "@/store/api/authApi";
import { OtpInput } from "./OtpInput";
import { VerificationSuccess } from "./VerificationSuccess";
import { useOtpTimer } from "@/hooks/useOtpTimer";

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
  const { countdown, canResend, resetTimer } = useOtpTimer(60);

  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [error, setError] = useState("");
  const [isVerified, setIsVerified] = useState(false);

  // Reset state whenever the modal is opened
  useEffect(() => {
    if (isOpen) {
      setOtp(Array(6).fill(""));
      setError("");
      setIsVerified(false);
      resetTimer();
    }
  }, [isOpen, resetTimer]);

  const handleVerify = async (otpCode: string) => {
    if (otpCode.length !== 6) {
      setError("Please enter the complete 6-digit code.");
      return;
    }
    if (!tempToken) {
      setError("Verification session expired. Please register again.");
      return;
    }
    setError("");

    try {
      const result = await verifyOtp({
        payload: { otp: otpCode },
        tempToken,
      }).unwrap();

      setIsVerified(true);
      setTimeout(() => {
        onClose();
        // Role-based redirection
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
      setError(err.data?.message || "Invalid verification code.");
    }
  };

  const handleResend = async () => {
    // Implement resend API call here, then reset the timer.
    // e.g., await resendOtp({ email }).unwrap();
    console.log("Resending OTP for:", email);
    setError("");
    resetTimer();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      {isVerified ? (
        <VerificationSuccess />
      ) : (
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
          <div className="p-8 pt-0 space-y-6">
            <OtpInput
              otp={otp}
              setOtp={setOtp}
              isDisabled={isLoading}
              onComplete={handleVerify}
            />
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Button
              onClick={() => handleVerify(otp.join(""))}
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
      )}
    </Dialog>
  );
}
