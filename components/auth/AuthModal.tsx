"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Eye, EyeOff, Mail, Lock, User, Building } from "lucide-react";
import { LoginPayload, RegisterPayload, UserRole } from "@/types";
import { useLoginMutation, useRegisterMutation } from "@/store/api/authApi";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: "login" | "signup";
  onVerificationNeeded: (email: string, tempAccessToken: string) => void;
  title?: string;
  subtitle?: string;
}

export function AuthModal({
  isOpen,
  onClose,
  defaultMode = "login",
  onVerificationNeeded,
  title,
  subtitle,
}: AuthModalProps) {
  const [mode, setMode] = useState<"login" | "signup">(defaultMode);
  const [step, setStep] = useState(1);
  const [userType, setUserType] = useState<UserRole | null>(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    companyName: "",
    agreeToTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();

  const [login, { isLoading: isLoggingIn }] = useLoginMutation();
  const [register, { isLoading: isRegistering }] = useRegisterMutation();

  const resetForm = () => {
    setFormData({
      email: "",
      password: "",
      confirmPassword: "",
      fullName: "",
      companyName: "",
      agreeToTerms: false,
    });
    setError("");
    setStep(1);
    setUserType(null);
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleModeSwitch = (newMode: "login" | "signup") => {
    resetForm();
    setMode(newMode);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // --- STEP 3: Refactor handleLoginSubmit ---
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const payload: LoginPayload = {
      email: formData.email,
      password: formData.password,
    };

    try {
      const response = await login(payload).unwrap();

      handleClose();
      setTimeout(() => {
        const userRole = response.user.role;
        switch (userRole) {
          case "admin":
            router.push("/admin/dashboard");
            break;
          case "employer":
            router.push("/competitions/manage");
            break;
          case "employee":
            router.push("/competitions/my");
            break;
          default:
            router.push("/");
        }
      }, 100);
    } catch (err: any) {
      setError(
        err.data?.message || "Login failed. Please check your credentials."
      );
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (step === 1) {
      if (!userType) {
        setError("Please select an account type");
        return;
      }
      setError("");
      setStep(2);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (!userType) {
      setError("User type not selected. Please go back.");
      return;
    }
    setError("");

    const payload: RegisterPayload = {
      email: formData.email,
      password: formData.password,
      name: formData.fullName,
      role: userType,
      ...(userType === "employer"
        ? { company: { name: formData.companyName } }
        : {}),
    };

    try {
      const response = await register(payload).unwrap();
      const tempAccessToken = response.accessToken;

      if (tempAccessToken) {
        onVerificationNeeded(formData.email, tempAccessToken);
      } else {
        setError("Could not get verification token. Please try again.");
      }
    } catch (err: any) {
      const errorMessage =
        err.data?.message || "Registration failed. Please try again.";
      setError(errorMessage);
    }
  };

  const quickLogin = (role: UserRole) => {
    const credentials = {
      admin: { email: "admin@example.com", password: "password123" },
      employer: { email: "employer@example.com", password: "password123" },
      employee: { email: "employee@example.com", password: "password123" },
    };
    setFormData((prev) => ({
      ...prev,
      email: credentials[role].email,
      password: credentials[role].password,
    }));
    setError("");
  };

  const handleDummyLogin = async () => {
    await handleLoginSubmit(new Event("submit") as any);
  };

  const renderLoginForm = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
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
      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-background text-muted-foreground">
              Quick Login (Demo)
            </span>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => quickLogin("admin")}
          >
            Admin
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => quickLogin("employer")}
          >
            Employer
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => quickLogin("employee")}
          >
            Employee
          </Button>
        </div>
        <div className="mt-2 text-center">
          <Button
            variant="link"
            size="sm"
            onClick={handleDummyLogin}
            disabled={!formData.email || !formData.password}
          >
            Auto Login with Filled Credentials
          </Button>
        </div>
      </div>
      <div className="text-center">
        <span className="text-sm">Don't have an account? </span>
        <button
          type="button"
          onClick={() => handleModeSwitch("signup")}
          className="font-medium text-primary hover:underline"
        >
          Sign up
        </button>
      </div>
    </motion.div>
  );

  const renderUserTypeSelection = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-xl font-semibold text-center mb-6">I am a...</h2>
      <div className="space-y-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setUserType("employee")}
          className={`w-full p-6 rounded-lg border-2 ${
            userType === "employee" ? "border-primary" : ""
          }`}
        >
          <div className="flex items-center">
            <User
              className={`w-8 h-8 mr-4 ${
                userType === "employee" ? "text-primary" : ""
              }`}
            />
            <div className="text-left">
              <h3>Job Seeker</h3>
              <p className="text-sm text-muted-foreground">
                Find opportunities
              </p>
            </div>
          </div>
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setUserType("employer")}
          className={`w-full p-6 rounded-lg border-2 ${
            userType === "employer" ? "border-primary" : ""
          }`}
        >
          <div className="flex items-center">
            <Building
              className={`w-8 h-8 mr-4 ${
                userType === "employer" ? "text-primary" : ""
              }`}
            />
            <div className="text-left">
              <h3>Employer</h3>
              <p className="text-sm text-muted-foreground">
                Post gigs and find talent
              </p>
            </div>
          </div>
        </motion.button>
      </div>
      {error && (
        <Alert variant="destructive" className="mt-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <Button
        onClick={() => userType && setStep(2)}
        disabled={!userType}
        className="w-full mt-6 h-12"
      >
        Continue
      </Button>
      <div className="text-center mt-4">
        <span className="text-sm">Already have an account? </span>
        <button
          type="button"
          onClick={() => handleModeSwitch("login")}
          className="font-medium text-primary hover:underline"
        >
          Sign in
        </button>
      </div>
    </motion.div>
  );

  const renderSignupForm = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <form onSubmit={handleSignupSubmit} className="space-y-6">
        <button
          type="button"
          onClick={() => setStep(1)}
          className="text-sm font-medium text-primary hover:underline"
        >
          ← Back to account type
        </button>
        <div className="space-y-2">
          <label htmlFor="fullName">Full Name</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              id="fullName"
              name="fullName"
              type="text"
              required
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
              className="pl-10 h-12"
            />
          </div>
        </div>
        {userType === "employer" && (
          <div className="space-y-2">
            <label htmlFor="companyName">Company Name</label>
            <div className="relative">
              <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                id="companyName"
                name="companyName"
                type="text"
                required
                value={formData.companyName}
                onChange={handleChange}
                placeholder="Enter your company name"
                className="pl-10 h-12"
              />
            </div>
          </div>
        )}
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
              placeholder="Create a password"
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
        <div className="space-y-2">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              className="pl-10 pr-10 h-12"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            >
              {showConfirmPassword ? <EyeOff /> : <Eye />}
            </button>
          </div>
        </div>
        <div className="flex items-center">
          <label
            htmlFor="agreeToTerms"
            className="flex items-center cursor-pointer"
          >
            <input
              type="checkbox"
              id="agreeToTerms"
              name="agreeToTerms"
              checked={formData.agreeToTerms}
              onChange={(e) =>
                setFormData((p) => ({ ...p, agreeToTerms: e.target.checked }))
              }
              required
              className="rounded border-gray-300 text-primary focus:ring-primary"
            />
            <span className="ml-2 text-sm text-muted-foreground">
              I agree to the{" "}
              <button
                type="button"
                className="font-medium text-primary hover:underline"
              >
                Terms
              </button>{" "}
              and{" "}
              <button
                type="button"
                className="font-medium text-primary hover:underline"
              >
                Policy
              </button>
            </span>
          </label>
        </div>
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <Button
          type="submit"
          disabled={isRegistering || !formData.agreeToTerms}
          className="w-full h-12"
        >
          {isRegistering ? "Creating account..." : "Create Account"}
        </Button>
      </form>
      <div className="text-center mt-4">
        <span className="text-sm">Already have an account? </span>
        <button
          type="button"
          onClick={() => handleModeSwitch("login")}
          className="font-medium text-primary hover:underline"
        >
          Sign in
        </button>
      </div>
    </motion.div>
  );

  const getTitle = () => {
    if (title) return title;
    if (mode === "login") return "Welcome Back";
    if (mode === "signup" && step === 1) return "Join the Platform";
    if (mode === "signup" && step === 2) return "Create Your Account";
    return "Authentication";
  };

  const getSubtitle = () => {
    if (subtitle) return subtitle;
    if (mode === "login") return "Sign in to continue to your dashboard";
    if (mode === "signup" && step === 1) return "First, tell us who you are";
    if (mode === "signup" && step === 2)
      return "Complete your registration to get started";
    return "";
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md mx-auto p-8 overflow-hidden">
        <DialogHeader className="text-center mb-8">
          <DialogTitle className="text-3xl font-bold">{getTitle()}</DialogTitle>
          <p className="text-muted-foreground">{getSubtitle()}</p>
        </DialogHeader>
        <AnimatePresence mode="wait">
          {mode === "login" && renderLoginForm()}
          {mode === "signup" && step === 1 && renderUserTypeSelection()}
          {mode === "signup" && step === 2 && renderSignupForm()}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
