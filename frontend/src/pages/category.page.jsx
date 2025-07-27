import { Link, useParams } from "react-router-dom";
import { useProductStore } from "../stores/product.store.js";
import { useEffect } from "react";

import { motion } from "framer-motion";
import ProductCard from "../components/product.card.jsx";
import { ChevronRight, Loader } from "lucide-react";

export default function CategoryPage() {
  const { fetchByCategory, products, fetchingProducts } = useProductStore();

  const { category } = useParams();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    fetchByCategory(category.toLowerCase());
  }, [fetchByCategory, category]);

  // if (true)
  //   return (
  //     <div className="flex items-center justify-center w-full h-full p-6 bg-amber-200">
  //       <Loader className="animate-spin text-emerald-500 w-6 h-6" />
  //     </div>
  //   );

  return (
    <div className="min-h-screen">
      <div className="relative z-10 max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-16 ">
        <nav className="flex items-center text-sm text-gray-400 mb-4">
          <Link to="/" className="text-emerald-500 hover:underline">
            Home
          </Link>
          <ChevronRight className="mx-2 h-4 w-4 text-gray-500" />
          <span className="text-gray-300">{category}</span>
        </nav>
        <motion.h1
          className="text-center text-4xl sm:text-5xl font-bold text-emerald-400 mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {category.charAt(0).toUpperCase() + category.slice(1)}
        </motion.h1>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {fetchingProducts ? (
            <div className="flex items-center justify-center w-full h-60 col-span-full">
              <Loader className="animate-spin text-emerald-500 w-6 h-6" />
            </div>
          ) : products?.length > 0 ? (
            products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))
          ) : (
            <h2 className="text-3xl font-semibold text-gray-300 text-center col-span-full">
              No product found
            </h2>
          )}
        </motion.div>
      </div>
    </div>
  );
}
