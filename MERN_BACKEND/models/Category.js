import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      min: 5,
    },
    status: { type: Number, default: 1 },
  },
  { timestamps: true }
);

const Category = mongoose.model("category", categorySchema);

export default Category;
