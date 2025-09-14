export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  errors?: Record<string, string[]>;
  meta?: {
    page: number;
    limit: number;
    total: number;
  };
}

export type UserRole = "admin" | "employer" | "employee";

export type Gender = "male" | "female" | "other" | "not-stated";

export interface Address {
  homeAddress?: string;
  city?: string;
  state?: string;
  country?: string;
  zipCode?: string;
}

export interface Experience {
  _id?: string;
  company: string;
  jobTitle: string;
  startDate: string;
  endDate?: string;
  currentlyWorking: boolean;
  jobDescription?: string;
}

export interface Education {
  _id?: string;
  institution: string;
  degree: string;
  fieldOfStudy?: string;
  grade?: string;
  startYear: string;
  endYear?: string;
  description?: string;
}

export interface User {
  _id: string;
  email: string;
  role: UserRole;
  name: string;

  password?: string;

  verified: boolean;

  companyName?: string;
  dateOfBirth?: string;
  gender?: Gender;
  nationality?: string;
  aboutMe?: string;
  languages: string[];
  skills: string[];

  salaryExpectations?: string;
  jobPreference?: string;

  phoneNumber?: string;
  linkedinProfile?: string;
  personalWebsite?: string;

  address: Address;
  experience: Experience[];
  education: Education[];

  deviceTokens: string[];

  createdAt: string;
  updatedAt: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  role: UserRole;
  name: string;
  companyName?: string;
}

export interface RegisterResponseData {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponseData {
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

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  pendingEmailVerification: boolean;
  error: string | null;
}

export type Round1Status = "not_started" | "pending" | "passed" | "failed";
export type Round2Status = "not_started" | "pending" | "approved" | "rejected";
export type Round3Status =
  | "not_started"
  | "scheduled"
  | "approved"
  | "rejected";
export type Round4Status = "not_started" | "completed" | "failed";

export interface Participant {
  user: string | User;

  round1: Round1Status;
  round2: Round2Status;
  round3: Round3Status;
  round4: Round4Status;

  joinedAt: string;
}

export interface CompetitionStats {
  totalParticipants: number;
  round1Passed: number;
  videosPending: number;
  interviewsScheduled: number;
  completed: number;
}

export interface Competition {
  _id: string;
  createdBy: string;
  bannerImage: string;
  title: string;
  description: string;
  category: string;
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
  participants: Participant[];
  stats?: CompetitionStats;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCompetitionPayload {
  title: string;
  description: string;
  category: string;
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
}

export interface CreateCompetitionResponseData {
  competition: Competition;
}

export type FetchCompetitionsResponseData = Competition[];
export type FetchCompetitionByIdResponseData = Competition;

export type QuestionType = 'single' | 'multiple' | 'true_false' | 'short' | 'broad';
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
  category: string;
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
  category: string;
}

export type CreateQuizQuestionResponseData = QuizQuestion[];
export type FetchQuizQuestionsResponseData = QuizQuestion[];

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

export interface RootState {
  quizQuestion: any;
  auth: AuthState;
  // Add other slices here as they are created
}

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
