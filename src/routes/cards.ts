import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';
import { urlCardLikes, urlCards, urlCardSetLike } from '../constants/urls';
import {
  createCard,
  getCards,
  removeCard,
  removeLike,
  setLike,
} from '../controllers/cards';

const routerCards = Router();

routerCards.get(urlCards, getCards);

routerCards.post(
  urlCards,
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30).required(),
      link: Joi.string().uri().required(),
    }),
  }),
  createCard,
);

routerCards.delete(urlCards, removeCard);

routerCards.delete(urlCardLikes, removeLike);

routerCards.put(urlCardSetLike, setLike);

export default routerCards;
