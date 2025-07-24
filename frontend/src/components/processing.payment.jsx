import { Loader2 } from "lucide-react";

export default function PaymentLoader() {
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-center px-4">
      <div className="flex items-center justify-center gap-3 mb-4">
        <Loader2 className="w-6 h-6 text-emerald-400 animate-spin" />
        <span className="text-emerald-200 text-base font-medium">
          Processing your payment...
        </span>
      </div>
      <p className="text-gray-400 text-sm">
        Please do not refresh or close this page while we confirm your transaction.
      </p>
    </div>
  );
}
