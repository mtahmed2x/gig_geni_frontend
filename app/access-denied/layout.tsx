// app/access-denied/layout.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Access Denied - GigGeni",
  description: "You do not have permission to access this page",
};

export default function AccessDeniedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
