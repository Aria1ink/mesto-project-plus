import User from "../models/user";
import bcrypt from "bcryptjs";
import { WrongDataError, ServerError, NotFoundError, WrongAuthError } from "constants/errors";
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export const signup = (req: Request, res: Response, next: NextFunction) => {
  bcrypt.hash(req.body.password, 10)
    .then( hash => {
        User.create({
          name: req.body.name,
          about: req.body.about,
          avatar: req.body.avatar,
          email: req.body.email,
          password: hash,
        })
        .then((user) => {
          if (!user) {
            throw new WrongDataError('User already exists');
          } else {
            res.send(user);
          }
        })
        .catch(next);
      }
    )
    .catch(err => next(new ServerError(err)));
}

export const signin = (req: Request, res: Response, next: NextFunction) => {
  User.findUserByCredentials(req.body.email, req.body.password)
    .then( (user) => {
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
      res.send({ token });
    })
    .catch(next);
}

export const getAllUsers = (req: Request, res: Response, next: NextFunction) => {
  User.find()
    .then( users => {
      if (!users || users.length === 0) {
        throw new NotFoundError('Users not found');
      } else {
        res.send(...users);
      }
    })
    .catch(next);
}

export const getUserById = (req: Request, res: Response, next: NextFunction) => {
  User.findById(req.params.userId)
    .then( user => {
      if (!user) {
        throw new NotFoundError('User not found');
      } else {
        res.send(user);
      }
    })
    .catch(next);
}

export const getCurrentUser = (req: Request, res: Response, next: NextFunction) => {
  User.findById(req.user._id)
    .then( user => {
      if (!user) {
        throw new NotFoundError('User not found');
      } else {
        res.send(user);
      }
    })
    .catch(next);
}

export const updateProfile = (req: Request, res: Response, next: NextFunction) => {
  User.findByIdAndUpdate(
    req.user._id,
    {
      name: req.body.name,
      about: req.body.about,
    },
    { returnDocument: 'after'},
  )
    .then( user => {
      if (!user) {
        throw new NotFoundError('User not found');
      } else {
        res.send(user);
      }
    })
    .catch(next);
}

export const updateAvatar = (req: Request, res: Response, next: NextFunction) => {
  User.findByIdAndUpdate(
    req.user._id,
    {
      avatar: req.body.avatar,
    },
    { returnDocument: 'after'},
  )
    .then( user => {
      if (!user) {
        throw new NotFoundError('User not found');
      } else {
        res.send(user);
      }
    })
    .catch(next);
}