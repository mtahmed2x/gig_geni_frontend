import { User, UserRole } from "@/lib/features/user/types";
import { Competition, Education, Experience } from "@/lib/interface";

export interface PaginationParams {
  page?: number;
  limit?: number;
}
export interface Meta {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  errors?: Record<string, string[]>;
  meta?: Meta;
}

export interface RegisterPayload {
  email: string;
  password: string;
  role: UserRole;
  name: string;
  phoneNumber: string;
  company?: {
    name?: string;
  };
}

export interface RegisterResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface VerifyOtpPayload {
  otp: string;
}

export interface RefreshTokenPayload {
  token: string;
}

export type UserProfileResponseData = User;

export type QuestionType =
  | "single"
  | "multiple"
  | "true_false"
  | "short"
  | "broad";
export type QuestionDifficulty = "easy" | "medium" | "hard";

export interface QuizQuestionOption {
  _id?: string;
  text: string;
  isCorrect?: boolean;
}

export interface QuizQuestion {
  _id: string;
  competition: string;
  question: string;
  type: QuestionType;
  options?: QuizQuestionOption[];
  wordLimit?: number;
  points: number;
  difficulty: QuestionDifficulty;
  createdAt: string;
  updatedAt: string;
}

export interface CreateQuizQuestionPayload {
  competition: string;
  question: string;
  type: QuestionType;
  options?: { text: string; isCorrect?: boolean }[];
  wordLimit?: number;
  points: number;
  difficulty: QuestionDifficulty;
}

export type CreateQuizQuestionResponseData = QuizQuestion[];
export type FetchQuizQuestionsResponseData = QuizQuestion[];

export interface GenerateQuizQuestionsPayload {
  competitionId: string;
  category: string;
  description: string;
  totalQuestions: number;
  difficulty: QuestionDifficulty;
  distribution: {
    single: number;
    multiple: number;
    true_false: number;
    short: number;
    broad: number;
  };
  shortWordLimit: number;
  broadWordLimit: number;
  pointsPerQuestion: number;
}

export interface CompetitionHistory {
  competitionId: string;
  competitionTitle: string;
  category: string;
  participatedDate: Date;
  finalRank: number;
  totalParticipants: number;
  pointsEarned: number;
  roundScores: RoundScore[];
  status: "completed" | "ongoing" | "withdrawn";
}

export interface QuizSettings {
  _id: string;
  competitionId: string;
  passingScore: number;
  timeLimit: number;
  randomizeQuestions: boolean;
  showResults: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface QuizSettingsPayload {
  competitionId: string;
  passingScore: number;
  timeLimit: number;
  randomizeQuestions: boolean;
  showResults: boolean;
}

export interface QuizAnswer {
  _id: string;
  userId: string;
  competitionId: string;
  questionId: string;
  answer: any; // Can be string, string[], boolean, etc.
  isCorrect: boolean;
  pointsAwarded: number;
  submittedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface SubmitAnswerPayload {
  competitionId: string;
  questionId: string;
  answer: any;
}

export interface EvaluateQuizPayload {
  competitionId: string;
}

export type HomeResponse = {
  activeCompetitions: number;
  completedCompetitions: number;
  activeHirer: number;
  activeTalent: number;
};

export interface EvaluateQuizResponse {
  message: string;
  totalPoints: number;
  passingScore: number;
}

export interface RoundScore {
  roundNumber: number;
  roundType: string;
  score: number;
  maxScore: number;
  evaluatorComments?: string;
  completedDate: Date;
}

export interface LeaderboardParticipant {
  id: string;
  name: string;
  email: string;
  profilePhoto: string;
  role: string;
  company?: string;
  totalPoints: number;
  competitionsParticipated: number;
  competitionsWon: number;
  achievements: Achievement[];
  competitionHistory: CompetitionHistory[];
  joinedDate: Date;
  lastActive: Date;
  categories: string[];
  skills: string[];
  rank?: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  earnedDate: Date;
  category: string;
  rarity: "common" | "rare" | "epic" | "legendary";
}

export interface LeaderboardFilters {
  category?: string;
  dateRange: "30days" | "90days" | "alltime";
  sortBy: "points" | "competitions";
  sortOrder: "desc" | "asc";
  page: number;
  limit: number;
}

export interface Training {
  id?: string;
  title?: string;
  provider?: string;
  date?: Date;
  description?: string;
  certificateUrl?: string;
}

export interface Reference {
  id?: string;
  name?: string;
  relationship?: string;
  contact?: string;
  email?: string;
  company?: string;
}

export interface ContactInformation {
  email?: string;
  phone?: string;
  linkedin?: string;
  website?: string;
}

export interface Address {
  home?: string;
  permanent?: string;
  city?: string;
  state?: string;
  country?: string;
  zipCode?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  profilePhoto?: string;
  rating?: number;
  ovationTag?: string;
  topRanking?: string;
  txValue?: number;
  aboutMe?: string;
  identityValidation?: string;
  salaryExpectation?: string;
  jobPreference?: string;
  skills: string[];
  experience: Experience[];
  education: Education[];
  personalInformation?: {
    dateOfBirth?: Date;
    gender?: string;
    nationality?: string;
    languages?: string[];
  };
  address?: Address;
  contactInformation?: ContactInformation;
  assets: string[];
  additionalActivity?: string;
  training: Training[];
  reference: Reference[];
  socialLinks: string[];
  createdAt?: Date;
  updatedAt?: Date;
  appliedCompetitions?: Competition[];
}

export interface EmployerProfile {
  id: string;
  companyName: string;
  companySize?: number;
  industry?: string;
  teamMembers?: string[];
  hiringPreferences?: string[];
  postedCompetitions: Competition[];
  companyDescription?: string;
  website?: string;
  foundedYear?: number;
  headquarters?: string;
}

// ============================================================================
// NOTIFICATION TYPES
// ============================================================================

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error" | "competition" | "system";
  isRead: boolean;
  createdAt: Date;
  actionUrl?: string;
  actionText?: string;
  metadata?: {
    competitionId?: string;
    userId?: string;
    [key: string]: any;
  };
}

// ============================================================================
// SETTINGS TYPES
// ============================================================================

export interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  competitionUpdates: boolean;
  leaderboardUpdates: boolean;
  promotionalEmails: boolean;
  weeklyDigest: boolean;
}

export interface UserSettings {
  notifications: NotificationSettings;
  privacy: {
    profileVisibility: "public" | "private" | "connections";
    showEmail: boolean;
    showPhone: boolean;
  };
  preferences: {
    theme: "light" | "dark" | "system";
    language: string;
    timezone: string;
  };
}

// ============================================================================
// REDUX TYPES
// ============================================================================

// export interface RootState {
//   quizQuestion: any;
//   auth: AuthState;
//   // Add other slices here as they are created
// }

// ============================================================================
// HTTP CLIENT TYPES
// ============================================================================

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
  details?: any;
}

export interface RequestConfig {
  requiresAuth?: boolean;
  retryOnFailure?: boolean;
  timeout?: number;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

export type LoadingState = "idle" | "pending" | "succeeded" | "failed";

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

// ============================================================================
// FORM TYPES
// ============================================================================

export interface FormField {
  name: string;
  label: string;
  type:
    | "text"
    | "email"
    | "password"
    | "select"
    | "textarea"
    | "checkbox"
    | "radio";
  required?: boolean;
  placeholder?: string;
  options?: SelectOption[];
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    custom?: (value: any) => string | null;
  };
}

export interface FormState {
  values: Record<string, any>;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  isSubmitting: boolean;
  isValid: boolean;
}
