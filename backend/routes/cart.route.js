import express from "express";
import { addToCart, deleteFromCart, getAllCartItems, updateQuantity } from "../controllers/cart.controller.js";
import { protectedRoute } from "../middleware/auth.middleware.js";

const cartRouter = express.Router();

cartRouter.get("/", protectedRoute, getAllCartItems);
cartRouter.post("/", protectedRoute, addToCart);
cartRouter.delete("/", protectedRoute, deleteFromCart);
cartRouter.put("/:id", protectedRoute, updateQuantity);

export default cartRouter;
 