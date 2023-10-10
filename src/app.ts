import express from 'express';
import mongoose from 'mongoose';
import crypto from 'crypto';
import catchErrors from './middlewares/catchErrors';
import { Settings } from './types/settings';
import { requestLogger, errorLogger } from './middlewares/logger';
import routerUsers from './routes/users';
import routerAuth from './routes/auth';
import routerCards from './routes/cards';

const settings: Settings = {
  JWT_SECRET: '',
};

const result = require('dotenv').config({ processEnv: settings });

if (result.error || settings.JWT_SECRET === '') {
  console.log('Missing JWT_SECRET in .env file. Temporary secret key generated.');
  settings.JWT_SECRET = crypto.randomBytes(16).toString('hex');
}

const app = express();
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');

mongoose.set('strictQuery', false);
mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(requestLogger);
app.use(cookieParser());

app.use('/', routerAuth);
app.use('/', routerUsers);
app.use('/', routerCards);

app.use(errorLogger);
app.use(errors());
app.use(catchErrors);

app.listen(3000);

export default settings;
