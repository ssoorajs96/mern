import express from "express";
import Job from "../models/Job.js";

const jobRouter = express.Router();

jobRouter.get("/list", async (req, res, next) => {
  const { job_title, location } = req.query;
  try {
    const jobData = await Job.find({
      $and: [
        { job_title: { $regex: job_title ?? "", $options: "i" } },
        { location: { $regex: location ?? "", $options: "i" } },
      ],
    });
    if (jobData) {
      res.status(200).json({ data: jobData });
    } else {
      res.status(400).json({ error: "Job not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

jobRouter.post("/jobs", async (req, res, next) => {
  const { job_title, company, location, requirements, salaryRange, deadLine } =
    req.body;
  try {
    if (
      !job_title ||
      !company ||
      !location ||
      !requirements ||
      !salaryRange ||
      !deadLine
    ) {
      res.status(400).json({ error: "Error Occured" });
    } else {
      const saveJob = await Job.create({
        job_title: job_title,
        company: company,
        location: location,
        requirements: requirements,
        salaryRange: salaryRange,
        deadLine: new Date(deadLine),
      });
      if (saveJob) {
        res.status(201).json({ message: "Success" });
      } else {
        res.status(400).json({ error: "Error Occured in saving" });
      }
    }
  } catch (error) {
    res.status(500).json({ error: error });
  }
});
export default jobRouter;
