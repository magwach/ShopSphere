import express from "express";
import {
  login,
  logout,
  signup,
  refreshToken,
} from "../controllers/auth.controllers.js";

const authRouter = express.Router();

authRouter.post("/signup", signup);

authRouter.post("/login", login);

authRouter.post("/logout", logout);

authRouter.post("/refresh-token", refreshToken);

export default authRouter;
