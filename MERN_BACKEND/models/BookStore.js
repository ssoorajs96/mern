import mongoose from "mongoose";

const bookStoreSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  author: { type: String, required: true },
  price: { type: String, required: true },
  publishedDate: { type: Date, default: new Date() },
  description: { type: String, default: "" },
  status: { type: Number, default: 1 },
});

const BookStore = mongoose.model("bookstore", bookStoreSchema);

export default BookStore;
