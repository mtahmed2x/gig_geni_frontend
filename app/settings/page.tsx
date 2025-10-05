import { SettingsPage } from "@/components/settings/SettingsPage";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings - GigGeni",
  description: "Manage your account settings and preferences",
};

export default function Settings() {
  return <SettingsPage />;
}
