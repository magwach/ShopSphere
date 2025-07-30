import { useEffect, useState } from "react";
import { Loader } from "lucide-react";
import { useCartStore } from "../stores/cart.store.js";
import ProductSlider from "./product.slider.jsx";

export default function PeopleAlsoBought() {
  const {
    recommendations,
    fetchRecommendations,
    recommendationsLoading: isLoading,
  } = useCartStore();

  useEffect(() => {
    fetchRecommendations();
  }, []);

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold text-emerald-500 text-center">
        People Also Bought
      </h2>

      {isLoading ? (
        <div className="flex justify-center items-center h-48">
          <Loader className="animate-spin text-emerald-500 w-6 h-6" />
        </div>
      ) : recommendations.length > 0 ? (
        <ProductSlider Products={recommendations} />
      ) : (
        <div className="flex justify-center items-center h-48">
          <p className="text-gray-500 text-sm">No recommendations available</p>
        </div>
      )}
    </div>
  );
}
