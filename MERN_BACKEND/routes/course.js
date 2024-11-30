import express from "express";
import Course from "../models/courseDemo.js";

const courseRouter = express.Router();

courseRouter.post("/courses/enroll/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const getCourseData = await Course.findById(id);
    if (getCourseData && getCourseData.isApplied) {
      res
        .status(200)
        .json({ error: "You have already applied for this course" });
    } else {
      const saveAppliedCourse = await Course.findByIdAndUpdate(id, {
        isApplied: true,
      });
      if (saveAppliedCourse) {
        res
          .status(403)
          .json({ message: "You have successfully enrolled for the course" });
      } else {
        res.status(403).json({ error: "Error Occured" });
      }
    }
  } catch (error) {
    res.status(400).json({ error: error });
  }
});

courseRouter.delete("/courses/drop/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const getCourseData = await Course.findById(id);
    if (getCourseData && !getCourseData.isApplied) {
      const dropCourse = await Course.findByIdAndUpdate(id, {
        isApplied: false,
      });
      if (dropCourse) {
        res.status(200).json({ message: "You have dropped the course" });
      } else {
        res.status(400).json({ error: "Error Occured" });
      }
    } else {
      res.status(403).json({ error: "You have not enrolled for this course" });
    }
  } catch (error) {
    response.status(400).json({ error: error });
  }
});

courseRouter.get("/courses/get", async (req, res, next) => {
  try {
    const getCourseData = await Course.find();
    if (getCourseData) {
      res.status(200).json({ data: getCourseData });
    } else {
      res.status(400).json({ error: "Error Occured" });
    }
  } catch (error) {
    response.status(400).json({ error: error });
  }
});

courseRouter.patch("/courses/rating/:id", async (req, res, next) => {
  const { id } = req.params;
  const { rating } = req.body;
  try {
    const getPreviousCourseData = await Course.findById(id);
    if (getPreviousCourseData && !getPreviousCourseData.isRated) {
      const finalRating = (
        (getPreviousCourseData.noOfRatings * getPreviousCourseData.rating +
          rating) /
        (getPreviousCourseData.noOfRatings + 1)
      ).toFixed(1);
      const saveFinalRating = await Course.findByIdAndUpdate(id, {
        noOfRatings: getPreviousCourseData.noOfRatings + 1,
        isRated: true,
        rating: finalRating,
      });
      if (saveFinalRating) {
        res.status(200).json({ message: "You have rated this course" });
      } else {
        res.status(400).json({ error: "Error Occured" });
      }
    } else if (getPreviousCourseData && getPreviousCourseData.isRated) {
      res.status(403).json({ error: "You have already rated this course" });
    } else if (getPreviousCourseData && getPreviousCourseData.isApplied) {
      res.status(403).json({ error: "You have not enrolled for this course" });
    } else {
      res.status(400).json({ error: "Error Occured" });
    }
  } catch (error) {
    response.status(400).json({ error: error });
  }
});
export default jobRouter;
