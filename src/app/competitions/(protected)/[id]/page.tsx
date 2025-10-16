"use client";
import { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Users,
  Trophy,
  Star,
  Clock,
  FileText,
  CheckCircle,
  Share2,
  Download,
  AlertCircle,
  Target,
  Award,
  Building,
  Bookmark,
  File,
  BookMarked,
  Loader2,
  DollarSign,
} from "lucide-react";
import Link from "next/link";
import { Competition } from "@/types";
import { useAppSelector } from "@/store/store";
import { selectCurrentUser } from "@/store/features/auth/authSlice";
import { useFetchCompetitionByIdQuery } from "@/store/api/competitionApi";

export default function CompetitionDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const competitionId = params.id as string;

  const {
    data: competition,
    isLoading,
    isError,
  } = useFetchCompetitionByIdQuery(competitionId, { skip: !competitionId });
  const currentUser = useAppSelector(selectCurrentUser);
  // const [saveCompetition, { isLoading: isSaving }] = useSaveCompetitionMutation();

  // The 'isJoined' state is now derived from the fetched data
  const isJoined = useMemo(() => {
    if (!competition || !currentUser) return false;
    return competition.participants.some((p) => {
      if (typeof p.user === "string") return p.user === currentUser._id;
      return p.user._id === currentUser._id;
    });
  }, [competition, currentUser]);

  const [isSaved, setIsSaved] = useState(false);

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "TBD";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };
  const getStatusBadge = (comp: Competition) => {
    const now = new Date();
    const startDate = comp.startDate;
    const endDate = comp.endDate;

    if (now < new Date(startDate))
      return { text: "Upcoming", color: "bg-blue-100 text-blue-700" };
    if (now > new Date(endDate))
      return { text: "Completed", color: "bg-gray-100 text-gray-500" };
    return { text: "Active", color: "bg-green-100 text-green-700" };
  };
  const formatShortDate = (date: Date | undefined) => {
    if (!date) return "TBD";
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleJoin = () => {
    // This is now just a simple navigation action
    router.push(`/competitions/${competitionId}/join`);
  };

  // --- STEP 3: Refactor handleSave to use the new mutation ---
  const handleSave = async () => {
    const newSaveState = !isSaved;
    setIsSaved(newSaveState); // Optimistically update the UI

    // try {
    //   await saveCompetition({ competitionId, isSaved: newSaveState }).unwrap();
    //   toast.success(
    //     newSaveState ? "Competition saved!" : "Competition unsaved."
    //   );
    // } catch (err) {
    //   setIsSaved(!newSaveState); // Revert UI on error
    //   toast.error("Could not save competition. Please try again.");
    // }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: competition?.title,
        text: competition?.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  // --- STEP 4: Update loading and error states ---
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center flex flex-col items-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
          <p className="text-gray-600">Loading competition details...</p>
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
            The competition you're looking for doesn't exist or has been
            removed.
          </p>
          {/* <Link href="/competitions">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Competitions
            </Button>
          </Link> */}
        </div>
      </div>
    );
  }

  const status = getStatusBadge(competition);

  return (
    <div className="min-h-screen  container">
      {/* Header Buttons - Positioned above banner */}
      <div className="relative z-20 bg-transparent mt-5 ">
        <div className="absolute top-0 left-0 right-0 p-6 ">
          <div className="flex items-center justify-between ">
            <Button
              variant="outline"
              size="sm"
              className="bg-white/90 backdrop-blur-sm text-gray-800 hover:bg-white border border-gray-300 shadow-md"
              onClick={() => router.back()}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Previous Page
            </Button>

            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={handleShare}
                className="bg-white/90 backdrop-blur-sm hover:bg-white shadow-sm"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button
                variant={isSaved ? "default" : "outline"}
                onClick={handleSave}
                className={
                  isSaved
                    ? "bg-orange-500 hover:bg-orange-600 shadow-sm"
                    : "bg-white/90 backdrop-blur-sm hover:bg-white shadow-sm"
                }
              >
                {isSaved ? (
                  <BookMarked className="h-4 w-4 mr-2" />
                ) : (
                  <Bookmark className="h-4 w-4 mr-2" />
                )}
                {isSaved ? "Saved" : "Save"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Banner Image - Full Width */}

      <div className="relative h-64 md:h-80 w-full rounded-xl overflow-hidden">
        <Image
          src={competition.bannerImage}
          alt={competition.title}
          fill
          className="object-cover"
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

        <div className="absolute bottom-6 left-6 text-white z-10">
          <div className="flex items-center space-x-2 mb-2">
            <Badge className="bg-white text-gray-900">
              {competition.category}
            </Badge>
            <Badge className={status.color}>{status.text}</Badge>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            {competition.title}
          </h1>
          <p className="text-lg opacity-90">by {"TechCorp Solutions"}</p>
        </div>
      </div>

      <div className="w-full py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8  ">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Competition Header */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <Badge className={status.color}>{status.text}</Badge>

                      <div className="flex items-center text-sm text-gray-600">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                        4.8
                      </div>
                    </div>
                    {/* <h1 className="text-3xl font-bold text-gray-900 mb-2">{competition.title}</h1> */}
                    {/* <div className="flex items-center text-lg text-gray-600 mb-4">
                      <Building className="h-5 w-5 mr-2" />
                      {competition.organizer}
                    </div> */}
                  </div>
                </div>

                {/* Categories */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {competition.category}
                </div>

                {/* Key Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  {competition.location && (
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                      <span>{competition.location}</span>
                    </div>
                  )}
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="h-4 w-4 mr-2 text-gray-400" />
                    <span>
                      {competition.participants.length || 0} participants
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <DollarSign className="h-4 w-4 mr-2 text-gray-400" />
                    <span>{competition.registrationFee}</span>
                  </div>

                  <div className="flex items-center text-sm font-semibold text-green-600">
                    <Trophy className="h-4 w-4 mr-2" />
                    <span>$5000 + Job Offer</span>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    About This Competition
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {competition.description}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Project Brief */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5" />
                  <span>Project Brief</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Build a comprehensive web application that demonstrates your
                  skills in modern web development. The project should showcase
                  clean code architecture, responsive design, and user-friendly
                  interfaces.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  {competition.description}
                </p>
              </CardContent>
            </Card>

            {/* Resources & Downloads */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Download className="h-5 w-5" />
                  <span>Resources</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-gray-50 rounded-lg border hover:bg-gray-100 transition-colors">
                  <div className="flex items-start space-x-3">
                    <File className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div className="flex-1">
                      <a
                        href="https://drive.google.com/file/d/1abc123/view"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        Find Necessary Information
                      </a>
                      <p className="text-sm text-gray-600 mt-1">
                        Includes detailed specifications, assets, and references
                        for the project.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Detailed Information Tabs */}
            <Card>
              <CardContent className="p-6">
                <Tabs defaultValue="details" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="details">Details</TabsTrigger>
                    <TabsTrigger value="skills">Skills</TabsTrigger>
                    <TabsTrigger value="timeline">Timeline</TabsTrigger>
                    <TabsTrigger value="terms">Terms</TabsTrigger>
                  </TabsList>

                  <TabsContent value="details" className="mt-6">
                    <div className="space-y-6">
                      {/* {competition.projectBrief && (
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                            <FileText className="h-5 w-5 mr-2 text-orange-500" />
                            Project Brief
                          </h4>
                          <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg">
                            {competition.projectBrief}
                          </p>
                        </div>
                      )} */}

                      {competition.submissionFormats &&
                        competition.submissionFormats.length > 0 && (
                          <div>
                            <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                              <Download className="h-5 w-5 mr-2 text-orange-500" />
                              Submission Formats
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {competition.submissionFormats.map(
                                (format, index) => (
                                  <Badge
                                    key={index}
                                    variant="outline"
                                    className="text-sm"
                                  >
                                    {format}
                                  </Badge>
                                )
                              )}
                            </div>
                          </div>
                        )}

                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-3">
                          Maximum File Size
                        </h4>
                        <p className="text-gray-700">10 MB</p>
                      </div>

                      {/* Evaluation Criteria */}
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                          <Award className="h-5 w-5 mr-2 text-orange-500" />
                          Evaluation Criteria
                        </h4>
                        <div className="space-y-3">
                          {[
                            "Innovation and Creativity",
                            "Technical Implementation",
                            "User Experience Design",
                            "Code Quality and Documentation",
                            "Problem-Solving Approach",
                          ].map((criteria, index) => (
                            <div
                              key={index}
                              className="flex items-center space-x-3"
                            >
                              <CheckCircle className="h-5 w-5 text-green-600" />
                              <span className="text-gray-700">{criteria}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Submission Requirements */}
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                          <FileText className="h-5 w-5 mr-2 text-orange-500" />
                          Submission Requirements
                        </h4>
                        <div className="space-y-3">
                          {[
                            "GitHub Repository Link",
                            "Live Demo URL",
                            "Project Documentation (PDF)",
                            "Video Walkthrough (Optional)",
                          ].map((format, index) => (
                            <div
                              key={index}
                              className="flex items-center space-x-3"
                            >
                              <File className="h-4 w-4 text-blue-600" />
                              <span className="text-gray-700">{format}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="skills" className="mt-6">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <Target className="h-5 w-5 mr-2 text-orange-500" />
                        Skills Being Tested
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <CheckCircle className="h-4 w-4 text-orange-500 mr-3" />
                        <span className="text-gray-800 font-medium">
                          {competition.skillsTested}
                        </span>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="timeline" className="mt-6">
                    <div className="space-y-6">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <Calendar className="h-5 w-5 mr-2 text-orange-500" />
                        Important Dates
                      </h4>

                      <div className="space-y-4">
                        {competition.startDate && (
                          <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                            <div className="flex items-center">
                              <Clock className="h-5 w-5 text-blue-500 mr-3" />
                              <div>
                                <p className="font-semibold text-gray-900">
                                  Competition Starts
                                </p>
                                <p className="text-sm text-gray-600">
                                  Registration deadline
                                </p>
                              </div>
                            </div>
                            <p className="text-lg font-semibold text-blue-600">
                              {formatDate(competition.startDate)}
                            </p>
                          </div>
                        )}

                        {competition.endDate && (
                          <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg">
                            <div className="flex items-center">
                              <Clock className="h-5 w-5 text-orange-500 mr-3" />
                              <div>
                                <p className="font-semibold text-gray-900">
                                  Submission Deadline
                                </p>
                                <p className="text-sm text-gray-600">
                                  Final submissions due
                                </p>
                              </div>
                            </div>
                            <p className="text-lg font-semibold text-orange-600">
                              {formatDate(competition.endDate)}
                            </p>
                          </div>
                        )}

                        {competition.resultDate && (
                          <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                            <div className="flex items-center">
                              <Award className="h-5 w-5 text-green-500 mr-3" />
                              <div>
                                <p className="font-semibold text-gray-900">
                                  Results Announced
                                </p>
                                <p className="text-sm text-gray-600">
                                  Winners will be announced
                                </p>
                              </div>
                            </div>
                            <p className="text-lg font-semibold text-green-600">
                              {formatDate(competition.resultDate)}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="terms" className="mt-6">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <FileText className="h-5 w-5 mr-2 text-orange-500" />
                        Terms and Conditions
                      </h4>
                      {competition.termsAndConditions &&
                      competition.termsAndConditions.length > 0 ? (
                        <div className="space-y-3">
                          {competition.termsAndConditions.map((term, index) => (
                            <div
                              key={index}
                              className="flex items-start p-3 bg-gray-50 rounded-lg"
                            >
                              <span className="text-orange-500 font-semibold mr-3">
                                {index + 1}.
                              </span>
                              <p className="text-gray-700">{term}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-600 italic">
                          Terms and conditions will be provided upon
                          registration.
                        </p>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          {/* Sticky Sidebar with All Cards */}
          <div className="lg:col-span-1">
            <div className="space-y-6 sticky top-6">
              {/* Join Competition */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-gray-900">
                    Join Competition
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-600 mb-1">
                      $5000 + Job Offer
                    </div>
                    <p className="text-sm text-gray-600">Total Prize Pool</p>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Participants:</span>
                      <span className="font-medium">
                        {competition.participants.length || 0}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Registration:</span>
                      <span className="font-medium">
                        {competition.registrationFee}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Deadline:</span>
                      <span className="font-medium text-orange-600">
                        {formatShortDate(new Date(competition.endDate))}
                      </span>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <Button
                      onClick={handleJoin}
                      className={`w-full ${
                        isJoined
                          ? "bg-green-500 hover:bg-green-600"
                          : "bg-orange-600 hover:bg-orange-700"
                      } text-white`}
                      size="lg"
                      disabled={status.text === "Completed"}
                    >
                      {isJoined ? (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Joined
                        </>
                      ) : (
                        <>
                          <Trophy className="h-4 w-4 mr-2" />
                          Join Competition
                        </>
                      )}
                    </Button>

                    {status.text === "Completed" && (
                      <p className="text-sm text-gray-500 text-center">
                        This competition has ended
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Info Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900">
                    Quick Info
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-gray-900">Duration</p>
                      <p className="text-sm text-gray-600">
                        {formatShortDate(new Date(competition.startDate))} -{" "}
                        {formatShortDate(new Date(competition.endDate))}
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-center space-x-3">
                    <Users className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium text-gray-900">Announcement</p>
                      <p className="text-sm text-gray-600">
                        {formatShortDate(new Date(competition.resultDate!)) ||
                          "Not Announced"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Organizer Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900">
                    Organizer
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
                      <Building className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        TechCorp Solutions
                      </p>
                      <p className="text-sm text-gray-600">Competition Host</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
