import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema({});

const expense = mongoose.model("expense", expenseSchema);

export default expense;
