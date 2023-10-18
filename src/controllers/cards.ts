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
    })
    .catch(next);
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
        return next(new WrongDataError(err.errors.link || err.errors.name || 'Validation error'));
      }
      return next(err);
    });
};

export const removeCard = (req: Request, res: Response, next: NextFunction) => {
  const id = req.user._id;
  Card.findById({ _id: req.params.cardId })
    .orFail(new NotFoundError('Card not found'))
    .then((card) => {
      if (card.owner.toString() !== id) {
        return next(new AccessDeniedError('Access denied'));
      }
      return card.delete()
        .then(() => res.send({ message: 'Card deleted' }))
        .catch(next);
    })
    .catch((err) => {
      if (isCastError(err)) {
        return next(new WrongDataError('Wrong card ID'));
      }
      return next(err);
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
      if (isCastError(err)) {
        return next(new WrongDataError('Wrong card ID'));
      }
      return next(err);
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
      if (isCastError(err)) {
        return next(new WrongDataError('Wrong card ID'));
      }
      return next(err);
    });
};
