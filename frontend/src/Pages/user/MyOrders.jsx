import React, { useEffect, useState } from "react";
import apiClient from "../../api/axios";
import { toast } from "react-toastify";
import {
  Package,
  Calendar,
  Tag,
  CheckCircle,
  Clock,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  ShoppingBag,
  Star,
} from "lucide-react";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await apiClient.get("/order/getorder", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOrders(response.data || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to load your orders.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;

    try {
      const token = localStorage.getItem("token");
      await apiClient.put(
        `/order/cancelorder/${orderId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Order cancelled successfully!");
      fetchOrders(); // Refresh orders
    } catch (error) {
      console.error("Error cancelling order:", error);
      toast.error("Failed to cancel order.");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const toggleOrderExpansion = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "processing":
        return "bg-yellow-100 text-yellow-800";
      case "shipped":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-32 px-4 md:px-8 lg:px-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
            <p className="text-gray-500 mt-1">
              View and track your order history
            </p>
          </div>
          <button
            onClick={fetchOrders}
            className="flex items-center gap-2 bg-white text-gray-700 px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors shadow-sm"
          >
            <RefreshCw size={16} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="animate-spin mb-3">
              <RefreshCw size={32} className="text-blue-500" />
            </div>
            <p className="text-gray-600">Loading your orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
            <ShoppingBag size={48} className="text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No Orders Yet
            </h3>
            <p className="text-gray-600 mb-6">
              You haven't placed any orders yet.
            </p>
            <a
              href="/shop"
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg transition-colors"
            >
              Browse Books
            </a>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.orderId}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
              >
                {/* Order Header */}
                <div className="p-4 md:p-6 border-b border-gray-100">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-50 rounded-lg p-2">
                        <ShoppingBag size={20} className="text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Order ID</p>
                        <p className="font-medium text-gray-900">
                          #{order.orderId.slice(0, 8).toUpperCase()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 text-gray-500">
                        <Calendar size={16} />
                        <span className="text-sm">
                          {new Date(order.orderDate).toLocaleDateString(
                            "en-GB",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            }
                          )}
                        </span>
                      </div>
                      <div
                        className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status.toLowerCase() === "completed" ? (
                          <CheckCircle size={14} />
                        ) : (
                          <Clock size={14} />
                        )}
                        {order.status}

                        {["pending", "processing", "shipped"].includes(
                          order.status.toLowerCase()
                        ) && (
                          <button
                            onClick={() => handleCancelOrder(order.orderId)}
                            className="ml-3 text-red-600 hover:underline text-xs"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Preview Section */}
                <div
                  className="px-4 md:px-6 py-3 bg-gray-50 flex justify-between items-center cursor-pointer"
                  onClick={() => toggleOrderExpansion(order.orderId)}
                >
                  <div className="flex items-center">
                    <span className="text-gray-700 font-medium">
                      {order.orderItems.length}{" "}
                      {order.orderItems.length === 1 ? "item" : "items"}
                    </span>
                    <span className="mx-2 text-gray-400">•</span>
                    <span className="font-semibold text-gray-900">
                      ₹{order.finalAmount.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center text-blue-600 font-medium">
                    <span className="mr-1">
                      {expandedOrder === order.orderId
                        ? "Hide details"
                        : "View details"}
                    </span>
                    {expandedOrder === order.orderId ? (
                      <ChevronUp size={18} />
                    ) : (
                      <ChevronDown size={18} />
                    )}
                  </div>
                </div>

                {/* Expanded Content */}
                {expandedOrder === order.orderId && (
                  <div className="px-4 md:px-6 py-4 border-t border-gray-100">
                    <ul className="divide-y divide-gray-100 mb-4">
                      {order.orderItems.map((item) => (
                        <li
                          key={item.orderItemId}
                          className="py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
                        >
                          <div className="flex items-center gap-3">
                            {item.bookImage ? (
                              <img
                                src={item.bookImage}
                                alt={item.bookTitle}
                                className="w-12 h-16 object-cover rounded-md shadow-sm"
                              />
                            ) : (
                              <div className="w-12 h-16 bg-gray-100 rounded-md flex items-center justify-center">
                                <Package size={18} className="text-gray-400" />
                              </div>
                            )}
                            <div>
                              <p className="font-medium text-gray-800">
                                {item.bookTitle}
                              </p>
                              <p className="text-sm text-gray-500">
                                Quantity: {item.quantity}
                              </p>

                              {/* ⭐ Feedback Button (only if order is completed) */}
                              {order.status.toLowerCase() === "completed" && (
                                <a
                                  href={`/feedback/${item.bookId}`}
                                  className="inline-flex items-center gap-1 text-blue-600 text-sm hover:underline mt-1"
                                >
                                  <Star size={14} />
                                  Give Feedback
                                </a>
                              )}
                            </div>
                          </div>
                          <span className="font-medium text-gray-900">
                            ₹{item.pricePerUnit} each
                          </span>
                        </li>
                      ))}
                    </ul>

                    <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="text-gray-900">
                          ₹
                          {(
                            order.finalAmount /
                            (1 - order.discountRate)
                          ).toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <div className="flex items-center gap-1 text-green-600">
                          <Tag size={14} />
                          <span>
                            Discount ({Math.round(order.discountRate * 100)}%)
                          </span>
                        </div>
                        <span className="text-green-600">
                          -₹
                          {(
                            (order.finalAmount / (1 - order.discountRate)) *
                            order.discountRate
                          ).toFixed(2)}
                        </span>
                      </div>
                      <div className="pt-2 border-t border-gray-200 flex justify-between font-medium">
                        <span className="text-gray-800">Total</span>
                        <span className="text-lg text-gray-900">
                          ₹{order.finalAmount.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
