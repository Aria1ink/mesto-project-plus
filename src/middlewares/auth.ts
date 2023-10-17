import { NextFunction, Response, Request } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import mongoose from 'mongoose';
import WrongAuthError from '../constants/errors/WrongAuthError';
import { settings } from '../constants/settings';
import WrongDataError from '../constants/errors/WrongDataError';

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

  if (!mongoose.Types.ObjectId.isValid(payload._id)) {
    return next(new WrongDataError('Wrong userId'));
  }

  req.user = { _id: payload?._id };

  return next();
};

export default needAuth;
