"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAppSelector } from "@/lib/hooks";
import { checkRoutePermission, getRedirectPath } from "@/lib/auth";
import {
  selectCurrentUser,
  selectIsAuthenticated,
} from "@/lib/features/auth/authSlice";

export function useRouteGuard() {
  const user = useAppSelector(selectCurrentUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const router = useRouter();
  const pathname = usePathname();

  const [shouldShowLoginModal, setShouldShowLoginModal] = useState(false);
  const [intendedPath, setIntendedPath] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const permission = checkRoutePermission(pathname, user);

    if (!permission.allowed) {
      if (!isAuthenticated) {
        if (pathname !== "/") {
          setIntendedPath(pathname);
        }
        setShouldShowLoginModal(true);
      } else {
        router.push(permission.redirectTo || "/access-denied");
      }
    } else {
      setShouldShowLoginModal(false);
    }
  }, [pathname, user, isAuthenticated, router]);
  const handleLoginSuccess = useCallback(() => {
    setShouldShowLoginModal(false);
    if (intendedPath) {
      router.push(intendedPath);
      setIntendedPath(null);
    } else if (user) {
      const defaultPath = getRedirectPath(user.role);
      router.push(defaultPath);
    } else {
      router.push("/");
    }
  }, [intendedPath, user, router]);

  const handleLoginModalClose = useCallback(() => {
    setShouldShowLoginModal(false);
    setIntendedPath(null);
    if (pathname !== "/") {
      router.push("/");
    }
  }, [pathname, router]);

  return {
    shouldShowLoginModal,
    intendedPath,
    handleLoginSuccess,
    handleLoginModalClose,
  };
}
