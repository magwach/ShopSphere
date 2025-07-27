import {
  BarChart,
  PlusCircle,
  ShoppingBasket,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

import AnalyticsTab from "../components/analytics.jsx";
import CreateProductForm from "../components/create.product.jsx";
import ProductsList from "../components/product.list.jsx";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useUserStore } from "../stores/user.store.js";

const tabs = [
  { id: "Create", label: "Create Product", icon: PlusCircle },
  { id: "Products", label: "Products", icon: ShoppingBasket },
  { id: "Analytics", label: "Analytics", icon: BarChart },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("Create");
  const { isAuthenticated, authLoading } = useUserStore();
  const navigate = useNavigate();
  useEffect(() => {
    if (!isAuthenticated && !authLoading) {
      navigate("/admin-login");
      return;
    }
  }, [isAuthenticated]);
  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="relative z-10 container mx-auto px-4 py-16">
        <nav className="flex items-center text-sm text-gray-400 mb-4">
          <Link to="/" className="text-emerald-500 hover:underline">
            Home
          </Link>
          <ChevronRight className="mx-2 h-4 w-4 text-gray-500" />
          <span className="text-gray-300">Admin</span>
          <ChevronRight className="mx-2 h-4 w-4 text-gray-500" />
          <span className="text-gray-300">{activeTab}</span>
        </nav>
        <motion.h1
          className="text-4xl font-bold mb-8 text-emerald-400 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Admin Dashboard
        </motion.h1>

        <div className="flex justify-center mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-4 py-2 mx-2 rounded-md transition-colors duration-200 cursor-pointer ${
                activeTab === tab.id
                  ? "bg-emerald-600 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              <tab.icon className="mr-2 h-5 w-5" />
              {tab.label}
            </button>
          ))}
        </div>
        {activeTab === "Create" && <CreateProductForm />}
        {activeTab === "Products" && <ProductsList />}
        {activeTab === "Analytics" && <AnalyticsTab />}
      </div>
    </div>
  );
}
