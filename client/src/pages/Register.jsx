import React, { useState } from "react";
import { Eye, EyeOff, Sun, Moon, Bot, Sparkles, Zap } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


const RegisterPage = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
    
  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName || formData.firstName.length < 2) {
      newErrors.firstName = formData.firstName
        ? "First name must be at least 2 characters"
        : "First name is required";
    }
    if (!formData.lastName || formData.lastName.length < 2) {
      newErrors.lastName = formData.lastName
        ? "Last name must be at least 2 characters"
        : "Last name is required";
    }
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)
    ) {
      newErrors.email = "Invalid email address";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password =
        "Password must contain uppercase, lowercase, and a number";
    }
    return newErrors;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };
  const NavHandler =  useNavigate()
  const onSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await axios.post(
        "https://chatgpt-h38f.onrender.com/api/auth/register",
        {
          fullName: {
            firstName: formData.firstName,
            lastName: formData.lastName
          },
          email: formData.email,
          password: formData.password
        },
        {
          withCredentials: true
        }
      );

      // Fixed: axios responses have .status, not .ok like fetch
      if (response.status === 200 || response.status === 201) {
        console.log("Registration successful:", response.data);
        alert("Registration successful! Welcome to AI Assistant!");
        setFormData({ firstName: "", lastName: "", email: "", password: "" });
        NavHandler('/login')
        setErrors({});
      }
    } catch (error) {
      console.error("Registration failed:", error);
      
      // Better error handling for different scenarios
      if (error.response) {
        // Server responded with error status
        const errorMessage = error.response.data?.message || "Registration failed";
        alert(`Registration failed: ${errorMessage}`);
      } else if (error.request) {
        // Network error
        alert("Network error. Please check your connection and try again.");
      } else {
        // Other error
        alert("Registration failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const themeClasses = isDarkMode
    ? "bg-gray-900 text-white"
    : "bg-gray-50 text-gray-900";

  return (
    <div className={`min-h-screen transition-all duration-300 ${themeClasses}`}>
      {/* Theme Toggle */}
      <div className="absolute top-4 right-4">
        <button
          onClick={toggleTheme}
          className={`p-3 rounded-full transition-all duration-300 ${
            isDarkMode
              ? "bg-gray-800 hover:bg-gray-700 text-yellow-400"
              : "bg-white hover:bg-gray-100 text-gray-600 shadow-md"
          }`}
        >
          {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </div>

      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div
                className={`p-3 rounded-2xl ${
                  isDarkMode
                    ? "bg-gradient-to-r from-blue-600 to-purple-600"
                    : "bg-gradient-to-r from-blue-500 to-purple-500"
                }`}
              >
                <Bot className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold mb-2">Join AI Assistant</h1>
            <p
              className={`text-sm ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Create your account and unlock the power of AI
            </p>
          </div>

          {/* Form Container */}
          <div
            className={`rounded-2xl p-8 transition-all duration-300 ${
              isDarkMode
                ? "bg-gray-800 border border-gray-700"
                : "bg-white border border-gray-200 shadow-xl"
            }`}
          >
            <form onSubmit={onSubmit} className="space-y-6">
              {/* First + Last Name */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    First Name
                  </label>
                  <input
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    type="text"
                    className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 ${
                      isDarkMode
                        ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500/20"
                        : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500/20"
                    } ${errors.firstName ? "border-red-500" : ""}`}
                    placeholder="John"
                  />
                  {errors.firstName && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.firstName}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Last Name
                  </label>
                  <input
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    type="text"
                    className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 ${
                      isDarkMode
                        ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500/20"
                        : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500/20"
                    } ${errors.lastName ? "border-red-500" : ""}`}
                    placeholder="Doe"
                  />
                  {errors.lastName && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.lastName}
                    </p>
                  )}
                </div>
              </div>

              {/* Email */}
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Email Address
                </label>
                <input
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  type="email"
                  className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 ${
                    isDarkMode
                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500/20"
                      : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500/20"
                  } ${errors.email ? "border-red-500" : ""}`}
                  placeholder="john.doe@example.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    type={showPassword ? "text" : "password"}
                    className={`w-full px-4 py-3 pr-12 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 ${
                      isDarkMode
                        ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500/20"
                        : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500/20"
                    } ${errors.password ? "border-red-500" : ""}`}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute right-3 top-1/2 transform -translate-y-1/2 transition-colors ${
                      isDarkMode 
                        ? "text-gray-400 hover:text-white" 
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-500">{errors.password}</p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Creating Account...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Create Account
                  </>
                )}
              </button>
            </form>

            {/* Footer */}
            <div className="mt-8 text-center">
              <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                Already have an account?{' '}
                <button className="text-blue-500 hover:text-blue-400 font-medium transition-colors">
                  Sign in
                </button>
              </p>
            </div>
          </div>

          {/* Features */}
          <div className="mt-8 grid grid-cols-3 gap-4">
            <div className="text-center">
              <div
                className={`inline-flex p-2 rounded-lg mb-2 ${
                  isDarkMode ? "bg-gray-800" : "bg-white shadow-md"
                }`}
              >
                <Zap className="w-5 h-5 text-yellow-500" />
              </div>
              <p
                className={`text-xs ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Lightning Fast
              </p>
            </div>
            <div className="text-center">
              <div
                className={`inline-flex p-2 rounded-lg mb-2 ${
                  isDarkMode ? "bg-gray-800" : "bg-white shadow-md"
                }`}
              >
                <Bot className="w-5 h-5 text-blue-500" />
              </div>
              <p
                className={`text-xs ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                AI Powered
              </p>
            </div>
            <div className="text-center">
              <div
                className={`inline-flex p-2 rounded-lg mb-2 ${
                  isDarkMode ? "bg-gray-800" : "bg-white shadow-md"
                }`}
              >
                <Sparkles className="w-5 h-5 text-purple-500" />
              </div>
              <p
                className={`text-xs ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Innovative
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;