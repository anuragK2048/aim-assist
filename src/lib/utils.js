import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// export function cn(...inputs) {
//   return twMerge(clsx(inputs));
// }

// Utility function to conditionally join class names
export function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

// Generate a unique ID
export function generateId() {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
}
