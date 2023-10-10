import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';
import {
  urlUsers,
  urlUserId,
  urlUserSelf,
  urlUserAvatar,
} from '../constants/urls';
// eslint-disable-next-line import/no-cycle
import {
  getAllUsers,
  getCurrentUser,
  getUserById,
  updateAvatar,
  updateProfile,
} from '../controllers/users';

const routerUsers = Router();

routerUsers.get(urlUsers, getAllUsers);

routerUsers.get(urlUserSelf, getCurrentUser);

routerUsers.get(urlUserId, getUserById);

routerUsers.patch(
  urlUserAvatar,
  celebrate({
    body: Joi.object()
      .keys({
        avatar: Joi.string().uri(),
      })
      .unknown(true)
      .required(),
  }),
  updateAvatar,
);

routerUsers.patch(
  urlUsers,
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30).required(),
      about: Joi.string().min(2).max(200).required(),
    }).unknown(true),
  }),
  updateProfile,
);

export default routerUsers;
