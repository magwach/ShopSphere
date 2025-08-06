import { motion } from "framer-motion";
import { ChevronRight, Loader } from "lucide-react";
import { useCartStore } from "../stores/cart.store.js";
import PeopleAlsoBought from "../components/people.also.bought.jsx";
import OrderSummary from "../components/order.summary.jsx";
import GiftCouponCard from "../components/gift.coupon.jsx";
import CartItem from "../components/cart.item.jsx";
import EmptyCartUI from "../components/empty.cart.jsx";
import { useUserStore } from "../stores/user.store.js";
import { useNavigate, Link } from "react-router-dom";
import ShopSphereSpinner from "../components/loading.jsx";

export default function CartPage() {
  const { cart, fetchingItems } = useCartStore();
  const { isAuthenticated, authLoading } = useUserStore();

  const navigate = useNavigate();

  console.log("cart");

  if (authLoading || isAuthenticated === null) return <ShopSphereSpinner />;
  if (!isAuthenticated) {
    navigate("/login?next=/cart");
    return;
  }

  return (
    <div className="py-8 md:py-16">
      <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
        <nav className="flex items-center text-sm text-gray-400 mb-4">
          <Link to="/" className="text-emerald-500 hover:underline">
            Home
          </Link>
          <ChevronRight className="mx-2 h-4 w-4 text-gray-500" />
          <span className="text-gray-300">Cart</span>
        </nav>
        <div className="mt-6 sm:mt-8 md:gap-6 lg:flex lg:items-start xl:gap-8">
          <motion.div
            className="mx-auto w-full flex-none lg:max-w-2xl xl:max-w-4xl"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {fetchingItems ? (
              <div className="flex items-center justify-center w-full h-60 col-span-full">
                <Loader className="animate-spin text-emerald-500 w-6 h-6" />
              </div>
            ) : cart.length === 0 ? (
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
