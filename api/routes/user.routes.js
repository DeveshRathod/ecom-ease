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

export default router;
