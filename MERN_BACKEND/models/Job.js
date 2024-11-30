import mongoose from "mongoose";

//setting up schema for courses
const jobSchema = new mongoose.Schema({
  job_title: {
    type: String,
    required: true,
  },
  company: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  requirements: {
    type: String,
    required: true,
  },
  salaryRange: {
    type: String,
    required: true,
  },
  deadLine: {
    type: Date,
    required: true,
  },
});

//setting up the Course model
const Job = mongoose.model("Job", jobSchema);

export default Job;
