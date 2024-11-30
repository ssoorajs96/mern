import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import userRoutes from "./routes/users.js";
import dUserRoutes from "./routes/dUser.js";
import expenseRoutes from "./routes/expense.js";
import jobRoutes from "./routes/job.js";
import requestRouter from "./routes/request.js";
import bookStoreRouter from "./routes/bookStore.js";
import fineRouter from "./routes/fine.js";

// configurations
const __fileName = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__fileName);
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

app.use("/assets", express.static(path.join(__dirname, "public/assets")));

//routes
app.use("/api/users", userRoutes);
app.use("/api/user", dUserRoutes);
app.use("/api/expense", expenseRoutes);
app.use("/api/job", jobRoutes);
app.use("/api/request", requestRouter);
app.use("/api/book-store", bookStoreRouter);
app.use("/api/fine", fineRouter)

// Mongoose setup
const PORT = process.env.PORT || 6001;
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => console.log(`server port: ${PORT}`));
  })
  .catch((error) => console.log(`${error} did not connect`));
