import express from "express";
import {
  getAllProducts,
  getAllFeturedProducts,
  createProduct,
  deleteProduct,
  getRecommendedProducts,
  getCategoryProducts,
  toggleFeaturedProduct,
} from "../controllers/product.controller.js";
import { adminRoute, protectedRoute } from "../middleware/auth.middleware.js";

const productRouter = express.Router();

productRouter.get("/", protectedRoute, adminRoute, getAllProducts);
productRouter.get("/featured", getAllFeturedProducts);
productRouter.get("/recommended",protectedRoute, getRecommendedProducts);
productRouter.get("/category/:category", getCategoryProducts);
productRouter.patch(
  "/:id/toggle-featured",
  protectedRoute,
  adminRoute,
  toggleFeaturedProduct
);
productRouter.post("/", protectedRoute, adminRoute, createProduct);
productRouter.delete("/:id", protectedRoute, adminRoute, deleteProduct);

export default productRouter;
