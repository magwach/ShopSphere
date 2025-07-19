import { motion } from "framer-motion";
import { useCartStore } from "../stores/cart.store.js";
import PeopleAlsoBought from "../components/people.also.bought.jsx";
import OrderSummary from "../components/order.summary.jsx";
import GiftCouponCard from "../components/gift.coupon.jsx";
import CartItem from "../components/cart.item.jsx";
import EmptyCartUI from "../components/empty.cart.jsx";
import { useEffect } from "react";
import { useUserStore } from "../stores/user.store.js";
import { useNavigate } from "react-router-dom";

export default function CartPage() {
  const { cart, getCartItems } = useCartStore();
  const { isAuthenticated, authLoading, user } = useUserStore();

  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated && !authLoading) {
      navigate("/login");
      return;
    } else {
      getCartItems();
    }
  }, []);
  return (
    <div className="py-8 md:py-16">
      <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
        <div className="mt-6 sm:mt-8 md:gap-6 lg:flex lg:items-start xl:gap-8">
          <motion.div
            className="mx-auto w-full flex-none lg:max-w-2xl xl:max-w-4xl"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {cart.length === 0 ? (
              <EmptyCartUI />
            ) : (
              <div className="space-y-6">
                {cart.map((item) => (
                  <CartItem key={item._id} item={item} />
                ))}
              </div>
            )}
            {cart.length > 0 && <PeopleAlsoBought />}
          </motion.div>

          {cart.length > 0 && (
            <motion.div
              className="mx-auto mt-6 max-w-4xl flex-1 space-y-6 lg:mt-0 lg:w-full"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <OrderSummary />
              <GiftCouponCard />
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
