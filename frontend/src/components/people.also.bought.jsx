import { useEffect, useState } from "react";
import axios from "../lib/axios";
import toast from "react-hot-toast";
import { Loader } from "lucide-react";
import ProductCard from "./product.card.jsx";

export default function PeopleAlsoBought() {
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const res = await axios.get("/products/recommended");
        setRecommendations(res?.data?.data);
      } catch (error) {
        toast.error(
          error.response.data.message ||
            "An error occurred while fetching recommendations"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  return isLoading ? (
    <Loader className="animate-spin text-emerald-500" />
  ) : (
    <div className="mt-8">
      <h3 className="text-2xl font-semibold text-emerald-400">
        People also bought
      </h3>
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg: grid-col-3">
        {recommendations.length > 0 ? (
          recommendations.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))
        ) : (
          <p className="text-gray-500">No recommendations available</p>
        )}
      </div>
    </div>
  );
}
