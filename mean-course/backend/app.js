import dotenv from "dotenv";
import dotenvExpand from "dotenv-expand";
import express from "express";
import mongoose from "mongoose";
import path from "path";
import postRouter from "./routes/posts.js";
import userRouter from "./routes/user.js";

dotenvExpand.expand(dotenv.config());

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Connected to database!");
  })
  .catch(() => {
    console.log("Database connection failed!");
  });

const app = express();

app.use(express.json());
app.use("/images", express.static(path.join("backend/images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  next();
});

app.use("/api/posts", postRouter);
app.use("/api/user", userRouter);

export default app;
