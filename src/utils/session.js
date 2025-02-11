import { THIRTY_DAYS } from "../constants/index.js";

export const setupSession = (res, session) => {
  res.cookie("refreshToken", session.refreshToken, {
      httpOnly: true,
      expires: new Date(Date.now() + THIRTY_DAYS),
  });
  res.cookie("sessionId", session._id.toString(), {
      httpOnly: true,
      expires: new Date(Date.now() + THIRTY_DAYS),
  });
};
