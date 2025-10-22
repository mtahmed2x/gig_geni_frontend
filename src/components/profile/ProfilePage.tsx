// src/components/profile/ProfilePage.tsx

"use client";

import { useState, useEffect, useRef, ChangeEvent } from "react";
import { useSearchParams } from "next/navigation";
import { useAppSelector } from "@/lib/hooks";

import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Edit, X, Camera, AlertCircle, Loader2 } from "lucide-react";

// Import all your tab components
import { PersonalInfoTab } from "./tabs/PersonalInfoTab";
import { ExperienceTab } from "./tabs/ExperienceTab";
import { EducationTab } from "./tabs/EducationTab";
import { SkillsTab } from "./tabs/SkillsTab";
import { ContactTab } from "./tabs/ContactTab";
import { CompanyTab } from "./tabs/CompanyTab";
import { ProfileCompletionModal } from "./ProfileCompletionModal";
import { toast } from "sonner";
import { selectCurrentUser } from "@/lib/features/auth/authSlice";
import {
  useGetUserProfileQuery,
  useUpdateUserProfileMutation,
  useUpdateAvatarMutation, // --- STEP 1: Import the new mutation hook ---
} from "@/lib/api/userApi";
import { User } from "@/lib/features/user/types";

export function ProfilePage() {
  const authUser = useAppSelector(selectCurrentUser);
  const { data: profileData, isLoading, isError } = useGetUserProfileQuery();
  const [updateProfile, { isLoading: isUpdating }] =
    useUpdateUserProfileMutation();

  // --- STEP 2: Instantiate the avatar mutation hook ---
  const [updateAvatar, { isLoading: isUploading }] = useUpdateAvatarMutation();
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const profile = profileData?.data;

  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    const shouldComplete = searchParams.get("complete") === "true";
    if (shouldComplete && profile && !profile.isProfileComplete) {
      setShowCompletionModal(true);
    }
    const shouldEdit = searchParams.get("edit") === "true";
    if (shouldEdit) {
      setIsEditing(true);
    }
  }, [profile, searchParams]);

  const handleUpdateProfile = async (updates: Partial<User>) => {
    const promise = updateProfile(updates).unwrap();

    toast.promise(promise, {
      loading: "Saving changes...",
      success: () => {
        setIsEditing(false);
        return "Profile updated successfully!";
      },
      error: (err) => err.data?.message || "Failed to update profile.",
    });
  };

  // --- STEP 3: Create a handler for the avatar file change ---
  const handleAvatarChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const promise = updateAvatar({ avatar: file, payload: {} }).unwrap();

    toast.promise(promise, {
      loading: "Uploading new avatar...",
      success: "Avatar updated successfully!",
      error: (err) => err.data?.message || "Failed to update avatar.",
    });

    // Reset the input value to allow re-uploading the same file
    if (avatarInputRef.current) {
      avatarInputRef.current.value = "";
    }
  };

  const getTabsForRole = () => {
    const commonTabs = [
      { value: "personal", label: "Personal Info" },
      { value: "contact", label: "Contact" },
    ];
    if (authUser?.role === "employee") {
      return [
        ...commonTabs,
        { value: "experience", label: "Experience" },
        { value: "education", label: "Education" },
        { value: "skills", label: "Skills" },
      ];
    }
    if (authUser?.role === "employer") {
      return [...commonTabs, { value: "company", label: "Company" }];
    }
    return commonTabs;
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-8">
          <div className="h-48 bg-gray-200 rounded-lg"></div>
          <div className="h-96 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (isError || !authUser || !profile) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <AlertCircle className="mx-auto h-12 w-12 text-destructive mb-4" />
        <h2 className="text-xl font-semibold">Could not load user profile.</h2>
        <p className="text-muted-foreground">Please try refreshing the page.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Profile Header */}
      <div className="mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              {/* --- STEP 4: Update Avatar display and add hidden file input --- */}
              <div className="relative">
                <Avatar className="w-24 h-24 border-4 border-white shadow-md">
                  <AvatarImage
                    src={
                      profile.avatar ||
                      "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                    }
                  />
                  <AvatarFallback className="text-3xl">
                    {authUser.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <>
                    <input
                      type="file"
                      ref={avatarInputRef}
                      onChange={handleAvatarChange}
                      accept="image/png, image/jpeg, image/gif"
                      style={{ display: "none" }}
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0"
                      onClick={() => avatarInputRef.current?.click()}
                      disabled={isUploading}
                    >
                      {isUploading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Camera className="w-4 h-4" />
                      )}
                    </Button>
                  </>
                )}
              </div>
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-3xl font-bold">{profile.name}</h1>
                    <p className="text-muted-foreground capitalize">
                      {profile.role}
                    </p>
                    {profile.role === "employer" && profile.company?.name && (
                      <p className="text-sm text-muted-foreground">
                        {profile.company.name}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">
                        Profile Completion
                      </p>
                      <p className="text-lg font-semibold text-primary">
                        {profile.profileCompletionPercentage}%
                      </p>
                    </div>
                    <Button
                      onClick={() => setIsEditing(!isEditing)}
                      variant={isEditing ? "outline" : "default"}
                      disabled={isUpdating}
                    >
                      {isUpdating ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : isEditing ? (
                        <>
                          <X className="w-4 h-4 mr-2" />
                          Cancel
                        </>
                      ) : (
                        <>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Profile
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Profile Tabs (No changes needed below this line) */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList
          className="grid w-full"
          style={{
            gridTemplateColumns: `repeat(${
              getTabsForRole().length
            }, minmax(0, 1fr))`,
          }}
        >
          {getTabsForRole().map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="personal">
          <PersonalInfoTab
            profile={profile}
            onUpdate={handleUpdateProfile}
            isUpdating={isEditing}
          />
        </TabsContent>
        <TabsContent value="contact">
          <ContactTab
            profile={profile}
            isEditing={isEditing}
            onUpdate={handleUpdateProfile}
          />
        </TabsContent>

        {authUser.role === "employee" && (
          <>
            <TabsContent value="experience">
              <ExperienceTab
                profile={profile}
                isEditing={isEditing}
                onUpdate={handleUpdateProfile}
              />
            </TabsContent>
            <TabsContent value="education">
              <EducationTab
                profile={profile}
                isEditing={isEditing}
                onUpdate={handleUpdateProfile}
              />
            </TabsContent>
            <TabsContent value="skills">
              <SkillsTab
                profile={profile}
                isEditing={isEditing}
                onUpdate={handleUpdateProfile}
                userRole={authUser.role}
              />
            </TabsContent>
          </>
        )}
        {authUser.role === "employer" && (
          <TabsContent value="company">
            <CompanyTab
              profile={profile}
              isEditing={isEditing}
              onUpdate={handleUpdateProfile}
            />
          </TabsContent>
        )}
      </Tabs>

      <ProfileCompletionModal
        isOpen={showCompletionModal}
        onClose={() => setShowCompletionModal(false)}
        onComplete={() => {
          setShowCompletionModal(false);
          setIsEditing(true);
        }}
        onSkip={() => setShowCompletionModal(false)}
      />
    </div>
  );
}
