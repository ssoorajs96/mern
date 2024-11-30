import mongoose from "mongoose";

const bookSchema = mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    bookId: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    status: {
      type: Number,
      default: 1,
    },
    random: {
      type: Number,
      default: Math.ceil(Math.random() * 10),
    },
  },
  { timestamps: true }
);

const AssignBook = mongoose.model("assignBooks", bookSchema);

export default AssignBook;
