import Coupon from "../models/coupon.model.js";

export default async function createDBCoupon(userId) {
  try {
    const newCoupon = await Coupon.create({
      userId,
      code:
        "DISCOUNT-COUPON" +
        Math.random().toString(36).substring(2, 15).toUpperCase(),
      discountPercentage: 10,
      expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });
    return newCoupon;
  } catch (error) {
    console.error("Error creating coupon:", error.message);
  }
}
