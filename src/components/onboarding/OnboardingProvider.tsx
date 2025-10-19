"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAppSelector } from "@/lib/hooks";

import { useRouteGuard } from "@/hooks/useRouteGuard";
import { useAuth } from "@/contexts/AuthProvider";
import {
  selectCurrentUser,
  selectIsAuthenticated,
} from "@/lib/features/auth/authSlice";

interface OnboardingProviderProps {
  children: React.ReactNode;
}

export function OnboardingProvider({ children }: OnboardingProviderProps) {
  const user = useAppSelector(selectCurrentUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const router = useRouter();
  const pathname = usePathname();

  const { openLoginModal, authModalState } = useAuth();

  const {
    shouldShowLoginModal,
    intendedPath,
    handleLoginSuccess,
    handleLoginModalClose,
  } = useRouteGuard();

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
    if (shouldShowLoginModal && !authModalState.isOpen) {
      handleLoginModalClose();
    }
  }, [shouldShowLoginModal, authModalState.isOpen, handleLoginModalClose]);
  return <>{children}</>;
}
