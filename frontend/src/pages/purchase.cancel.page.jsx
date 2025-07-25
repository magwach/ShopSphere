import { useUserStore } from "../stores/user.store.js";
import ShopSphereSpinner from "../components/loading.jsx";
import PaymentError from "../components/payment.error.jsx";

export default function PurchaseCancelPage() {
  const { authLoading, isAuthenticated } = useUserStore();

  if (authLoading || isAuthenticated === null) return <ShopSphereSpinner />;
  if (!isAuthenticated) {
    navigate("/login");
    return;
  }

  return <PaymentError type={"cancel"} />;
}
