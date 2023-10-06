import { Router } from "express";
import { celebrate, Joi } from "celebrate";
import { urlUsers, urlUserId, urlUserSelf, urlUserAvatar } from "constants/urls";
import { getAllUsers, getCurrentUser, getUserById, signin, signup, updateAvatar, updateProfile } from "controllers/users";

const router = Router();

router.get(urlUsers, getAllUsers);

router.get(urlUserSelf, getCurrentUser);

router.get(urlUserId, getUserById);

router.patch(
  urlUserAvatar,
  celebrate({
  body: Joi.object()
    .keys({
      avatar: Joi.string().uri()
    })
      .unknown(true)
      .required(),
}), updateAvatar);

router.patch(
  urlUsers,
  celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(200).required(),
  })
    .unknown(true),
}), updateProfile);

export default router;