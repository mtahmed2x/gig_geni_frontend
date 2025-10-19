"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from "react";
import { AuthModal } from "@/components/auth/AuthModal";
import { EmailVerificationModal } from "@/components/auth/EmailVerificationModal";

interface AuthContextType {
  openLoginModal: () => void;
  openSignupModal: () => void;
  authModalState: { isOpen: boolean; mode: "login" | "signup" };
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

  // 2. Wrap your functions in useCallback
  const openLoginModal = useCallback(() => {
    setAuthModalState({ isOpen: true, mode: "login" });
  }, []); // Empty dependency array means this function is created only once

  const openSignupModal = useCallback(() => {
    setAuthModalState({ isOpen: true, mode: "signup" });
  }, []);

  const closeModals = useCallback(() => {
    setAuthModalState({ isOpen: false, mode: "login" });
    setVerificationModalState({ isOpen: false, email: "" });
    setTempToken(null);
  }, []);

  const handleVerificationNeeded = useCallback(
    (email: string, token: string) => {
      setAuthModalState({ isOpen: false, mode: "login" });
      setTempToken(token);
      setVerificationModalState({ isOpen: true, email });
    },
    []
  );

  const handleBackToAuth = useCallback(() => {
    setVerificationModalState({ isOpen: false, email: "" });
    setTempToken(null);
    setAuthModalState({ isOpen: true, mode: "login" });
  }, []);

  // 3. Pass the stable functions to the provider value
  const contextValue = {
    openLoginModal,
    openSignupModal,
    authModalState,
  };

  return (
    <AuthContext.Provider value={contextValue}>
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
