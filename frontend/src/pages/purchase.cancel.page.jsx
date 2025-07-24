import { useUserStore } from "../stores/user.store.js";
import ShopSphereSpinner from "../components/loading.jsx";
import { useNavigate } from "react-router-dom";

export default function PurchaseCancelPage() {
  const { authLoading, isAuthenticated } = useUserStore();

  const navigate = useNavigate();

  if (authLoading || isAuthenticated === null) return <ShopSphereSpinner />;
  if (!isAuthenticated) {
    navigate("/login");
    return;
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      Purchase Cancelled Page
    </div>
  );
}
