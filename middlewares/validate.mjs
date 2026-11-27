/**
 * Middy middlewares that validate the request with a Zod schema.
 * Used after httpJsonBodyParser (and auth, when the endpoint needs it).
 */
import { createError } from "@middy/util";

/**
 * Validates event.body against a Zod schema.
 * - invalid → 400 with the first Zod message
 * - valid → event.body is replaced with the parsed data (unknown fields removed)
 * @param schema a Zod schema
 * @returns a middy middleware object with before
 */
export const validateBody = (schema) => ({
  before: (handler) => {
    const body = handler.event.body;
    const result = schema.safeParse(body);
    if (!result.success) {
      throw createError(400, result.error.issues[0].message);
    }
    handler.event.body = result.data;
  },
});

/**
 * Validates event.queryStringParameters against a Zod schema.
 * A request without "?" has no queryStringParameters, so it is validated as {}.
 * - invalid → 400 with the first Zod message
 * - valid → event.queryStringParameters is replaced with the parsed data
 * @param schema a Zod schema
 * @returns a middy middleware object with before
 */
export const validateQuery = (schema) => ({
  before: (handler) => {
    const query = handler.event.queryStringParameters ?? {};
    const result = schema.safeParse(query);
    if (!result.success) {
      throw createError(400, result.error.issues[0].message);
    }
    handler.event.queryStringParameters = result.data;
  },
});
