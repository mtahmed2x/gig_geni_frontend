"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { useCheckParticipantMutation } from "@/lib/api/participantApi";
import QuizTakingPageContent from "@/components/competitions/quiz-manager/QuizTakingPage";

const VerifyingAccess = () => (
  <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
    <Loader2 className="h-10 w-10 animate-spin text-primary" />
    <p className="mt-4 text-lg text-gray-600">
      Verifying your participation status...
    </p>
  </div>
);

export default function CompetitionQuizPage() {
  const router = useRouter();
  const params = useParams();
  const competitionId = params.id as string;

  const [authStatus, setAuthStatus] = useState<
    "checking" | "allowed" | "denied"
  >("checking");

  const [checkParticipant] = useCheckParticipantMutation();

  useEffect(() => {
    if (!competitionId) {
      toast.error("Competition ID is missing.");
      router.push("/");
      return;
    }

    const verifyParticipation = async () => {
      try {
        const result = await checkParticipant({ competitionId }).unwrap();

        if (result.canParticipate === true) {
          setAuthStatus("allowed");
        } else {
          setAuthStatus("denied");
          toast.error("You are not allowed to take the quiz");
          router.push(`/competitions/${competitionId}`);
        }
      } catch (error: any) {
        setAuthStatus("denied");
        const message =
          error.data?.message || "You are not authorized to access this quiz.";
        toast.error(message);
        router.push("/");
      }
    };

    verifyParticipation();
  }, [competitionId, checkParticipant, router]);

  if (authStatus === "checking") {
    return <VerifyingAccess />;
  }

  if (authStatus === "allowed") {
    return (
      <div className="bg-gray-50 min-h-screen py-8 md:py-12">
        <QuizTakingPageContent />
      </div>
    );
  }

  return null;
}
