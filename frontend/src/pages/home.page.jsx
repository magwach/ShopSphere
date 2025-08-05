import { Loader } from "lucide-react";
import CategoryItem from "../components/category.item.jsx";
import { useProductStore } from "../stores/product.store.js";
import { useEffect } from "react";
import ProductSlider from "../components/product.slider.jsx";
import { useUserStore } from "../stores/user.store.js";
import EmailVerificationPage from "../components/verify.email.jsx";
import TwoFactorAuthenticationPage from "../components/two.factor.auth.page.jsx";

export default function HomePage() {
  const { fetchFeaturedProducts, products, fetchingProducts } =
    useProductStore();
  const { user } = useUserStore();

  const categories = [
    { href: "/Jeans", name: "Jeans", imageUrl: "/jeans.jpeg" },
    { href: "/T-Shirts", name: "T-shirts", imageUrl: "/tshirts.jpeg" },
    { href: "/Shoes", name: "Shoes", imageUrl: "/shoes.jpeg" },
    { href: "/Glasses", name: "Glasses", imageUrl: "/glasses.jpeg" },
    { href: "/Jackets", name: "Jackets", imageUrl: "/jackets.jpeg" },
    { href: "/Suits", name: "Suits", imageUrl: "/suits.avif" },
    { href: "/Bags", name: "Bags", imageUrl: "/bags.jpeg" },
  ];

  useEffect(() => {
    fetchFeaturedProducts();
  }, [fetchFeaturedProducts]);

  if (user && !user.isVerified) {
    return <EmailVerificationPage />;
  }

    return (
      <div className="relative min-h-screen text-white overflow-hidden">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-center text-5xl sm:text-6xl font-bold text-emerald-400 mb-4">
            Explore Our Categories
          </h1>
          <p className="text-center text-xl text-gray-300 mb-12">
            Discover the latest trends in eco-friendly fashion
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category) => (
              <CategoryItem category={category} key={category.name} />
            ))}
          </div>
          <div className="flex flex-col items-center justify-center my-12 gap-4">
            <h2 className="text-2xl sm:text-3xl font-semibold text-emerald-400 mb-4">
              Featured Products
            </h2>

            {fetchingProducts ? (
              <Loader className="animate-spin text-emerald-500 w-6 h-6" />
            ) : products?.length > 0 ? (
              <ProductSlider Products={products} />
            ) : (
              <p className="text-center text-lg text-gray-300">
                No featured products available.
              </p>
            )}
          </div>
        </div>
      </div>
    );
}
