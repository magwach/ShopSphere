import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

export async function protectedRoute(req, res, next) {
  try {
    const accessToken = req.cookies.accessToken;
    if (!accessToken) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized - No access token" });
    }
    try {
      const decoded = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET);
      const userId = decoded.id;

      const user = await User.findById(userId);
      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }
      req.user = user;
    } catch (error) {
      console.error("JWT verification failed:", error);
      return res.status(401).json({
        success: false,
        message: "Invalid or expired access token",
      });
    }

    next();
  } catch (error) {
    console.error("Error in protected route middleware:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
}

export function adminRoute(req, res, next) {
  try {
    if (req.user && req.user.role === "admin") {
      next();
    } else {
      return res.status(403).json({
        success: false,
        message: "Forbidden - Admin access required",
      });
    }
  } catch (error) {
    console.error("Error in admin route middleware:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
}
