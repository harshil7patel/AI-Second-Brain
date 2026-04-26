import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length
}

export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str
  return str.slice(0, maxLength) + "…"
}

export function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  }).format(new Date(dateString))
}
