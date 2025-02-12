import createHttpError from 'http-errors';
import { registerUser, loginUser, logoutUser, refreshUser } from '../services/auth.js';
import { THIRTY_DAYS} from '../constants/index.js';
import { UsersCollection } from '../db/models/user.js';
import { registerUserSchema } from '../validation/auth.js';
import { setupSession } from '../utils/session.js';

export const registerUserController = async (req, res, next) => {
    try {
      const { error } = registerUserSchema.validate(req.body);
      if (error) {
        throw createHttpError(400, 'Missing required fields');
      }
      const { name, email, password } = req.body;
      const existingUser = await UsersCollection.findOne({ email });
      if (existingUser) {
        throw createHttpError(409, 'Email in use');
      }

      const user = await registerUser(name, email, password);
      res.status(201).json({
        status: 201,
        message: 'Successfully registered a user!',
        data: user,
      });
    } catch (error) {

      next(error);
    }
  };

  export const loginUserController = async (req, res, next) => {
    try {
      const { email, password } = req.body;

      const userSession = await loginUser({ email, password });

      if (!userSession) {
        throw createHttpError(500, "Failed to create user session");
      }

      res.cookie("sessionId", userSession._id.toString(), {
        httpOnly: true,
        expires: new Date(Date.now() + THIRTY_DAYS),
      });
      res.cookie("refreshToken", userSession.refreshToken, {
        httpOnly: true,
        expires: new Date(Date.now() + THIRTY_DAYS),
    });

      res.status(200).json({
        status: 200,
        message: "Successfully logged in an user!",
        accessToken: userSession.accessToken,
      });
    } catch (error) {
      next(error);
    }
  };

  export const refreshUserController = async (req, res, next) => {
    try {
      const session = await refreshUser({
        sessionId: req.cookies.sessionId,
        refreshToken: req.cookies.refreshToken,
      });

      setupSession(res, session);

      res.json({
        status: 200,
        message: 'Successfully refreshed a session!',
        data: {
          accessToken: session.accessToken,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  export const logoutUserController = async (req, res, next) => {
    if (req.cookies.sessionId) {
      await logoutUser(req.cookies.sessionId);
    }
    res.clearCookie("sessionId");
    res.clearCookie("refreshToken");
    res.status(204).send();
  };
