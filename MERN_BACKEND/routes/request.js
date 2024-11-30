import express from "express";
import Request from "../models/Request.js";

const router = express.Router();

router.get("/list", async (req, res) => {
  try {
    const getListData = await Request.find();
    if (getListData && getListData.length > 0) {
      return res.status(201).json({ type: "Ok", requests: getListData });
    } else {
      return res.status(400).json({ error: "Error Occured" });
    }
  } catch (error) {
    return res.status(500).json(error);
  }
});

router.patch("/update/:id", async (req, res) => {
  const { id } = req.params;
  const { reason, status } = req.body;
  try {
    const updateData = await Request.findByIdAndUpdate(id, {
      reason: reason,
      status: status,
    });
    if (updateData) {
      return res.status(200).json({ message: "data updated" });
    } else {
      return res.status(403).json({ error: "Error Occured" });
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post("/save", async (req, res) => {
  const { name, email, type } = req.body;
  try {
    const getStatus = await Request.find({
      email: email,
      status: { $in: ["new", "in-progress"] },
    });
    if (getStatus && getStatus.length > 0) {
      return res.status(403).json({ error: "Active request exist" });
    } else {
      const saveData = await Request.create({
        name: name,
        email: email,
        type: type,
      });
      console.log("🚀 ~ router.post ~ saveData:", saveData);

      if (saveData) {
        return res.status(200).json({ message: "Success" });
      } else {
        return res.status(403).json({ error: "Error Occured" });
      }
    }
  } catch (error) {
    res.status(500).json(error);
  }
});
export default router;
