"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { AuthModal } from "@/components/auth/AuthModal";
import { EmailVerificationModal } from "@/components/auth/EmailVerificationModal";

interface AuthContextType {
  openLoginModal: () => void;
  openSignupModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authModalState, setAuthModalState] = useState<{
    isOpen: boolean;
    mode: "login" | "signup";
  }>({ isOpen: false, mode: "login" });
  const [verificationModalState, setVerificationModalState] = useState<{
    isOpen: boolean;
    email: string;
  }>({ isOpen: false, email: "" });
  const [tempToken, setTempToken] = useState<string | null>(null);

  const openLoginModal = () =>
    setAuthModalState({ isOpen: true, mode: "login" });
  const openSignupModal = () =>
    setAuthModalState({ isOpen: true, mode: "signup" });

  const closeModals = () => {
    setAuthModalState({ isOpen: false, mode: "login" });
    setVerificationModalState({ isOpen: false, email: "" });
    setTempToken(null);
  };

  const handleVerificationNeeded = (email: string, token: string) => {
    setAuthModalState({ isOpen: false, mode: "login" });
    setTempToken(token);
    setVerificationModalState({ isOpen: true, email });
  };

  const handleBackToAuth = () => {
    setVerificationModalState({ isOpen: false, email: "" });
    setTempToken(null);
    setAuthModalState({ isOpen: true, mode: "login" });
  };

  return (
    <AuthContext.Provider value={{ openLoginModal, openSignupModal }}>
      {children}
      <AuthModal
        isOpen={authModalState.isOpen}
        onClose={closeModals}
        defaultMode={authModalState.mode}
        onVerificationNeeded={handleVerificationNeeded}
      />
      <EmailVerificationModal
        isOpen={verificationModalState.isOpen}
        onClose={closeModals}
        email={verificationModalState.email}
        tempToken={tempToken}
        onBackToAuth={handleBackToAuth}
      />
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
