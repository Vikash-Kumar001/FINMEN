import jwt from "jsonwebtoken";

/**
 * Generates a signed JWT token for the given user ID.
 * @param {string} userId - MongoDB ObjectId of the user.
 * @returns {string} - JWT token.
 */
export const generateToken = (userId) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("❌ JWT_SECRET not defined in environment variables");
  }

  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "7d", // Customize as needed
  });
};
