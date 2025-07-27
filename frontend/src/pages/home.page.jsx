import CategoryItem from "../components/category.item.jsx";

export default function HomePage() {
  const categories = [
    { href: "/Jeans", name: "Jeans", imageUrl: "/jeans.jpeg" },
    { href: "/T-Shirts", name: "T-shirts", imageUrl: "/tshirts.jpeg" },
    { href: "/Shoes", name: "Shoes", imageUrl: "/shoes.jpeg" },
    { href: "/Glasses", name: "Glasses", imageUrl: "/glasses.jpeg" },
    { href: "/Jackets", name: "Jackets", imageUrl: "/jackets.jpeg" },
    { href: "/Suits", name: "Suits", imageUrl: "/suits.avif" },
    { href: "/Bags", name: "Bags", imageUrl: "/bags.jpeg" },
  ];
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
      </div>
    </div>
  );
}
