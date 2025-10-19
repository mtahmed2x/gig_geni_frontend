"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { UserTypeSelection } from "./UserTypeSelection";
import { SignupForm } from "./SignupForm";
import { UserRole } from "@/lib/features/user/types";

interface SignupFlowProps {
  onVerificationNeeded: (email: string, tempAccessToken: string) => void;
  onSwitchToLogin: () => void;
}

export function SignupFlow({
  onVerificationNeeded,
  onSwitchToLogin,
}: SignupFlowProps) {
  const [step, setStep] = useState(1);
  const [userType, setUserType] = useState<UserRole | null>(null);

  const handleUserTypeSelect = (role: UserRole) => {
    setUserType(role);
    setStep(2);
  };

  const animation = {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
    transition: { duration: 0.3 },
  };

  return (
    <div className="p-8">
      <AnimatePresence mode="wait">
        {step === 1 ? (
          <motion.div key="step1" {...animation}>
            <UserTypeSelection
              onSelect={handleUserTypeSelect}
              onSwitchToLogin={onSwitchToLogin}
            />
          </motion.div>
        ) : (
          <motion.div key="step2" {...animation}>
            <SignupForm
              userType={userType!}
              onBack={() => setStep(1)}
              onVerificationNeeded={onVerificationNeeded}
              onSwitchToLogin={onSwitchToLogin}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
