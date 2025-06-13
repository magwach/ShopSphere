import express from "express";
import { adminRoute, protectedRoute } from "../middleware/auth.middleware";
import {
  getAnalyticsData,
  getDailySalesData,
} from "../controllers/analytics.controller.js";

const analyticsRouter = express.Router();

analyticsRouter.get("/", protectedRoute, adminRoute, async (req, res) => {
  try {
    const analyticsData = await getAnalyticsData();
    const endDate = new Date();
    const startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000);

    const dailyData = await getDailySalesData(startDate, endDate);
    res.status(200).json({
      message: "Analytics data fetched successfully",
      data: {
        analyticsData,
        dailyData,
        startDate,
        endDate,
      },
    });
  } catch (error) {
    console.error("Error fetching analytics data:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
});

export default analyticsRouter;
