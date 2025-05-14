import React from "react";
import { Link, useLocation } from "react-router-dom";
import { MdDashboard, MdCampaign } from "react-icons/md";
import { FaBook } from "react-icons/fa";
import { GrCart } from "react-icons/gr";
import { HiUserGroup } from "react-icons/hi";
import { FiLogOut } from "react-icons/fi";
import { FaChartBar, FaUserCircle } from "react-icons/fa";

function SideBar() {
  const location = useLocation();
  const currentPath = location.pathname;
  const role = localStorage.getItem("role");

  const isActive = (path) => currentPath === path;

  const linkClasses = (path) =>
    `flex items-center space-x-4 p-2 rounded-lg transition-colors font-medium ${
      isActive(path)
        ? "bg-blue-100 text-blue-600"
        : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
    }`;

  return (
    <nav className="bg-white h-full flex flex-col">
      <div className="p-6 border-b border-gray-100">
        <h1 className="text-2xl font-bold text-gray-800">Bookery</h1>
      </div>

      <div className="flex-grow p-4 space-y-6 mt-4">
        {role === "Admin" && (
          <>
            <Link to="/admin" className={linkClasses("/admin")}>
              <MdDashboard className="text-xl" />
              <span>Dashboard</span>
            </Link>

            <Link to="/admin/book" className={linkClasses("/admin/book")}>
              <FaBook className="text-xl" />
              <span>Books</span>
            </Link>

            <Link to="/admin/announcement" className={linkClasses("/admin/announcement")}>
              <MdCampaign className="text-xl" />
              <span>Announcements</span>
            </Link>

            <Link to="/admin/orders" className={linkClasses("/admin/orders")}>
              <GrCart className="text-xl" />
              <span>Orders</span>
            </Link>

            <Link to="/admin/users" className={linkClasses("/admin/users")}>
              <HiUserGroup className="text-xl" />
              <span>Users</span>
            </Link>
          </>
        )}

        {role === "Staff" && (
          <>
            <Link to="/staff" className={linkClasses("/staff")}>
              <MdDashboard className="text-xl" />
              <span>Dashboard</span>
            </Link>

            <Link to="/staff/orders" className={linkClasses("/staff/orders")}>
              <GrCart className="text-xl" />
              <span>Orders</span>
            </Link>
          </>
        )}
      </div>

      <div className="p-4 mt-auto border-t border-gray-100">
        <button
          className="flex items-center justify-center w-full space-x-2 bg-red-600 hover:bg-red-700 text-white py-2.5 px-4 rounded-lg transition-colors font-medium text-sm"
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("role");
            window.location.href = "/";
          }}
        >
          <FiLogOut className="text-lg" />
          <span>Logout</span>
        </button>
      </div>
    </nav>
  );
}

export default SideBar;