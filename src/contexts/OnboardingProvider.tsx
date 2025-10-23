"use client";

import { useEffect } from "react";

import { useAppSelector } from "@/lib/hooks";

import { useRouteGuard } from "@/hooks/useRouteGuard";
import { useAuth } from "@/contexts/AuthProvider";
import { selectIsAuthenticated } from "@/lib/features/auth/authSlice";
import { usePrevious } from "@/hooks/usePrevious";

interface OnboardingProviderProps {
  children: React.ReactNode;
}

export function OnboardingProvider({ children }: OnboardingProviderProps) {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const { openLoginModal, authModalState } = useAuth();

  const {
    shouldShowLoginModal,
    intendedPath,
    handleLoginSuccess,
    handleLoginModalClose,
  } = useRouteGuard();

  const isModalOpen = authModalState.isOpen;
  const wasModalOpen = usePrevious(isModalOpen);

  useEffect(() => {
    if (shouldShowLoginModal) {
      openLoginModal();
    }
  }, [shouldShowLoginModal, openLoginModal]);

  useEffect(() => {
    if (isAuthenticated && intendedPath) {
      handleLoginSuccess();
    }
  }, [isAuthenticated, intendedPath, handleLoginSuccess]);

  useEffect(() => {
    if (wasModalOpen && !isModalOpen && !isAuthenticated) {
      handleLoginModalClose();
    }
  }, [isModalOpen, wasModalOpen, isAuthenticated, handleLoginModalClose]);

  return <>{children}</>;
}
