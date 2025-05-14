import React, { useEffect, useState } from "react";
import apiClient from "../../api/axios";
import { Clock, Bell, AlertCircle } from "lucide-react";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await apiClient.get("/user/fetchnotification", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (Array.isArray(res.data)) {
        setNotifications(res.data);
      } else if (Array.isArray(res.data.data)) {
        setNotifications(res.data.data);
      } else {
        setNotifications([]);
      }
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const formatDate = (dateString) => {
    const options = {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    };
    return new Date(dateString).toLocaleString(undefined, options);
  };

  return (
    <div className="px-6 sm:px-10 md:px-16 lg:px-20 pt-28 mb-20 min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : notifications.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Bell size={28} className="text-gray-400" />
            </div>
            <p className="text-gray-500 text-lg">
              You don't have any notifications yet
            </p>
            <p className="text-gray-400 text-sm mt-2">
              When you receive notifications, they will appear here
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((notif, index) => {
              // Calculate how recent the notification is
              const isRecent =
                new Date() - new Date(notif.createdAt) < 24 * 60 * 60 * 1000;

              return (
                <div
                  key={index}
                  className={`bg-white p-6 rounded-xl shadow-sm border transition-all ${
                    isRecent ? "border-blue-100" : "border-gray-100"
                  } hover:shadow-md`}
                >
                  <div className="flex items-start">
                    <div
                      className={`rounded-full p-2 mr-4 ${
                        isRecent ? "bg-blue-50" : "bg-gray-50"
                      }`}
                    >
                      {isRecent ? (
                        <AlertCircle size={20} className="text-blue-500" />
                      ) : (
                        <Bell size={20} className="text-gray-500" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-800 font-medium text-base">
                        {notif.message}
                      </p>
                      <div className="flex items-center text-sm text-gray-500 mt-2">
                        <Clock size={14} className="mr-1" />
                        <span>{formatDate(notif.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
