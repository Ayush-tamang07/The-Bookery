import React, { useState, useEffect } from 'react';
import { FaBook, FaShoppingCart, FaUsers, FaChartBar, FaDollarSign, FaBox, FaClipboardCheck } from 'react-icons/fa';
import apiClient from "../../api/axios";


// Enhanced StatCard component
const StatCard = ({ title, value, icon, color }) => {
  // Map color names to Tailwind classes
  const colorClasses = {
    blue: "bg-blue-50 text-blue-700 border-blue-200",
    indigo: "bg-indigo-50 text-indigo-700 border-indigo-200",
    green: "bg-green-50 text-green-700 border-green-200",
    orange: "bg-amber-50 text-amber-700 border-amber-200",
    purple: "bg-purple-50 text-purple-700 border-purple-200",
    red: "bg-red-50 text-red-700 border-red-200",
    gray: "bg-gray-50 text-gray-700 border-gray-200"
  };

  const colorClass = colorClasses[color] || colorClasses.blue;

  return (
    <div className={`rounded-xl border ${colorClass} p-6 flex items-center shadow-sm transition-all hover:shadow-md`}>
      <div className={`rounded-full p-3 mr-4 ${colorClass}`}>
        {icon}
      </div>
      <div>
        <h3 className="text-sm font-medium opacity-80">{title}</h3>
        <p className="text-2xl font-semibold mt-1">{value}</p>
      </div>
    </div>
  );
};

function DashboardContent() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await apiClient.get("/dashboard/getdata", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("Dashboard response:", response.data);
        setDashboardData(response.data);
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const latestOrders = dashboardData?.latestOrders || [];

  // No orders message component
  const NoOrdersMessage = () => (
    <tr>
      <td colSpan="4" className="py-8 text-center text-gray-500">
        <div className="flex flex-col items-center">
          <FaShoppingCart className="text-gray-300 mb-3" size={32} />
          <p>No recent orders to display</p>
        </div>
      </td>
    </tr>
  );

  if (loading) {
    return <div className="text-center py-10 text-gray-500">Loading dashboard...</div>;
  }

  return (
    <div className="px-6 py-4">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Total Users" 
          value={dashboardData?.totalUsers || 0} 
          icon={<FaUsers size={22} />} 
          color="blue" 
        />
        <StatCard 
          title="Total Staff" 
          value={dashboardData?.totalStaff || 0} 
          icon={<FaUsers size={22} />} 
          color="indigo" 
        />
        <StatCard 
          title="Total Books" 
          value={dashboardData?.totalBooks || 0} 
          icon={<FaBook size={22} />} 
          color="green" 
        />
        <StatCard 
          title="Total Revenue" 
          value={`$${dashboardData?.totalRevinew?.toFixed(2) || "0.00"}`} 
          icon={<FaDollarSign size={22} />} 
          color="purple" 
        />
      </div>

      {/* Order Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard 
          title="Pending Orders" 
          value={dashboardData?.totalPendingOrder || 0} 
          icon={<FaShoppingCart size={22} />} 
          color="orange" 
        />
        <StatCard 
          title="Completed Orders" 
          value={dashboardData?.totalCompletedOrder || 0} 
          icon={<FaClipboardCheck size={22} />} 
          color="green" 
        />
        <StatCard 
          title="Out of Stock" 
          value={dashboardData?.outOfStock || 0} 
          icon={<FaBox size={22} />} 
          color="red" 
        />
      </div>

      {/* Orders Table */}
      <div className="grid grid-cols-1 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-800">Recent Orders</h2>
            {/* {latestOrders.length > 0 && (
              <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                View All
              </button>
            )} */}
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Order Date</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Customer</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Total</th>
                </tr>
              </thead>
              <tbody>
                {latestOrders.length > 0 ? latestOrders.map((order, index) => (
                  <tr 
                    key={index} 
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-4 px-4 text-sm">
                      {new Date(order.orderDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                    <td className="py-4 px-4 text-sm">
                      <div className="font-medium">{order.username}</div>
                      <div className="text-gray-500 text-xs">{order.email}</div>
                    </td>
                    <td className="py-4 px-4 text-sm">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        order.status === "Pending"
                          ? "bg-amber-100 text-amber-800"
                          : order.status === "Completed"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-sm font-medium">${order.finalAmount.toFixed(2)}</td>
                  </tr>
                )) : (
                  <NoOrdersMessage />
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardContent;