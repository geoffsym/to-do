import User from "../models/user.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import dotenvExpand from "dotenv-expand";
import express from "express";
import jwt from "jsonwebtoken";

dotenvExpand.expand(dotenv.config());

const router = express.Router();

router.post("/signup", (req, res, next) => {
  bcrypt.hash(req.body.password, 10).then((hash) => {
    const user = new User({
      email: req.body.email,
      password: hash,
    });
    user
      .save()
      .then((result) => {
        res.status(200).json({
          message: "User created!",
          result: result,
        });
      })
      .catch((err) => {
        res.status(500).json({ error: err });
      });
  });
});

router.post("/login", (req, res, next) => {
  let foundUser = {};
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        throw new Error("User not found");
      }
      // user found
      foundUser = user;
      return bcrypt.compare(req.body.password, user.password);
    })
    .then((result) => {
      if (!result) {
        throw new Error("User password is invalid");
      }
      // valid password
      const token = jwt.sign(
        { email: foundUser.email, userId: foundUser._id },
        process.env.AUTH_SECRET,
        { expiresIn: "1h" }
      );
      res.status(200).json({ token: token });
    })
    .catch((err) => {
      res.status(401).json({ message: err.message });
    });
});

export default router;
