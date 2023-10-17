import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';
import needAuth from '../middlewares/auth';
import {
  urlUsers,
  urlUserId,
  urlUserSelf,
  urlUserAvatar,
} from '../constants/urls';
import {
  getAllUsers,
  getCurrentUser,
  getUserById,
  updateAvatar,
  updateProfile,
} from '../controllers/users';
import { urlPattern } from '../constants/settings';

const routerUsers = Router();

routerUsers.get(urlUserSelf, needAuth, getCurrentUser);

routerUsers.get(urlUserId, [
  needAuth,
  celebrate({
    params: Joi.object()
      .keys({
        userId: Joi.string()
          .regex(/^[0-9a-fA-F]{24}$/)
          .message('Wrong userId'),
      })
      .unknown(true)
      .required(),
  }),
], getUserById);

routerUsers.get(urlUsers, needAuth, getAllUsers);

routerUsers.patch(
  urlUserAvatar,
  [
    needAuth,
    celebrate({
      body: Joi.object()
        .keys({
          avatar: Joi.string().pattern(urlPattern),
        })
        .unknown(true)
        .required(),
    }),
  ],
  updateAvatar,
);

routerUsers.patch(
  urlUsers,
  [
    needAuth,
    celebrate({
      body: Joi.object().keys({
        name: Joi.string().min(2).max(30).required(),
        about: Joi.string().min(2).max(200).required(),
      }).unknown(true),
    }),
  ],
  updateProfile,
);

export default routerUsers;
