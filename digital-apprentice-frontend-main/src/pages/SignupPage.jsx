import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signup } from "../api/api";

const SignupPage = () => {
  const navigate = useNavigate();
  const [formState, setFormState] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { email, username, password, confirmPassword } = formState;

    if (!email || !username || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await signup(email, password, username);
      // Store the token
      localStorage.setItem("token", response.access_token);
      localStorage.setItem("user_id", response.user_id);
      // Navigate to home page
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.detail || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-100 flex flex-col">

  
      <div className="bg-[#FF6A00] py-4 shadow-md">
        <h1 className="text-white text-2xl font-bold text-center">
          Digital Apprentice
        </h1>
      </div>

      {/* Center Card */}
      <div className="w-full flex items-center justify-center flex-grow px-4">
       <div className="w-full max-w-md p-10 bg-blue-600 rounded-2xl shadow-xl">

          {/* Blue Title */}
          <h2 className="text-2xl font-bold text-center text-white mb-8">
            Create Your Account
          </h2>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-white mb-1"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formState.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter Email"
                required
              />
            </div>

            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-white mb-1"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formState.username}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter Username"
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-white mb-1"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formState.password}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="••••••••"
                required
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-white mb-1"
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formState.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="••••••••"
                required
              />
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button
            type="submit"
            disabled={loading}
            style={{ backgroundColor: "#FF6A00" }}
            className="w-full px-4 py-2 text-white rounded-md hover:opacity-90 transition disabled:opacity-50"
>
             {loading ? "Signing Up..." : "Signup"}
            </button>
          </form>

          <p className="text-sm text-center text-white mt-4">
            Already have an account?{" "}
            <a href="/login"  style={{ color: "#FF6A00" }}
  className="font-semibold hover:underline">
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
