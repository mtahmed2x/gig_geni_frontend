"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
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
import { AuthGuard } from "@/components/auth/AuthGuard";
import { Competition, Participant } from "@/types";
import CompetitionJourney from "@/components/competitions/CompetitionJourney";
import { useFetchCompetitionByIdQuery } from "@/store/api/competitionApi";
import { selectCurrentUser } from "@/store/features/auth/authSlice";
import { useAppSelector } from "@/store/store";

function CompetitionJourneyPageContent() {
  const params = useParams();
  const competitionId = params.id as string;

  // --- STEP 2: Replace useDispatch/useSelector with RTK Query and correct user selector ---
  const {
    data: competition,
    isLoading,
    isError,
  } = useFetchCompetitionByIdQuery(competitionId, { skip: !competitionId });

  const currentUser = useAppSelector(selectCurrentUser);

  // The useEffect for fetching and cleanup is no longer needed.
  // RTK Query handles the entire data lifecycle.

  // This useMemo hook remains the same and works perfectly with the new data source
  const participantData = useMemo(() => {
    if (!competition || !currentUser) return undefined;
    return competition.participants.find((p) => {
      if (typeof p.user === "string") {
        return p.user === currentUser._id;
      }
      return p.user._id === currentUser._id;
    });
  }, [competition, currentUser]);

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
    if (now < startDate)
      return { text: "Upcoming", color: "bg-blue-100 text-blue-700" };
    if (now > endDate)
      return { text: "Completed", color: "bg-gray-100 text-gray-500" };
    return { text: "Active", color: "bg-green-100 text-green-700" };
  };

  // --- STEP 3: Update Loading State ---
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

  // --- STEP 4: Update Error/Not Found State ---
  if (isError || !competition) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold">Competition Not Found</h2>
          <p className="text-muted-foreground mb-6">
            This competition journey could not be loaded.
          </p>
          <Button asChild>
            <Link href="/employee/competitions/my">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to My Competitions
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const status = getStatusBadge(competition);

  // The rest of the component JSX remains unchanged
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <Button asChild variant="ghost">
              <Link href={`/competitions/${competition._id}`}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Details
              </Link>
            </Button>
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
                      <span>
                        {competition.participants.length} participants
                      </span>
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
            participantData={participantData}
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
                  <Link href="/employee/competitions/my">My Competitions</Link>
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

// The parent component with the AuthGuard remains unchanged
export default function CompetitionJourneyPage() {
  return (
    <AuthGuard requireAuth={true} allowedRoles={["employee"]}>
      <CompetitionJourneyPageContent />
    </AuthGuard>
  );
}
