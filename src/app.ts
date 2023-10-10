import express from 'express';
import mongoose from 'mongoose';
import crypto from 'crypto';
import catchErrors from './middlewares/catchErrors';
import { requestLogger, errorLogger } from './middlewares/logger';
import router from './routes/index';
import { settings } from './constants/settings';

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

app.use(express.json());

app.use(cookieParser());

app.use('/', router);

app.use(errorLogger);
app.use(errors());
app.use(catchErrors);

app.listen(3000);
