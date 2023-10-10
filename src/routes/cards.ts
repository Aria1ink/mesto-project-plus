import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';
import needAuth from '../middlewares/auth';
import { urlCardLikes, urlCards, urlCardSetLike } from '../constants/urls';
import {
  createCard,
  getCards,
  removeCard,
  removeLike,
  setLike,
} from '../controllers/cards';

const routerCards = Router();

routerCards.get(urlCards, needAuth, getCards);

routerCards.post(
  urlCards,
  [
    needAuth,
    celebrate({
      body: Joi.object().keys({
        name: Joi.string().min(2).max(30).required(),
        link: Joi.string().uri().required(),
      }),
    }),
  ],
  createCard,
);

routerCards.delete(urlCards, needAuth, removeCard);

routerCards.delete(urlCardLikes, needAuth, removeLike);

routerCards.put(urlCardSetLike, needAuth, setLike);

export default routerCards;
