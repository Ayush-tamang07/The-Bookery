import React from "react";
import { Link } from "react-router-dom";

const Register = () => {
  return (
    <div className="flex h-screen">
      {/* Left image section */}
      <div className="w-1/2 hidden md:block">
        <img
          src="https://i.pinimg.com/736x/00/21/a3/0021a3321c1d0cbc065b055c858b3b5c.jpg"
          alt="Bookshelf"
          className="h-full w-full object-cover"
        />
      </div>

      {/* Right form sectionss*/}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-white px-8">
        <div className="max-w-md w-full">
          <h2 className="text-2xl font-semibold mb-6 text-center text-gray-900">
            Create an account
          </h2>

          <form className="space-y-4">
            <div>
              <label className="block text-sm text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                placeholder="Enter your email address"
                className="w-full px-4 py-2 border rounded-md outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1">Username</label>
              <input
                type="text"
                placeholder="Enter your username"
                className="w-full px-4 py-2 border rounded-md outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1">Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                className="w-full px-4 py-2 border rounded-md outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1">Confirm Password</label>
              <input
                type="password"
                placeholder="Confirm your password"
                className="w-full px-4 py-2 border rounded-md outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-green-800 text-white py-2 rounded-md hover:bg-green-900 transition"
            >
              Create an account
            </button>
          </form>

          <p className="text-sm text-center text-gray-700 mt-4">
            Already have an account?{" "}
            <Link to="/login" className="text-green-800 font-medium hover:underline">
              Login
            </Link>
          </p>

          <div className="flex justify-center gap-6 mt-6 text-gray-500 text-lg">
            <i className="fab fa-facebook-f cursor-pointer"></i>
            <i className="fab fa-twitter cursor-pointer"></i>
            <i className="fab fa-instagram cursor-pointer"></i>
            <i className="fab fa-linkedin-in cursor-pointer"></i>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
