import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Clock,
  Linkedin,
  Globe,
  Briefcase,
  GraduationCap,
  Award,
  MessageSquare,
  XCircle,
} from "lucide-react";

import { RoundStatusBadge } from "./RoundStatusBadge";
import { Participant } from "@/lib/features/participant/types";

interface ParticipantDetailModalProps {
  participant: Participant;
  onClose: () => void;
}

const DetailRow = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value?: string | number | null;
}) =>
  value ? (
    <div className="flex items-start">
      <span className="mr-3 mt-1 text-gray-500">{icon}</span>
      <div>
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <p className="font-semibold">{value}</p>
      </div>
    </div>
  ) : null;

export const ParticipantDetailModal = ({
  participant,
  onClose,
}: ParticipantDetailModalProps) => {
  const { user } = participant;
  const rounds = [
    { name: "Round 1: Quiz", data: participant.round1_quiz },
    { name: "Round 2: Video", data: participant.round2_video },
    { name: "Round 3: Meeting", data: participant.round3_meeting },
    { name: "Round 4: Final Task", data: participant.round4_task },
  ];

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <CardHeader className="sticky top-0 bg-white z-10 border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">{user.name}</CardTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <XCircle className="h-6 w-6" />
            </Button>
          </div>
          <CardDescription>{user.email}</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left Column: Personal & Contact Info */}
            <div className="md:col-span-1 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Contact & Links</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <DetailRow
                    icon={<Mail className="h-4 w-4" />}
                    label="Email"
                    value={user.email}
                  />
                  <DetailRow
                    icon={<Phone className="h-4 w-4" />}
                    label="Phone"
                    value={user.phoneNumber}
                  />
                  <DetailRow
                    icon={<Linkedin className="h-4 w-4" />}
                    label="LinkedIn"
                    value={user.linkedinProfile}
                  />
                  <DetailRow
                    icon={<Globe className="h-4 w-4" />}
                    label="Website"
                    value={user.personalWebsite}
                  />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Professional</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <DetailRow
                    icon={<Briefcase className="h-4 w-4" />}
                    label="Experience"
                    value={user.experience?.[0]?.company}
                  />
                  <DetailRow
                    icon={<GraduationCap className="h-4 w-4" />}
                    label="Education"
                    value={user.education?.[0]?.institution}
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-2 flex items-center">
                      <Award className="h-4 w-4 mr-2" />
                      Skills
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {user.skills?.map((skill) => (
                        <Badge key={skill} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column: Competition Journey */}
            <div className="md:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Competition Journey</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {rounds.map((round) => (
                    <div key={round.name} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">{round.name}</h4>
                        <RoundStatusBadge status={round.data.status} />
                      </div>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-gray-700">
                        {"score" in round.data && (
                          <p>
                            <strong>Score:</strong> {round.data.score}%
                          </p>
                        )}
                        {"videoUrl" in round.data && round.data.videoUrl && (
                          <p>
                            <strong>Video:</strong>{" "}
                            <a
                              href={round.data.videoUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              View Submission
                            </a>
                          </p>
                        )}
                        {"submittedAt" in round.data &&
                          round.data.submittedAt && (
                            <p>
                              <strong>Submitted:</strong>{" "}
                              {new Date(
                                round.data.submittedAt
                              ).toLocaleString()}
                            </p>
                          )}
                        {"feedback" in round.data && round.data.feedback && (
                          <p className="col-span-2">
                            <strong>Feedback:</strong> {round.data.feedback}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </div>
    </div>
  );
};
