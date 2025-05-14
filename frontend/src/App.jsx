import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  useMatch,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import React from "react";
import "react-toastify/dist/ReactToastify.css";

// Auth
import Login from "./Pages/auth/Login";
import Register from "./Pages/auth/Register";
import Auth from "./Pages/auth/Auth";

// User Pages
import Home from "./Pages/user/Home";
import Whitelist from "./Pages/user/Whitelist";
import Browsebooks from "./Pages/user/Browsebooks";
import MyOrders from "./Pages/user/MyOrders";
import Cart from "./Pages/user/cart";
import ClaimCode from "./Pages/user/ClaimCode";
import BookDetail from "./Pages/user/BookDetail";
import UserProfile from "./Pages/user/UserProfile";
import SellerBest from "./Pages/user/SellerBest";
import WinnerAward from "./Pages/user/WinnerAward";
import ReleaseNew from "./Pages/user/ReleaseNew";
import SoonComing from "./Pages/user/SoonComing";
import FeedbackForm from "./Pages/user/FeedbackForm";
import Notifications from "./Pages/user/notifications";
import SearchResults from "./Pages/user/SearchResults";
import Deals from "./Pages/user/Deals";

// Admin Pages
import Admin from "./Pages/admin/Admin";
import BookContent from "./Pages/admin/BookContent";
import AnnouncementContent from "./Pages/admin/AnnouncementContent";
import DashboardContent from "./Pages/admin/DashboardContent";
import OrderContent from "./Pages/admin/OrderContent";
import CustomerContent from "./Pages/admin/UserContent";
import AddBook from "./components/adminComponent/AddBook";
import AddAnnoun from "./components/adminComponent/AddAnnoun";
import UpdateBook from "./components/adminComponent/UpdateBook";
import UpdateAnnoun from "./components/adminComponent/UpdateAnnoun";

// Shared Components
import UserHeader from "./components/user/UserHeader";
import UserFooter from "./components/user/UserFooter";
import Staff from "./Pages/staff/Staff";
import RealTimeNotification from "./components/NotificationController/Notification"; // ✅ SignalR notification handler

function App() {
  const isAdminRoute = useMatch("/admin/*");
  const isStaffRoute = useMatch("/staff/*");
  const isAuthRoute = useMatch("/auth/*");
  const location = useLocation();
  const role = localStorage.getItem("role");

  // Redirect Admin to /admin if logged in and visiting a non-admin page
  if (role === "Admin" && !location.pathname.startsWith("/admin")) {
    window.location.href = "/admin";
    return null;
  }

  if (role === "Staff" && !location.pathname.startsWith("/staff")) {
    window.location.href = "/staff";
    return null;
  }

  return (
    <>
      <ToastContainer />
      {!isAdminRoute && !isStaffRoute && !isAuthRoute && <UserHeader />}

      {/* ✅ Global Toast Container */}
      <ToastContainer position="top-right" autoClose={4000} />

      {/* ✅ Real-time toast notifications via SignalR */}
      <RealTimeNotification />

      <Routes>
        {/* Public User Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/whitelist" element={<Whitelist />} />
        <Route path="/browsebooks" element={<Browsebooks />} />
        <Route path="/myorders" element={<MyOrders />} />
        <Route path="/claimcode" element={<ClaimCode />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/book/:id" element={<BookDetail />} />
        <Route path="/UserProfile" element={<UserProfile />} />
        <Route path="/SellerBest" element={<SellerBest />} />
        <Route path="/WinnerAward" element={<WinnerAward />} />
        <Route path="/ReleaseNew" element={<ReleaseNew />} />
        <Route path="/SoonComing" element={<SoonComing />} />
        <Route path="/feedback/:id" element={<FeedbackForm />} />
        <Route path="/Notifications" element={<Notifications />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/Deals" element={<Deals />} />

        {/* Auth Routes */}
        <Route path="/auth" element={<Auth />}>
          <Route index element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<Admin />}>
          <Route index element={<DashboardContent />} />
          <Route path="book" element={<BookContent />} />
          <Route path="announcement" element={<AnnouncementContent />} />
          <Route path="book/update-book/:bookId" element={<UpdateBook />} />
          <Route
            path="announcement/update-announcement/:announcementId"
            element={<UpdateAnnoun />}
          />
          <Route path="/admin/add-book" element={<AddBook />} />
          <Route path="/admin/add-announcement" element={<AddAnnoun />} />
          <Route path="/admin/orders" element={<OrderContent />} />
          <Route path="/admin/users" element={<CustomerContent />} />
        </Route>

        {/* Staff Routes */}
        <Route path="/staff" element={<Staff />}>
          <Route index element={<DashboardContent />} />
          <Route path="orders" element={<OrderContent />} />
        </Route>
      </Routes>
      {!isAdminRoute && !isStaffRoute && !isAuthRoute && <UserFooter />}

    </>
  );
}

export default App;
