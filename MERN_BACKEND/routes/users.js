import express from "express";
import {
  getUser,
  addEmpData,
  sortAndFilterEmpData,
  deleteEmployee,
  editEmpData,
  getUsers,
} from "../controllers/users.js";
import { verifyAuth } from "../middleware/auth.js";
import { addEmpValidate } from "../validators/user.validator.js";
import multer from "multer";

const router = express.Router();
// file storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/assets");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });
/* READ */
router.get("/get-employee-data/:id", verifyAuth, getUser);
router.post("/sort-&-filter-employee-data", verifyAuth, sortAndFilterEmpData);
router.get("/", getUsers);

/* UPDATE */
router.patch("/delete-employee/:id", verifyAuth, deleteEmployee);
router.post(
  "/edit-employee",
  verifyAuth,
  upload.single("picture"),
  editEmpData
);

/* INSERT */
router.post(
  "/add-employee",
  verifyAuth,
  upload.single("picture"),
  addEmpValidate,
  addEmpData
);
export default router;
