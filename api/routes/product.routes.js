import express from "express";
import { getAllNewArrival } from "../controllers/product.controller.js";

const router = express.Router();

router.get("/newarrivals", getAllNewArrival);

export default router;
