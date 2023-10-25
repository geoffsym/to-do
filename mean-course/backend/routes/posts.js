import {
  createPost,
  deletePost,
  getPost,
  getPosts,
  updatePost,
} from "../controllers/posts.js";

import { checkAuth } from "../middleware/check-auth.js";
import express from "express";
import extractFile from "../middleware/file.js";

const router = express.Router();

router.post("/", checkAuth, extractFile, createPost);

router.put("/:id", checkAuth, extractFile, updatePost);

router.get("/", getPosts);

router.get("/:id", getPost);

router.delete("/:id", checkAuth, deletePost);

export default router;
