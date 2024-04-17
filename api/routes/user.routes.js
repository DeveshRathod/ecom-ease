import express from "express";
import {
  addAddress,
  deleteAddress,
  getAddress,
  me,
  signin,
  signup,
  updateUser,
  deleteUser,
  getcartandnotificationcount,
  addCart,
  getCartItems,
} from "../controllers/user.controller.js";
import verifyUser from "../utils/verifyUser.js";

const router = express.Router();

router.get("/me", me);
router.post("/signup", signup);
router.post("/signin", signin);
router.put("/update", verifyUser, updateUser);
router.delete("/delete", verifyUser, deleteUser);
router.get("/getAddress", verifyUser, getAddress);
router.post("/addAddress", verifyUser, addAddress);
router.delete("/deleteAddress", verifyUser, deleteAddress);
router.get("/getcount", verifyUser, getcartandnotificationcount);
router.post("/addToCart", verifyUser, addCart);
router.get("/getcart", verifyUser, getCartItems);

export default router;
