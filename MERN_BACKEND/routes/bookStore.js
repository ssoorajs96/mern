import express from "express";
import BookStore from "../models/BookStore.js";
import AssignBook from "../models/AssignBook.js";
const Router = express.Router();

Router.get("/list-books", async (req, res) => {
  try {
    const getData = await BookStore.find({ status: 1 });
    if (getData && getData.length > 0) {
      return res.status(200).json({ data: getData });
    } else {
      return res.status(403).json({ message: "No Data" });
    }
  } catch (error) {
    return res.status(400).json(error);
  }
});

Router.get("/list-book/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const getData = await BookStore.findById(id);
    if (getData && getData.length > 0) {
      return res.status(200).json({ data: getData });
    } else {
      return res.status(403).json({ message: "No Data" });
    }
  } catch (error) {
    return res.status(400).json(error);
  }
});

Router.post("/save", async (req, res) => {
  const { title, author, price, publishedDate, description } = req.body;
  try {
    const checkBookExists = await BookStore.find({
      $and: [
        {
          title: { $regex: "title" },
        },
        { status: 1 },
      ],
    });

    if (checkBookExists && checkBookExists.length == 0) {
      const saveData = await BookStore.create({
        title: title,
        author: author,
        price: price,
        publishedDate: publishedDate,
        description: description,
      });
      if (saveData) {
        return res.status(200).json({ message: "Book saved successfully" });
      } else {
        return res.status(400).json({ error: "Error Occured" });
      }
    } else {
      return res.status(403).json({ error: "Book already exists" });
    }
  } catch (error) {
    return res.status(400).json(error);
  }
});

Router.get("/list-assigned-books", async (req, res) => {
  const { userId } = req.query;
  try {
    const getData = await AssignBook.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "empId",
          as: "user",
        },
      },
      {
        $lookup: {
          from: "bookstores",
          localField: "bookId",
          foreignField: "_id",
          as: "book",
        },
      },
      { $match: { status: 1, userId: userId } },
      // {
      //   $group: {
      //     _id: null,
      //     // _id: { day: { $dayOfYear: "$date" }, year: { $year: "$date" } },
      //     totalAmount: { $sum: "$random" },
      //     // count: { $sum: 1 },
      //   },
      // },
      // { status: 1 },
    ]);

    if (getData && getData.length > 0) {
      return res.status(200).json({ data: getData, total: "" });
    } else {
      return res.status(200).json({ message: "No Data" });
    }
  } catch (error) {
    return res.status(400).json(error);
  }
});

// Router.post("/assign-book", async (req, res) => {
//   const { user, book } = req.body;
//   try {
//     const checkBookAssigned = await AssignBook.find({
//       $and: [{ userId: user }, { bookId: book }, { status: 1 }],
//     });
//     if (checkBookAssigned && checkBookAssigned.length > 0) {
//       return res.status(403).json({ error: "Book Already Assigned to you" });
//     } else {
//       const saveData = await AssignBook.create({
//         userId: user,
//         bookId: book,
//       });
//       console.log("🚀 ~ Router.post ~ saveData:", saveData);
//       if (saveData && Object.keys(saveData).length > 0) {
//         return res.status(200).json({ message: "Success!" });
//       } else {
//         return res.status(400).json({ error: "Error while saving" });
//       }
//     }
//   } catch (error) {
//     res.status(400).json({ error: error });
//   }
// });
Router.post("/assign-book", async (req, res) => {
  const { user, book } = req.body;
  try {
    const checkBookAssigned = await AssignBook.find({
      $and: [{ userId: user }, { bookId: book }, { status: 1 }],
    });
    if (checkBookAssigned && checkBookAssigned.length > 0) {
      res.status(403).json({ error: "Book already assigned" });
    } else {
      const saveData = await AssignBook.create({ userId: user, bookId: book });
      if (saveData && Object.keys(saveData).length > 0) {
        res.status(201).json({ message: "Book assigned" });
      } else {
        res.status(400).json({ error: "Error while saving" });
      }
    }
  } catch (error) {
    res.status(400).json({ error: error });
  }
});
Router.get("/aggregate-data/:item", async (req, res) => {
  const { item } = req.params;
  try {
    if (item == "user") {
      const aggregateData = await AssignBook.aggregate([
        {
          $group: {
            _id: { userId: "$userId" },
            count: {
              $sum: 1,
            },
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "_id.userId",
            foreignField: "empId",
            as: "user",
          },
        },
      ]);
      return res.status(200).json({ data: aggregateData });
    } else {
      const aggregateData = await AssignBook.aggregate([
        {
          $group: {
            _id: { bookId: "$bookId" },
            count: {
              $sum: 1,
            },
          },
        },
        {
          $lookup: {
            from: "bookstores",
            localField: "_id.bookId",
            foreignField: "_id",
            as: "book",
          },
        },
      ]);
      return res.status(200).json({ data: aggregateData });
    }
  } catch (error) {
    res.status(400).json({ error: error });
  }
});
export default Router;
