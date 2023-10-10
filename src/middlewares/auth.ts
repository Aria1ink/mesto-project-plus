import { NextFunction, Response, Request } from 'express';
import jwt from 'jsonwebtoken';
import WrongAuthError from '../constants/errors/WrongAuthError';
import { settings } from '../constants/settings';

const needAuth = (req: Request, res: Response, next: NextFunction) => {
  let authorization = req.cookies.jwt;

  if (!authorization) {
    authorization = req.headers?.authorization;
  }

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new WrongAuthError('Auth required');
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, settings.JWT_SECRET);
  } catch (err) {
    throw new WrongAuthError('Auth required');
  }

  req.user = { _id: payload as string };

  next();
};

export default needAuth;
