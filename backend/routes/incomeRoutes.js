import express from "express";
import authMiddleware from "../middleware/auth.js";
import {
  deleteIncome,
  addIncome,
  getAllIncomes,
  updateIncome,
  downloadIncomeExcel,
  getIncomeOverview,
} from "../controllers/incomeController.js";

const router = express.Router();

router.get("/get", authMiddleware, getAllIncomes);
router.get("/downloadExcel", authMiddleware, downloadIncomeExcel);
router.get("/overview", authMiddleware, getIncomeOverview);

router.post("/add", authMiddleware, addIncome);

router.put("/update/:id", authMiddleware, updateIncome);

router.delete("/delete/:id", authMiddleware, deleteIncome);

export default router;
