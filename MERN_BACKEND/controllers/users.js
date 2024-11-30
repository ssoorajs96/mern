import User from "../models/User.js";
import { validationResult } from "express-validator";
// import { users } from "../data/index.js";
//read
export const getUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.find({ empId: id });
    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getUsers = async (req, res) => {
  try {
    const user = await User.find();
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addEmpData = async (req, res) => {
  try {
    const { firstName, lastName, joiningDate, dateOfBirth } = req.body;
    const errors = validationResult(req);
    // if there is error then return Error
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }
    let picturePath =
      req && req.file && Object.keys(req.file).length > 0
        ? process.env.FILE_PATH + req.file.filename
        : "";
    const user = await User.create({
      firstName,
      lastName,
      joiningDate,
      dateOfBirth,
      picture: picturePath,
    });
    if (!user) {
      return res.status(400).json({
        success: false,
        errors: "Error Occured",
      });
    } else {
      return res
        .status(201)
        .json({ success: true, errors: "Saved Sucessfully" });
    }
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

export const sortAndFilterEmpData = async (req, res) => {
  try {
    const { searchParams, filterParams } = req.body;
    const searchData = {};
    const filterData = {};
    if (searchParams && Object.keys(searchParams).length !== 0) {
      searchParams && searchParams.empName && searchParams.empName !== ""
        ? (searchData.firstName = {
            $regex: searchParams.empName,
            $options: "i",
          })
        : delete searchData.firstName;
      searchParams && searchParams.DOB && searchParams.DOB !== ""
        ? (searchData.dateOfBirth = searchParams.DOB)
        : delete searchData.dateOfBirth;
    }
    const convertedSearchArray = Object.entries(searchData).map(
      ([key, value]) => ({
        [key]: value,
      })
    );

    if (filterParams && Object.keys(filterParams).length !== 0) {
      filterParams && filterParams.createdAt && filterParams.createdAt !== ""
        ? (filterData.createdAt = filterParams.createdAt == "asc" ? 1 : -1)
        : delete filterData.createdAt;
      filterParams && filterParams.status && filterParams.status !== ""
        ? (filterData.status = filterParams.status == "Y" ? -1 : 1)
        : delete filterData.status;
    }
    const empData = await User.find({
      $and: convertedSearchArray,
    }).sort(filterData);

    return res.status(201).json({ success: true, data: empData });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

export const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const delEmp = await User.findOneAndUpdate({ empId: id }, { status: 0 });
    if (!delEmp) {
      return res.status(400).json({
        success: false,
        errors: "Error Occured",
      });
    }
    return res
      .status(201)
      .json({ success: true, message: "deleted sucessfully" });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

export const editEmpData = async (req, res) => {
  try {
    const { empId, firstName, lastName, joiningDate, dateOfBirth } = req.body;
    const filter = empId && empId !== "" ? { empId: empId } : {};
    if (filter && Object.keys(filter).length !== 0) {
      if (joiningDate && joiningDate !== "") {
        return res.status(400).json({
          success: false,
          errors: "Cannot edit Joining Date",
        });
      } else if (dateOfBirth && dateOfBirth !== "") {
        return res.status(400).json({
          success: false,
          errors: "Cannot edit Date of birth",
        });
      } else {
        const data = {};
        req && req.file && Object.keys(req.file).length > 0
          ? (data.picture = process.env.FILE_PATH + req.file.filename)
          : delete data.picture;
        firstName && firstName !== ""
          ? (data.firstName = firstName)
          : delete data.firstName;
        lastName && lastName !== ""
          ? (data.lastName = lastName)
          : delete data.lastName;
        const result = await User.findOneAndUpdate(filter, data, {
          new: true,
        });
        if (!result) {
          return res.status(400).json({
            success: false,
            errors: "Employee data not found",
          });
        }
        return res
          .status(201)
          .json({ success: true, message: "Updated Sucessfully" });
      }
    } else {
      return res.status(400).json({
        success: false,
        errors: "Employee id required",
      });
    }
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};
