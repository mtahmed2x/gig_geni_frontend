import { Participant } from "../participant/types";
import { User } from "../user/types";

export enum CompetitionStatus {
  Active = "active",
  Completed = "completed",
}

export enum ReviewStatus {
  Pending = "pending",
  Approved = "approved",
  Rejected = "rejected",
}

export enum QuestionType {
  Single = "single",
  Multiple = "multiple",
  TrueFalse = "true_false",
  Short = "short",
  Broad = "broad",
}

export interface CompetitionStats {
  totalParticipants: number;
  round1Passed: number;
  videosPendingReview: number;
  interviewsScheduled: number;
  tasksCompleted: number;
}

export interface Competition {
  _id: string;
  createdBy: string | User;
  bannerImage: string;
  title: string;
  description: string;
  category: string[];
  experienceLevel: string;
  location: string;
  workType: string;
  skillsTested: string;
  projectBrief: string;
  evaluationCriteria: string;
  startDate: string;
  endDate: string;
  resultDate: string;
  prize: string;
  maxParticipants?: number;
  registrationFee: "Free" | "Paid";
  submissionFormats: string[];
  additionalFiles: { link: string; description?: string }[];
  termsAndConditions: string[];
  quizSettings: {
    passingScore: number;
    timeLimit: number;
    randomizeQuestions: boolean;
    showResults: boolean;
  };
  totalParticipants: number;
  reviewStatus: ReviewStatus;
  reviewFeedback?: string;
  status: CompetitionStatus;
  stats?: CompetitionStats;
  participants?: Participant[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateCompetitionPayload {
  title: string;
  description: string;
  category: string[];
  experienceLevel: string;
  location: string;
  workType: string;
  skillsTested: string;
  projectBrief: string;
  evaluationCriteria: string;
  startDate: string;
  endDate: string;
  resultDate?: string;
  prize: string;
  maxParticipants?: number;
  registrationFee: "Free" | "Paid";
  submissionFormats: string[];
  additionalFiles: { link: string; description?: string }[];
  termsAndConditions: string[];
  quizSettings: {
    passingScore: number;
    timeLimit: number;
    randomizeQuestions: boolean;
    showResults: boolean;
  };
}

export type CreateCompetitionResponse = Competition;
export type GetAllCompetitionResponse = Competition[];
export type GetCompetitionResponse = Competition;
