// src/components/profile/ProfilePage.tsx

"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/store";

import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Edit, X, Camera, AlertCircle, Loader2 } from "lucide-react";
import { User } from "@/types";

// Import all your tab components
import { PersonalInfoTab } from "./tabs/PersonalInfoTab";
import { ExperienceTab } from "./tabs/ExperienceTab";
import { EducationTab } from "./tabs/EducationTab";
import { SkillsTab } from "./tabs/SkillsTab";
import { ContactTab } from "./tabs/ContactTab";
import { CompanyTab } from "./tabs/CompanyTab";
import { ProfileCompletionModal } from "./ProfileCompletionModal";
import { toast } from "sonner";
import { selectCurrentUser } from "@/store/features/auth/authSlice";
import {
  useGetUserProfileQuery,
  useUpdateUserProfileMutation,
} from "@/store/api/userApi";

export function ProfilePage() {
  const authUser = useAppSelector(selectCurrentUser);
  const { data: profile, isLoading, isError } = useGetUserProfileQuery();
  const [updateProfile, { isLoading: isUpdating }] =
    useUpdateUserProfileMutation();

  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    // The query hook handles fetching automatically. This effect is now only for UI logic.
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
      success: (updatedProfile) => {
        setIsEditing(false); // Turn off editing mode on success
        return "Profile updated successfully!";
      },
      error: (err) => err.data?.message || "Failed to update profile.",
    });
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
              <div className="relative">
                <Avatar className="w-24 h-24 border-4 border-white shadow-md">
                  <AvatarImage
                    src={
                      "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                    }
                  />
                  <AvatarFallback className="text-3xl">
                    {authUser.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0"
                  >
                    <Camera className="w-4 h-4" />
                  </Button>
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

      {/* Profile Tabs */}
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

        {/* Each tab now receives the authoritative `profile` from the query and the `isUpdating` state */}
        <TabsContent value="personal">
          <PersonalInfoTab
            profile={profile}
            onUpdate={handleUpdateProfile}
            isUpdating={isUpdating}
          />
        </TabsContent>
        <TabsContent value="contact">
          <ContactTab
            profile={profile}
            isEditing={isUpdating}
            onUpdate={handleUpdateProfile}
          />
        </TabsContent>

        {authUser.role === "employee" && (
          <>
            <TabsContent value="experience">
              <ExperienceTab
                profile={profile}
                isEditing={isUpdating}
                onUpdate={handleUpdateProfile}
              />
            </TabsContent>
            <TabsContent value="education">
              <EducationTab
                profile={profile}
                isEditing={isUpdating}
                onUpdate={handleUpdateProfile}
              />
            </TabsContent>
            <TabsContent value="skills">
              <SkillsTab
                profile={profile}
                isEditing={isUpdating}
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
              isEditing={isUpdating}
              onUpdate={handleUpdateProfile}
            />
          </TabsContent>
        )}
      </Tabs>

      {/* Modal remains the same */}
      {showCompletionModal && (
        <ProfileCompletionModal
          isOpen={showCompletionModal}
          onClose={() => setShowCompletionModal(false)}
          onComplete={() => {
            setShowCompletionModal(false);
            setIsEditing(true);
          }}
          onSkip={() => setShowCompletionModal(false)}
        />
      )}
    </div>
  );
}
