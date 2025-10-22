// src/components/CompetitionJourney.tsx

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  Circle,
  Lock,
  Play,
  Video,
  Calendar,
  FileText,
  XCircle,
  Trophy,
  Loader2,
  Link as LinkIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Participant, RoundStatus } from "@/lib/features/participant/types";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { useUpdateParticipantMutation } from "@/lib/api/participantApi";
import { toast } from "sonner";
import Link from "next/link";

type JourneyStepStatus = "completed" | "current" | "locked" | "failed";

// ... (interface definitions remain the same)

interface JourneyStep {
  round: number;
  title: string;
  description: string;
  status: JourneyStepStatus;
}

interface CompetitionJourneyProps {
  competitionId: string;
  participantData?: Participant;
}

export default function CompetitionJourney({
  competitionId,
  participantData,
}: CompetitionJourneyProps) {
  const router = useRouter();
  const [videoUrl, setVideoUrl] = useState("");

  // --- STEP 1: Import and instantiate the update mutation ---
  const [updateParticipant, { isLoading: isUpdating }] =
    useUpdateParticipantMutation();

  // --- (getStepStatus, journeySteps, and getStatusIcon functions remain unchanged) ---
  const getStepStatus = (round: number): JourneyStepStatus => {
    if (!participantData) return "locked";

    const {
      round1_quiz,
      round2_video,
      round3_meeting,
      round4_task,
      isEliminated,
    } = participantData;

    switch (round) {
      case 1:
        if (round1_quiz.status === "passed") return "completed";
        if (round1_quiz.status === "failed") return "failed";
        return isEliminated ? "locked" : "current";

      case 2:
        if (round1_quiz.status !== "passed") return "locked";
        if (
          round2_video.status === "passed" ||
          round2_video.status === "approved"
        )
          return "completed";
        if (
          round2_video.status === "failed" ||
          round2_video.status === "rejected"
        )
          return "failed";
        return isEliminated ? "locked" : "current";

      case 3:
        if (
          round2_video.status !== "passed" &&
          round2_video.status !== "approved"
        )
          return "locked";
        if (round3_meeting.status === "passed") return "completed";
        if (round3_meeting.status === "failed") return "failed";
        return isEliminated ? "locked" : "current";

      case 4:
        if (round3_meeting.status !== "passed") return "locked";
        if (round4_task.status === "passed") return "completed";
        if (round4_task.status === "failed") return "failed";
        return isEliminated ? "locked" : "current";

      default:
        return "locked";
    }
  };

  const journeySteps: JourneyStep[] = [
    {
      round: 1,
      title: "Round 1: Online Quiz",
      description:
        "Test your foundational knowledge with a timed multiple-choice quiz.",
      status: getStepStatus(1),
    },
    {
      round: 2,
      title: "Round 2: Video Submission",
      description:
        "Record and submit a short video answering a behavioral question.",
      status: getStepStatus(2),
    },
    {
      round: 3,
      title: "Round 3: Live Interview",
      description:
        "Schedule and attend a live virtual interview with the hiring manager.",
      status: getStepStatus(3),
    },
    {
      round: 4,
      title: "Round 4: Final Project",
      description:
        "Complete a take-home project to showcase your practical skills.",
      status: getStepStatus(4),
    },
  ];

  const getStatusIcon = (status: JourneyStepStatus) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      case "current":
        return <Circle className="h-6 w-6 text-primary animate-pulse" />;
      case "failed":
        return <XCircle className="h-6 w-6 text-destructive" />;
      case "locked":
        return <Lock className="h-6 w-6 text-gray-400" />;
    }
  };

  // --- STEP 2: Create the handler to submit the video URL ---
  const handleVideoSubmit = async () => {
    if (!videoUrl.trim() || !participantData?._id) {
      toast.error("Please enter a valid video URL.");
      return;
    }

    const payload = {
      id: participantData._id,
      round2_video: {
        status: RoundStatus.SUBMITTED,
        videoUrl: videoUrl,
        submittedAt: new Date().toISOString(),
      },
    };

    const promise = updateParticipant(payload).unwrap();

    toast.promise(promise, {
      loading: "Submitting your video link...",
      success: "Submission successful! We will review it shortly.",
      error: "Failed to submit. Please try again.",
    });
  };

  // --- STEP 3: Enhance the action renderer for Round 2 ---
  const renderStepAction = (step: JourneyStep) => {
    if (step.status !== "current") {
      return null;
    }

    // --- Special UI for Round 2 ---
    if (step.round === 2) {
      const round2Status = participantData?.round2_video.status;

      // If already submitted, show a confirmation message
      if (
        round2Status === RoundStatus.SUBMITTED ||
        round2Status === RoundStatus.PENDING
      ) {
        return (
          <div className="mt-3 p-3 bg-muted rounded-lg text-sm">
            <p className="font-semibold text-foreground mb-2">
              Submission Under Review
            </p>
            <p className="text-muted-foreground mb-3">
              We have received your submission. Please wait for an email
              regarding the next steps.
            </p>
            <Link
              href={participantData?.round2_video.videoUrl || "#"}
              target="_blank"
              className="flex items-center text-primary hover:underline"
            >
              <LinkIcon className="h-4 w-4 mr-2" />
              View Your Submission
            </Link>
          </div>
        );
      }

      // Otherwise, show the submission form
      return (
        <div className="mt-4 space-y-3 p-4 border rounded-lg">
          <p className="text-sm text-muted-foreground">
            Please follow the instructions sent to your email to create your
            video, then paste the public URL below (e.g., YouTube, Vimeo, Loom).
          </p>
          <div className="flex gap-2">
            <Input
              placeholder="https://your-video-link.com"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              disabled={isUpdating}
            />
            <Button
              onClick={handleVideoSubmit}
              disabled={isUpdating || !videoUrl}
            >
              {isUpdating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Submit"
              )}
            </Button>
          </div>
        </div>
      );
    }

    // --- Default button for other rounds ---
    const actions: {
      [key: number]: { label: string; icon: JSX.Element; path: string };
    } = {
      1: {
        label: "Start Quiz",
        icon: <Play className="h-4 w-4 mr-2" />,
        path: `/competitions/${competitionId}/quiz`,
      },
      3: {
        label: "Schedule Interview",
        icon: <Calendar className="h-4 w-4 mr-2" />,
        path: `/competitions/${competitionId}/interview`,
      },
      4: {
        label: "Submit Project",
        icon: <FileText className="h-4 w-4 mr-2" />,
        path: `/competitions/${competitionId}/project`,
      },
    };

    const action = actions[step.round];
    if (!action) return null;

    return (
      <Button className="mt-3" onClick={() => router.push(action.path)}>
        {action.icon}
        {action.label}
      </Button>
    );
  };

  // --- (Main return JSX remains the same) ---
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Competition Journey</CardTitle>
        <CardDescription>
          Follow the steps below to complete the competition.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {participantData?.isWinner && (
          <Alert className="mb-6 bg-green-50 border-green-200">
            <Trophy className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-800">Congratulations!</AlertTitle>
            <AlertDescription className="text-green-700">
              You have successfully won the competition!
            </AlertDescription>
          </Alert>
        )}
        {participantData?.isEliminated && !participantData.isWinner && (
          <Alert variant="destructive" className="mb-6">
            <XCircle className="h-4 w-4" />
            <AlertTitle>You Have Been Eliminated</AlertTitle>
            <AlertDescription>
              Unfortunately, you did not pass the requirements for the next
              round.
            </AlertDescription>
          </Alert>
        )}

        <div className="relative space-y-8">
          <div className="absolute left-3 top-3 bottom-3 w-0.5 bg-gray-200 rounded" />
          {journeySteps.map((step, index) => (
            <motion.div
              key={step.round}
              className="relative flex items-start space-x-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.15 }}
            >
              <div className="z-10 absolute left-0 top-0 h-6 w-6 rounded-full bg-background flex items-center justify-center">
                {getStatusIcon(step.status)}
              </div>

              <div className="flex-1 pl-10">
                <h3
                  className={`font-semibold ${
                    step.status === "locked" || step.status === "failed"
                      ? "text-muted-foreground"
                      : "text-foreground"
                  }`}
                >
                  {step.title}
                </h3>
                <p
                  className={`text-sm ${
                    step.status === "locked" || step.status === "failed"
                      ? "text-muted-foreground"
                      : "text-gray-600"
                  }`}
                >
                  {step.description}
                </p>

                {renderStepAction(step)}
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
