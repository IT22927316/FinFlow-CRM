import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({ emailOrUsername: '', password: '' });
  const [loading, setLoading] = useState(false); // Add loading state
  const [error, setError] = useState(""); // Store error message
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(""); // Reset error message when user types
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); // Show spinner
    setError(""); // Clear previous errors

    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', formData);
      
      if (res.data.token && res.data.role) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('role', res.data.role);
        navigate('/dashboard');
      } else {
        setError("Login failed: Missing token or role.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false); // Hide spinner
    }
  };

  return (
    <div className="h-screen bg-gradient-to-r from-indigo-100 to-purple-100 flex items-center justify-center">
      <div className="bg-white shadow-xl rounded-xl flex overflow-hidden max-w-4xl">
        
        {/* Left Side (Illustration or Placeholder) */}
        <div className="hidden md:flex w-1/2 bg-gradient-to-r from-indigo-400 to-purple-400 items-center justify-center">
          <img
            src="https://i.imgur.com/x4z7E6u.png"
            alt="Login Illustration"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right Side (Login Form) */}
        <div className="w-full md:w-1/2 p-10">
          <h2 className="text-2xl font-bold text-indigo-600 mb-2">Welcome Back!</h2>
          <p className="text-gray-600 mb-6 text-sm">
            A workspace designed specifically for you.
          </p>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              className="w-full p-3 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              name="emailOrUsername"
              placeholder="Email or Username"
              onChange={handleChange}
              required
            />
            <input
              type="password"
              className="w-full p-3 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              required
            />
            
            <button
              type="submit"
              className={`w-full py-3 rounded-lg text-white font-bold ${
                loading ? "bg-gray-400" : "bg-indigo-500 hover:bg-indigo-600"
              }`}
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>

            <div className="text-right">
              <Link
                to="/forgot-password"
                className="text-sm text-indigo-500 hover:text-indigo-700"
              >
                Forgot Password?
              </Link>
            </div>
          </form>

          <div className="mt-6 text-sm text-center text-gray-600">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="text-indigo-500 font-semibold hover:text-indigo-700"
            >
              Sign Up!
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
