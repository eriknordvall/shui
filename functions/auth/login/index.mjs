/**
 * POST /auth/login
 * Logs in a user. Body: { username, password }.
 * 200 { message, token, username } · 400 invalid body · 401 wrong username or password
 */
import middy from "@middy/core";
import httpJsonBodyParser from "@middy/http-json-body-parser";
import { sendResponse } from "../../../utils/responses.mjs";
import { validateBody } from "../../../middlewares/validate.mjs";
import { loginSchema } from "../../../schemas/auth.mjs";
import { loginUser } from "../../../services/auth.mjs";
import { errorHandler } from "../../../middlewares/errorHandler.mjs";

/**
 * Validated body in, 200 with a JWT and the username out.
 */
const loginHandler = async (event) => {
  const { username, password } = event.body;
  const user = await loginUser(username, password);
  return sendResponse(200, {
    message: "Login successful",
    token: user.token,
    username: user.username,
  });
};

export const handler = middy(loginHandler)
  .use(httpJsonBodyParser())
  .use(validateBody(loginSchema))
  .use(errorHandler());
