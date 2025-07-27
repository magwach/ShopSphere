import Order from "../models/order.model.js";
import User from "../models/user.model.js";

function getRangeDates(start, end) {
  const dates = [];

  let currentDate = new Date(start);
  const endDate = new Date(end);
  while (currentDate <= endDate) {
    dates.push(currentDate.toISOString().split("T")[0]);
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return dates;
}

export async function getAnalyticsData() {
  try {
    const totalUsers = await User.countDocuments();
    const totalProducts = await User.countDocuments();

    const salesData = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalSales: { $sum: 1 },
          totalRevenue: { $sum: "$totalAmount" },
        },
      },
    ]);

    const { totalSales, totalRevenue } = salesData[0] || {
      totalSales: 0,
      totalRevenue: 0,
    };
    return {
      totalUsers,
      totalProducts,
      totalSales,
      totalRevenue,
    };
  } catch (error) {
    console.error("Error fetching analytics data:", error);
    throw new Error("Failed to fetch analytics data");
  }
}

export async function getDailySalesData(startDate, endDate) {
  try {
    const dailySalesData = await Order.aggregate([
      {
        $match: {
          createdAt: {
            $gt: startDate,
            $lt: endDate,
          },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          sales: { $sum: 1 },
          revenue: { $sum: "$totalAmount" },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    const dateRange = getRangeDates(startDate, endDate);

    return dateRange.map((date) => {
      const dailyData = dailySalesData.find((data) => data._id === date);
      return {
        date,
        sales: dailyData ? dailyData.sales : 0,
        revenue: dailyData ? dailyData.revenue : 0,
      };
    });
  } catch (error) {
    console.error("Error fetching daily sales data:", error);
    throw new Error("Failed to fetch daily sales data");
  }
}
