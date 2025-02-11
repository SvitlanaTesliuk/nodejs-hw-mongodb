import { randomBytes } from "crypto";

const FIFTEEN_MINUTES = 15 * 60 * 1000;
const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;

export const createSession = (userId) => {
  return {
    userId,
    accessToken: randomBytes(32).toString("hex"),
    refreshToken: randomBytes(64).toString("hex"),
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + THIRTY_DAYS),
  };
};
