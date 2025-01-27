import { HttpError } from 'http-errors';
export const errorHandler = (err, req, res, next) => {
  if (err instanceof HttpError) {
    res.status(err.status).json({
      status: 404,
      message: "Contact not found",
      data: err,
    });
    return;
  }
    res.status(500).json({
      status: 500,
      message: 'Something went wrong',
      error: err.message,
    });
  };
