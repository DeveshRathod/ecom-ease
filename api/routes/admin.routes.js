import express from "express";
import verifyUser from "../utils/verifyUser.js";
import {
  addBrand,
  addProduct,
  deleteProduct,
  deleteUser,
  getAllNonAdminUsers,
  getAllProduct,
  getDashboard,
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
router.get("/getDashboardDetails", verifyUser, getDashboard);
router.delete("/deleteUser", verifyUser, deleteUser);

export default router;
