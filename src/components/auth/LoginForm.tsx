"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { LoginPayload } from "@/types";
import { useLoginMutation } from "@/lib/api/authApi";

interface LoginFormProps {
  onClose: () => void;
  onSwitchToSignup: () => void;
}

export function LoginForm({ onClose, onSwitchToSignup }: LoginFormProps) {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const [login, { isLoading: isLoggingIn }] = useLoginMutation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const payload: LoginPayload = {
      email: formData.email,
      password: formData.password,
    };

    try {
      const response = await login(payload).unwrap();
      onClose();
      // setTimeout(() => {
      //   const userRole = response.data!.user.role;
      //   switch (userRole) {
      //     case "admin":
      //       router.push("/admin/dashboard");
      //       break;
      //     case "employer":
      //       router.push("/competitions/manage");
      //       break;
      //     case "employee":
      //       router.push("/competitions/my");
      //       break;
      //     default:
      //       router.push("/");
      //   }
      // }, 100);
    } catch (err: any) {
      setError(
        err.data?.message || "Login failed. Please check your credentials."
      );
    }
  };

  return (
    <div className="p-8">
      <DialogHeader className="text-center mb-8">
        <DialogTitle className="text-3xl font-bold">Welcome Back</DialogTitle>
        <p className="text-muted-foreground">
          Sign in to continue to your dashboard
        </p>
      </DialogHeader>
      <form onSubmit={handleLoginSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="email">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="pl-10 h-12"
            />
          </div>
        </div>
        <div className="space-y-2">
          <label htmlFor="password">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="pl-10 pr-10 h-12"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </button>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="rounded border-gray-300 text-primary focus:ring-primary"
            />
            <span className="ml-2 text-sm text-muted-foreground">
              Remember me
            </span>
          </label>
          <button
            type="button"
            className="text-sm font-medium text-primary hover:underline"
          >
            Forgot password?
          </button>
        </div>
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <Button type="submit" disabled={isLoggingIn} className="w-full h-12">
          {isLoggingIn ? "Signing in..." : "Sign In"}
        </Button>
      </form>
      <div className="text-center mt-6">
        <span className="text-sm">Don't have an account? </span>
        <button
          type="button"
          onClick={onSwitchToSignup}
          className="font-medium text-primary hover:underline"
        >
          Sign up
        </button>
      </div>
    </div>
  );
}
