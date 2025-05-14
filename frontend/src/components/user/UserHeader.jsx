import React, { useEffect, useState } from "react";
import { FaShoppingCart, FaUserCircle } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import apiClient from "../../api/axios";

const UserHeader = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [announcement, setAnnouncement] = useState(null);
  const [showBanner, setShowBanner] = useState(true);
  const [searchTerm, setSearchTerm] = useState(""); // 🔍 new state for search
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  useEffect(() => {
    const fetchAnnouncement = async () => {
      try {
        const res = await apiClient.get("/announcement/getannouncementbyuser");
        const now = new Date();
        const active = res.data.find((a) => {
          const start = new Date(a.startTime);
          const end = new Date(a.endTime);
          return a.isActive && now >= start && now <= end;
        });
        if (active) setAnnouncement(active);
      } catch (err) {
        console.error("Failed to fetch announcement:", err);
      }
    };
    fetchAnnouncement();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) setShowBanner(false);
      else setShowBanner(true);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/auth");
  };

  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };

  const handleSearch = (e) => {
    if (e.key === "Enter" && searchTerm.trim() !== "") {
      navigate(`/search?query=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <>
      {/* Announcement Banner */}
      {announcement && showBanner && (
        <div className="fixed top-0 left-0 w-full bg-web-primary text-white py-3 px-4 z-[999] shadow-md">
          <div className="container mx-auto flex justify-between items-center">
            <div className="w-24 text-xs opacity-80">
              {new Date(announcement.startTime).toLocaleDateString()}
            </div>
            <p className="font-medium text-base text-center">
              <strong>{announcement.message}</strong>
            </p>
            <div className="w-24 text-right text-xs opacity-80">
              {new Date(announcement.endTime).toLocaleDateString()}
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header
        className={`fixed ${
          showBanner && announcement ? "top-12" : "top-0"
        } left-0 w-full z-50 bg-web-bgSoft px-6 py-4 flex justify-between items-center transition-all duration-300`}
      >
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <span className="text-4xl font-bold text-web-primary font-Cedarville Cursive" onClick={()=> navigate('/')}>
            BookStore
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex space-x-6 text-gray-700 font-medium">
          <Link to="/" className="hover:text-green-600">
            Home
          </Link>
          <Link to="/Browsebooks" className="hover:text-green-600">
            All Books
          </Link>
          <Link to="/SellerBest" className="hover:text-green-600">
            Best Sellers
          </Link>
          <Link to="/WinnerAward" className="hover:text-green-600">
            Award Winned
          </Link>
          <Link to="/ReleaseNew" className="hover:text-green-600">
            New Releases
          </Link>
          <Link to="/SoonComing" className="hover:text-green-600">
            New Arrivals
          </Link>
          <Link to="/Deals" className="hover:text-green-600">
            Deals
          </Link>
        </nav>

        {/* Right Controls */}
        <div className="flex items-center space-x-4 relative">
          {/* 🔍 Search Input */}
          <input
            type="text"
            placeholder="Search books..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleSearch}
            className="w-full max-w-md py-3 px-4 text-gray-700 text-sm bg-white border border-gray-200 rounded-xl outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 placeholder-gray-400"
          />

          {/* 🛒 Cart */}
          <Link to="/cart" className="relative">
            <FaShoppingCart className="text-xl text-gray-700" />
          </Link>

          {/* 👤 User Menu */}
          {isLoggedIn ? (
            <div className="relative">
              <button
                onClick={toggleDropdown}
                className="flex items-center space-x-1 text-green-600 font-semibold focus:outline-none"
              >
                <FaUserCircle className="text-xl" />
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-50">
                  <Link
                    to="/UserProfile"
                    onClick={() => setShowDropdown(false)}
                    className="block px-4 py-2 hover:bg-gray-100 text-sm text-gray-700"
                  >
                    My Profile
                  </Link>
                  <Link
                    to="/whitelist"
                    onClick={() => setShowDropdown(false)}
                    className="block px-4 py-2 hover:bg-gray-100 text-sm text-gray-700"
                  >
                    My Whitelist
                  </Link>
                  <Link
                    to="/MyOrders"
                    onClick={() => setShowDropdown(false)}
                    className="block px-4 py-2 hover:bg-gray-100 text-sm text-gray-700"
                  >
                    My Orders
                  </Link>
                  <Link
                    to="/Notifications"
                    onClick={() => setShowDropdown(false)}
                    className="block px-4 py-2 hover:bg-gray-100 text-sm text-gray-700"
                  >
                    Notifications
                  </Link>
                  <button
                    onClick={() => {
                      setShowDropdown(false);
                      handleLogout();
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-red-600"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/auth"
              className="bg-web-primary text-white px-4 py-2 rounded hover:bg-green-700 transition"
            >
              Login
            </Link>
          )}
        </div>
      </header>
    </>
  );
};

export default UserHeader;
