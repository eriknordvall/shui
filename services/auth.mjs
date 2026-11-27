/**
 * Business logic for register and login.
 * Hashes passwords with bcryptjs (plain JS, works on Lambda).
 */
import bcrypt from "bcryptjs";
import { createError } from "@middy/util";
import { createUser } from "../repositories/users.mjs";

/**
 * Registers a new user.
 * - hashes the password and saves { username, password, createdAt }
 * - username already taken → 409
 * @param username a validated username
 * @param password the plain-text password
 * @returns { username } (never the hash)
 */
export const registerUser = async (username, password) => {
  const hash = await bcrypt.hash(password, 10);
  const user = {
    username,
    password: hash,
    createdAt: new Date().toISOString(),
  };

  try {
    await createUser(user);
  } catch (error) {
    if (error.name === "ConditionalCheckFailedException") {
      throw createError(409, "Username is already taken");
    }
    throw error;
  }

  return { username };
};
