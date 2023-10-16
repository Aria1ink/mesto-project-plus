import { NextFunction, Response, Request } from 'express';
import mongoose from 'mongoose';
import WrongDataError from '../constants/errors/WrongDataError';
import Users from '../models/user';
import Cards from '../models/card';
import NotFoundError from '../constants/errors/NotFoundError';

export const isUserExists = (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user._id || req.params.userId;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    next(new WrongDataError('Wrong userId'));
  } else {
    Users.findById(userId).orFail(new NotFoundError('User not found'))
      .then(() => {
        next();
      })
      .catch(next);
  }
};

export const isCardExists = (req: Request, res: Response, next: NextFunction) => {
  const { cardId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(cardId)) {
    next(new WrongDataError('Wrong cardId'));
  } else {
    Cards.findById(cardId).orFail(new NotFoundError('Card not found'))
      .then(() => {
        next();
      })
      .catch(next);
  }
};
