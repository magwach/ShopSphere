import { useUserStore } from "../stores/user.store.js";
import ShopSphereSpinner from "../components/loading.jsx";
import { useNavigate } from "react-router-dom";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle,
  HandHeart,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Confetti from "react-confetti";
import { useCartStore } from "../stores/cart.store.js";

import PaymentLoader from "../components/processing.payment.jsx";
import PaymentError from "../components/payment.error.jsx";

export default function PurchaseSuccessPage() {
  const { authLoading, isAuthenticated } = useUserStore();

  const navigate = useNavigate();

  const { clearCart, processingPayment, paymentError, handlePaymentSuccess } =
    useCartStore();
  const [error, setError] = useState(false);

  useEffect(() => {
    const sessionId = new URLSearchParams(window.location.search).get(
      "session_id"
    );
    if (sessionId) {
      handlePaymentSuccess(sessionId);
    } else {
      setError(true);
    }
  }, [clearCart]);

  if (authLoading || isAuthenticated === null) return <ShopSphereSpinner />;

  if (!isAuthenticated) {
    navigate("/login");
    return;
  }

  if (processingPayment) return <PaymentLoader />;

  if (error)
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-center px-4">
        <div className="flex items-center justify-center gap-3 mb-4">
          <AlertTriangle className="w-6 h-6 text-red-500" />
          <h2 className="text-red-400 text-lg font-semibold">Error</h2>
        </div>
        <p className="text-gray-400 text-sm mb-6 max-w-sm">
          Session ID not found. Please try again later.
        </p>

        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
        >
          Continue Shopping
        </Link>
      </div>
    );

  if (paymentError) return <PaymentError />;

  return (
    <div className="h-screen flex items-center justify-center px-4">
      <Confetti
        width={window.innerWidth}
        height={window.innerHeight}
        gravity={0.1}
        style={{ zIndex: 99 }}
        numberOfPieces={700}
        recycle={false}
      />

      <div className="max-w-md w-full bg-gray-800 rounded-lg shadow-xl overflow-hidden relative z-10">
        <div className="p-6 sm:p-8">
          <div className="flex justify-center">
            <CheckCircle className="text-emerald-400 w-16 h-16 mb-4" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-center text-emerald-400 mb-2">
            Purchase Successful!
          </h1>

          <p className="text-gray-300 text-center mb-2">
            Thank you for your order. {"We're"} processing it now.
          </p>
          <p className="text-emerald-400 text-center text-sm mb-6">
            Check your email for order details and updates.
          </p>
          <div className="bg-gray-700 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Order number</span>
              <span className="text-sm font-semibold text-emerald-400">
                #12345
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Estimated delivery</span>
              <span className="text-sm font-semibold text-emerald-400">
                3-5 business days
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <button
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4
             rounded-lg transition duration-300 flex items-center justify-center"
            >
              <HandHeart className="mr-2" size={18} />
              Thanks for trusting us!
            </button>
            <Link
              to={"/"}
              className="w-full bg-gray-700 hover:bg-gray-600 text-emerald-400 font-bold py-2 px-4 
            rounded-lg transition duration-300 flex items-center justify-center"
            >
              Continue Shopping
              <ArrowRight className="ml-2" size={18} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
