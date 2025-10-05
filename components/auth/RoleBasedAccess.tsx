"use client";

import { useAppSelector } from "@/store/store";
import { UserRole } from "@/lib/auth";
import { selectCurrentUser } from "@/store/features/auth/authSlice";

interface RoleBasedAccessProps {
  allowedRoles: UserRole[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function RoleBasedAccess({
  allowedRoles,
  children,
  fallback = null,
}: RoleBasedAccessProps) {
  const user = useAppSelector(selectCurrentUser);

  if (!user || !allowedRoles.includes(user.role)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

export function EmployeeOnly({
  children,
  fallback,
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  return (
    <RoleBasedAccess allowedRoles={["employee"]} fallback={fallback}>
      {children}
    </RoleBasedAccess>
  );
}

export function EmployerOnly({
  children,
  fallback,
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  return (
    <RoleBasedAccess allowedRoles={["employer"]} fallback={fallback}>
      {children}
    </RoleBasedAccess>
  );
}

export function AdminOnly({
  children,
  fallback,
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  return (
    <RoleBasedAccess allowedRoles={["admin"]} fallback={fallback}>
      {children}
    </RoleBasedAccess>
  );
}

export function AuthenticatedOnly({
  children,
  fallback,
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  return (
    <RoleBasedAccess
      allowedRoles={["admin", "employer", "employee"]}
      fallback={fallback}
    >
      {children}
    </RoleBasedAccess>
  );
}
