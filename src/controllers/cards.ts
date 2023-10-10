import { NextFunction, Request, Response } from 'express';
import NotFoundError from '../constants/errors/NotFoundError';
import WrongAuthError from '../constants/errors/WrongAuthError';
import Card from '../models/card';
import ServerError from '../constants/errors/ServerError';

export const getCards = (req: Request, res: Response, next: NextFunction) => {
  Card.find({}).limit(50).populate(['owner', 'likes'])
    .then((cards) => {
      res.send(cards);
    })
    .catch((err) => { next(new ServerError(err.message)); });
};

export const createCard = (req: Request, res: Response, next: NextFunction) => {
  Card.create({
    name: req.body.name,
    link: req.body.link,
    owner: req.user._id,
  })
    .then((card) => {
      card.populate(['owner', 'likes'])
        .then((result) => {
          res.send(result);
        });
    })
    .catch(() => {
      next(new WrongAuthError('Access denied'));
    });
};

export const removeCard = (req: Request, res: Response, next: NextFunction) => {
  const id = req.user._id;
  Card.findOneAndDelete({ _id: req.params.cardId, owner: { id } })
    .orFail(new NotFoundError('Card not found'))
    .then(() => {
      res.send({ message: 'Card deleted' });
    })
    .catch((err) => {
      if (err.statusCode) {
        next(err);
      } else {
        next(new NotFoundError('Card not found'));
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
      if (err.statusCode) {
        next(err);
      } else {
        next(new NotFoundError('Card not found'));
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
      if (err.statusCode) {
        next(err);
      } else {
        next(new NotFoundError('Card not found'));
      }
    });
};
