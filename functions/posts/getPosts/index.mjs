/**
 * GET /posts
 * Lists every post, newest first. Optional filter: ?username=
 * 200 [posts] ([] if none) · 400 invalid query parameters
 */
import middy from "@middy/core";
import { sendResponse } from "../../../utils/responses.mjs";
import { validateQuery } from "../../../middlewares/validate.mjs";
import { postsQuerySchema } from "../../../schemas/posts.mjs";
import { listPosts } from "../../../services/posts.mjs";
import { errorHandler } from "../../../middlewares/errorHandler.mjs";

const getPostsHandler = async (event) => {
  const { username } = event.queryStringParameters;
  const posts = await listPosts(username);
  return sendResponse(200, posts);
};

export const handler = middy(getPostsHandler)
  .use(validateQuery(postsQuerySchema))
  .use(errorHandler());
