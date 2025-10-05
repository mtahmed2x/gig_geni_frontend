"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { LoginForm } from "./LoginForm";
import { SignupFlow } from "./SignupFlow";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: "login" | "signup";
  onVerificationNeeded: (email: string, tempAccessToken: string) => void;
}

export function AuthModal({
  isOpen,
  onClose,
  defaultMode = "login",
  onVerificationNeeded,
}: AuthModalProps) {
  const [mode, setMode] = useState<"login" | "signup">(defaultMode);

  const handleModeSwitch = (newMode: "login" | "signup") => {
    setMode(newMode);
  };

  // Reset mode to default when closing the modal to ensure it opens correctly next time
  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setMode(defaultMode);
    }, 300); // Delay allows for exit animation before state reset
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md mx-auto p-0 overflow-hidden">
        <AnimatePresence mode="wait">
          {mode === "login" ? (
            <motion.div
              key="login"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <LoginForm
                onClose={handleClose}
                onSwitchToSignup={() => handleModeSwitch("signup")}
              />
            </motion.div>
          ) : (
            <motion.div
              key="signup"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <SignupFlow
                onVerificationNeeded={onVerificationNeeded}
                onSwitchToLogin={() => handleModeSwitch("login")}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
