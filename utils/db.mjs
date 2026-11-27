/**
 * Shared DynamoDB client and table names.
 * Only the files in repositories/ (users, posts, comments) import this file.
 */
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});

/**
 * The DocumentClient, created once and reused by every function.
 * It converts between plain JavaScript objects and DynamoDB's own format.
 */
export const db = DynamoDBDocumentClient.from(client);

/**
 * Table names. They must match TableName in serverless.yml.
 */
export const TABLES = {
  users: "shui-users",
  posts: "shui-posts",
  comments: "shui-comments",
};
