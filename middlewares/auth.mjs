/**
 * Middy middleware that checks the JWT in the Authorization header.
 * Sets event.user = { username } so handlers never read the user from the body.
 */
import jwt from "jsonwebtoken";
import { createError } from "@middy/util";

/**
 * Verifies "Authorization: Bearer <token>" with JWT_SECRET.
 * - no header → 401, or continue without event.user if optional is true (guest posts)
 * - not "Bearer", invalid or expired token → always 401
 * @param options.optional let requests without a token through (default false)
 * @returns a middy middleware object with before
 */
export const auth = ({ optional = false } = {}) => ({
  before: async (request) => {
    const header = request.event.headers?.authorization;
    if (!header) {
      if (optional) {
        return;
      }
      throw createError(401, "Missing token");
    }

    const [type, token] = header.split(" ");
    if (type !== "Bearer" || !token) {
      throw createError(401, "Invalid or expired token");
    }

    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      request.event.user = { username: payload.username };
    } catch (error) {
      throw createError(401, "Invalid or expired token");
    }
  },
});
