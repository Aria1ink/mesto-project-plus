import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';
import { urlSignin, urlSignup } from '../constants/urls';
// eslint-disable-next-line import/no-cycle
import { signin, signup } from '../controllers/users';

const routerAuth = Router();

routerAuth.post(
  urlSignin,
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    }),
  }),
  signin,
);

routerAuth.post(
  urlSignup,
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
      name: Joi.string().min(2).max(30).default('Жак-Ив Кусто'),
      about: Joi.string().min(2).max(200).default('Исследователь'),
      avatar: Joi.string()
        .uri()
        .default(
          'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
        ),
    }),
  }),
  signup,
);

export default routerAuth;
