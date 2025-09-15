// src/app/competitions/[id]/join/page.tsx

"use client";

import { useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AuthGuard } from "@/components/auth/AuthGuard";
import {
  ArrowLeft,
  Trophy,
  CheckCircle,
  AlertCircle,
  Info,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  fetchCompetitionById,
  joinCompetition,
  selectSelectedCompetition,
  selectCompetitionIsLoading,
  clearSelectedCompetition,
} from "@/store/slices/competitionSlice";
import { selectUser } from "@/store/slices/authSlice";
import { toast, Toaster } from "sonner";

function JoinCompetitionPageContent() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const competitionId = params.id as string;

  const competition = useAppSelector(selectSelectedCompetition);
  const isLoading = useAppSelector(selectCompetitionIsLoading);
  const currentUser = useAppSelector(selectUser);

  // Fetch competition details on component mount
  useEffect(() => {
    if (competitionId) {
      dispatch(fetchCompetitionById(competitionId));
    }
    // Clean up state when the component unmounts
    return () => {
      dispatch(clearSelectedCompetition());
    };
  }, [dispatch, competitionId]);

  // Use useMemo to efficiently check if the user has already joined
  const hasJoined = useMemo(() => {
    if (!competition || !currentUser) return false;
    return competition.participants.some((p) => p.user === currentUser._id);
  }, [competition, currentUser]);

  const handleJoinCompetition = async () => {
    const promise = dispatch(joinCompetition(competitionId)).unwrap();

    toast.promise(promise, {
      loading: "Submitting your application...",
      success: () => {
        // Redirect to a page where employees can see their joined competitions
        router.push("/employee/competitions/my");
        return "Successfully joined the competition!";
      },
      error: (err) =>
        err.message || "An error occurred. You may have already joined.",
    });
  };

  if (isLoading && !competition) {
    return (
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading competition details...</p>
      </div>
    );
  }

  if (!competition) {
    return (
      <Card className="max-w-md mx-auto">
        <CardHeader className="text-center">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-2" />
          <CardTitle>Competition Not Found</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-muted-foreground mb-4">
            This competition may no longer be available.
          </p>
          <Button asChild>
            <Link href="/competitions">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Competitions
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Confirm Your Entry</CardTitle>
        <CardDescription>
          You are about to join the following competition. Please review the
          details below.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="p-4 bg-secondary/50 rounded-lg space-y-2 border">
          <h3 className="text-xl font-semibold">{competition.title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {competition.description}
          </p>
          <div className="pt-2">
            <span className="font-bold text-primary text-lg">
              {competition.prize}
            </span>
            <span className="text-sm text-muted-foreground"> in prizes</span>
          </div>
        </div>

        {hasJoined ? (
          <div className="p-4 text-center bg-green-50 text-green-800 rounded-lg border border-green-200 flex items-center justify-center">
            <CheckCircle className="mr-2 h-5 w-5" />
            <p className="font-medium">
              You have already joined this competition.
            </p>
          </div>
        ) : (
          <div className="p-4 bg-blue-50 text-blue-800 rounded-lg border border-blue-200 flex items-start">
            <Info className="mr-3 h-5 w-5 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold">Heads up!</h4>
              <p className="text-sm">
                By clicking "Confirm & Join", you agree to the competition's
                terms and conditions. Your profile will be shared with the
                organizer for evaluation purposes.
              </p>
            </div>
          </div>
        )}

        <div className="flex flex-col-reverse sm:flex-row items-center gap-4">
          <Button variant="outline" className="w-full" asChild>
            <Link href={`/competitions/${competition._id}`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Cancel & Go Back
            </Link>
          </Button>
          <Button
            className="w-full"
            onClick={handleJoinCompetition}
            disabled={isLoading || hasJoined}
          >
            {isLoading ? (
              "Joining..."
            ) : hasJoined ? (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                Already Joined
              </>
            ) : (
              <>
                <Trophy className="mr-2 h-4 w-4" />
                Confirm & Join
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function JoinCompetitionPage() {
  return (
    // This page is protected and only accessible by employees
    <AuthGuard requireAuth={true} allowedRoles={["employee"]}>
      <div className="py-12 md:py-20">
        <JoinCompetitionPageContent />
        <Toaster position="top-center" richColors />
      </div>
    </AuthGuard>
  );
}
