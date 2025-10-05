import { ProfilePage } from "@/components/profile/ProfilePage";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile - GigGeni",
  description: "Manage your profile information and settings",
};

export default function Profile() {
  return <ProfilePage />;
}
