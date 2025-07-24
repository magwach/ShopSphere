import { AlertTriangle } from "lucide-react";
import { useCartStore } from "../stores/cart.store.js";
import { Link } from "react-router-dom";

export default function PaymentError({
  message = "Something went wrong while processing your payment. Please try again or contact support if the problem persists.",
}) {
  const { handlePayment } = useCartStore();
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-center px-4">
      <div className="flex items-center justify-center gap-3 mb-4">
        <AlertTriangle className="w-6 h-6 text-red-500" />
        <h2 className="text-red-400 text-lg font-semibold">Payment Failed</h2>
      </div>
      <p className="text-gray-400 text-sm mb-6 max-w-sm">{message}</p>

      {message !== "Session ID not found. Please try again later." ? (
        <button
          className="inline-flex items-center gap-2 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
          onClick={() => handlePayment(true)}
        >
          Try Again
        </button>
      ) : (
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
        >
          Continue Shopping
        </Link>
      )}
    </div>
  );
}
