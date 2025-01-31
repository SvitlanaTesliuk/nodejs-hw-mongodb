import { isValidObjectId } from 'mongoose';
import createHttpError from 'http-errors';

export const isValidId = (req, res, next) => {
  const { contacttId } = req.params;
  if (!isValidObjectId(contacttId)) {
    throw createHttpError(400, 'Bad Request');
  }

  next();
};
