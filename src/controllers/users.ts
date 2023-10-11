import bcrypt from 'bcryptjs';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import NotFoundError from '../constants/errors/NotFoundError';
import UserExistsError from '../constants/errors/UserExistsError';
import { settings } from '../constants/settings';
import User from '../models/user';
import ServerError from '../constants/errors/ServerError';
import WrongDataError from '../constants/errors/WrongDataError';
import { isCastError } from '../tools/checkErrors';

export const signup = (req: Request, res: Response, next: NextFunction) => {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => {
      User.create({
        name: req.body.name,
        about: req.body.about,
        avatar: req.body.avatar,
        email: req.body.email,
        password: hash,
      })
        .then((user) => {
          res.send(user.toObject({ useProjection: true }));
        })
        .catch((err) => {
          if (err._message) {
            next(new WrongDataError(err._message));
          } else if (err?.code === 11000) {
            next(new UserExistsError('User already exists'));
          } else {
            next(new ServerError(err.message));
          }
        });
    })
    .catch((err) => {
      next(new ServerError(err.message));
    });
};

export const signin = (req: Request, res: Response, next: NextFunction) => {
  User.findUserByCredentials(req.body.email, req.body.password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, settings.JWT_SECRET, { expiresIn: '7d' });
      res.cookie('jwt', token, {
        maxAge: 604800,
        httpOnly: true,
        path: '/',
      });
      res.send(user.toObject({ useProjection: true }));
    })
    .catch(next);
};

export const getAllUsers = (req: Request, res: Response, next: NextFunction) => {
  User.find()
    .then((users) => {
      res.send([...users]);
    })
    .catch((err) => next(new ServerError(err.message)));
};

export const getUserById = (req: Request, res: Response, next: NextFunction) => {
  User.findById(req.params.userId).orFail(new NotFoundError('User not found'))
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.statusCode === 404) {
        next(err);
      } else if (isCastError(err)) {
        next(new NotFoundError('User not found'));
      } else {
        next(new ServerError(err.message));
      }
    });
};

export const getCurrentUser = (req: Request, res: Response, next: NextFunction) => {
  User.findById(req.user._id).orFail(new NotFoundError('User not found'))
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.statusCode === 404) {
        next(err);
      } else {
        next(new ServerError(err.message));
      }
    });
};

export const updateProfile = (req: Request, res: Response, next: NextFunction) => {
  User.findByIdAndUpdate(
    req.user._id,
    {
      name: req.body.name,
      about: req.body.about,
    },
    {
      returnDocument: 'after',
      runValidators: true,
    },
  ).orFail(new NotFoundError('User not found'))
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.statusCode === 404) {
        next(err);
      } else {
        next(new ServerError(err.message));
      }
    });
};

export const updateAvatar = (req: Request, res: Response, next: NextFunction) => {
  User.findByIdAndUpdate(
    req.user._id,
    {
      avatar: req.body.avatar,
    },
    {
      returnDocument: 'after',
      runValidators: true,
    },
  ).orFail(new NotFoundError('User not found'))
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.statusCode === 404) {
        next(err);
      } else {
        next(new ServerError(err.message));
      }
    });
};
