export const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'production') {
    return res.status(err.statusCode).json({
      success: false,
      message: err.statusCode === 500 ? 'An internal server error occurred.' : err.message,
    });
  } else {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      stack: err.stack,
      error: err,
    });
  }
};

export class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}
