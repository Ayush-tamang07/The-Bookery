import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../../api/axios";
import { toast } from "react-toastify";
import {
  FaCheck,
  FaShippingFast,
  FaSpinner,
  FaChevronDown,
  FaChevronUp,
  FaSearch,
  FaDownload,
  FaFilter,
} from "react-icons/fa";

function OrderContent() {
  const [expandedOrders, setExpandedOrders] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [orders, setOrders] = useState([]);
  const [claimCode, setClaimCode] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  const toggleOrderDetails = (orderId) => {
    setExpandedOrders((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };


  const handleSubmitClaimCode = async () => {
    try {
      const token = localStorage.getItem("token");
      await apiClient.post(
        "/staff/verify-claim-code",
        { claimCode: claimCode.trim() },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Claim code verified successfully!");
    } catch (error) {
      console.error("Verification failed:", error);
      toast.error("Failed to verify claim code. Please try again.");
    } finally {
      setShowPopup(false);
      setClaimCode("");
    }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await apiClient.get("/order/getallorder", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = response?.data;
        if (Array.isArray(data)) {
          setOrders(data);
        } else {
          console.error("Expected 'data' to be an array, but got:", data);
          setOrders([]);
        }
      } catch (error) {
        console.error("Failed to fetch orders", error);
      }
    };

    fetchOrders();
  }, []);

  const filterOptions = ["All", "Completed", "Pending"];

  const filteredOrders = orders.filter((order) => {
    // Filter by status
    if (selectedFilter !== "All" && order.status !== selectedFilter) {
      return false;
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        order.orderId.toLowerCase().includes(query) ||
        order.username.toLowerCase().includes(query) ||
        order.userId.toLowerCase().includes(query)
      );
    }

    return true;
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case "Completed":
        return <FaCheck className="text-green-500" />;
      case "Shipped":
        return <FaShippingFast className="text-blue-500" />;
      case "Processing":
        return <FaSpinner className="text-yellow-500" />;
      default:
        return null;
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-700 border-green-200";
      case "Shipped":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "Processing":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "Pending":
        return "bg-gray-100 text-gray-700 border-gray-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      {/* Filters and Search */}
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
          <div className="flex items-center">
            <div className="relative rounded-md shadow-sm">
              <button
                className="inline-flex items-center px-5 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={() => setShowPopup(true)}
              >
                Verify
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className="flex items-center">
              <FaFilter className="text-gray-400 mr-2" />
              <span className="text-sm text-gray-600 mr-2">Status:</span>
            </div>
            <div className="inline-flex shadow-sm rounded-md">
              {filterOptions.map((filter) => (
                <button
                  key={filter}
                  className={`px-4 py-1 text-sm ${
                    selectedFilter === filter
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  } border border-gray-300 first:rounded-l-md last:rounded-r-md -ml-px first:ml-0`}
                  onClick={() => setSelectedFilter(filter)}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Order ID
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Customer
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Date
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Discount
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Total
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <React.Fragment key={order.orderId}>
                  <tr className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {order.orderId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {order.username}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {order.orderDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusClass(
                          order.status
                        )}`}
                      >
                        <span className="mr-1">
                          {getStatusIcon(order.status)}
                        </span>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {order.discountRate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {order.finalAmount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        onClick={() => toggleOrderDetails(order.orderId)}
                      >
                        {expandedOrders[order.orderId]
                          ? "Hide Details"
                          : "View Details"}
                        {expandedOrders[order.orderId] ? (
                          <FaChevronUp className="ml-1.5 text-xs" />
                        ) : (
                          <FaChevronDown className="ml-1.5 text-xs" />
                        )}
                      </button>
                    </td>
                  </tr>
                  {expandedOrders[order.orderId] && (
                    <tr>
                      <td colSpan="7" className="px-6 py-4 bg-gray-50">
                        <div className="border-l-4 border-blue-500 pl-4">
                          <h4 className="text-sm font-medium text-gray-900 mb-3">
                            Order Items
                          </h4>
                          <div className="space-y-3">
                            {order.orderItems.map((item) => (
                              <div
                                key={item.orderItemId}
                                className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"
                              >
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                  <div>
                                    <p className="text-xs text-gray-500 mb-1">
                                      Order Item ID
                                    </p>
                                    <p
                                      className="text-sm font-medium text-gray-900 truncate"
                                      title={item.orderItemId}
                                    >
                                      {item.orderItemId}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-gray-500 mb-1">
                                      Book Title
                                    </p>
                                    <p className="text-sm font-medium text-gray-900">
                                      {item.bookTitle}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-gray-500 mb-1">
                                      Quantity
                                    </p>
                                    <p className="text-sm font-medium text-gray-900">
                                      {item.quantity}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-gray-500 mb-1">
                                      Price Per Unit
                                    </p>
                                    <p className="text-sm font-medium text-gray-900">
                                      ${item.pricePerUnit.toFixed(2)}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="px-6 py-12 text-center">
                  <p className="text-gray-500 text-sm">
                    No orders found matching your criteria
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing <span className="font-medium">{filteredOrders.length}</span>{" "}
            of <span className="font-medium">{orders.length}</span> orders
          </div>
          <div className="flex space-x-1">
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
              Previous
            </button>
            <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
              1
            </button>
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
              Next
            </button>
          </div>
        </div>
      </div>
      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Enter Claim Code
            </h3>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Claim Code"
              value={claimCode}
              onChange={(e) => setClaimCode(e.target.value)}
            />
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={() => setShowPopup(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitClaimCode}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Verify
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default OrderContent;
