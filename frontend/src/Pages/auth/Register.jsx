import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import apiClient from "../../api/axios";
import { toast } from "react-toastify";
import { Eye, EyeOff } from "lucide-react"; // 👁️ Import for toggle

const Register = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // for password toggle
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // for confirm password toggle
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email || !emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!email || !username || !password || !confirmPassword) {
      setError("All fields are required.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const payload = { email, username, password, confirmPassword };
      const response = await apiClient.post("/auth/register", payload, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.status === 200) {
        toast.success("Registration successful! Please login.");
        navigate("/auth");
      }
    } catch (err) {
      toast.error("Failed to Register");
      setError("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Left image */}
      <div className="w-1/2 hidden md:block">
        <img
          src="https://i.pinimg.com/736x/00/21/a3/0021a3321c1d0cbc065b055c858b3b5c.jpg"
          alt="Bookshelf"
          className="h-full w-full object-cover"
        />
      </div>

      {/* Right form */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-white px-8">
        <div className="max-w-md w-full">
          <h2 className="text-2xl font-semibold mb-6 text-center text-gray-900">
            Create an account
          </h2>

          {error && <p className="text-red-500 text-center mb-4">{error}</p>}

          <form className="space-y-4" onSubmit={handleRegister}>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full px-4 py-2 border rounded-md outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="w-full px-4 py-2 border rounded-md outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div className="relative">
              <label className="block text-sm text-gray-700 mb-1">Password</label>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-2 pr-10 border rounded-md outline-none focus:ring-2 focus:ring-green-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-9 right-3 text-gray-500"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <div className="relative">
              <label className="block text-sm text-gray-700 mb-1">Confirm Password</label>
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                className="w-full px-4 py-2 pr-10 border rounded-md outline-none focus:ring-2 focus:ring-green-500"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute top-9 right-3 text-gray-500"
                tabIndex={-1}
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-800 text-white py-2 rounded-md hover:bg-green-900 transition"
            >
              {loading ? "Registering..." : "Create an account"}
            </button>
          </form>

          <p className="text-sm text-center text-gray-700 mt-4">
            Already have an account?{" "}
            <Link to="/auth" className="text-green-800 font-medium hover:underline">
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
