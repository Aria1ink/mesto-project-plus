import { NextFunction, Response, Request } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import WrongAuthError from '../constants/errors/WrongAuthError';
import { settings } from '../constants/settings';

const needAuth = (req: Request, res: Response, next: NextFunction) => {
  const authorization = req.cookies.jwt || req.headers.authorization;

  if (!authorization && !authorization.startsWith('Bearer ')) {
    return next(new WrongAuthError('Auth required'));
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, settings.JWT_SECRET) as JwtPayload;
  } catch (err) {
    return next(new WrongAuthError('Auth required'));
  }
  req.user = { _id: payload?._id };

  return next();
};

export default needAuth;
