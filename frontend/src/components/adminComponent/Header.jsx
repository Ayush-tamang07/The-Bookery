import React from 'react';
import { FaSearch, FaBell, FaUserCircle } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';

function Header() {
  const role = localStorage.getItem("role");
  const location = useLocation();

  // Map pathnames to titles
  const getTitle = () => {
    const path = location.pathname;
    if (path === '/admin' || path === '/staff') return 'Dashboard';
    if (path === '/admin/book') return 'Books';
    if (path === '/admin/add-book') return 'Add Book';
    if (path === '/admin/announcement') return 'Announcements';
    if (path === '/admin/orders' || path === '/staff/orders') return 'Orders';
    if (path === '/admin/users') return 'Users';
    return 'Dashboard';
  };

  return (
    <header className="bg-white">
      <div className="flex items-center justify-between px-6 py-2">
        <h1 className="text-2xl font-semibold text-gray-800">
          {getTitle()}
        </h1>
        <div className="flex items-center space-x-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2.5 rounded-lg bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" size={16} />
          </div>
          <FaBell size={20} className="text-gray-600 cursor-pointer hover:text-blue-500" />
          <div className="flex items-center space-x-2">
            <FaUserCircle size={24} className="text-blue-500" />
            <span className="font-medium">{role}</span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;