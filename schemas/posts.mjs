/**
 * Zod schemas for the posts endpoints.
 */
import { z } from "zod";

/**
 * Query parameters for GET /posts.
 * - username: optional, but not empty if it is sent (?username= → 400)
 */
export const postsQuerySchema = z.object({
  username: z.string().trim().min(1, "Username cannot be empty").optional(),
});
