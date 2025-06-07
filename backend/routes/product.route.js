import express from "express";
import {
  getAllProducts,
  getAllFeturedProducts,
  createProduct,
  deleteProduct,
  getRecommendedProducts,
  getCategoryProducts,
} from "../controllers/product.controller.js";
import { adminRoute, protectedRoute } from "../middleware/auth.middleware.js";

const productRouter = express.Router();

productRouter.get("/", protectedRoute, adminRoute, getAllProducts);
productRouter.get("/featured", getAllFeturedProducts);
productRouter.get("/recommended", getRecommendedProducts);
productRouter.get("/category/:category", getCategoryProducts);
productRouter.post("/", protectedRoute, adminRoute, createProduct);
productRouter.delete("/delete/:id", protectedRoute, adminRoute, deleteProduct);

export default productRouter;
