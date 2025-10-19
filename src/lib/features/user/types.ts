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

export interface Company {
  _id?: string;
  name?: string;
  industry?: string;
  companySze?: string;
  foundedYear?: string;
  website?: string;
  headQuarters?: string;
  description?: string;
  teamMembers?: string[];
  totalCompetitions?: number;
}

export interface User {
  _id: string;
  email: string;
  role: UserRole;
  name: string;
  verified: boolean;
  active?: boolean;
  suspended?: boolean;
  avatar?: string | null;

  dateOfBirth?: string | null;
  gender?: Gender | null;
  nationality?: string | null;
  aboutMe?: string | null;

  languages: string[];
  skills: string[];

  salaryExpectations?: string | null;
  jobPreference?: string | null;

  phoneNumber?: string | null;
  linkedinProfile?: string | null;
  personalWebsite?: string | null;

  address?: Address;
  company?: Company;
  hiringPreferences?: string[];

  experience: Experience[];
  education: Education[];

  deviceTokens: string[];

  profileCompletionPercentage: number;
  isProfileComplete: boolean;

  createdAt: string;
  updatedAt: string;
}

export type GetUserResponse = User;
export type UpdateUserProfilePayload = Partial<User>;
