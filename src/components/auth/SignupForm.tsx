"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Eye, EyeOff, Mail, Lock, User, Building } from "lucide-react";
import { useRegisterMutation } from "@/lib/api/authApi";
import { UserRole } from "@/lib/features/user/types";
import { RegisterPayload } from "@/types";

interface SignupFormProps {
  userType: UserRole;
  onBack: () => void;
  onVerificationNeeded: (email: string, tempAccessToken: string) => void;
  onSwitchToLogin: () => void;
}

export function SignupForm({
  userType,
  onBack,
  onVerificationNeeded,
  onSwitchToLogin,
}: SignupFormProps) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    fullName: "",
    companyName: "",
    agreeToTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [register, { isLoading: isRegistering }] = useRegisterMutation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (!formData.agreeToTerms) {
      setError("You must agree to the terms and policy");
      return;
    }

    const payload: RegisterPayload = {
      email: formData.email,
      password: formData.password,
      phoneNumber: formData.phoneNumber,
      name: formData.fullName,
      role: userType,
      ...(userType === "employer"
        ? { company: { name: formData.companyName } }
        : {}),
    };

    try {
      const response = await register(payload).unwrap();
      const tempAccessToken = response.data!.accessToken;

      if (tempAccessToken) {
        onVerificationNeeded(formData.email, tempAccessToken);
      } else {
        setError("Could not get verification token. Please try again.");
      }
    } catch (err: any) {
      setError(err.data?.message || "Registration failed. Please try again.");
    }
  };

  return (
    <div>
      <DialogHeader className="text-center mb-8">
        <DialogTitle className="text-3xl font-bold">
          Create Your Account
        </DialogTitle>
        <p className="text-muted-foreground">
          Complete your registration to get started
        </p>
      </DialogHeader>
      <form onSubmit={handleSignupSubmit} className="space-y-6">
        <button
          type="button"
          onClick={onBack}
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
          <label htmlFor="phoneNumber">Phone Number</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              id="phoneNumber"
              name="phoneNumber"
              type="text"
              required
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="Enter your Phone Number"
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
          <input
            type="checkbox"
            id="agreeToTerms"
            name="agreeToTerms"
            checked={formData.agreeToTerms}
            onChange={handleChange}
            required
            className="rounded border-gray-300 text-primary focus:ring-primary"
          />
          <label
            htmlFor="agreeToTerms"
            className="ml-2 text-sm text-muted-foreground"
          >
            I agree to the{" "}
            <a
              href="/terms"
              target="_blank"
              className="font-medium text-primary hover:underline"
            >
              Terms
            </a>{" "}
            and{" "}
            <a
              href="/policy"
              target="_blank"
              className="font-medium text-primary hover:underline"
            >
              Policy
            </a>
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
          onClick={onSwitchToLogin}
          className="font-medium text-primary hover:underline"
        >
          Sign in
        </button>
      </div>
    </div>
  );
}
