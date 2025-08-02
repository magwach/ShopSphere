import redis from "../db/redis.js";
import stripe from "../lib/stripe.js";
import Coupon from "../models/coupon.model.js";
import Order from "../models/order.model.js";
import createDBCoupon from "../utils/create.db.coupon.js";
import createStripeCoupon from "../utils/create.stripe.coupon.js";
import createRandomCode from "../utils/create.random.code.js";

export async function createCheckOutSession(req, res) {
  try {
    let { products, couponCode, retry } = req.body;

    if (retry) {
      products = JSON.parse(
        await redis.get(`checkout_session_products_${req.user._id}`)
      );
      couponCode = JSON.parse(
        await redis.get(`checkout_session_coupon_${req.user._id}`)
      );

      if (products === null && couponCode === null) {
        return res.status(200).json({
          success: false,
          message: "No previous checkout session found",
        });
      }
    }

    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Products are invalid or empty",
      });
    }

    let totalAmount = 0;

    const lineItems = products.map((item) => {
      const product = item.product;
      const amount = Math.round(product.price * 100);

      totalAmount += amount * product.quantity;

      return {
        price_data: {
          currency: "kes",
          product_data: {
            name: product.name,
            images: [product.image],
          },
          unit_amount: amount,
        },
        quantity: item.quantity,
      };
    });

    let coupon = null;

    if (couponCode) {
      coupon = await Coupon.findOne({
        code: couponCode,
        isActive: true,
        userId: req.user._id,
      });
      totalAmount -= Math.round(
        (totalAmount * coupon.discountPercentage) / 100
      );
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/purchase-cancelled`,
      discounts: coupon
        ? [
            {
              coupon: await createStripeCoupon(coupon.discountPercentage),
            },
          ]
        : [],
      metadata: {
        userId: req.user._id.toString(),
        couponId: coupon ? coupon._id.toString() : null,
        products: JSON.stringify(
          products.map((p) => {
            return {
              id: p.product._id,
              quantity: p.quantity,
              name: p.product.name,
              price: p.product.price,
            };
          })
        ),
      },
    });

    if (totalAmount >= 20000) {
      await createDBCoupon(req.user._id);
    }

    await redis.set(
      `checkout_session_products_${req.user._id}`,
      JSON.stringify(products, couponCode)
    );
    await redis.set(
      `checkout_session_coupon_${req.user._id}`,
      JSON.stringify(couponCode)
    );

    return res.status(200).json({
      success: true,
      message: "Checkout session created successfully",
      data: { sessionId: session.id, totalAmount: totalAmount / 100 },
    });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
}

export async function checkoutSuccess(req, res) {
  const { sessionId } = req.body;

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Session not found",
      });
    }

    const existingOrder = await Order.findOne({ sessionId });
    if (existingOrder) {
      return res.status(200).json({
        success: true,
        message: "Order already exists",
        orderNumber: existingOrder.orderNumber,
      });
    }

    if (session.payment_status === "paid") {
      if (session.metadata.couponId) {
        const coupon = await Coupon.findOneAndUpdate(
          {
            _id: session.metadata.couponId,
            userId: session.metadata.userId,
          },
          { isActive: false },
          { new: true }
        );
      }
    }

    let created = false;
    let order = null;

    while (!created) {
      try {
        order = await Order.create({
          owner: session.metadata.userId,
          products: JSON.parse(session.metadata.products).map((p) => ({
            product: p.id,
            quantity: p.quantity,
            price: p.price,
          })),
          totalAmount: session.amount_total / 100,
          orderNumber: createRandomCode(),
          sessionId: session.id,
        });
        created = true;
      } catch (err) {
        if (err.code === 11000) {
          continue;
        }
        throw err;
      }
    }

    const orderNumber = order.orderNumber;

    await redis.del(`checkout_session_products_${session.metadata.userId}`);
    await redis.del(`checkout_session_coupon_${session.metadata.userId}`);

    return res.status(200).json({
      success: true,
      message: "Checkout successful",
      orderNumber,
    });
  } catch (error) {
    console.error("Error processing checkout:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
}

export async function cancelCheckout(req, res) {
  try {
    await redis.del(`checkout_session_products_${req.user._id}`);
    await redis.del(`checkout_session_coupon_${req.user._id}`);
    return res.status(200).json({
      success: true,
      message: "Checkout cancelled successfully",
    });
  } catch (error) {
    console.error("Error cancelling checkout:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
}
