"use client";
import { useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Eye, AlertCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import QuizManager from "@/components/competitions/QuizManager";
import VideoReviewManager from "@/components/competitions/VideoReviewManager";
import ZoomScheduler from "@/components/competitions/ZoomScheduler";
import FinalEvaluation from "@/components/competitions/FinalEvaluation";
import NotificationSystem from "@/components/competitions/NotificationSystem";
import { useGetCompetitionQuery } from "@/lib/api/competitionApi";
import ParticipantTracker from "@/components/competitions/ParticipantTracker";

function CompetitionManagePageContent() {
  const params = useParams();
  const competitionId = params.id as string;

  const {
    data: competition,
    isLoading,
    isError,
  } = useGetCompetitionQuery(competitionId, {
    skip: !competitionId,
  });

  const [activeTab, setActiveTab] = useState("overview");

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center flex flex-col items-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
          <p className="text-gray-600">Loading Competition Management...</p>
        </div>
      </div>
    );
  }

  if (isError || !competition) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Competition Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            {isError
              ? "There was an error loading the competition."
              : "The competition you're trying to manage doesn't exist."}
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

  // The rest of the component logic and JSX remains the same
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
              <p className="text-2xl font-bold">
                {stats?.totalParticipants ?? 0}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-gray-600">Round 1 Passed</p>
              <p className="text-2xl font-bold text-green-600">
                {stats?.round1Passed ?? 0}
              </p>
            </CardContent>
          </Card>
          {/* <Card>
            <CardContent className="p-6">
              <p className="text-sm text-gray-600">Videos Pending</p>
              <p className="text-2xl font-bold text-yellow-600">
                {stats?.videosPending ?? 0}
              </p>
            </CardContent>
          </Card> */}
          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-gray-600">Interviews Scheduled</p>
              <p className="text-2xl font-bold text-blue-600">
                {stats?.interviewsScheduled ?? 0}
              </p>
            </CardContent>
          </Card>
          {/* <Card>
            <CardContent className="p-6">
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-purple-600">
                {stats?.completed ?? 0}
              </p>
            </CardContent>
          </Card> */}
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 lg:grid-cols-7">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="round1">Round 1: Quiz</TabsTrigger>
            <TabsTrigger value="round2">Round 2: Videos</TabsTrigger>
            <TabsTrigger value="round3">Round 3: Interviews</TabsTrigger>
            <TabsTrigger value="round4">Round 4: Final</TabsTrigger>
            <TabsTrigger value="participants">Participants</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <Card>
              <CardHeader>
                <CardTitle>Competition Overview</CardTitle>
              </CardHeader>
              <CardContent>
                {/* This could be a dashboard component later */}
                <p>An overview of competition progress will be shown here.</p>
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
              participants={competition.participants || []}
            />
          </TabsContent>
          <TabsContent value="notifications">
            <NotificationSystem
              competitionId={competitionId}
              participants={competition.participants || []}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// The parent component with the AuthGuard remains unchanged
export default function CompetitionManagePage() {
  return <CompetitionManagePageContent />;
}
