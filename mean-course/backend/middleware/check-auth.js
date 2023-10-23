import dotenv from "dotenv";
import dotenvExpand from "dotenv-expand";
import jwt from "jsonwebtoken";

dotenvExpand.expand(dotenv.config());

export function checkAuth(req, res, next) {
  try {
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, process.env.AUTH_SECRET);
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid auth token" });
  }
}
