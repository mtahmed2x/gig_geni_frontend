"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  User,
  Search,
  Download,
  Users,
  TrendingUp,
  XCircle,
  Activity,
  Trophy,
} from "lucide-react";

import { formatDistanceToNow } from "date-fns";
import { Participant } from "@/lib/features/participant/types";

import { User as UserType } from "@/lib/features/user/types";
import { ParticipantCard } from "./participants/ParticipantCard";
import { ParticipantDetailModal } from "./participants/ParticipantDetailModal";

interface ParticipantTrackerProps {
  competitionId: string;
  participants: Participant[];
}

const transformParticipantData = (p: Participant) => {
  let currentRound = 1;
  let progressPercentage = 0;
  const totalRounds = 4;

  if (p.round1_quiz.status === "passed") {
    currentRound = 2;
    progressPercentage = 25;
  }
  if (p.round2_video.status === "passed") {
    currentRound = 3;
    progressPercentage = 50;
  }
  if (p.round3_meeting.status === "passed") {
    currentRound = 4;
    progressPercentage = 75;
  }
  if (p.round4_task.status === "completed") {
    progressPercentage = 100;
  }

  const overallStatus = p.isWinner
    ? "winner"
    : p.isEliminated
    ? "eliminated"
    : progressPercentage === 100
    ? "completed"
    : "active";

  return {
    ...p,
    user: p.user as UserType, // Ensure user is fully typed
    currentRound,
    progressPercentage,
    overallStatus,
    lastActivity: formatDistanceToNow(new Date(p.updatedAt), {
      addSuffix: true,
    }),
    registrationDate: new Date(p.createdAt).toLocaleDateString(),
  };
};

export default function ParticipantTracker({
  competitionId,
  participants = [],
}: ParticipantTrackerProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [roundFilter, setRoundFilter] = useState("all");
  const [selectedParticipant, setSelectedParticipant] = useState<ReturnType<
    typeof transformParticipantData
  > | null>(null);

  const processedParticipants = useMemo(
    () => participants.map(transformParticipantData),
    [participants]
  );

  const filteredParticipants = useMemo(
    () =>
      processedParticipants.filter((p) => {
        const user = p.user;
        const matchesSearch =
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus =
          statusFilter === "all" || p.overallStatus === statusFilter;
        const matchesRound =
          roundFilter === "all" || p.currentRound.toString() === roundFilter;
        return matchesSearch && matchesStatus && matchesRound;
      }),
    [processedParticipants, searchTerm, statusFilter, roundFilter]
  );

  const stats = useMemo(
    () => ({
      total: processedParticipants.length,
      active: processedParticipants.filter((p) => p.overallStatus === "active")
        .length,
      eliminated: processedParticipants.filter(
        (p) => p.overallStatus === "eliminated"
      ).length,
      winners: processedParticipants.filter((p) => p.overallStatus === "winner")
        .length,
      avgProgress:
        processedParticipants.length > 0
          ? processedParticipants.reduce(
              (sum, p) => sum + p.progressPercentage,
              0
            ) / processedParticipants.length
          : 0,
    }),
    [processedParticipants]
  );

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
            <Users className="h-8 w-8 text-gray-500" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active</p>
              <p className="text-2xl font-bold text-blue-600">{stats.active}</p>
            </div>
            <Activity className="h-8 w-8 text-blue-500" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Eliminated</p>
              <p className="text-2xl font-bold text-red-600">
                {stats.eliminated}
              </p>
            </div>
            <XCircle className="h-8 w-8 text-red-500" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Winners</p>
              <p className="text-2xl font-bold text-yellow-600">
                {stats.winners}
              </p>
            </div>
            <Trophy className="h-8 w-8 text-yellow-500" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Progress</p>
              <p className="text-2xl font-bold text-purple-600">
                {stats.avgProgress.toFixed(0)}%
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-purple-500" />
          </CardContent>
        </Card>
      </div>

      {/* Filters and Controls */}
      <Card>
        <CardContent className="p-4 flex flex-wrap items-center gap-4">
          <div className="relative flex-grow min-w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="eliminated">Eliminated</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="winner">Winner</SelectItem>
            </SelectContent>
          </Select>
          <Select value={roundFilter} onValueChange={setRoundFilter}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Current Round" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Rounds</SelectItem>
              <SelectItem value="1">Round 1: Quiz</SelectItem>
              <SelectItem value="2">Round 2: Video</SelectItem>
              <SelectItem value="3">Round 3: Meeting</SelectItem>
              <SelectItem value="4">Round 4: Task</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </CardContent>
      </Card>

      {/* Participants List */}
      <div className="space-y-4">
        {filteredParticipants.length > 0 ? (
          filteredParticipants.map((participant) => (
            <ParticipantCard
              key={participant._id}
              participant={participant}
              onViewDetails={() => setSelectedParticipant(participant)}
            />
          ))
        ) : (
          <Card>
            <CardContent className="p-6 text-center text-gray-500">
              No participants match the current filters.
            </CardContent>
          </Card>
        )}
      </div>

      {/* Participant Detail Modal */}
      {selectedParticipant && (
        <ParticipantDetailModal
          participant={selectedParticipant}
          onClose={() => setSelectedParticipant(null)}
        />
      )}
    </div>
  );
}
