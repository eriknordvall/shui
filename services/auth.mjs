/**
 * Business logic for register and login.
 * Hashes passwords with bcryptjs (plain JS, works on Lambda).
 * Signs JWTs with jsonwebtoken and JWT_SECRET from the environment.
 */
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { createError } from "@middy/util";
import { createUser, getUser } from "../repositories/users.mjs";

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

/**
 * Logs in a user.
 * - unknown username or wrong password → the same 401, so nobody can tell which one was wrong
 * - signs a JWT with { username } that expires after 1 hour
 * @param username a validated username
 * @param password the plain-text password
 * @returns an object with token and username
 */
export const loginUser = async (username, password) => {
  const user = await getUser(username);
  if (!user) {
    throw createError(401, "Invalid username or password");
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    throw createError(401, "Invalid username or password");
  }

  const token = jwt.sign({ username }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  return { token, username };
};
