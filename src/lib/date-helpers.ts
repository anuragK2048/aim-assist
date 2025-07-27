// src/utils/date-helpers.ts

import {
  format,
  formatDistanceToNow,
  formatRelative,
  isToday,
  isTomorrow,
  isYesterday,
  parseISO,
} from "date-fns";

/**
 * Converts a date from the database (ISO string) or a timestamp number
 * into a Date object. Returns null if the date is invalid.
 */
export function parseDate(date: string | number | Date): Date | null {
  if (!date) return null;
  // If it's already a Date object, return it.
  if (date instanceof Date) return date;
  // If it's a string, parse it from ISO format.
  // The 'Z' at the end of Supabase timestamps ensures it's parsed as UTC.
  return parseISO(String(date));
}

/**
 * Formats a date for display in a user-friendly way, like "October 27, 2024".
 * Handles conversion from UTC to the user's local timezone.
 *
 * @param date - An ISO string or timestamp from the DB.
 * @returns A formatted string or an empty string if the date is invalid.
 */
export function formatToUserFriendlyDate(date: string | number | null): string {
  const parsed = parseDate(date!);
  if (!parsed) return "";
  return format(parsed, "MMMM d, yyyy"); // e.g., "October 27, 2024"
}

/**
 * Formats a date to a relative time, like "yesterday", "about 5 hours ago".
 * This is great for `created_at` or `updated_at` fields.
 *
 * @param date - An ISO string or timestamp from the DB.
 * @returns A relative time string or an empty string.
 */
export function formatToRelativeTime(date: string | number | null): string {
  const parsed = parseDate(date!);
  if (!parsed) return "";
  // `addSuffix: true` adds "ago" or "in". e.g., "about 5 hours ago"
  return formatDistanceToNow(parsed, { addSuffix: true });
}

/**
 * A smart formatter for due dates. Shows "Today", "Tomorrow", "Yesterday",
 * otherwise shows the full date.
 *
 * @param date - An ISO string or timestamp from the DB.
 * @returns A smart, context-aware date string.
 */
export function formatDueDate(date: string | number | null): string {
  const parsed = parseDate(date!);
  if (!parsed) return "No due date";

  if (isToday(parsed)) return "Today";
  if (isTomorrow(parsed)) return "Tomorrow";
  if (isYesterday(parsed)) return "Yesterday";

  // For dates in the past or far future, show the date with weekday.
  return format(parsed, "E, MMM d"); // e.g., "Sun, Oct 27"
}

/**
 * Converts a client-side timestamp (like Date.now()) into the
 * ISO 8601 string format required by the database.
 *
 * @param timestamp - A number from Date.now() or a Date object.
 * @returns An ISO string in UTC.
 */
export function formatForDB(timestamp: number | Date = Date.now()): string {
  return new Date(timestamp).toISOString();
}
