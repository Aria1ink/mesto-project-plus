import { NextFunction, Request, Response } from 'express';

interface ErrorWithStatus extends Error {
  statusCode: number;
}

// eslint-disable-next-line no-unused-vars, max-len
export default function catchErrors(err: ErrorWithStatus, req: Request, res: Response, next: NextFunction) {
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'Internal server error'
        : message,
    });
}
