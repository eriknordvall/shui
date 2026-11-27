/**
 * Zod schemas for the auth endpoints (register and login).
 * Used with validateBody in functions/register and functions/login.
 */
import { z } from "zod";

/**
 * Body for POST /auth/login.
 * Only checks that both fields are present, so users can still log in
 * if the register rules change later.
 */
export const loginSchema = z.object({
  username: z.string().trim().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

/**
 * Body for POST /auth/register.
 * - username: 6–15 characters, trimmed
 * - password: 8–72 characters (bcrypt only uses the first 72 bytes),
 *   at least one uppercase, one lowercase, one digit and one special character
 */
export const registerSchema = z.object({
  username: z
    .string()
    .trim()
    .min(6, "Your username must consist of at least 6 characters")
    .max(15, "Your username may contain a maximum of 15 characters"),
  password: z
    .string()
    .min(8, "Your password must contain at least 8 characters")
    .max(72, "Your password may contain a maximum of 72 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).+$/,
      "Your password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character",
    ),
});
