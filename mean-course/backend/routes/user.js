import { createUser, userLogin } from "../controllers/user.js";

import express from "express";

const router = express.Router();

router.post("/signup", createUser);

router.post("/login", userLogin);

export default router;
