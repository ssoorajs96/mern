import express from "express"
import FineModel from "../models/Fine.js"
import moment from "moment";
const router = express.Router();

router.post("/add-data", async (req, res) => {
    const { first_name, last_name, email, gender, fine } = req.body;
    try {
        const respData = await FineModel.create({ first_name: first_name, last_name: last_name, email: email, gender: gender, fine: fine })
        if (respData) {
            return res.status(200).json({ data: respData });
        } else {
            return res.status(400).json("No data found");
        }
    } catch (error) {
        res.status(401).json({ error: error?.message })
    }
})

router.get("/get-data", async (req, res) => {
    try {
        const response = await FineModel.find();
        response?.length !== 0 ? res.status(201).json(response) : res.status(400)
    } catch (error) {
        res.status(400)
    }
})

router.post("/get-data-with-email", async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: "Email is required" });
    }

    try {
        // Assuming `date` is stored as a string in the format YYYY-MM-DD
        const resp = await FineModel.find({
            email: { $regex: `${email}` } // Use regex if partial date match is needed
        });

        if (resp && resp.length !== 0) {
            return res.status(200).json({ data: resp });
        } else {
            return res.status(404).json({ message: "No records found" });
        }
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});


router.post("/find-data", async (req, res) => {
    const { first_name, last_name, email } = req.body;
    try {
        const findData = await FineModel.find({ $or: [{ first_name: first_name }, { last_name: last_name }, { email: email }] })
        findData && findData.length !== 0 ? res.status(200).json(findData) : res.status(400)
    } catch (error) {
        res.status(400)
    }
})

router.post("/find-data-aggregate", async (req, res) => {
    const { first_name, last_name, email } = req.body;
    const resp = await FineModel.aggregate([
        {
            $match: { $or: [{ first_name: { $regex: `^ ${first_name}`, $options: "i" } }, { last_name: last_name }, { email: email }] }
        },
        {
            $group: { _id: null, data: { $push: { fName: "$first_name" } }, sum: { $sum: "$fine" }, count: { $sum: 1 } }
        },

    ])
    resp && resp.length !== 0 ? res.status(201).json(resp) : res.status(400)
})

router.post("/fine-gt-sort", async (req, res) => {
    const { fine } = req.body;
    try {
        if (fine === "") return res.status(400).status("enter fine amount");

        const resp = await FineModel.find({ fine: { $gte: fine } }).sort({ fine: -1 });
        if (resp && resp.length !== 0) {
            return res.status(200).json({ data: resp })
        } else {
            return res.status(400).json("no data")
        }

    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})

router.post("/get-by-year", async (req, res) => {
    const { date } = req.body;
    if (date === "") return res.status(400).json("no date");
    const finalDate = new Date(date)
    try {
        const respData = await FineModel.find({ date: { $gte: new Date(finalDate.getFullYear(), 0, 1), $lte: new Date(finalDate.getFullYear(), 11, 31) } })
        if (respData && respData.length !== 0) {
            return res.status(200).json({ data: respData })
        } else {
            return res.status(400).json("no data")
        }
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})

router.post("/get-by-month-and-year", async (req, res) => {
    const { date } = req.body;
    try {
        if (!date || date.trim() === "") {
            return res.status(400).json("No date provided");
        }

        const finalDate = new Date(date);
        const month = finalDate.getMonth(); // Get the month (0 = January, 11 = December)
        const year = finalDate.getFullYear(); // Get the year

        // Aggregation to filter by month and year
        const respData = await FineModel.aggregate([
            {
                $match: {
                    date: {
                        $gte: new Date(year, month, 1), // Start of the month
                        $lt: new Date(year, month + 1, 1) // Start of the next month
                    }
                }
            },
            {
                $sort: { date: -1 } // Sort by date in descending order
            }
        ]);

        if (respData && respData.length > 0) {
            return res.status(200).json({ data: respData });
        } else {
            return res.status(400).json("No data found");
        }

    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
});

router.get("/count-total", async (req, res) => {
    try {
        const respData = await FineModel.aggregate([
            {
                $group: {
                    _id: null, total: { $sum: 1 }
                }

            }
        ])
        if (respData) {
            return res.status(200).json({ data: respData });
        } else {
            return res.status(400).json("No data found");
        }
    } catch (error) {
        return res.status(400).json({ error: error.message });

    }
})

router.get("/total-sum", async (req, res) => {
    try {
        const respData = await FineModel.aggregate([
            {
                $group: {
                    _id: null, total: { $sum: "$fine" }
                }

            }
        ])
        if (respData) {
            return res.status(200).json({ data: respData });
        } else {
            return res.status(400).json("No data found");
        }
    } catch (error) {
        return res.status(400).json({ error: error.message });

    }
})

router.get("/gender-fine-avg", async (req, res) => {
    try {
        const respData = await FineModel.aggregate([
            {
                $group: {
                    _id: "$gender",
                    data: { $push: { first_name: "$first_name", fine: "$fine" } },
                    avg: { $avg: "$fine" }
                }
            }
        ])
        if (respData) {
            return res.status(200).json({ data: respData });
        } else {
            return res.status(400).json("No data found");
        }
    } catch (error) {
        return res.status(400).json({ error: error.message });

    }
})

router.get("/group-by-date-and-count", async (req, res) => {
    try {
        const respData = await FineModel.aggregate([
            {
                $group: {
                    _id: "$date",
                    data: { $push: { first_name: "$first_name", fine: "$fine" } },
                    count: { $sum: 1 }
                }
            }
        ])
        if (respData) {
            return res.status(200).json({ data: respData });
        } else {
            return res.status(400).json("No data found");
        }
    } catch (error) {
        return res.status(400).json({ error: error.message });

    }
})

router.patch("/update-by-id/:id", async (req, res) => {
    const { id } = req.params;
    const { fine } = req.body;
    try {
        const respData = await FineModel.findOneAndUpdate({ tempid: id },
            { $set: { fine: fine } }
        );
        if (respData) {
            return res.status(200).json({ data: respData });
        } else {
            return res.status(400).json("No data found");
        }
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
})

router.post("/get-top-2-highest-fines", async (req, res) => {
    try {
        // Query to get the top 2 documents with the highest fine
        const topFines = await FineModel.find()
            .sort({ fine: -1 })  // Sort by fine in descending order
            .limit(2);           // Limit the result to the top 2

        if (topFines && topFines.length > 0) {
            return res.status(200).json({ data: topFines });
        } else {
            return res.status(400).json("No data found");
        }
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
});

router.get("/group-by-gender-and-filter-fine-gt-500", async (req, res) => {
    try {
        const respData = await FineModel.aggregate([
            { $match: { fine: { $gt: 500 } } },
            { $group: { _id: "$gender", data: { $push: { first_name: "$first_name", fine: "$fine" } }, totalFine: { $sum: "$fine" } } },
        ])
        if (respData && respData.length > 0) {
            return res.status(200).json({ data: respData });
        } else {
            return res.status(400).json("No data found");
        }
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})

router.get("/group-by-gender-total-fine-desc", async (req, res) => {
    try {
        const respData = await FineModel.aggregate([
            {
                $group: {
                    _id: "$gender",
                    data: { $push: { first_name: "$first_name", fine: "$fine", gender: "$gender" } },
                    total: { $sum: "$fine" }
                }
            },
            { $sort: { total: 1 } }

        ])
        if (respData && respData.length > 0) {
            return res.status(200).json({ data: respData });
        } else {
            return res.status(400).json("No data found");
        }
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})

router.get("/project-data", async (req, res) => {
    try {
        const respData = await FineModel.aggregate([
            {
                $project: {
                    first_name: 1,
                    year: { $year: "$date" }
                }
            }
        ])
        if (respData && respData.length > 0) {
            return res.status(200).json({ data: respData });
        } else {
            return res.status(400).json("No data found");
        }
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})

router.get("/largest-fine-aggregate", async (req, res) => {
    try {
        const respData = await FineModel.aggregate([
            {
                $sort: { fine: -1 }
            }
        ]).limit(1)
        if (respData && respData.length > 0) {
            return res.status(200).json({ data: respData });
        } else {
            return res.status(400).json("No data found");
        }
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})

router.get("/group-by-year-and-count", async (req, res) => {
    try {
        const respData = await FineModel.aggregate([
            { $group: { _id: { $year: "$date" }, total: { $sum: 1 } } }
        ])
        if (respData && respData.length > 0) {
            return res.status(200).json({ data: respData });
        } else {
            return res.status(400).json("No data found");
        }
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})

router.get("/group-by-gender-maximum-fine", async (req, res) => {
    try {
        const respData = await FineModel.aggregate([
            {
                $group: {
                    _id: "$gender",              // Group by gender
                    max_fine: { $max: "$fine" }  // Find the maximum fine in each gender group
                }
            },
            {
                $sort: { _id: 1 } // Optional: Sort by gender in ascending order (optional)
            }
        ]);

        if (respData && respData.length > 0) {
            return res.status(200).json({ data: respData });
        } else {
            return res.status(404).json({ message: "No data found" });
        }
    } catch (error) {
        console.error("Error in /group-by-gender-maximum-fine:", error);
        res.status(500).json({ error: error.message });
    }
});

router.get("/extract-month-year", async (req, res) => {
    try {
        const respData = await FineModel.aggregate([
            {
                $project: {
                    first_name: 1,
                    last_name: 1,
                    month: { $month: "$date" },  // Extract the month from the date
                    year: { $year: "$date" }     // Extract the year from the date
                }
            }
        ]);

        if (respData && respData.length > 0) {
            return res.status(200).json({ data: respData });
        } else {
            return res.status(404).json({ message: "No data found" });
        }
    } catch (error) {
        console.error("Error in /extract-month-year:", error);
        res.status(500).json({ error: error.message });
    }
});

router.get("/join-by-tempid", async (req, res) => {
    try {
        const respData = await FineModel.aggregate([
            {
                $lookup: {
                    from: "TempModel",             // The collection to join with (TempModel)
                    localField: "tempid",          // The field in FineModel to match
                    foreignField: "tempid",        // The field in TempModel to match against
                    as: "tempData"                 // The field where joined results will be stored
                }
            },
            {
                $unwind: {
                    path: "$tempData",           // Flatten the array to get individual joined document
                    preserveNullAndEmptyArrays: true // If no match, still return the document with `tempData` as null
                }
            }
        ]);

        if (respData && respData.length > 0) {
            return res.status(200).json({ data: respData });
        } else {
            return res.status(404).json({ message: "No data found" });
        }
    } catch (error) {
        console.error("Error in /join-by-tempid:", error);
        res.status(500).json({ error: error.message });
    }
});

router.get("/group-by-month-year", async (req, res) => {
    try {
        const respData = await FineModel.aggregate([
            {
                $project: {
                    year: { $year: "$date" },
                    month: { $month: "$date" },
                    fine: 1
                }
            },
            {
                $group: {
                    _id: { year: "$year", month: "$month" },
                    sum: { $sum: "$fine" }
                }
            }
        ])
        if (respData && respData.length > 0) {
            return res.status(200).json({ data: respData });
        } else {
            return res.status(400).json("No data found");
        }
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})

export default router