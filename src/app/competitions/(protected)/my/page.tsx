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
  Star,
  Trophy,
  Clock,
  Eye,
  Play,
  CheckCircle,
  XCircle,
  MapPin,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { useGetJoinedCompetitionsQuery } from "@/lib/api/competitionApi";

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

function MyCompetitionsPageContent() {
  const {
    data: joinedCompetitionsData,
    isLoading,
    isError,
  } = useGetJoinedCompetitionsQuery();

  const joinedCompetitions = joinedCompetitionsData?.data || [];

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredCompetitions = useMemo(() => {
    return joinedCompetitions.filter((competition) => {
      const matchesSearch = competition.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      // The status filter logic will need to be updated when your API provides
      // a participant-specific status (e.g., 'in_progress', 'completed').
      // For now, it's a placeholder.
      // const matchesStatus = statusFilter === 'all' || competition.participantStatus === statusFilter;
      return matchesSearch;
    });
  }, [joinedCompetitions, searchQuery, statusFilter]);

  const stats = useMemo(
    () => ({
      total: joinedCompetitions.length,
      inProgress: 0, // Placeholder - requires participant-specific status from API
      completed: 0, // Placeholder
      won: 0, // Placeholder
    }),
    [joinedCompetitions]
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            My Competitions
          </h1>
          <p className="text-gray-600">
            Track your progress and manage your joined competitions.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <p className="text-sm font-medium text-gray-600">Total Joined</p>
              <p className="text-2xl font-bold text-gray-900">
                {isLoading ? "..." : stats.total}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <p className="text-sm font-medium text-gray-600">In Progress</p>
              <p className="text-2xl font-bold text-blue-600">
                {isLoading ? "..." : stats.inProgress}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-green-600">
                {isLoading ? "..." : stats.completed}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <p className="text-sm font-medium text-gray-600">Won</p>
              <p className="text-2xl font-bold text-yellow-600">
                {isLoading ? "..." : stats.won}
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
                  placeholder="Search your joined competitions..."
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
                  <TabsTrigger value="in_progress">In Progress</TabsTrigger>
                  <TabsTrigger value="completed">Completed</TabsTrigger>
                  <TabsTrigger value="eliminated">Eliminated</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardContent>
        </Card>

        {/* Competitions Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CompetitionCardSkeleton />
            <CompetitionCardSkeleton />
          </div>
        ) : isError ? (
          <Card>
            <CardContent className="p-12 text-center text-destructive">
              <AlertCircle className="h-12 w-12 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">
                Failed to Load Your Competitions
              </h3>
              <p>
                There was an error fetching your data. Please refresh the page
                or try again later.
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
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-xl mb-2">
                      {competition.title}
                    </CardTitle>
                    {/* Placeholder for participant-specific status */}
                    <Badge>In Progress</Badge>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {competition.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {competition.skillsTested.split(",").map((skill) => (
                        <Badge key={skill} variant="secondary">
                          {skill.trim()}
                        </Badge>
                      ))}
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-1" />
                        {competition.prize}
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        {competition.totalParticipants} participants
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        Ends{" "}
                        {new Date(competition.endDate).toLocaleDateString()}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {competition.location}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button asChild variant="outline" className="flex-1">
                        <Link href={`/competitions/${competition._id}`}>
                          <Eye className="h-4 w-4 mr-2" /> View Details
                        </Link>
                      </Button>
                      <Button asChild className="flex-1 bg-primary">
                        <Link href={`/competitions/${competition._id}/journey`}>
                          <Play className="h-4 w-4 mr-2" />
                          Continue Journey
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
                No Competitions Found
              </h3>
              <p className="text-gray-600 mb-4">
                {searchQuery || statusFilter !== "all"
                  ? "Try adjusting your filters"
                  : "You haven't joined any competitions yet."}
              </p>
              <Button asChild>
                <Link href="/competitions">Browse Competitions</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

export default function MyJoinedCompetitionsPage() {
  return <MyCompetitionsPageContent />;
}
