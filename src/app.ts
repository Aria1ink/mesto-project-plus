import express from "express";
import mongoose from "mongoose";
import catchErrors from "middlewares/catchErrors";
import crypto from 'crypto';
import { Settings } from "./types/settings";

export const settings: Settings = {};

const result = require('dotenv').config({processEnv: settings});

if (result.error) {
  console.log('Missing .env file. Temporary secret key generated.');
  settings.JWT_SECRET = crypto.randomBytes(16).toString('hex');
}

const app = express();
mongoose.set("strictQuery", false);
mongoose.connect("mongodb://localhost:27017/mestodb");

app.use(catchErrors);

app.listen(3000);