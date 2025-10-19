"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Search,
  Calendar,
  DollarSign,
  Users,
  Trophy,
  Clock,
  Eye,
  Edit,
  Plus,
  CheckCircle,
  AlertCircle,
  Play,
  Pause,
  Settings,
  BarChart3,
} from "lucide-react";
import Link from "next/link";
import { Competition } from "@/lib/features/competition/types";
import { useGetMyCompetitionsQuery } from "@/lib/api/competitionApi";

// --- Helper Functions ---
const getStatusColor = (status: Competition["status"]) => {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-800";
    case "completed":
      return "bg-blue-100 text-blue-800";

    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getStatusIcon = (status: Competition["status"]) => {
  switch (status) {
    case "active":
      return <Play className="h-4 w-4" />;
    case "completed":
      return <CheckCircle className="h-4 w-4" />;
    default:
      return <AlertCircle className="h-4 w-4" />;
  }
};

// --- Skeleton Loader Component ---
const CompetitionCardSkeleton = () => (
  <Card className="h-full animate-pulse">
    <CardHeader>
      <div className="h-6 bg-gray-200 rounded w-3/4"></div>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="h-4 bg-gray-200 rounded w-full"></div>
      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
      <div className="flex justify-between items-center pt-4">
        <div className="h-8 bg-gray-200 rounded w-1/4"></div>
        <div className="h-8 bg-gray-200 rounded w-1/4"></div>
      </div>
    </CardContent>
  </Card>
);

function ManageCompetitionsPageContent() {
  const {
    data: myCompetitionsData,
    isLoading,
    isError,
  } = useGetMyCompetitionsQuery();

  const myCompetitions = myCompetitionsData?.data || [];

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredCompetitions = useMemo(() => {
    return myCompetitions.filter((competition) => {
      const matchesSearch = competition.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || competition.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [myCompetitions, searchQuery, statusFilter]);

  const stats = useMemo(
    () => ({
      total: myCompetitions.length,
      active: myCompetitions.filter((c) => c.status === "active").length,
      completed: myCompetitions.filter((c) => c.status === "completed").length,

      totalParticipants: myCompetitions.reduce(
        (sum, c) => sum + (c.participants?.length || 0),
        0
      ),
    }),
    [myCompetitions]
  );

  return (
    <div className="min-h-screen">
      <div className="w-full container py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Manage Competitions
            </h1>
            <p className="text-gray-600">
              Create, monitor, and manage your competition campaigns
            </p>
          </div>
          <Button asChild>
            <Link href="/competitions/create">
              <Plus className="h-4 w-4 mr-2" />
              Create Competition
            </Link>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <p className="text-sm font-medium text-gray-600">Total Created</p>
              <p className="text-2xl font-bold">
                {isLoading ? "..." : stats.total}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <p className="text-sm font-medium text-gray-600">Active</p>
              <p className="text-2xl font-bold text-green-600">
                {isLoading ? "..." : stats.active}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-blue-600">
                {isLoading ? "..." : stats.completed}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <p className="text-sm font-medium text-gray-600">
                Total Participants
              </p>
              <p className="text-2xl font-bold text-purple-600">
                {isLoading ? "..." : stats.totalParticipants}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  placeholder="Search competitions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Tabs
                value={statusFilter}
                onValueChange={setStatusFilter}
                className="w-auto"
              >
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="active">Active</TabsTrigger>
                  <TabsTrigger value="completed">Completed</TabsTrigger>
                  <TabsTrigger value="draft">Drafts</TabsTrigger>
                  <TabsTrigger value="paused">Paused</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardContent>
        </Card>

        {/* --- STEP 5: Add loading state and map over live data --- */}
        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CompetitionCardSkeleton />
            <CompetitionCardSkeleton />
            <CompetitionCardSkeleton />
            <CompetitionCardSkeleton />
          </div>
        ) : isError ? (
          <Card>
            <CardContent className="p-12 text-center text-destructive">
              <AlertCircle className="h-12 w-12 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">
                Failed to Load Competitions
              </h3>
              <p>
                There was an error fetching your data. Please try again later.
              </p>
            </CardContent>
          </Card>
        ) : filteredCompetitions.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredCompetitions.map((competition, index) => (
              <motion.div
                key={competition._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-xl mb-2">
                      {competition.title}
                    </CardTitle>
                    <Badge className={getStatusColor(competition.status)}>
                      {getStatusIcon(competition.status)}
                      <span className="ml-1 capitalize">
                        {competition.status}
                      </span>
                    </Badge>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {competition.description}
                    </p>
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-1" />
                        {competition.prize}
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        {competition.totalParticipants} participants
                      </div>
                      {/* <div className="flex items-center">
                        <Eye className="h-4 w-4 mr-1" />
                        {competition.views || 0} views
                      </div> */}
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        Ends{" "}
                        {new Date(competition.endDate).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button asChild variant="outline" className="flex-1">
                        <Link href={`/competitions/${competition._id}`}>
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Link>
                      </Button>
                      <Button asChild variant="outline">
                        <Link
                          href={`/competitions/${competition._id}/analytics`}
                        >
                          <BarChart3 className="h-4 w-4 mr-2" />
                          Analytics
                        </Link>
                      </Button>
                      <Button asChild>
                        <Link href={`/competitions/${competition._id}/manage/`}>
                          <Settings className="h-4 w-4 mr-2" />
                          Manage
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <Trophy className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No competitions found
              </h3>
              <p className="text-gray-600 mb-4">
                {searchQuery || statusFilter !== "all"
                  ? "Try adjusting your search or filters"
                  : "You haven't created any competitions yet"}
              </p>
              <Button asChild>
                <Link href="/competitions/create">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Competition
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

export default function ManageCompetitionsPage() {
  return <ManageCompetitionsPageContent />;
}
