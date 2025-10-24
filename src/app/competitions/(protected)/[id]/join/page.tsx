"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useCreateParticipantMutation } from "@/lib/api/participantApi";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";

function JoinCompetitionPageContent() {
  const params = useParams();
  const router = useRouter();
  const competitionId = params.id as string;

  const [createParticipant, { isLoading, isSuccess, isError, error }] =
    useCreateParticipantMutation();

  useEffect(() => {
    if (competitionId) {
      const payload = { competition: competitionId };

      const promise = createParticipant(payload).unwrap();

      toast.promise(promise, {
        loading: "Registering you for the competition...",
        success: "Successfully joined! Redirecting to the first round...",
        error: (err) => err.data?.message || "Failed to join the competition.",
      });
    }
  }, [competitionId, createParticipant]);

  useEffect(() => {
    if (isSuccess && competitionId) {
      const timer = setTimeout(() => {
        router.push(`/competitions/${competitionId}/quiz`);
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [isSuccess, router, competitionId]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center text-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <h1 className="text-2xl font-bold">Joining Competition...</h1>
        <p className="text-muted-foreground">
          Please wait while we register your participation.
        </p>
      </div>
    );
  }

  if (isError) {
    const errorMessage =
      (error as any)?.data?.message ||
      "An unexpected error occurred. You might have already joined this competition.";

    return (
      <div className="flex flex-col items-center justify-center text-center text-red-600">
        <h1 className="text-2xl font-bold">Registration Failed</h1>
        <p className="text-muted-foreground mt-2 max-w-md">{errorMessage}</p>
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="mt-6"
        >
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center text-center">
      <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
      <h1 className="text-2xl font-bold">Successfully Joined!</h1>
      <p className="text-muted-foreground">
        Preparing the first round for you...
      </p>
    </div>
  );
}

export default function JoinCompetitionPage() {
  return (
    <div className="py-12 md:py-20">
      <JoinCompetitionPageContent />
      <Toaster position="top-center" richColors />
    </div>
  );
}
