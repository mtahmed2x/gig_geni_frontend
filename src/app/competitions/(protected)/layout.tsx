import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export default function ProtectedCompetitionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}
