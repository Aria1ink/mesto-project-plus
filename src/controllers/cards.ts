import { NextFunction, Request, Response } from 'express';
import NotFoundError from '../constants/errors/NotFoundError';
import Card from '../models/card';
import WrongDataError from '../constants/errors/WrongDataError';
import { isCastError, isValidationError } from '../tools/checkErrors';
import AccessDeniedError from '../constants/errors/AccessDeniedEroor';

export const getCards = (req: Request, res: Response, next: NextFunction) => {
  Card.find({}).limit(50).populate(['owner', 'likes'])
    .then((cards) => {
      res.send(cards);
    });
};

export const createCard = (req: Request, res: Response, next: NextFunction) => {
  Card.create({
    name: req.body.name,
    link: req.body.link,
    owner: req.user._id,
  })
    .then((card) => card.populate(['owner', 'likes']).then((result) => { res.send(result); }))
    .catch((err) => {
      if (isValidationError(err)) {
        next(new WrongDataError(err.errors.link || err.errors.name || 'Validation error'));
      }
    });
};

export const removeCard = (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user._id;
  const { cardId } = req.params;

  console.log('cardId');

  Card.findOneAndDelete({ _id: cardId })
    .orFail(new NotFoundError('Card not found'))
    .then((card) => {
      if (card.owner.toString() === userId) {
        res.send({ message: 'Card deleted' });
      } else {
        next(new AccessDeniedError('Access denied'));
      }
    })
    .catch((err) => {
      if (err.statusCode === 404) {
        next(err);
      } else if (isCastError(err)) {
        next(new WrongDataError('Wrong card ID'));
      }
    });
};

export const setLike = (req: Request, res: Response, next: NextFunction) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  ).orFail(new NotFoundError('Card not found'))
    .populate(['owner', 'likes'])
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      if (err.statusCode === 404) {
        next(err);
      } else if (isCastError(err)) {
        next(new WrongDataError('Wrong card ID'));
      }
    });
};

export const removeLike = (req: Request, res: Response, next: NextFunction) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  ).orFail(new NotFoundError('Card not found'))
    .populate(['owner', 'likes'])
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      if (err.statusCode === 404) {
        next(err);
      } else if (isCastError(err)) {
        next(new WrongDataError('Wrong card ID'));
      }
    });
};
