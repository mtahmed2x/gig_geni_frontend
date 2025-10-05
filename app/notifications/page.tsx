import { NotificationsPage } from "@/components/notifications/NotificationsPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Notifications - GigGeni",
  description: "View and manage your notifications",
};

export default function Notifications() {
  return <NotificationsPage />;
}
