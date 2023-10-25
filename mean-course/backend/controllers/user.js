import User from "../models/user.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import dotenvExpand from "dotenv-expand";
import jwt from "jsonwebtoken";

dotenvExpand.expand(dotenv.config());

export function createUser(req, res, next) {
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
        res.status(500).json({
          message: "User already exists",
        });
      });
  });
}

export function userLogin(req, res, next) {
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
        throw new Error("Invalid password");
      }
      // valid password
      const token = jwt.sign(
        { email: foundUser.email, userId: foundUser._id },
        process.env.AUTH_SECRET,
        { expiresIn: "1h" }
      );
      res.status(200).json({
        userId: foundUser._id,
        token: token,
        expiresIn: 3600,
      });
    })
    .catch((err) => {
      res.status(401).json({ message: err.message });
    });
}
