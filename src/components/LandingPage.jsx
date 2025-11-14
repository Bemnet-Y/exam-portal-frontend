import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const LandingPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!formData.email || !formData.password) {
      setError("Please enter both email and password");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/login`,
        formData
      );
      const { token, user } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      if (user.forcePasswordChange) {
        navigate("/change-password");
      } else {
        switch (user.role) {
          case "admin":
            navigate("/admin/dashboard");
            break;
          case "teacher":
            navigate("/teacher/dashboard");
            break;
          case "student":
            navigate("/student/dashboard");
            break;
          default:
            navigate("/");
        }
      }
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Login failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Student Exam Photo */}
      <div className="w-1/2 bg-gradient-to-br from-green-900 to-emerald-800 flex items-center justify-center p-8 relative">
        <div className="absolute inset-0 bg-black/20"></div>

        <div className="relative z-10 text-center text-white">
          {/* Student exam photo container */}
          <div className="w-80 h-80 rounded-2xl mx-auto mb-6 overflow-hidden shadow-2xl border-2 border-white/20">
            <img
              src="https://images.unsplash.com/photo-1588072432836-e10032774350?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
              alt="Student taking online exam"
              className="w-full h-full object-cover"
            />
          </div>

          <h2 className="text-3xl font-bold mb-4">Excel in Your Studies</h2>
          {/* <p className="text-emerald-100 max-w-md text-lg">
            Professional online examination platform designed for academic
            success and secure testing
          </p> */}
        </div>
      </div>

      {/* Right Side - Login Section */}
      <div className="w-1/2 bg-white p-8 flex items-center justify-center">
        <div className="max-w-md w-full">
          <header className="mb-8 text-center">
            <div className="text-3xl font-bold text-gray-900 mb-2">
              EXAM PORTAL SYSTEM
            </div>
            <p className="text-gray-600">Access your exam dashboard</p>
          </header>

          {/* Login Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  {error}
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username or email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="johnsmith007"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="••••••••••"
                disabled={loading}
              />
            </div>

            <div className="text-right">
              <Link
                to="/forgot-password"
                className="text-sm text-green-600 hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-700 text-white py-3 rounded-md font-semibold hover:bg-green-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Signing in...
                </div>
              ) : (
                "Sign in"
              )}
            </button>

            {/* Demo Credentials */}
            <div className="text-center text-sm text-gray-600 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="font-semibold text-yellow-800">Demo Credentials</p>
              <p className="mt-1 text-yellow-700">
                Default password for all users: <strong>password123</strong>
              </p>
              <p className="text-xs mt-1 text-yellow-600">
                You'll be prompted to change it on first login
              </p>
            </div>
          </form>

          {/* Additional options */}
          {/* <div className="text-center mt-6">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-green-700 hover:underline font-semibold"
              >
                Sign up
              </Link>
            </p>
          </div> */}

          {/* Support Info */}
          <div className="text-center mt-4">
            <p className="text-xs text-gray-500">
              Having trouble signing in?{" "}
              <span className="text-green-600 hover:text-green-800 cursor-pointer">
                Contact administrator
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
