import express from "express";
import mongoose from "mongoose";
import catchErrors from "middlewares/catchErrors";
import crypto from 'crypto';
import { Settings } from "./types/settings";
import { requestLogger, errorLogger } from './middlewares/logger';

export const settings: Settings = {
  JWT_SECRET: '',
};

const result = require('dotenv').config({processEnv: settings});

if (result.error || settings.JWT_SECRET === '') {
  console.log('Missing JWT_SECRET in .env file. Temporary secret key generated.');
  settings.JWT_SECRET = crypto.randomBytes(16).toString('hex');
}

const app = express();
const cookieParser = require('cookie-parser');

mongoose.set("strictQuery", false);
mongoose.connect("mongodb://localhost:27017/mestodb");

app.use(requestLogger);
app.use(cookieParser());


app.use(errorLogger);
app.use(catchErrors);

app.listen(3000);