import Category from "../models/Category.js";
import Expense from "../models/Expense.js";

export const listCategories = async (req, res) => {
  const { sortBy, searchParam } = req.query;
  const searchData =
    searchParam && searchParam !== "" ? { name: { $regex: searchParam } } : {};
  try {
    const response = await Category.find(searchData).sort(sortBy);
    if (response) {
      return res.status(200).json({ data: response });
    }
  } catch (error) {
    return res.status(200).json({ error: error });
  }
};
export const createCategory = async (req, res) => {
  const { cName } = req.body;
  if (!cName) {
    return res.status(400).json({ error: "Name is required" });
  } else {
    const checkCategoryExists = await Category.find({ name: cName });
    if (checkCategoryExists && checkCategoryExists.length > 0) {
      return res.status(400).json({ error: "Category already exists" });
    } else {
      try {
        const saveData = new Category({ name: cName });
        await saveData.save();
        return res.status(200).json({ message: "Category saved successfully" });
      } catch (error) {
        return res.status(500).json({ error: error });
      }
    }
  }
};
export const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { cName } = req.body;
  if (id) {
    if (cName) {
      const response = await Category.findByIdAndUpdate(
        { _id: id },
        { name: cName }
      );
      if (response) {
        return res
          .status(200)
          .json({ message: "Category updated successfully" });
      } else {
        return res.status(400).json({ error: "Error updating category" });
      }
    } else {
      return res.status(400).json({ error: "Name is required." });
    }
  } else {
    return res.status(400).json({ error: "Error occured." });
  }
};
export const deleteCategory = async (req, res) => {};
export const listExpenses = async (req, res) => {};
export const createExpense = async (req, res) => {};
export const updateExpense = async (req, res) => {};
export const deleteExpense = async (req, res) => {};
