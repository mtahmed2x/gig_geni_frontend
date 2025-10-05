"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppSelector } from "@/store/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Lock, UserX } from "lucide-react";
import { useAuth } from "@/contexts/AuthProvider";
import { UserRole } from "@/types";
import {
  selectCurrentUser,
  selectIsAuthenticated,
} from "@/store/features/auth/authSlice";

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  allowedRoles?: UserRole[];
  fallback?: React.ReactNode;
}

export function AuthGuard({
  children,
  requireAuth = true,
  allowedRoles = [],
  fallback,
}: AuthGuardProps) {
  const user = useAppSelector(selectCurrentUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);

  // Get the modal control function from the global context
  const { openLoginModal } = useAuth();

  // Effect to ensure the component only renders on the client
  useEffect(() => {
    setMounted(true);
  }, []);

  // Effect to handle URL-triggered authentication
  useEffect(() => {
    const authRequired = searchParams.get("auth");
    if (authRequired === "required" && !isAuthenticated) {
      openLoginModal();
    }

    // Logic to clear 'unauthorized' error from the URL
    const error = searchParams.get("error");
    if (error === "unauthorized") {
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete("error");
      router.replace(newUrl.pathname + newUrl.search);
    }
  }, [searchParams, isAuthenticated, router, openLoginModal]);

  // Avoid rendering during server-side rendering or hydration mismatch
  if (!mounted) {
    return null;
  }

  // If the page does not require authentication, render the children immediately
  if (!requireAuth) {
    return <>{children}</>;
  }

  // Check if the user is authenticated
  if (!isAuthenticated || !user) {
    if (fallback) {
      return <>{fallback}</>;
    }

    // Render a UI prompting the user to log in
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
              <Lock className="w-6 h-6 text-orange-600" />
            </div>
            <CardTitle>Authentication Required</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">
              You need to be logged in to access this page.
            </p>
            <Button
              onClick={openLoginModal} // Use the function from the context
              className="w-full"
            >
              Sign In
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push("/")}
              className="w-full"
            >
              Go Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Check for role-based access if roles are specified
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    if (fallback) {
      return <>{fallback}</>;
    }

    // Render an "Access Denied" message if the user's role is not allowed
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <UserX className="w-6 h-6 text-red-600" />
            </div>
            <CardTitle>Access Denied</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">
              You do not have permission to access this page.
            </p>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-left">
              <div className="flex items-center gap-2 text-amber-800">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm font-medium">
                  Required role: {allowedRoles.join(" or ")}
                </span>
              </div>
              <p className="text-sm text-amber-700 mt-1 pl-6">
                Your current role: {user.role}
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => router.push("/")}
              className="w-full"
            >
              Go Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // If the user is authenticated and has the required role, render the children
  return <>{children}</>;
}

/**
 * A utility hook for checking authentication and roles in components
 * without needing the full AuthGuard wrapper.
 */
export function useAuthGuard() {
  const user = useAppSelector(selectCurrentUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  const hasRole = (roles: UserRole[]) => {
    if (!isAuthenticated || !user) return false;
    return roles.includes(user.role);
  };

  const canAccess = (requiredRoles?: UserRole[]) => {
    if (!isAuthenticated || !user) return false;
    if (!requiredRoles || requiredRoles.length === 0) return true;
    // An admin can access everything
    if (user.role === "admin") return true;
    return requiredRoles.includes(user.role);
  };

  return {
    user,
    isAuthenticated,
    hasRole,
    canAccess,
  };
}
