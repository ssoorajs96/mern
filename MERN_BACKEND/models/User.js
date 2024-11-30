import mongoose from "mongoose";
import { nanoid } from "nanoid";

const UserSchema = new mongoose.Schema(
  {
    empId: {
      type: String,
      // default: () => nanoid(7),
      index: { unique: true },
    },
    firstName: {
      type: String,
      required: true,
      min: 2,
      max: 50,
    },
    lastName: {
      type: String,
      required: true,
      min: 2,
      max: 50,
    },
    dateOfBirth: { type: Date, required: true },
    joiningDate: { type: Date, default: new Date() },
    status: { type: Number, default: 1 },
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);

export default User;
