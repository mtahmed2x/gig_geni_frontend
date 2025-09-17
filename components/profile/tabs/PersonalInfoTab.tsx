"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Save, Plus, X, User as UserIcon } from "lucide-react";
// --- STEP 1: Import the global User type ---
import { Gender, User } from "@/types";

interface PersonalInfoTabProps {
  profile: User | null;
  isEditing: boolean;
  onUpdate: (updates: Partial<User>) => void;
}

export function PersonalInfoTab({
  profile,
  isEditing,
  onUpdate,
}: PersonalInfoTabProps) {
  const [formData, setFormData] = useState({
    name: "",
    aboutMe: "",
    salaryExpectation: "",
    jobPreference: "",
    dateOfBirth: "",
    gender: "",
    nationality: "",
    languages: [] as string[],
    newLanguage: "",
  });

  const [isSaving, setIsSaving] = useState(false);

  // --- STEP 2: Sync local form state with the profile prop ---
  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || "",
        aboutMe: profile.aboutMe || "",
        salaryExpectation: profile.salaryExpectations || "",
        jobPreference: profile.jobPreference || "",
        dateOfBirth: profile.dateOfBirth?.split("T")[0] || "", // Format for date input
        gender: profile.gender || "",
        nationality: profile.nationality || "",
        languages: profile.languages || [],
        newLanguage: "",
      });
    }
  }, [profile]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddLanguage = () => {
    if (formData.newLanguage.trim()) {
      setFormData((prev) => ({
        ...prev,
        languages: [...prev.languages, prev.newLanguage.trim()],
        newLanguage: "",
      }));
    }
  };

  const handleRemoveLanguage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      languages: prev.languages.filter((_, i) => i !== index),
    }));
  };

  // --- STEP 3: Refactor handleSave to call the onUpdate prop ---
  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Format the payload to match the backend User model
      const updates: Partial<User> = {
        name: formData.name,
        aboutMe: formData.aboutMe,
        salaryExpectations: formData.salaryExpectation,
        jobPreference: formData.jobPreference,
        dateOfBirth: formData.dateOfBirth || null,
        gender: (formData.gender as Gender) || null,
        nationality: formData.nationality || null,
        languages: formData.languages,
      };

      await onUpdate(updates);
    } finally {
      setIsSaving(false);
    }
  };

  if (!profile) return null;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <UserIcon className="w-5 h-5" />
          Personal Information
        </CardTitle>
        {isEditing && (
          <Button onClick={handleSave} disabled={isSaving}>
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            {isEditing ? (
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Enter your full name"
              />
            ) : (
              <p className="p-2 bg-muted rounded h-10 flex items-center">
                {profile.name || "Not specified"}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="dateOfBirth">Date of Birth</Label>
            {isEditing ? (
              <Input
                id="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) =>
                  handleInputChange("dateOfBirth", e.target.value)
                }
              />
            ) : (
              <p className="p-2 bg-muted rounded h-10 flex items-center">
                {profile.dateOfBirth
                  ? new Date(profile.dateOfBirth).toLocaleDateString("en-CA")
                  : "Not specified"}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="gender">Gender</Label>
            {isEditing ? (
              <Select
                value={formData.gender}
                onValueChange={(value) => handleInputChange("gender", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                  <SelectItem value="not-stated">Prefer not to say</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <p className="p-2 bg-muted rounded h-10 flex items-center capitalize">
                {profile.gender || "Not specified"}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="nationality">Nationality</Label>
            {isEditing ? (
              <Input
                id="nationality"
                value={formData.nationality}
                onChange={(e) =>
                  handleInputChange("nationality", e.target.value)
                }
                placeholder="Enter your nationality"
              />
            ) : (
              <p className="p-2 bg-muted rounded h-10 flex items-center">
                {profile.nationality || "Not specified"}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="aboutMe">About Me</Label>
          {isEditing ? (
            <Textarea
              id="aboutMe"
              value={formData.aboutMe}
              onChange={(e) => handleInputChange("aboutMe", e.target.value)}
              placeholder="Tell us about yourself..."
              rows={4}
            />
          ) : (
            <p className="text-sm p-3 bg-muted rounded min-h-[100px] whitespace-pre-wrap">
              {profile.aboutMe || "No description provided."}
            </p>
          )}
        </div>

        {profile.role === "employee" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="salaryExpectation">Salary Expectation</Label>
              {isEditing ? (
                <Input
                  id="salaryExpectation"
                  value={formData.salaryExpectation}
                  onChange={(e) =>
                    handleInputChange("salaryExpectation", e.target.value)
                  }
                  placeholder="e.g., $80,000 - $100,000"
                />
              ) : (
                <p className="p-2 bg-muted rounded h-10 flex items-center">
                  {profile.salaryExpectations || "Not specified"}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="jobPreference">Job Preference</Label>
              {isEditing ? (
                <Select
                  value={formData.jobPreference}
                  onValueChange={(value) =>
                    handleInputChange("jobPreference", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select preference" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="remote">Remote</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                    <SelectItem value="onsite">On-site</SelectItem>
                    <SelectItem value="flexible">Flexible</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <p className="p-2 bg-muted rounded h-10 flex items-center capitalize">
                  {profile.jobPreference || "Not specified"}
                </p>
              )}
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Label>Languages</Label>
          <div className="flex flex-wrap gap-2 min-h-[40px] p-2 border rounded-md">
            {formData.languages.map((language, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="flex items-center gap-1"
              >
                {language}
                {isEditing && (
                  <button
                    onClick={() => handleRemoveLanguage(index)}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </Badge>
            ))}
            {formData.languages.length === 0 && !isEditing && (
              <p className="text-muted-foreground text-sm">
                No languages added yet.
              </p>
            )}
          </div>
          {isEditing && (
            <div className="flex gap-2">
              <Input
                value={formData.newLanguage}
                onChange={(e) =>
                  handleInputChange("newLanguage", e.target.value)
                }
                placeholder="Add a language"
                onKeyPress={(e) => e.key === "Enter" && handleAddLanguage()}
              />
              <Button onClick={handleAddLanguage} size="sm">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
