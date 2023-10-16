import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';
import needAuth from '../middlewares/auth';
import {
  urlCardId,
  urlCardLikes,
  urlCards,
  urlCardSetLike,
} from '../constants/urls';
import {
  createCard,
  getCards,
  removeCard,
  removeLike,
  setLike,
} from '../controllers/cards';
import { isCardExists, isUserExists } from '../middlewares/validateId';
import { urlPattern } from '../constants/settings';

const routerCards = Router();

routerCards.get(urlCards, [needAuth, isUserExists], getCards);

routerCards.post(
  urlCards,
  [
    needAuth,
    isUserExists,
    celebrate({
      body: Joi.object().keys({
        name: Joi.string().min(2).max(30).required(),
        link: Joi.string().pattern(urlPattern).required(),
      }).unknown(true),
    }),
  ],
  createCard,
);

routerCards.delete(urlCardId, [needAuth, isUserExists, isCardExists], removeCard);

routerCards.delete(urlCardLikes, [needAuth, isUserExists, isCardExists], removeLike);

routerCards.put(urlCardSetLike, [needAuth, isUserExists, isCardExists], setLike);

export default routerCards;
