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

const routerUsers = Router();

routerUsers.get(urlUserSelf, needAuth, getCurrentUser);

routerUsers.get(urlUserId, needAuth, getUserById);

routerUsers.get(urlUsers, needAuth, getAllUsers);

routerUsers.patch(
  urlUserAvatar,
  [
    needAuth,
    celebrate({
      body: Joi.object()
        .keys({
          avatar: Joi.string().uri(),
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
