import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import apiClient from '../../api/axios';
import { Eye, EyeOff } from 'lucide-react'; // Eye toggle icons

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false); // Password visibility toggle

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Both email and password are required.');
      return;
    }

    const payload = {
      email,
      password,
    };

    try {
      const response = await apiClient.post("/auth/login", payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        const data = response.data;

        // Store token, role, userId
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.user.role);
        localStorage.setItem("userId", data.user.userId);

        // Redirect based on role
        if (data.user.role === "Admin") {
          navigate("/admin");
        } else if (data.user.role === "Staff") {
          navigate("/staff");
        } else if (data.user.role === "User") {
          navigate("/");
        }
      } else {
        setError('Invalid email or password.');
      }
    } catch (error) {
      console.error("Login failed:", error);
      setError('Login failed. Please check credentials or try again later.');
    }
  };

  return (
    <div className="flex flex-row h-screen">
      {/* Left - Login Form */}
      <div className="w-1/2 flex items-center justify-center p-8 rounded-tr-3xl rounded-br-3xl">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold mb-8 text-center">Welcome Back</h1>

          <form className="space-y-6" onSubmit={handleLogin}>
            {error && <p className="text-red-600 text-sm">{error}</p>}

            <div className="space-y-2">
              <label className="block text-sm text-gray-500">Email Address</label>
              <input 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-700"
              />
            </div>

            <div className="space-y-2 relative">
              <label className="block text-sm text-gray-500">Password</label>
              <input 
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full p-3 pr-10 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-700"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-9 right-3 text-gray-600"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <button 
              type="submit"
              className="w-full p-3 bg-[#3A4F41] text-white hover:bg-green-900 transition-colors duration-300 rounded-3xl"
            >
              Login
            </button>

            <div className="text-center text-sm">
              <span className="text-gray-600">Don't have an account? </span>
              <Link to="/auth/register" className="text-[#3A4F41] hover:underline">Register</Link>
            </div>
          </form>

          <div className="flex justify-center space-x-4 mt-8 text-gray-500 text-xl">
            <i className="fab fa-facebook-f cursor-pointer"></i>
            <i className="fab fa-twitter cursor-pointer"></i>
            <i className="fab fa-instagram cursor-pointer"></i>
            <i className="fab fa-linkedin-in cursor-pointer"></i>
          </div>
        </div>
      </div>

      {/* Right - Bookshelf Image */}
      <div className="w-1/2 bg-gray-100">
        <img 
          src="https://i.pinimg.com/736x/00/21/a3/0021a3321c1d0cbc065b055c858b3b5c.jpg" 
          alt="Bookshelf" 
          className="h-full w-full object-cover"
        />
      </div>
    </div>
  );
}

export default Login;
