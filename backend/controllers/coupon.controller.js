import Coupon from "../models/coupon.model.js";

export async function getCoupons(req, res) {
  try {
    const coupon = await Coupon.findOne({
      userId: req.user._id,
      isActive: true,
    });
    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "No active coupon found for this user",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Coupon fetched successfully",
      data: coupon,
    });
  } catch (error) {
    console.error("Error fetching coupon:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
}

export async function validateCoupon(req, res) {
  const { code } = req.body;
  try {
    const coupon = await Coupon.findOne({
      code: code,
      isActive: true,
      userId: req.user._id,
    });
    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found or inactive",
      });
    }
    if (coupon.expirationDate < new Date()) {
      coupon.isActive = false;
      await coupon.save();
      return res.status(400).json({
        success: false,
        message: "Coupon has expired",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Coupon is valid",
      data: coupon,
    });
  } catch (error) {
    console.error("Error validating coupon:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
}
