// src/app/employer/competitions/my/page.tsx

"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { Search, Trophy, Play, CheckCircle, Star, Eye } from "lucide-react";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  fetchMyCompetitions,
  selectMyCompetitions,
  selectCompetitionIsLoading,
} from "@/store/slices/competitionSlice";
import { Competition } from "@/types"; // Import the Competition type

// You can create a reusable skeleton loader component for better UX
const CompetitionCardSkeleton = () => (
  <Card className="h-full animate-pulse">
    <CardHeader>
      <div className="h-6 w-3/4 bg-gray-200 rounded"></div>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
      <div className="h-10 w-full bg-gray-200 rounded"></div>
      <div className="flex justify-between">
        <div className="h-8 w-1/4 bg-gray-200 rounded"></div>
        <div className="h-8 w-1/4 bg-gray-200 rounded"></div>
      </div>
    </CardContent>
  </Card>
);

function MyCompetitionsPageContent() {
  const dispatch = useAppDispatch();
  const myCompetitions = useAppSelector(selectMyCompetitions);
  const isLoading = useAppSelector(selectCompetitionIsLoading);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // Add more statuses if needed

  // Fetch data when the component mounts
  useEffect(() => {
    dispatch(fetchMyCompetitions());
  }, [dispatch]);

  const filteredCompetitions = myCompetitions.filter((competition) => {
    const matchesSearch = competition.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    // Add a status filter if your backend provides a competition status
    // const matchesStatus = statusFilter === 'all' || competition.status === statusFilter;
    return matchesSearch; // && matchesStatus;
  });

  const stats = {
    total: myCompetitions.length,
    // Add more stats based on the data you get back
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Manage Competitions
          </h1>
          <p className="text-gray-600">
            Track and manage the competitions you have created.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Created
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {isLoading ? "..." : stats.total}
                  </p>
                </div>
                <Trophy className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
          {/* Add more stat cards as needed */}
        </div>

        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="Search competitions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CompetitionCardSkeleton />
            <CompetitionCardSkeleton />
          </div>
        ) : filteredCompetitions.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredCompetitions.map((competition: Competition, index) => (
              <motion.div key={competition._id} /* ... animation props ... */>
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-xl mb-2">
                      {competition.title}
                    </CardTitle>
                    <p className="text-gray-600 mb-3">{competition.category}</p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {competition.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {competition.skillsTested.split(",").map((skill) => (
                        <Badge
                          key={skill.trim()}
                          variant="secondary"
                          className="text-xs"
                        >
                          {skill.trim()}
                        </Badge>
                      ))}
                    </div>
                    {/* Display other competition info as needed */}
                    <div className="flex gap-2 mt-4">
                      <Button asChild className="flex-1">
                        <Link
                          href={`/employer/competitions/manage/${competition._id}`}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Manage & View
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
                {searchQuery
                  ? "Try adjusting your search"
                  : "You haven't created any competitions yet."}
              </p>
              <Button asChild>
                <Link href="/competitions/create">
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

export default function MyCompetitionsPage() {
  return (
    // Make sure the role is correct for this page
    <AuthGuard requireAuth={true} allowedRoles={["employer"]}>
      <MyCompetitionsPageContent />
    </AuthGuard>
  );
}
