import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import axios from "../lib/axios.js";
import { Users, Package, ShoppingCart, DollarSign, Loader } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import AnalyticsCard from "./analytics.card.jsx";

export default function AnalyticsTab() {
  const [analyticsData, setAnalyticsData] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalSales: 0,
    totalRevenue: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [dailyData, setDailyData] = useState([]);
  const [chartHeight, setChartHeight] = useState(400);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        const response = await axios.get("/analytics");
        setAnalyticsData(response.data.data.analyticsData);
        setDailyData(response.data.data.dailyData);
      } catch (error) {
        console.error("Error fetching analytics data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAnalyticsData();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const screenWidth = window.innerWidth;
      if (screenWidth < 480) {
        setChartHeight(250);
      } else if (screenWidth < 768) {
        setChartHeight(300);
      } else {
        setChartHeight(400);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (isLoading)
    return (
      <div className="flex items-center justify-center w-full h-full p-6">
        <Loader className="animate-spin text-emerald-500 w-6 h-6" />
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <AnalyticsCard
          title="Total Users"
          value={analyticsData.totalUsers.toLocaleString()}
          Icon={Users}
          color="from-emerald-500 to-teal-700"
        />
        <AnalyticsCard
          title="Total Products"
          value={analyticsData.totalProducts.toLocaleString()}
          Icon={Package}
          color="from-emerald-500 to-green-700"
        />
        <AnalyticsCard
          title="Total Sales"
          value={analyticsData.totalSales.toLocaleString()}
          Icon={ShoppingCart}
          color="from-emerald-500 to-cyan-700"
        />
        <AnalyticsCard
          title="Total Revenue"
          value={`Ksh ${analyticsData.totalRevenue.toLocaleString()}`}
          Icon={DollarSign}
          color="from-emerald-500 to-lime-700"
        />
      </div>
      <motion.div
        className="bg-gray-800/60 rounded-lg p-6 shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.25 }}
      >
        <ResponsiveContainer width="100%" height={chartHeight}>
          <LineChart
            data={dailyData}
            margin={{ top: 20, right: 40, left: 40, bottom: 50 }} // more breathing room
          >
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis
              dataKey="date"
              stroke="#D1D5DB"
              label={{
                value: "Date",
                position: "bottom",
                dy: 25, // push down label
                fill: "#10B981",
                fontSize: chartHeight < 300 ? 10 : 12,
              }}
              tick={{ fontSize: chartHeight < 300 ? 10 : 12, fill: "#D1D5DB" }}
            />

            <YAxis
              yAxisId="left"
              stroke="#D1D5DB"
              label={{
                value: "Sales",
                angle: -90,
                position: "outsideLeft",
                dx: -30, // pull left
                fill: "#10B981",
                fontSize: chartHeight < 300 ? 10 : 12,
              }}
              tick={{ fontSize: chartHeight < 300 ? 10 : 12, fill: "#D1D5DB" }}
            />

            <YAxis
              yAxisId="right"
              orientation="right"
              stroke="#D1D5DB"
              label={{
                value: "Revenue (KES)",
                angle: 90,
                position: "outsideRight",
                dx: 30, // pull right
                fill: "#10B981",
                fontSize: chartHeight < 300 ? 10 : 12,
              }}
              tick={{ fontSize: chartHeight < 300 ? 10 : 12, fill: "#D1D5DB" }}
            />

            <Tooltip
              wrapperStyle={{ fontSize: 12 }}
              contentStyle={{
                backgroundColor: "#1F2937",
                borderColor: "#10B981",
              }}
              labelStyle={{ color: "#10B981" }}
            />
            <Legend
              wrapperStyle={{
                fontSize: 12,
                bottom: 0,
                right: 30,
                paddingTop: 20,
                position: "absolute",
              }}
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="sales"
              stroke="#10B981"
              activeDot={{ r: 5 }}
              name="Sales"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="revenue"
              stroke="#3B82F6"
              activeDot={{ r: 5 }}
              name="Revenue"
            />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
}
