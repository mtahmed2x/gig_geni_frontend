"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { Loader2 } from "lucide-react";

function JoinCompetitionPageContent() {
  const params = useParams();
  const router = useRouter();
  const competitionId = params.id as string;

  // This effect runs once when the component mounts, triggering the redirect.
  useEffect(() => {
    if (competitionId) {
      router.push(`/competitions/${competitionId}/quiz`);
    }
  }, [router, competitionId]);

  // Display a loading state to provide feedback to the user during the redirect.
  return (
    <div className="flex flex-col items-center justify-center text-center">
      <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
      <h1 className="text-2xl font-bold">Joining Competition...</h1>
      <p className="text-muted-foreground">
        Please wait, preparing the first round for you.
      </p>
    </div>
  );
}

// The parent component with AuthGuard remains to protect the route.
export default function JoinCompetitionPage() {
  return (
    <AuthGuard requireAuth={true} allowedRoles={["employee"]}>
      <div className="py-12 md:py-20">
        <JoinCompetitionPageContent />
      </div>
    </AuthGuard>
  );
}
