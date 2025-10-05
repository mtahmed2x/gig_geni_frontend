"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Circle, Lock, Play } from "lucide-react";
import { useRouter } from "next/navigation";
import { Participant } from "@/types";

// The visual state of a single step
interface JourneyStep {
  round: number;
  title: string;
  description: string;
  status: "completed" | "current" | "locked";
}

interface CompetitionJourneyProps {
  competitionId: string;
  // We still accept this prop to handle future rounds correctly
  participantData?: Participant;
}

export default function CompetitionJourney({
  competitionId,
  participantData,
}: CompetitionJourneyProps) {
  const router = useRouter();

  // --- THIS LOGIC IS NOW CORRECTED AS PER YOUR INSTRUCTIONS ---
  const journeySteps: JourneyStep[] = [
    {
      round: 1,
      title: "Round 1: Online Quiz",
      description:
        "Test your foundational knowledge with a timed multiple-choice quiz.",
      // If the participant data shows the quiz is passed, it's 'completed'.
      // Otherwise, it is ALWAYS 'current'.
      status: participantData?.round1 === "passed" ? "completed" : "current",
    },
    {
      round: 2,
      title: "Round 2: Video Submission",
      description:
        "Record and submit a short video answering a behavioral question.",
      // This round is locked until round 1 is passed.
      status: participantData?.round1 === "passed" ? "current" : "locked",
    },
    {
      round: 3,
      title: "Round 3: Live Interview",
      description:
        "Schedule and attend a live virtual interview with the hiring manager.",
      // This round is locked until round 2 is approved.
      status: participantData?.round2 === "approved" ? "current" : "locked",
    },
    {
      round: 4,
      title: "Round 4: Final Project",
      description:
        "Complete a take-home project to showcase your practical skills.",
      // This round is locked until round 3 is approved.
      status: participantData?.round3 === "approved" ? "current" : "locked",
    },
  ];

  const getStatusIcon = (status: JourneyStep["status"]) => {
    if (status === "completed")
      return <CheckCircle className="h-6 w-6 text-green-500" />;
    if (status === "current")
      return <Circle className="h-6 w-6 text-primary animate-pulse" />;
    return <Lock className="h-6 w-6 text-gray-400" />;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Competition Journey</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative space-y-8">
          <div className="absolute left-3 top-3 bottom-3 w-0.5 bg-gray-200 rounded" />

          {journeySteps.map((step, index) => (
            <motion.div
              key={step.round}
              className="relative flex items-start space-x-6 pl-10"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.15 }}
            >
              <div className="absolute left-0 top-0 h-6 w-6 rounded-full bg-background flex items-center justify-center border-2 border-gray-200">
                {getStatusIcon(step.status)}
              </div>
              <div className="flex-1">
                <h3
                  className={`font-semibold ${
                    step.status === "locked"
                      ? "text-muted-foreground"
                      : "text-foreground"
                  }`}
                >
                  {step.title}
                </h3>
                <p
                  className={`text-sm ${
                    step.status === "locked"
                      ? "text-muted-foreground"
                      : "text-gray-600"
                  }`}
                >
                  {step.description}
                </p>

                {/* --- THIS IS THE GUARANTEED ACTION BUTTON FOR ROUND 1 --- */}
                {/* It will show if the status is 'current' (i.e., not yet passed) */}
                {step.round === 1 && step.status === "current" && (
                  <Button
                    className="mt-3"
                    onClick={() =>
                      router.push(`/competitions/${competitionId}/quiz`)
                    }
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Start Quiz
                  </Button>
                )}

                {/* Placeholder for future rounds */}
                {step.round === 2 && step.status === "current" && (
                  <Button className="mt-3" disabled>
                    Upload Video (Locked)
                  </Button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
