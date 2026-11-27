/**
 * GET /health
 * Checks that the API is running.
 */
import middy from "@middy/core";
import { sendResponse } from "../../utils/responses.mjs";
import { errorHandler } from "../../middlewares/errorHandler.mjs";

const healthHandler = async () => {
  return sendResponse(200, { status: "ok" });
};

export const handler = middy(healthHandler).use(errorHandler());
