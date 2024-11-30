import mongoose from "mongoose";

//setting up schema for courses
const requestSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: "new",
    // required: true,
  },
  date: {
    type: String,
    // required: true,
    default: new Date(),
  },
  reason: {
    type: String,
    // required: true,
  },
});

//setting up the Course model
const Request = mongoose.model("Request", requestSchema);

export default Request;
