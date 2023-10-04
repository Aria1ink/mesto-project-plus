import { NextFunction, Request, Response } from "express";
import { WrongAuthError } from "constants/errors";
import jwt from 'jsonwebtoken';

export const needAuth = (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    throw new WrongAuthError('Auth required');
  }

  const token = authorization.replace("Bearer ", "");
  let payload;
  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    throw new WrongAuthError('Auth required');
  }

  req.user = payload;

  next();
}