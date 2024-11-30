import mongoose from "mongoose";
const UserSchema = new mongoose.Schema(
  {
    courseName: {
      type: String,
      required: true,
      validate(value) {
        if (!value.match(/^[A-Za-z0-9. ]{3,}$/)) {
          throw new Error(
            "Course name can contain only alphabets, numbers, spaces and dots. The length of the course name should be greater than 2 letters"
          );
        }
      },
    },
    courseDept: {
      type: String,
      required: true,
      validate(value) {
        if (!value.match(/^(WD|AI|DS|CS|CC|UI|GD)$/)) {
          throw new Error("Please enter a valid department name");
        }
      },
    },
    description: {
      type: String,
      required: true,
      validate(value) {
        if (!value.match(/(?:[^!@#$%]+ ){2,14}[^!@#$%]+/)) {
          throw new Error(
            "Course description should have a length of atleast 3 words"
          );
        }
      },
    },
    duration: {
      type: Number,
      required: true,
      min: 1,
      max: 100,
    },
    noOfRatings: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      default: 0.0,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("Course", UserSchema);

export default User;
