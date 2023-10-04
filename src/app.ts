import express from "express";
import mongoose from "mongoose";

const app = express();
mongoose.set("strictQuery", false);
mongoose.connect("mongodb://localhost:27017/mestodb");
app.listen(3000);