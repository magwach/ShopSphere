import stripe from "../lib/stripe.js";
import Coupon from "../models/coupon.model.js";
import Order from "../models/order.model.js";
import createDBCoupon from "../utils/create.db.coupon.js";
import createStripeCoupon from "../utils/create.stripe.coupon.js";

export async function createCheckOutSession(req, res) {
  try {
    const { products, couponCode } = req.body;

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
          currency: "usd",
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
      cancel_url: `${process.env.CLIENT_URL}/parchase-cancelled`,
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
              id: p._id,
              quantity: p.quantity,
              name: p.name,
            };
          })
        ),
      },
    });

    if (totalAmount >= 20000) {
      await createDBCoupon(req.user._id);
    }

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
  const { session_id } = req.body;
  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);
    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Session not found",
      });
    }

    if (session.payment_status === "paid") {
      if (session.metadata.couponId) {
        const coupon = await Coupon.findByIdAndUpdate(
          {
            code: session.metadata.couponId,
            userId: session.metadata.userId,
          },
          { isActive: false },
          { new: true }
        );
      }
    }

    await Order.create({
      owner: session.metadata.userId,
      products: JSON.parse(session.metadata.products).map((p) => {
        return {
          product: p.id,
          quantity: p.quantity,
          price: p.price,
        };
      }),
      totalAmount: session.amount_total / 100,
      stripeSessionId: session.id,
    });

    return res.status(200).json({
      success: true,
      message: "Checkout successful",
      data: session,
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
