import mongoose, { Model } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import WrongAuthError from '../constants/errors/WrongAuthError';

interface User {
  name: string;
  about: string;
  avatar: string;
  email: string;
  password: string;
}

interface UserModel extends Model<User> {
  findUserByCredentials: (email: string, password: string) =>
    Promise<mongoose.Document<unknown, any, User>>;
}

const userSchema = new mongoose.Schema<User, UserModel>(
  {
    name: {
      type: String,
      minlength: 2,
      maxlength: 30,
      default: 'Жак-Ив Кусто',
    },
    about: {
      type: String,
      minlength: 2,
      maxlength: 200,
      default: 'Исследователь',
    },
    avatar: {
      type: String,
      validate: {
        validator(url: string) {
          return validator.isURL(url);
        },
        message: 'Wrong URL',
      },
      default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator(email: string) {
          return validator.isEmail(email);
        },
        message: 'Wrong email',
      },
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
  },
  { versionKey: false },
);

userSchema.static('findUserByCredentials', function findUserByCredentials(email: string, password: string) {
  return this.findOne({ email }).select('+password').orFail(new WrongAuthError('Wrong login or password'))
    .then(async (user) => {
      const result = await bcrypt.compare(password, user.password);
      if (!result) {
        return Promise.reject(new WrongAuthError('Wrong login or password'));
      }
      return user;
    });
});

export default mongoose.model<User, UserModel>('user', userSchema);
