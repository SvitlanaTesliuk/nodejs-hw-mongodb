import { UsersCollection } from '../db/models/user.js';
import { SessionsCollection } from '../db/models/session.js';
import { createSession } from '../services/sessionService.js';
import { FIFTEEN_MINUTES, THIRTY_DAYS, SMTP } from '../constants/index.js';
import { getEnvVar } from '../utils/getEnvVar.js';
import { sendEmail } from '../utils/sendMail.js';
import crypto from "crypto";
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import createHttpError from 'http-errors';
import jwt from 'jsonwebtoken';

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

export const requestResetToken = async (email) => {
  const user = await UsersCollection.findOne({ email });

  if (!user) {
    throw createHttpError(404, 'User not found!');
  }

  const resetToken = jwt.sign(
    { sub: user._id, email },
    getEnvVar('JWT_SECRET'),
    { expiresIn: '5m' }
  );

  const resetLink = `${getEnvVar('APP_DOMAIN')}/reset-password?token=${resetToken}`;

  try {
    await sendEmail({
      from: getEnvVar('SMTP_FROM'),
      to: email,
      subject: 'Reset your password',
      html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`,
    });
  } catch (error) {
    throw createHttpError(500, 'Failed to send the email, please try again later.');
  }
};

export const resetPassword = async (token, newPassword) => {
  try {
    const decoded = jwt.verify(token, getEnvVar('JWT_SECRET'));
    const user = await UsersCollection.findOne({ email: decoded.email });

    if (!user) {
      throw createHttpError(404, 'User not found!');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await UsersCollection.updateOne({ email: decoded.email }, { password: hashedPassword });

    await SessionsCollection.deleteMany({ userId: user._id });

  } catch (error) {
    throw createHttpError(401, 'Token is expired or invalid.');
  }
};
