import { NextFunction, Response } from "express";
import { RequestAuth } from "types/express";
import { WrongAuthError } from "constants/errors";
import jwt from 'jsonwebtoken';

export const needAuth = (req: RequestAuth, res: Response, next: NextFunction) => {
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

  req.user = {_id: payload};

  next();
}