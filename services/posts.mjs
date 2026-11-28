/**
 * Business logic for posts.
 * Every post leaves this file through toPost, so the internal entity field never reaches the client.
 */
import { createError } from "@middy/util";
import {
  getAllPosts,
  getPostsByUsername,
  getPostById,
} from "../repositories/posts.mjs";

/**
 * Builds a post in the API's field order and drops internal fields (entity).
 * @param item a post item from DynamoDB
 * @returns the post as the API returns it
 */
const toPost = (item) => ({
  id: item.id,
  username: item.username,
  isGuest: item.isGuest,
  title: item.title,
  content: item.content,
  createdAt: item.createdAt,
  updatedAt: item.updatedAt,
});

/**
 * Lists posts, newest first.
 * @param username optional filter (?username=)
 * @returns an array of posts ([] if none match)
 */
export const listPosts = async (username) => {
  const items = username
    ? await getPostsByUsername(username)
    : await getAllPosts();
  return items.map(toPost);
};

/**
 * Gets one post.
 * @param id the post id
 * @returns the post
 * @throws 404 if the post does not exist
 */
export const getPost = async (id) => {
  const item = await getPostById(id);
  if (!item) {
    throw createError(404, "Post not found");
  }
  return toPost(item);
};
