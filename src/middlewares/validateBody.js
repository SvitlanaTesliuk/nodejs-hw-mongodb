import createHttpError from "http-errors";

export const validateBody = (schema) => (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      return next(createHttpError(400, 'Bad Request', {
        errors: error.details.map(err => ({
          message: err.message,
          path: err.path.join('.'),
        })),
      }));
    }

    next();
  };
