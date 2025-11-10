import { z } from "zod";

// Input validation schemas
export const emailSchema = z
  .string()
  .trim()
  .email({ message: "Invalid email address" })
  .max(255, { message: "Email must be less than 255 characters" });

export const passwordSchema = z
  .string()
  .min(8, { message: "Password must be at least 8 characters" })
  .max(100, { message: "Password must be less than 100 characters" })
  .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
  .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
  .regex(/[0-9]/, { message: "Password must contain at least one number" });

export const nameSchema = z
  .string()
  .trim()
  .min(1, { message: "Name is required" })
  .max(100, { message: "Name must be less than 100 characters" })
  .regex(/^[a-zA-Z\s'-]+$/, { message: "Name can only contain letters, spaces, hyphens, and apostrophes" });

export const tripTitleSchema = z
  .string()
  .trim()
  .min(3, { message: "Title must be at least 3 characters" })
  .max(200, { message: "Title must be less than 200 characters" });

export const searchQuerySchema = z
  .string()
  .trim()
  .max(500, { message: "Search query too long" });

export const budgetSchema = z
  .number()
  .min(0, { message: "Budget must be positive" })
  .max(1000000, { message: "Budget value too large" });

export const notesSchema = z
  .string()
  .max(5000, { message: "Notes must be less than 5000 characters" });

// Sanitization utilities
export const sanitizeHTML = (input: string): string => {
  const div = document.createElement('div');
  div.textContent = input;
  return div.innerHTML;
};

export const sanitizeURL = (url: string): string => {
  try {
    const parsed = new URL(url);
    // Only allow http and https protocols
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      throw new Error('Invalid protocol');
    }
    return parsed.toString();
  } catch {
    return '';
  }
};

// XSS prevention
export const escapeHTML = (text: string): string => {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    "/": '&#x2F;',
  };
  return text.replace(/[&<>"'/]/g, (char) => map[char]);
};
