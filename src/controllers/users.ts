import bcrypt from 'bcryptjs';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import NotFoundError from '../constants/errors/NotFoundError';
import UserExistsError from '../constants/errors/UserExistsError';
import { settings } from '../constants/settings';
import User from '../models/user';
import WrongDataError from '../constants/errors/WrongDataError';
import { isCastError, isValidationError } from '../tools/checkErrors';

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
          if (isValidationError(err)) {
            return next(new WrongDataError(err.errors.avatar || err.errors.email || 'Validation error'));
          }
          if (err?.code === 11000) {
            return next(new UserExistsError('User already exists'));
          }
          return next(err);
        });
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
    .catch(next);
};

export const getUserById = (req: Request, res: Response, next: NextFunction) => {
  User.findById(req.params.userId).orFail(new NotFoundError('User not found'))
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (isCastError(err)) {
        return next(new WrongDataError('Wrong user ID'));
      }
      return next(err);
    });
};

export const getCurrentUser = (req: Request, res: Response, next: NextFunction) => {
  User.findById(req.user._id).orFail(new NotFoundError('User not found'))
    .then((user) => {
      res.send(user);
    })
    .catch(next);
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
      if (isValidationError(err)) {
        return next(new WrongDataError(err.errors.name || err.errors.about || 'Validation error'));
      }
      return next(err);
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
      if (isValidationError(err)) {
        return next(new WrongDataError(err.errors.avatar || 'Validation error'));
      }
      return next(err);
    });
};
