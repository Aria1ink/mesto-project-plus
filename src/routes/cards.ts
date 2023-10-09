import { Router } from "express";
import { celebrate, Joi } from "celebrate";
import { urlCardLikes, urlCards, urlCardSetLike } from "constants/urls";
import { createCard, getCards, removeCard, removeLike, setLike } from "controllers/cards";

const router = Router();

router.get(urlCards, getCards);

router.post(
  urlCards,
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30).required(),
      link: Joi.string().uri().required(),
    }),
  }),
  createCard
);

router.delete(urlCards, removeCard);

router.delete(urlCardLikes, removeLike);

router.put(urlCardSetLike, setLike);

export default router;