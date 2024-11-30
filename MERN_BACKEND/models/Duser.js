import mongoose from "mongoose";
const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      min: 2,
      max: 50,
    },
    email: {
      type: String,
      default: "",
    },
    registered_courses: { type: [Number], default: [] },
    status: { type: Number, default: 1 },
  },
  { timestamps: true }
);

const Duser = mongoose.model("Duser", UserSchema);

export default Duser;
