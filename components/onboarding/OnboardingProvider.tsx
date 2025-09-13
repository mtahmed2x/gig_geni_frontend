"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAppSelector } from "@/store";
// We now need `isAuthenticated` to know when login is complete
import { selectUser, selectIsAuthenticated } from "@/store/slices/authSlice";
import { useRouteGuard } from "@/hooks/useRouteGuard";
// --- STEP 1: Import the useAuth hook to control the modals ---
import { useAuth } from "@/contexts/AuthProvider";

interface OnboardingProviderProps {
  children: React.ReactNode;
}

export function OnboardingProvider({ children }: OnboardingProviderProps) {
  const user = useAppSelector(selectUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated); // Get the auth status
  const router = useRouter();
  const pathname = usePathname();

  // --- STEP 2: Get the modal control function ---
  const { openLoginModal } = useAuth();

  // Initialize the route guard hook (this logic is unchanged)
  const {
    shouldShowLoginModal,
    intendedPath,
    handleLoginSuccess,
    handleLoginModalClose, // Note: this might need adjustment depending on its use
  } = useRouteGuard();

  // --- EFFECT 1: Trigger Login Modal for Protected Routes ---
  // This effect watches the route guard. If it says to show the modal, we call the context function.
  useEffect(() => {
    if (shouldShowLoginModal) {
      openLoginModal();
    }
  }, [shouldShowLoginModal, openLoginModal]);

  // --- EFFECT 2: Handle Post-Authentication Redirect ---
  // After a successful login (isAuthenticated becomes true), the route guard
  // can redirect the user to their original intended path.
  useEffect(() => {
    if (isAuthenticated && intendedPath) {
      handleLoginSuccess();
    }
  }, [isAuthenticated, intendedPath, handleLoginSuccess]);

  // --- EFFECT 3: Enforce Profile Completion (This logic is unchanged) ---
  // This is a great example of business logic that belongs in this provider.
  // useEffect(() => {
  //   if (user && user.verified) {
  //     // Assuming `isProfileComplete` exists
  //     if (pathname !== "/profile/complete") {
  //       // Or your specific profile completion route
  //       router.push("/profile/complete");
  //     }
  //   }
  // }, [user, router, pathname]);

  // --- STEP 3: Remove all local state and handlers for modals ---
  /*
  const [verificationEmail, setVerificationEmail] = useState(''); DELETED
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false); DELETED
  const handleAuthSuccess = ... DELETED
  const handleVerificationComplete = ... DELETED
  const handleBackToAuth = ... DELETED
  */

  // --- STEP 4: Remove the direct rendering of modals ---
  // The provider's only job is to render its children. AuthProvider handles the modals.
  return <>{children}</>;
}
