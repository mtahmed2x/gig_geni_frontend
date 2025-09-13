"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  Home,
  Trophy,
  Award,
  Bell,
  Menu,
  Plus,
  MessageCircle,
  UserCircle,
  Settings,
  FilePlus2,
  FileCog,
  Users,
  Target,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { NavLink } from "./NavLink";
// --- STEP 1: Import the useAuth hook ---
import { useAuth } from "@/contexts/AuthProvider";
import { useAppDispatch, useAppSelector } from "@/store";
import { logout, selectUser } from "@/store/slices/authSlice";

export function MobileDock() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const pathname = usePathname();

  // --- STEP 2: Remove local state for auth modals, keep only the sheet state ---
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // --- STEP 3: Get modal control functions from the context ---
  const { openLoginModal } = useAuth();

  // --- STEP 4: Remove local handlers for auth modals ---
  /*
  const handleAuthSuccess = ...
  const handleVerificationComplete = ...
  const handleBackToAuth = ...
  */

  const handleLogout = () => {
    dispatch(logout());
    setIsSheetOpen(false); // Close the sheet on logout
    router.push("/");
  };

  return (
    <div className="lg:hidden">
      {/* Bottom Navigation Dock */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t z-50">
        <div className="flex items-center justify-around">
          {/* Home */}
          <NavLink
            href="/"
            className={`flex flex-col items-center justify-center h-16 w-full ${
              pathname === "/" ? "text-primary" : "text-gray-500"
            }`}
          >
            <Home className="h-5 w-5 mb-1" />
            <span className="text-[10px] leading-tight font-medium">Home</span>
          </NavLink>

          {/* Competitions */}
          <NavLink
            href="/competitions"
            className={`flex flex-col items-center justify-center h-16 w-full ${
              pathname.startsWith("/competitions")
                ? "text-primary"
                : "text-gray-500"
            }`}
          >
            <Trophy className="h-5 w-5 mb-1" />
            <span className="text-[10px] leading-tight font-medium">
              Competitions
            </span>
          </NavLink>

          {/* Dynamic Action Button (Create/My Gigs/Login) */}
          {user ? (
            user.role === "employer" ? (
              <NavLink
                href="/competitions/create"
                className={`flex flex-col items-center justify-center h-16 w-full ${
                  pathname === "/competitions/create"
                    ? "text-primary"
                    : "text-gray-500"
                }`}
              >
                <Plus className="h-5 w-5 mb-1" />
                <span className="text-[10px] leading-tight font-medium">
                  Create
                </span>
              </NavLink>
            ) : (
              <NavLink
                href="/competitions/my"
                className={`flex flex-col items-center justify-center h-16 w-full ${
                  pathname === "/competitions/my"
                    ? "text-primary"
                    : "text-gray-500"
                }`}
              >
                <Target className="h-5 w-5 mb-1" />
                <span className="text-[10px] leading-tight font-medium">
                  My Gigs
                </span>
              </NavLink>
            )
          ) : (
            // --- STEP 5: Use the context function in the onClick handler ---
            <button
              onClick={openLoginModal}
              className="flex flex-col items-center justify-center h-16 w-full text-gray-500"
            >
              <Target className="h-5 w-5 mb-1" />
              <span className="text-[10px] leading-tight font-medium">
                Login
              </span>
            </button>
          )}

          {/* Menu Sheet */}
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                className="flex flex-col items-center justify-center h-16 w-full text-gray-500"
              >
                <Menu className="h-5 w-5 mb-1" />
                <span className="text-[10px] leading-tight font-medium">
                  Menu
                </span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-80 p-0 bg-white dark:bg-gray-900"
            >
              {/* Sheet content remains largely the same, but we update the Login button */}
              <div className="flex flex-col h-full">
                {/* ... Sheet Header ... */}
                <div className="flex-1 p-4 overflow-y-auto pb-20">
                  <nav className="space-y-2">
                    {/* ... other nav links ... */}
                    {!user ? (
                      <button
                        onClick={() => {
                          // --- STEP 5 (cont.): Use context function here too ---
                          setIsSheetOpen(false); // Close the sheet first
                          openLoginModal(); // Then open the modal
                        }}
                        className="group flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 w-full text-left"
                      >
                        <div className="p-1.5 rounded-md bg-gray-100">
                          <UserCircle className="h-4 w-4" />
                        </div>
                        <span className="font-medium">Login / Sign Up</span>
                      </button>
                    ) : (
                      <div className="space-y-2">
                        {/* ... links for logged-in users ... */}
                        <button
                          onClick={handleLogout}
                          className="group flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 w-full text-left"
                        >
                          <div className="p-1.5 rounded-md bg-red-100">
                            <UserCircle className="h-4 w-4" />
                          </div>
                          <span className="font-medium">Logout</span>
                        </button>
                      </div>
                    )}
                  </nav>
                </div>
                {/* ... Sheet Close button ... */}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>

      {/* Spacer */}
      <div className="h-20" />
    </div>
  );
}
