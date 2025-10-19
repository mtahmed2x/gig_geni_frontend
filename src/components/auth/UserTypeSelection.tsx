"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { User, Building } from "lucide-react";
import { UserRole } from "@/lib/features/user/types";

interface UserTypeSelectionProps {
  onSelect: (role: UserRole) => void;
  onSwitchToLogin: () => void;
}

export function UserTypeSelection({
  onSelect,
  onSwitchToLogin,
}: UserTypeSelectionProps) {
  const [selectedType, setSelectedType] = useState<UserRole | null>(null);
  const [error, setError] = useState("");

  const handleContinue = () => {
    if (!selectedType) {
      setError("Please select an account type");
      return;
    }
    setError("");
    onSelect(selectedType);
  };

  return (
    <div>
      <DialogHeader className="text-center mb-8">
        <DialogTitle className="text-3xl font-bold">
          Join the Platform
        </DialogTitle>
        <p className="text-muted-foreground">First, tell us who you are</p>
      </DialogHeader>
      <div className="space-y-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setSelectedType("employee")}
          className={`w-full p-6 rounded-lg border-2 text-left ${
            selectedType === "employee"
              ? "border-primary bg-primary/10"
              : "border-border"
          }`}
        >
          <div className="flex items-center">
            <User
              className={`w-8 h-8 mr-4 ${
                selectedType === "employee"
                  ? "text-primary"
                  : "text-muted-foreground"
              }`}
            />
            <div>
              <h3 className="font-semibold">Job Seeker</h3>
              <p className="text-sm text-muted-foreground">
                Find opportunities
              </p>
            </div>
          </div>
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setSelectedType("employer")}
          className={`w-full p-6 rounded-lg border-2 text-left ${
            selectedType === "employer"
              ? "border-primary bg-primary/10"
              : "border-border"
          }`}
        >
          <div className="flex items-center">
            <Building
              className={`w-8 h-8 mr-4 ${
                selectedType === "employer"
                  ? "text-primary"
                  : "text-muted-foreground"
              }`}
            />
            <div>
              <h3 className="font-semibold">Employer</h3>
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
        onClick={handleContinue}
        disabled={!selectedType}
        className="w-full mt-6 h-12"
      >
        Continue
      </Button>
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
