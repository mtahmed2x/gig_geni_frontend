"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAppSelector } from "@/lib/hooks";
import { checkRoutePermission } from "@/lib/auth";
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
    const permission = checkRoutePermission(pathname, user);
    if (!permission.allowed) {
      if (!isAuthenticated) {
        setIntendedPath(pathname);
        setShouldShowLoginModal(true);
      } else {
        router.push(permission.redirectTo || "/access-denied");
      }
    } else {
      setShouldShowLoginModal(false);
    }
  }, [pathname, user, isAuthenticated, router]);

  const handleLoginSuccess = () => {
    setShouldShowLoginModal(false);
    if (intendedPath) {
      router.push(intendedPath);
      setIntendedPath(null);
    }
  };

  const handleLoginModalClose = () => {
    setShouldShowLoginModal(false);
    setIntendedPath(null);
    router.push("/");
  };

  return {
    shouldShowLoginModal,
    intendedPath,
    handleLoginSuccess,
    handleLoginModalClose,
  };
}
