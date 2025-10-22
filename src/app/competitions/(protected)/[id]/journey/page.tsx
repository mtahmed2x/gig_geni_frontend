"use client";

import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  AlertCircle,
  Trophy,
  Users,
  Calendar,
  MapPin,
  Loader2,
} from "lucide-react";
import Link from "next/link";

import CompetitionJourney from "@/components/competitions/CompetitionJourney";
import { useGetCompetitionQuery } from "@/lib/api/competitionApi";
import { Competition } from "@/lib/features/competition/types";
import { useGetParticipantQuery } from "@/lib/api/participantApi";

function CompetitionJourneyPageContent() {
  const params = useParams();
  const router = useRouter();
  const competitionId = params.id as string;

  const {
    data: participant,
    isLoading,
    isError,
  } = useGetParticipantQuery(competitionId);
  useGetCompetitionQuery(competitionId, { skip: !competitionId });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center flex flex-col items-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">
            Loading competition journey...
          </p>
        </div>
      </div>
    );
  }

  if (isError || !participant) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold">Competition Not Found</h2>
          <p className="text-muted-foreground mb-6">
            This competition journey could not be loaded.
          </p>
          <Button asChild>
            <Link href="/competitions/my">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to My Competitions
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const competition = participant.competition;

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "TBD";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getStatusBadge = (comp: Competition) => {
    const now = new Date();
    const startDate = new Date(comp.startDate);
    const endDate = new Date(comp.endDate);
    if (comp.status === "completed") {
      return { text: "Completed", color: "bg-gray-100 text-gray-500" };
    }
    return { text: "Active", color: "bg-green-100 text-green-700" };
  };

  const status = getStatusBadge(competition);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.back()}
              className="flex items-center gap-2 bg-white text-gray-700 px-8 py-3 rounded-full font-semibold border-2 border-gray-200 hover:border-[#FC5602]/30 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <ArrowLeft className="w-5 h-5" />
              Go Back
            </motion.button>
            <Badge className={status.color}>{status.text}</Badge>
          </div>

          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h1 className="text-2xl font-bold mb-2">
                    {competition.title}
                  </h1>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span>{competition.location}</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2" />
                      <span>{competition.totalParticipants} participants</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>Ends {formatDate(competition.endDate)}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center text-green-600 font-semibold">
                    <Trophy className="h-5 w-5 mr-2" />
                    <span>{competition.prize}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <CompetitionJourney
            competitionId={competition._id}
            participantData={participant}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8"
        >
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              <div className="flex flex-wrap gap-3">
                <Button asChild variant="outline">
                  <Link href={`/competitions/${competition._id}`}>
                    View Competition Details
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/competitions/my">My Competitions</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/competitions">Browse More Competitions</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

export default function CompetitionJourneyPage() {
  return <CompetitionJourneyPageContent />;
}
