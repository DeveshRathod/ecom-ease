import express from "express";
import {
  addCart,
  deleteCart,
  exploreProducts,
  getAllNewArrival,
  getCartItems,
  getCurrentProduct,
} from "../controllers/product.controller.js";
import verifyUser from "../utils/verifyUser.js";

const router = express.Router();

router.get("/newarrivals", getAllNewArrival);
router.get("/exploreProducts", exploreProducts);
router.post("/addToCart", verifyUser, addCart);
router.get("/getcart", verifyUser, getCartItems);
router.post("/getProduct", getCurrentProduct);
router.post("/deleteCart", verifyUser, deleteCart);

export default router;
