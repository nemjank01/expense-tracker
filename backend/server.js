import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";

import userRouter from "./routes/userRoutes.js";
import incomeRouter from "./routes/incomeRoutes.js";
import expenseRouter from "./routes/expenseRoutes.js";

dotenv.config();
const app = express();
const PORT = 3000;

//MIDDLEWARES
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//DB
connectDB();

//ROUTES
app.use("/api/user", userRouter);
app.use("/api/income", incomeRouter);
app.use("/api/expense", expenseRouter);

app.get("/", (req, res) => {
  res.send("API WORKS!");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}...`);
});
