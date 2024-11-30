import { body } from "express-validator";

export const addEmpValidate = [
  body("firstName").trim().notEmpty().withMessage("firstName is required"),
  body("lastName").trim().notEmpty().withMessage("lastName is required"),
  body("dateOfBirth")
    .notEmpty()
    .withMessage("DOB is required")
    .isDate()
    .withMessage("DOB should be valid date"),
  body("joiningDate")
    .notEmpty()
    .withMessage("Joining Data is required")
    .isDate()
    .withMessage("Joining Data should be valid date"),
];
