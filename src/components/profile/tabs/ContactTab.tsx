// src/components/profile/tabs/ContactTab.tsx

"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Save, Mail, Phone, Globe, MapPin } from "lucide-react";
import { User } from "@/types";

interface ContactTabProps {
  profile: User | null;
  isEditing: boolean;
  onUpdate: (updates: Partial<User>) => void;
}

export function ContactTab({ profile, isEditing, onUpdate }: ContactTabProps) {
  const [formData, setFormData] = useState({
    phone: "",
    linkedin: "",
    website: "",
    homeAddress: "",
    city: "",
    state: "",
    country: "",
    zipCode: "",
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setFormData({
        phone: profile.phoneNumber || "",
        linkedin: profile.linkedinProfile || "",
        website: profile.personalWebsite || "",
        homeAddress: profile.address?.homeAddress || "",
        city: profile.address?.city || "",
        state: profile.address?.state || "",
        country: profile.address?.country || "",
        zipCode: profile.address?.zipCode || "",
      });
    }
  }, [profile]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    const updates: Partial<User> = {
      phoneNumber: formData.phone,
      linkedinProfile: formData.linkedin,
      personalWebsite: formData.website,
      address: {
        homeAddress: formData.homeAddress,
        city: formData.city,
        state: formData.state,
        country: formData.country,
        zipCode: formData.zipCode,
      },
    };
    await onUpdate(updates);
    setIsSaving(false);
  };

  if (!profile) return null;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Contact Information</CardTitle>
        {isEditing && (
          <Button onClick={handleSave} disabled={isSaving}>
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={profile.email}
              disabled
              className="bg-muted"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            {isEditing ? (
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
              />
            ) : (
              <p className="p-2 bg-muted rounded h-10 flex items-center">
                {profile.phoneNumber || "Not provided"}
              </p>
            )}
          </div>
          {/* ...other inputs for linkedin, website, etc., following the same pattern... */}
        </div>
      </CardContent>
    </Card>
  );
}
