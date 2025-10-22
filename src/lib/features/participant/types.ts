import { Competition } from "../competition/types";
import { User } from "../user/types";

export enum RoundStatus {
  NOT_STARTED = "not_started",
  PENDING = "pending",
  SUBMITTED = "submitted",
  PASSED = "passed",
  FAILED = "failed",
  APPROVED = "approved",
  REJECTED = "rejected",
  SCHEDULED = "scheduled",
  SELECTED = "selected",
  ABSENT = "absent",
  COMPLETED = "completed",
}

export interface Participant {
  _id: string;

  competition: Competition;
  user: User;

  isEliminated: boolean;
  isWinner: boolean;

  round1_quiz: {
    status: RoundStatus;
    score?: number;
    attemptId?: string;
  };

  round2_video: {
    status: RoundStatus;
    videoUrl?: string;
    submittedAt?: string;
    feedback?: string;
  };

  round3_meeting: {
    status: RoundStatus;
    meetingId?: string;
    feedback?: string;
  };

  round4_task: {
    status: RoundStatus;
    taskSubmissionId?: string;
    presentationMeetingId?: string;
    feedback?: string;
  };

  createdAt: string;
  updatedAt: string;
}

export type GetParticipantsResponse = Participant[];
export type GetParticipantResponse = Participant;
export type CreateParticipantPayload = {
  competition: string;
};
