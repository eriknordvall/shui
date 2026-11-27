/**
 * POST /auth/register
 * Registers a new user. Body: { username, password }.
 * 201 { message, username } · 400 invalid body · 409 username taken
 */
import middy from "@middy/core";
import httpJsonBodyParser from "@middy/http-json-body-parser";
import { sendResponse } from "../../../utils/responses.mjs";
import { validateBody } from "../../../middlewares/validate.mjs";
import { registerSchema } from "../../../schemas/auth.mjs";
import { registerUser } from "../../../services/auth.mjs";
import { errorHandler } from "../../../middlewares/errorHandler.mjs";

/**
 * Validated body in, 201 with the username out (never the password).
 */
const registerHandler = async (event) => {
  const { username, password } = event.body;
  const user = await registerUser(username, password);
  return sendResponse(201, {
    message: "User registered successfully",
    username: user.username,
  });
};

export const handler = middy(registerHandler)
  .use(httpJsonBodyParser())
  .use(validateBody(registerSchema))
  .use(errorHandler());
