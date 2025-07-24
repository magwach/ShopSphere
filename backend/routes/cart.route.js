import express from "express";
import {
  addToCart,
  deleteFromCart,
  getAllCartItems,
  updateQuantity,
  clearCart,
} from "../controllers/cart.controller.js";
import { protectedRoute } from "../middleware/auth.middleware.js";

const cartRouter = express.Router();

cartRouter.get("/", protectedRoute, getAllCartItems);
cartRouter.post("/", protectedRoute, addToCart);
cartRouter.delete("/", protectedRoute, deleteFromCart);
cartRouter.delete("/all", protectedRoute, clearCart);
cartRouter.put("/:id", protectedRoute, updateQuantity);

export default cartRouter;
