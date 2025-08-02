import express from "express";
import {
  login,
  logout,
  signup,
  refreshToken,
  getProfile,
  verifyEmail,
  resendCode,
} from "../controllers/auth.controllers.js";
import { protectedRoute } from "../middleware/auth.middleware.js";

const authRouter = express.Router();

authRouter.post("/signup", signup);

authRouter.post("/login", login);

authRouter.post("/logout", logout);

authRouter.post("/verify-email", verifyEmail);

authRouter.post("/resend-verification-email", resendCode);

authRouter.post("/refresh-token", refreshToken);

authRouter.get("/profile", protectedRoute, getProfile);

export default authRouter;
