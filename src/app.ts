import express from "express";
import mongoose from "mongoose";

import catchErrors from "middlewares/catchErrors";

const app = express();
mongoose.set("strictQuery", false);
mongoose.connect("mongodb://localhost:27017/mestodb");

app.use(catchErrors);

app.listen(3000);