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
import { useAppDispatch, useAppSelector } from "@/store";
import { logout, selectUser } from "@/store/slices/authSlice";

export function DesktopNav() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);

  // --- STEP 2: Get the modal control functions from the context ---
  // All the local useState and handler functions for modals are now gone.
  const { openLoginModal, openSignupModal } = useAuth();

  const handleLogout = () => {
    dispatch(logout());
    router.push("/");
  };

  return (
    <nav className="hidden lg:flex w-full border-b bg-white">
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
              className="w-64 p-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-lg"
            >
              {!user ? (
                <>
                  {/* --- STEP 3: Use the context functions in your onClick handlers --- */}
                  <DropdownMenuItem className="p-0">
                    <button
                      onClick={openLoginModal}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-md text-gray-700 dark:text-gray-300 hover:bg-[#FC5602]/10 hover:text-[#FC5602] transition-all duration-200 w-full text-left"
                    >
                      <div className="p-1.5 rounded-md bg-gray-100 dark:bg-gray-800 group-hover:bg-[#FC5602]/20 transition-colors">
                        <User className="h-4 w-4" />
                      </div>
                      <span className="font-medium">Login</span>
                    </button>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="p-0">
                    <button
                      onClick={openSignupModal}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-md text-gray-700 dark:text-gray-300 hover:bg-[#FC5602]/10 hover:text-[#FC5602] transition-all duration-200 w-full text-left"
                    >
                      <div className="p-1.5 rounded-md bg-gray-100 dark:bg-gray-800 group-hover:bg-[#FC5602]/20 transition-colors">
                        <UserCircle className="h-4 w-4" />
                      </div>
                      <span className="font-medium">Sign Up</span>
                    </button>
                  </DropdownMenuItem>
                  <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>
                </>
              ) : (
                <>
                  {/* This part for logged-in users remains the same */}
                  <div className="px-3 py-3 border-b border-gray-200 dark:border-gray-700 mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FC5602] to-[#FF7B02] flex items-center justify-center text-white font-bold text-sm">
                        {user.name
                          ? user.name.charAt(0).toUpperCase()
                          : user.email.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                          {user.name || "User"}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {user.email}
                        </p>
                        <span className="inline-block px-1.5 py-0.5 text-xs bg-[#FC5602]/10 text-[#FC5602] rounded mt-1 capitalize">
                          {user.role}
                        </span>
                      </div>
                    </div>
                  </div>
                  {/* ... other dropdown items for logged-in users ... */}
                  <DropdownMenuItem className="p-0">
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-md text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 w-full text-left"
                    >
                      <div className="p-1.5 rounded-md bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors">
                        <UserCircle className="h-4 w-4" />
                      </div>
                      <span className="font-medium">Logout</span>
                    </button>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}
