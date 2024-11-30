import Duser from "../models/Duser.js";
import Course from "../models/Course.js";
// import { course } from "../data/index.js";

export const getCourseData = (req, res) => {
  Course.find()
    .then((data) => {
      if (data && data.length > 0) {
        return res.status(200).json({ response: data });
      } else {
        return res.status(400).json({ error: "No Data" });
      }
    })
    .catch((err) => {
      return res.status(500).json({ error: err });
    });
};

export const addUser = async (req, res) => {
  const { name, email, courseRegistered } = req.body;
  if (name == "" && email == "") {
    return res.status(400).json({ error: "Name and email must be provided" });
  } else if (courseRegistered && courseRegistered.length <= 0) {
    return res.status(400).json({ error: "At least select one course" });
  } else {
    const checkUserExists = await Duser.findOne({ email: email });
    if (checkUserExists) {
      return res.status(400).json({ error: "User already exists" });
    } else {
      try {
        const response = new Duser({
          name: name,
          email: email,
          registered_courses: courseRegistered,
        });
        await response.save();
        return res.status(200).json({ message: "User saved successfully" });
      } catch (error) {
        return res.status(500).json({ error: error });
      }
    }
  }
};

export const editUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, courseRegistered } = req.body;

  if (!name && !email) {
    return res.status(400).json({ error: "Name and email must be provided" });
  } else if (courseRegistered && courseRegistered.length <= 0) {
    return res.status(400).json({ error: "At least select one course" });
  } else {
    try {
      const data = await Duser.findByIdAndUpdate(
        { _id: id },
        { name: name, email: email, registered_courses: courseRegistered }
      );
      if (data) {
        return res.status(200).json({ message: "User updated successfully" });
      } else {
        return res.status(400).json({ error: "error occured" });
      }
    } catch (error) {
      return res.status(500).json({ error: error });
    }
  }
};

export const getUsersData = async (req, res) => {
  const { sortBy, searchParam } = req.query;
  const searchData =
    searchParam && searchParam !== "" ? { email: { $regex: searchParam } } : {};
  try {
    const response = await Duser.find(searchData).sort(sortBy);
    if (response) {
      return res.status(200).json({ data: response });
    }
  } catch (error) {
    return res.status(200).json({ error: error });
  }
};
