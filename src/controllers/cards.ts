import { NextFunction, Request, Response } from 'express';
import { NotFoundError, WrongAuthError } from '../constants/errors';
import Card from '../models/card';

export const getCards = (req: Request, res: Response, next: NextFunction) => {
  Card.find({}).limit(50).populate(['owner', 'likes'])
    .then((cards) => {
      res.send(cards);
    })
    .catch(() => {
      next(new NotFoundError('Cards not found'));
    });
};

export const createCard = (req: Request, res: Response, next: NextFunction) => {
  Card.create({
    name: req.body.name,
    link: req.body.link,
    owner: req.user._id,
    likes: [],
    createdAt: new Date().toUTCString(),
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
    .then((result) => {
      if (!result) {
        next(new WrongAuthError('Access denied'));
      } else {
        res.send({ message: 'Card deleted' });
      }
    })
    .catch(() => {
      next(new WrongAuthError('Access denied'));
    });
};

export const setLike = (req: Request, res: Response, next: NextFunction) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .populate(['owner', 'likes'])
    .then((card) =>{
      res.send(card);
    })
    .catch(() => {
      next(new NotFoundError('Card not found'));
    });
};

export const removeLike = (req: Request, res: Response, next: NextFunction) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .populate(['owner', 'likes'])
    .then((card) =>{
      res.send(card);
    })
    .catch(() => {
      next(new NotFoundError('Card not found'));
    });
};
