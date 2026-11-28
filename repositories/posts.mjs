/**
 * DynamoDB calls for the shui-posts table.
 * The only file that reads or writes posts.
 */
import { GetCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { db, TABLES } from "../utils/db.mjs";

/**
 * Gets every post, newest first (Query on the postsByDate index).
 * @returns an array of post items ([] if there are none)
 */
export const getAllPosts = async () => {
  const command = new QueryCommand({
    TableName: TABLES.posts,
    IndexName: "postsByDate",
    KeyConditionExpression: "entity = :entity",
    ExpressionAttributeValues: { ":entity": "POST" },
    ScanIndexForward: false,
  });

  const result = await db.send(command);
  return result.Items;
};

/**
 * Gets one user's posts, newest first (Query on the postsByUsername index).
 * @param username the username to filter on
 * @returns an array of post items ([] if there are none)
 */
export const getPostsByUsername = async (username) => {
  const command = new QueryCommand({
    TableName: TABLES.posts,
    IndexName: "postsByUsername",
    KeyConditionExpression: "username = :username",
    ExpressionAttributeValues: { ":username": username },
    ScanIndexForward: false,
  });

  const result = await db.send(command);
  return result.Items;
};

/**
 * Gets one post by id.
 * @param id the post id
 * @returns the post item or undefined
 */
export const getPostById = async (id) => {
  const command = new GetCommand({
    TableName: TABLES.posts,
    Key: { id },
  });

  const result = await db.send(command);
  return result.Item;
};
