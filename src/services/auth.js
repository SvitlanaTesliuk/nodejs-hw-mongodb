import { UsersCollection } from '../db/models/user.js';
import { SessionsCollection } from '../db/models/session.js';
import { createSession } from '../services/sessionService.js';
import { FIFTEEN_MINUTES, THIRTY_DAYS } from '../constants/index.js';
import crypto from "crypto";
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import createHttpError from 'http-errors';


dotenv.config();
export const registerUser = async (name, email, password) => {
  const existingUser = await UsersCollection.findOne({ email });
  if (existingUser) throw createHttpError(409, 'Email in use');

  const hashedPassword = await bcrypt.hash(password, 10);

  return await UsersCollection.create({
    name,
    email,
    password: hashedPassword,
  });
};

export const loginUser = async (payload) => {
  const user = await UsersCollection.findOne({ email: payload.email });

  if (!user) {
    throw createHttpError(404, "User not found");
  }

  const isEqual = await bcrypt.compare(payload.password, user.password);
  if (!isEqual) {
    throw createHttpError(401, "Unauthorized");
  }

  await SessionsCollection.deleteOne({ userId: user._id });

  const accessToken = crypto.randomBytes(32).toString("hex");
  const refreshToken = crypto.randomBytes(64).toString("hex");

  const accessTokenValidUntil = new Date(Date.now() + FIFTEEN_MINUTES);
  const refreshTokenValidUntil = new Date(Date.now() + THIRTY_DAYS);
 
  return await SessionsCollection.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil,
    refreshTokenValidUntil,
  });

}

export const refreshUser = async ({ sessionId, refreshToken }) => {

  const session = await SessionsCollection.findOne({ _id: sessionId, refreshToken });

  if (!session) {
    throw createHttpError(401, "Session not found");
  }

  if (new Date() > new Date(session.refreshTokenValidUntil)) {
    throw createHttpError(401, "Session token expired");
  }

  const newSession = createSession(session.userId);

  await SessionsCollection.deleteOne({ _id: sessionId });
  return await SessionsCollection.create({ userId: session.userId, ...newSession });
};
export const logoutUser = async (sessionId) => {
  await SessionsCollection.deleteOne({ _id: sessionId });
};
