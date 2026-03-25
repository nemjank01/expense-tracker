import express from "express";
import authMiddleware from "../middleware/auth.js";
import {
  deleteExpense,
  addExpense,
  getAllExpenses,
  updateExpense,
  downloadExpenseExcel,
  getExpenseOverview,
} from "../controllers/expenseController.js";

const router = express.Router();

router.get("/get", authMiddleware, getAllExpenses);
router.get("/downloadExcel", authMiddleware, downloadExpenseExcel);
router.get("/overview", authMiddleware, getExpenseOverview);

router.post("/add", authMiddleware, addExpense);

router.put("/update/:id", authMiddleware, updateExpense);

router.delete("/delete/:id", authMiddleware, deleteExpense);

export default router;
