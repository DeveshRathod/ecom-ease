import express from "express";

import { me, signin, signup } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/me", me);
router.post("/signup", signup);
router.post("/signin", signin);

export default router;
