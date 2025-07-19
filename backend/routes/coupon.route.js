import express from "express";
import { protectedRoute } from "../middleware/auth.middleware.js";
import {
  getCoupons,
  validateCoupon,
} from "../controllers/coupon.controller.js";

const couponRouter = express.Router();

couponRouter.get("/", protectedRoute, getCoupons);
couponRouter.post("/validate", protectedRoute, validateCoupon);

export default couponRouter;
