import express from "express";
import {
  listCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  listExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
} from "../controllers/expense.js";

const router = express.Router();

router.get("/category/list", listCategories);
router.post("/category/create", createCategory);
router.patch("/category/update/:id", updateCategory);
router.delete("/category/delete/:id", deleteCategory);

router.get("/expense/list", listExpenses);
router.post("/expense/create", createExpense);
router.patch("/expense/update/:id", updateExpense);
router.delete("/expense/delete/:id", deleteExpense);

export default router;
