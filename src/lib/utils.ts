import { ApiResponse } from "@/types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function unwrapResponse<T>(response: ApiResponse<T>): T {
  if (!response.success) {
    throw new Error("An unexpected error occurred. Please try again.");
  }

  if (!response.data) throw new Error("No data found.");

  return response.data;
}
