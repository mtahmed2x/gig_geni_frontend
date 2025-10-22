"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Trophy,
  SlidersHorizontal,
  Eye,
  MapPin,
  Calendar,
  Users,
  AlertCircle,
} from "lucide-react";
import { categories } from "@/lib/mock-data";
import Link from "next/link";
import { useGetAllCompetitionQuery } from "@/lib/api/competitionApi";
import { Competition } from "@/lib/features/competition/types";

const CompetitionCardSkeleton = () => (
  <Card className="h-full animate-pulse">
    <CardContent className="p-6 space-y-4">
      <div className="h-4 w-1/4 bg-gray-200 rounded"></div>
      <div className="h-6 w-3/4 bg-gray-200 rounded"></div>
      <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
      <div className="h-10 w-full bg-gray-200 rounded-lg mt-auto"></div>
    </CardContent>
  </Card>
);

export default function CompetitionsPage() {
  const {
    data: allCompetitions = [], // Default to an empty array
    isLoading,
    isError,
  } = useGetAllCompetitionQuery();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceRange, setPriceRange] = useState(100);
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [showFilters, setShowFilters] = useState(true);

  const uniqueLocations = useMemo(() => {
    return Array.from(
      new Set(allCompetitions.map((comp) => comp.location).filter(Boolean))
    );
  }, [allCompetitions]);

  const filteredAndSortedCompetitions = useMemo(() => {
    let filtered = allCompetitions.filter((competition) => {
      const lowerCaseSearch = searchQuery.toLowerCase();
      const matchesSearch =
        competition.title.toLowerCase().includes(lowerCaseSearch) ||
        (competition.description &&
          competition.description.toLowerCase().includes(lowerCaseSearch)) ||
        competition.skillsTested.toLowerCase().includes(lowerCaseSearch);
      // const matchesCategory =
      //   selectedCategory === "all" || competition.category === selectedCategory;
      const matchesLocation =
        selectedLocation === "all" || competition.location === selectedLocation;
      return matchesSearch && matchesLocation;
      // return matchesSearch && matchesCategory && matchesLocation;
    });

    filtered.sort((a, b) => {
      if (sortBy === "newest")
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      if (sortBy === "participants")
        return (b.participants?.length || 0) - (a.participants?.length || 0);
      // Add other sort conditions as needed
      return 0;
    });

    return filtered;
  }, [
    searchQuery,
    // selectedCategory,
    selectedLocation,
    sortBy,
    allCompetitions,
  ]);

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "TBD";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getStatusBadge = (competition: Competition) => {
    const now = new Date();
    const startDate = new Date(competition.startDate);
    const endDate = new Date(competition.endDate);
    if (now < startDate)
      return { text: "Upcoming", variant: "default" as const };
    if (now > endDate)
      return { text: "Completed", variant: "outline" as const };
    return { text: "Active", variant: "destructive" as const };
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Discover Competitions
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Find the perfect competition to showcase your skills and advance
              your career
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          {/* Main Search Bar */}
          <div className="flex flex-col lg:flex-row gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="Search competitions, skills, or companies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 text-lg border-gray-300 focus:border-orange-500 focus:ring-orange-500"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="h-12 px-6 border-gray-300 hover:border-orange-500"
            >
              <SlidersHorizontal className="h-5 w-5 mr-2" />
              Filters
            </Button>
          </div>

          {/* Filter Options */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-gray-200"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <Select
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                >
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <Select
                  value={selectedLocation}
                  onValueChange={setSelectedLocation}
                >
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="All Locations" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    {uniqueLocations.map((location) => (
                      <SelectItem key={location} value={location}>
                        {location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sort By
                </label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="participants">
                      Most Participants
                    </SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                    <SelectItem value="prize">Prize Amount</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </motion.div>
          )}
        </div>

        {/* Results Summary */}
        <div className="flex justify-between items-center mt-6 mb-4">
          <p className="text-gray-600">
            {filteredAndSortedCompetitions.length} competition
            {filteredAndSortedCompetitions.length !== 1 ? "s" : ""} found
          </p>
        </div>

        {/* --- THIS IS THE CORRECTED SEARCH & FILTER SECTION --- */}

        {/* Competitions Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <CompetitionCardSkeleton />
              <CompetitionCardSkeleton />
              <CompetitionCardSkeleton />
            </div>
          ) : isError ? (
            <div className="text-center py-12 bg-white rounded-lg border border-destructive/50 text-destructive">
              <AlertCircle className="h-12 w-12 mx-auto mb-4" />
              <h3 className="text-lg font-semibold">
                Could Not Load Competitions
              </h3>
              <p className="mb-4">
                There was an error fetching data. Please try again later.
              </p>
            </div>
          ) : filteredAndSortedCompetitions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAndSortedCompetitions.map((competition, index) => {
                const status = getStatusBadge(competition);
                return (
                  <motion.div
                    key={competition._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="h-full flex flex-col hover:shadow-xl transition-all duration-300">
                      <CardContent className="p-6 flex flex-col h-full">
                        <div className="flex justify-between items-start mb-4">
                          <Badge variant={status.variant}>{status.text}</Badge>
                        </div>
                        <div className="mb-4">
                          <h3 className="text-xl font-bold line-clamp-2 h-[56px]">
                            {competition.title}
                          </h3>
                          <p className="text-gray-600 font-medium text-sm">
                            {competition.category}
                          </p>
                        </div>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-grow">
                          {competition.description}
                        </p>
                        <div className="mb-4">
                          <div className="flex flex-wrap gap-1">
                            {competition.skillsTested
                              .split(",")
                              .slice(0, 3)
                              .map((skill) => (
                                <span
                                  key={skill}
                                  className="text-xs bg-orange-50 text-orange-700 px-2 py-1 rounded"
                                >
                                  {skill.trim()}
                                </span>
                              ))}
                          </div>
                        </div>
                        <div className="space-y-2 mb-4 text-sm text-gray-600">
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-2" />
                            {competition.location}
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2" />
                            Ends on {formatDate(competition.endDate)}
                          </div>
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-2" />
                            {competition.totalParticipants} participants
                          </div>
                          <div className="flex items-center font-semibold text-green-600">
                            <Trophy className="h-4 w-4 mr-2" />
                            {competition.prize}
                          </div>
                        </div>
                        <div className="mt-auto">
                          <Link
                            href={`/competitions/${competition._id}`}
                            className="block"
                          >
                            <Button className="w-full">
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg border">
              <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold">No competitions found</h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your search criteria or clearing your filters.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                  setSelectedLocation("all");
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
