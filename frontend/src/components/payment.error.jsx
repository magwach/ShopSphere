import { ArrowLeft, RefreshCw, ShoppingCart, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCartStore } from "../stores/cart.store.js";

export default function PaymentError({ type }) {
  const { handlePayment } = useCartStore();

  const navigate = useNavigate();

  const handleRetryPayment = () => {
    handlePayment(true);
  };

  const handleContinueShopping = () => {
    navigate("/");
  };

  const handleViewCart = () => {
    navigate("/cart");
  };
  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.3)_0%,rgba(10,80,60,0.2)_45%,rgba(0,0,0,0.1)_100%)] flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-black/20 bg-opacity-10 backdrop-blur-lg rounded-2xl p-8 border border-emerald-500 border-opacity-20 shadow-2xl">
          <div className="text-center mb-8">
            <div className="relative mb-6">
              <div className="w-24 h-24 mx-auto bg-red-500 bg-opacity-20 rounded-full flex items-center justify-center mb-4">
                <XCircle className="w-12 h-12 text-red-400" />
              </div>
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-24 h-24 border-2 border-red-400 border-opacity-30 rounded-full animate-ping"></div>
            </div>

            <div className="mb-6">
              <h1 className="text-2xl font-bold text-white mb-2">
                Shop<span className="text-emerald-400">Sphere</span>
              </h1>
            </div>

            <h2 className="text-3xl font-bold text-white mb-4">
              {type === "cancel" ? "Payment Cancelled" : "Payment Failed"}
            </h2>
            <p className="text-gray-300 text-lg mb-2">
              {type === "cancel"
                ? "Your purchase has been cancelled and no payment was processed."
                : "An error occurred while processing your payment"}
            </p>
            <p className="text-gray-400">
              Don't worry - your items are still saved in your cart!
            </p>
          </div>

          <div className="space-y-4 mb-8">
            <button
              onClick={handleRetryPayment}
              className="w-full flex items-center justify-center gap-3 bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-4 rounded-lg font-semibold transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg"
            >
              <RefreshCw className="w-5 h-5" />
              Try Payment Again
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={handleViewCart}
                className="flex items-center justify-center gap-2 bg-transparent border-2 border-emerald-400 text-emerald-400 hover:bg-emerald-400 hover:text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-[1.02]"
              >
                <ShoppingCart className="w-5 h-5" />
                View Cart
              </button>

              <button
                onClick={handleContinueShopping}
                className="flex items-center justify-center gap-2 bg-transparent border-2 border-gray-500 text-gray-300 hover:bg-gray-500 hover:text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-[1.02]"
              >
                <ArrowLeft className="w-5 h-5" />
                Continue Shopping
              </button>
            </div>
          </div>
        </div>

        <div className="absolute top-10 left-10 w-4 h-4 bg-red-400 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-6 h-6 bg-emerald-300 rounded-full opacity-20 animate-bounce"></div>
        <div className="absolute top-1/4 right-20 w-3 h-3 bg-emerald-500 rounded-full opacity-30 animate-ping"></div>
        <div className="absolute bottom-1/4 left-20 w-5 h-5 bg-gray-500 rounded-full opacity-15 animate-pulse"></div>
      </div>
    </div>
  );
}
