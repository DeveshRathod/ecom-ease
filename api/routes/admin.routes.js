import express from "express";
import verifyUser from "../utils/verifyUser.js";
import {
  addBrand,
  addProduct,
  deleteProduct,
  getAllNonAdminUsers,
  getAllProduct,
  getProduct,
  updateProduct,
} from "../controllers/admin.contoller.js";

const router = express.Router();

router.post("/addBrand", verifyUser, addBrand);
router.post("/addProduct", verifyUser, addProduct);
router.delete("/deleteProduct/:productId", verifyUser, deleteProduct);
router.get("/getProduct/:productId", verifyUser, getProduct);
router.get("/getAllProduct", verifyUser, getAllProduct);
router.put("/updateProduct/:productId", verifyUser, updateProduct);
router.get("/getUsers", verifyUser, getAllNonAdminUsers);

export default router;
