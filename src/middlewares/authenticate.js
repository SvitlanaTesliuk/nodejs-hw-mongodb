import createHttpError from 'http-errors';
import { SessionsCollection } from '../db/models/session.js';

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw createHttpError(401, "Unauthorized");
    }

    const accessToken = authHeader.split(" ")[1];
    const session = await SessionsCollection.findOne({ accessToken });

    if (!session) {
      throw createHttpError(401, "Unauthorized");
    }

    if (new Date() > new Date(session.accessTokenValidUntil)) {
      throw createHttpError(401, "Access token expired");
    }

    req.user = session.userId.toString();
    console.log(session, req.user)
    next();
  } catch (error) {
    next(error);
  }
};


