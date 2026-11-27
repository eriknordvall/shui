/**
 * DynamoDB calls for the shui-users table.
 * The only file that reads or writes users.
 */
import { GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import { db, TABLES } from "../utils/db.mjs";

/**
 * Gets one user by username.
 * @param username the partition key
 * @returns the user item ({ username, password, createdAt }) or undefined
 */
export const getUser = async (username) => {
  const command = new GetCommand({
    TableName: TABLES.users,
    Key: { username },
  });

  const result = await db.send(command);
  return result.Item;
};

/**
 * Saves a new user. Fails if the username is already taken.
 * @param user { username, password (hash), createdAt }
 * @throws ConditionalCheckFailedException if the username exists
 */
export const createUser = async (user) => {
  const command = new PutCommand({
    TableName: TABLES.users,
    Item: user,
    ConditionExpression: "attribute_not_exists(username)",
  });

  await db.send(command);
  return user;
};
