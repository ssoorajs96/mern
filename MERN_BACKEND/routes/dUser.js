import express from "express";
import {
  getCourseData,
  addUser,
  getUsersData,
  editUser,
} from "../controllers/dUser.js";

const router = express.Router();

router.get("/getCourseData", getCourseData);
router.get("/getUsersData", getUsersData);
router.post("/addUser", addUser);
router.patch("/editUser/:id", editUser);

export default router;
