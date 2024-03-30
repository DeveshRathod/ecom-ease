import express from "express";
import {
  exploreProducts,
  getAllNewArrival,
} from "../controllers/product.controller.js";

const router = express.Router();

router.get("/newarrivals", getAllNewArrival);
router.get("/exploreProducts", exploreProducts);

export default router;
