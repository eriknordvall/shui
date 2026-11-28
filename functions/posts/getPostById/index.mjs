/**
 * GET /posts/{postId}
 * Gets one post.
 * 200 post · 404 post not found
 */
import middy from "@middy/core";
import { sendResponse } from "../../../utils/responses.mjs";
import { getPost } from "../../../services/posts.mjs";
import { errorHandler } from "../../../middlewares/errorHandler.mjs";

const getPostByIdHandler = async (event) => {
  const { postId } = event.pathParameters;
  const post = await getPost(postId);
  return sendResponse(200, post);
};

export const handler = middy(getPostByIdHandler).use(errorHandler());
