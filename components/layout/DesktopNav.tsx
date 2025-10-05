"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Bell,
  User,
  UserCircle,
  Settings,
  FileCog,
  Plus,
  Trophy,
  MessageCircle,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NavLink } from "./NavLink";
// --- STEP 1: Import the useAuth hook ---
import { useAuth } from "@/contexts/AuthProvider";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { logout, selectCurrentUser } from "@/store/features/auth/authSlice";

export function DesktopNav() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectCurrentUser);

  // --- STEP 2: Get the modal control functions from the context ---
  const { openLoginModal, openSignupModal } = useAuth();

  const handleLogout = () => {
    dispatch(logout());
    router.push("/");
  };

  return (
    <nav className="hidden lg:flex w-full border-b bg-white sticky top-0 z-40">
      <div className="container mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/" className="text-2xl font-bold text-primary">
            GiG Geni
          </Link>
        </div>

        {/* Center Navigation */}
        <div className="flex items-center space-x-8">
          <NavLink
            href="/"
            className="px-3 py-2 rounded-lg"
            activeClassName="bg-orange-50 text-primary"
          >
            Home
          </NavLink>
          <NavLink
            href="/competitions"
            className="px-3 py-2 rounded-lg"
            activeClassName="bg-orange-50 text-primary"
          >
            Competitions
          </NavLink>
          <NavLink
            href="/leaderboards"
            className="px-3 py-2 rounded-lg"
            activeClassName="bg-orange-50 text-primary"
          >
            Leaderboards
          </NavLink>
        </div>

        {/* Right Side */}
        <div className="flex items-center space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-64 p-2 bg-white shadow-lg border"
            >
              {!user ? (
                // --- Logged-out user view ---
                <>
                  <DropdownMenuItem className="p-0">
                    <button
                      onClick={openLoginModal}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-md w-full text-left"
                    >
                      <div className="p-1.5 rounded-md bg-gray-100">
                        <User className="h-4 w-4" />
                      </div>
                      <span className="font-medium">Login</span>
                    </button>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="p-0">
                    <button
                      onClick={openSignupModal}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-md w-full text-left"
                    >
                      <div className="p-1.5 rounded-md bg-gray-100">
                        <UserCircle className="h-4 w-4" />
                      </div>
                      <span className="font-medium">Sign Up</span>
                    </button>
                  </DropdownMenuItem>
                </>
              ) : (
                // --- Logged-in user view (RESTORED) ---
                <>
                  <div className="px-3 py-3 border-b mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-orange-400 flex items-center justify-center text-white font-bold">
                        {user.name
                          ? user.name.charAt(0).toUpperCase()
                          : user.email.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate">
                          {user.name || "User"}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {user.email}
                        </p>
                        <span className="inline-block px-1.5 py-0.5 text-xs bg-primary/10 text-primary rounded mt-1 capitalize">
                          {user.role}
                        </span>
                      </div>
                    </div>
                  </div>

                  <DropdownMenuItem asChild className="p-0">
                    <Link
                      href="/notifications"
                      className="flex items-center gap-3 px-3 py-2.5 rounded-md w-full"
                    >
                      <div className="p-1.5 rounded-md bg-gray-100">
                        <Bell className="h-4 w-4" />
                      </div>
                      <span className="font-medium">Notifications</span>
                    </Link>
                  </DropdownMenuItem>

                  <div className="border-t my-2"></div>

                  {/* Role-specific links for Employer */}
                  {user.role === "employer" && (
                    <>
                      <DropdownMenuItem asChild className="p-0">
                        <Link
                          href="/competitions/manage"
                          className="flex items-center gap-3 px-3 py-2.5 rounded-md w-full"
                        >
                          <div className="p-1.5 rounded-md bg-gray-100">
                            <FileCog className="h-4 w-4" />
                          </div>
                          <span className="font-medium">
                            Manage Competitions
                          </span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild className="p-0">
                        <Link
                          href="/competitions/create"
                          className="flex items-center gap-3 px-3 py-2.5 rounded-md w-full"
                        >
                          <div className="p-1.5 rounded-md bg-gray-100">
                            <Plus className="h-4 w-4" />
                          </div>
                          <span className="font-medium">
                            Create Competition
                          </span>
                        </Link>
                      </DropdownMenuItem>
                      <div className="border-t my-2"></div>
                    </>
                  )}

                  {/* Role-specific links for Employee */}
                  {user.role === "employee" && (
                    <>
                      <DropdownMenuItem asChild className="p-0">
                        <Link
                          href="/competitions/my"
                          className="flex items-center gap-3 px-3 py-2.5 rounded-md w-full"
                        >
                          <div className="p-1.5 rounded-md bg-gray-100">
                            <Trophy className="h-4 w-4" />
                          </div>
                          <span className="font-medium">My Competitions</span>
                        </Link>
                      </DropdownMenuItem>
                      <div className="border-t my-2"></div>
                    </>
                  )}

                  <div className="border-t my-2"></div>

                  <DropdownMenuItem asChild className="p-0">
                    <Link
                      href="/profile"
                      className="flex items-center gap-3 px-3 py-2.5 rounded-md w-full"
                    >
                      <div className="p-1.5 rounded-md bg-gray-100">
                        <UserCircle className="h-4 w-4" />
                      </div>
                      <span className="font-medium">Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="p-0">
                    <Link
                      href="/settings"
                      className="flex items-center gap-3 px-3 py-2.5 rounded-md w-full"
                    >
                      <div className="p-1.5 rounded-md bg-gray-100">
                        <Settings className="h-4 w-4" />
                      </div>
                      <span className="font-medium">Settings</span>
                    </Link>
                  </DropdownMenuItem>

                  <div className="border-t my-2"></div>

                  <DropdownMenuItem className="p-0">
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-md text-red-600 hover:bg-red-50 w-full text-left"
                    >
                      <div className="p-1.5 rounded-md bg-red-100">
                        <UserCircle className="h-4 w-4" />
                      </div>
                      <span className="font-medium">Logout</span>
                    </button>
                  </DropdownMenuItem>
                </>
              )}
              <DropdownMenuItem asChild className="p-0">
                <Link
                  href="/contact"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-md w-full"
                >
                  <div className="p-1.5 rounded-md bg-gray-100">
                    <MessageCircle className="h-4 w-4" />
                  </div>
                  <span className="font-medium">Contact Us</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}
