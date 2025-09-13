"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AuthGuard } from "@/components/auth/AuthGuard";
import {
  ArrowLeft,
  Users,
  Trophy,
  CheckCircle,
  Video,
  Calendar,
  Award,
  Eye,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  fetchCompetitionById,
  selectSelectedCompetition,
  selectCompetitionIsLoading,
  clearSelectedCompetition,
} from "@/store/slices/competitionSlice";

// You will eventually replace these with real data and components
import QuizManager from "@/components/competitions/QuizManager";
import VideoReviewManager from "@/components/competitions/VideoReviewManager";
import ZoomScheduler from "@/components/competitions/ZoomScheduler";
import FinalEvaluation from "@/components/competitions/FinalEvaluation";
import ParticipantTracker from "@/components/competitions/ParticipantTracker";
import NotificationSystem from "@/components/competitions/NotificationSystem";

function CompetitionManagePageContent() {
  const params = useParams();
  const dispatch = useAppDispatch();
  const competitionId = params.id as string;

  // Get data from the Redux store
  const competition = useAppSelector(selectSelectedCompetition);
  const isLoading = useAppSelector(selectCompetitionIsLoading);

  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (competitionId) {
      dispatch(fetchCompetitionById(competitionId));
    }

    // Clean up the selected competition when the component unmounts
    return () => {
      dispatch(clearSelectedCompetition());
    };
  }, [dispatch, competitionId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading competition management...</p>
        </div>
      </div>
    );
  }

  if (!competition) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Competition Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            The competition you're trying to manage doesn't exist.
          </p>
          <Button asChild>
            <Link href="/employer/competitions/my">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to My Competitions
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const stats = competition.stats;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full py-8 container">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Manage: {competition.title}
            </h1>
            <p className="text-gray-600">
              Control all aspects of your competition journey
            </p>
          </div>
          <Button asChild variant="outline">
            <Link href={`/competitions/${competition._id}`}>
              <Eye className="h-4 w-4 mr-2" />
              View Public Page
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-gray-600">Participants</p>
              <p className="text-2xl font-bold">{stats?.totalParticipants}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-gray-600">Round 1 Passed</p>
              <p className="text-2xl font-bold text-green-600">
                {stats?.round1Passed}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-gray-600">Videos Pending</p>
              <p className="text-2xl font-bold text-yellow-600">
                {stats?.videosPending}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-gray-600">Interviews Scheduled</p>
              <p className="text-2xl font-bold text-blue-600">
                {stats?.interviewsScheduled}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-purple-600">
                {stats?.completed}
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-7">
            {/* Tabs Triggers */}
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="round1">Round 1: Quiz</TabsTrigger>
            <TabsTrigger value="round2">Round 2: Videos</TabsTrigger>
            <TabsTrigger value="round3">Round 3: Interviews</TabsTrigger>
            <TabsTrigger value="round4">Round 4: Final</TabsTrigger>
            <TabsTrigger value="participants">Participants</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>

          {/* Tabs Content */}
          <TabsContent value="overview">
            <Card>
              <CardHeader>
                <CardTitle>Participant Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Overview content will go here, using
                  `competition.participants` data.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="round1">
            <QuizManager competitionId={competitionId} />
          </TabsContent>
          <TabsContent value="round2">
            <VideoReviewManager
              competitionId={competitionId}
              submissions={[]}
            />
          </TabsContent>
          <TabsContent value="round3">
            <ZoomScheduler competitionId={competitionId} participants={[]} />
          </TabsContent>
          <TabsContent value="round4">
            <FinalEvaluation competitionId={competitionId} participants={[]} />
          </TabsContent>
          <TabsContent value="participants">
            <ParticipantTracker
              competitionId={competitionId}
              participants={[]}
            />
          </TabsContent>
          <TabsContent value="notifications">
            <NotificationSystem
              competitionId={competitionId}
              participants={[]}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default function CompetitionManagePage() {
  return (
    <AuthGuard requireAuth={true} allowedRoles={["employer"]}>
      <CompetitionManagePageContent />
    </AuthGuard>
  );
}
