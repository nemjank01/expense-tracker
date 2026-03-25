import express from "express";
import authMiddleware from "../middleware/auth.js";
import { getDashboardOverview } from "../controllers/dashboardController.js";

const router = express.Router();

router.get("/", authMiddleware, getDashboardOverview);

export default router;
