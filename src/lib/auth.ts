import { User } from "@/lib/features/user/types";

export type UserRole = "admin" | "employer" | "employee";

export interface RoutePermission {
  path: string;
  allowedRoles: UserRole[];
  requiresAuth: boolean;
  redirectTo?: string;
}

export const ROUTE_PERMISSIONS: RoutePermission[] = [
  {
    path: "/",
    allowedRoles: ["admin", "employer", "employee"],
    requiresAuth: false,
  },

  {
    path: "/competitions/my",
    allowedRoles: ["employee"],
    requiresAuth: true,
    redirectTo: "/",
  },
  {
    path: "/competitions/join",
    allowedRoles: ["employee"],
    requiresAuth: true,
    redirectTo: "/",
  },
  {
    path: "/competitions/quiz",
    allowedRoles: ["employee"],
    requiresAuth: true,
    redirectTo: "/",
  },
  {
    path: "/competitions/[id]/journey",
    allowedRoles: ["employee"],
    requiresAuth: true,
    redirectTo: "/",
  },

  // Employer-only routes
  {
    path: "/competitions/create",
    allowedRoles: ["employer"],
    requiresAuth: true,
    redirectTo: "/",
  },
  {
    path: "/competitions/manage",
    allowedRoles: ["employer"],
    requiresAuth: true,
    redirectTo: "/",
  },

  {
    path: "/competitions",
    allowedRoles: ["admin", "employer", "employee"],
    requiresAuth: true,
  },

  {
    path: "/leaderboards",
    allowedRoles: ["admin", "employer", "employee"],
    requiresAuth: true,
  },
  {
    path: "/contact",
    allowedRoles: ["admin", "employer", "employee"],
    requiresAuth: false,
  },

  {
    path: "/profile",
    allowedRoles: ["admin", "employer", "employee"],
    requiresAuth: true,
    redirectTo: "/",
  },
  {
    path: "/settings",
    allowedRoles: ["admin", "employer", "employee"],
    requiresAuth: true,
    redirectTo: "/",
  },
  {
    path: "/notifications",
    allowedRoles: ["admin", "employer", "employee"],
    requiresAuth: true,
    redirectTo: "/",
  },
];

export function checkRoutePermission(
  pathname: string,
  user: User | null
): {
  allowed: boolean;
  redirectTo?: string;
  reason?: string;
} {
  const routePermission = ROUTE_PERMISSIONS.find((route) => {
    if (route.path.includes("[")) {
      const routePattern = route.path.replace(/\[.*?\]/g, "[^/]+");
      const regex = new RegExp(`^${routePattern}$`);
      return regex.test(pathname);
    }

    if (route.path.includes("(") && route.path.includes(")")) {
      const routePattern = route.path.replace(/\([^)]+\)/g, "");
      return pathname.startsWith(routePattern);
    }

    return pathname === route.path || pathname.startsWith(route.path + "/");
  });

  if (!routePermission) {
    return { allowed: true };
  }

  if (routePermission.requiresAuth && !user) {
    return {
      allowed: false,
      redirectTo: routePermission.redirectTo || "/",
      reason: "Authentication required",
    };
  }

  if (user && !routePermission.allowedRoles.includes(user.role)) {
    return {
      allowed: false,
      redirectTo: "/access-denied",
      reason: `Access denied. Required roles: ${routePermission.allowedRoles.join(
        ", "
      )}`,
    };
  }

  return { allowed: true };
}

export function getRedirectPath(userRole: UserRole): string {
  switch (userRole) {
    case "admin":
      return "/";
    case "employer":
      return "/competitions";
    case "employee":
      return "/competitions";
    default:
      return "/";
  }
}

export function requiresRole(pathname: string, role: UserRole): boolean {
  const permission = ROUTE_PERMISSIONS.find((route) => {
    if (route.path.includes("[")) {
      const routePattern = route.path.replace(/\[.*?\]/g, "[^/]+");
      const regex = new RegExp(`^${routePattern}$`);
      return regex.test(pathname);
    }

    if (route.path.includes("(") && route.path.includes(")")) {
      const routePattern = route.path.replace(/\([^)]+\)/g, "");
      return pathname.startsWith(routePattern);
    }

    return pathname === route.path || pathname.startsWith(route.path + "/");
  });

  return permission
    ? permission.allowedRoles.includes(role) &&
        permission.allowedRoles.length === 1
    : false;
}
