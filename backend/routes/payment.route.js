import express from "express";
import { protectedRoute } from "../middleware/auth.middleware.js";
import {
  createCheckOutSession,
  checkoutSuccess,
  cancelCheckout,
} from "../controllers/payment.controller.js";

const paymentRouter = express.Router();

paymentRouter.post(
  "/create-checkout-session",
  protectedRoute,
  createCheckOutSession
);

paymentRouter.post("/checkout-success", protectedRoute, checkoutSuccess);
paymentRouter.post("/checkout-cancel", protectedRoute, cancelCheckout);

export default paymentRouter;
