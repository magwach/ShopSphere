import express from "express";
import {
  login,
  logout,
  signup,
  refreshToken,
  getProfile,
  verifyEmail,
  resendEmailCode,
  resetPasswordCode,
  verifyResetPasswordCode,
  resetPassword,
} from "../controllers/auth.controllers.js";
import { protectedRoute } from "../middleware/auth.middleware.js";

const authRouter = express.Router();

authRouter.post("/signup", signup);

authRouter.post("/login", login);

authRouter.post("/logout", logout);

authRouter.post("/verify-email-code", verifyEmail);

authRouter.post("/resend-verification-email", resendEmailCode);

authRouter.post("/send-password-reset-code", resetPasswordCode);

authRouter.post("/verify-password-reset-code", verifyResetPasswordCode);

authRouter.post("/reset-password", resetPassword);

authRouter.post("/refresh-token", refreshToken);

authRouter.get("/profile", protectedRoute, getProfile);

export default authRouter;
