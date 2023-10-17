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
import { urlPattern } from '../constants/settings';

const routerCards = Router();

routerCards.get(urlCards, needAuth, getCards);

routerCards.post(
  urlCards,
  [
    needAuth,
    celebrate({
      body: Joi.object().keys({
        name: Joi.string().min(2).max(30).required(),
        link: Joi.string().pattern(urlPattern).required(),
      }).unknown(true),
    }),
  ],
  createCard,
);
// vernut'
routerCards.delete(urlCardId, [
  needAuth,
  celebrate({
    params: Joi.object()
      .keys({
        cardId: Joi.string()
          .regex(/^[0-9a-fA-F]{24}$/)
          .message('Wrong cardId'),
      })
      .unknown(true)
      .required(),
  }),
], removeCard);

routerCards.delete(urlCardSetLike, [
  needAuth,
  celebrate({
    params: Joi.object()
      .keys({
        cardId: Joi.string()
          .regex(/^[0-9a-fA-F]{24}$/)
          .message('Wrong cardId'),
      })
      .unknown(true)
      .required(),
  }),
], removeLike);

routerCards.put(urlCardSetLike, [
  needAuth,
  celebrate({
    params: Joi.object()
      .keys({
        cardId: Joi.string()
          .regex(/^[0-9a-fA-F]{24}$/)
          .message('Wrong cardId'),
      })
      .unknown(true)
      .required(),
  }),
], setLike);

export default routerCards;
