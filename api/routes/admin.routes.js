import express from "express";
import verifyUser from "../utils/verifyUser.js";
import {
  addProduct,
  deleteProduct,
  getAllProduct,
  getProduct,
  updateProduct,
} from "../controllers/admin.contoller.js";

const router = express.Router();

router.post("/addProduct", verifyUser, addProduct);
router.delete("/deleteProduct/:productId", verifyUser, deleteProduct);
router.get("/getProduct/:productId", verifyUser, getProduct);
router.get("/getAllProduct", verifyUser, getAllProduct);
router.put("/updateProduct/:productId", verifyUser, updateProduct);

export default router;
