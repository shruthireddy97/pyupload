import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { username, password } = formData;

    // Get registered users from localStorage
    const users = JSON.parse(localStorage.getItem("users") || "[]");

    // Find user with matching credentials
    const user = users.find(
      (u) => u.username === username && u.password === password
    );

    if (user) {
      // Store logged in user info (optional)
      localStorage.setItem("currentUser", JSON.stringify(user));
      // Navigate to home page
      navigate("/");
    } else {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="w-full flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Digital Apprentice
        </h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-1 text-gray-900 bg-gray-100 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter Username"
              required
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-1 text-gray-900 bg-gray-100 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 text-center">{error}</p>
          )}

          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Log In
          </button>
        </form>
        <p className="text-sm text-center text-gray-600">
          Don't have an account?{" "}
          <a href="/signup" className="text-blue-500 hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;

// import { useNavigate } from "react-router-dom";
//
// export default function LoginPage() {
//   const navigate = useNavigate();
//
//   const handleLogin = () => {
//     // No authentication for now — direct navigation
//     navigate("/"); // This will take user to Upload page
//   };
//
//   return (
//     <div className="flex flex-col items-center justify-center h-screen bg-[#0A3D91] text-white">
//       <h1 className="text-3xl font-bold mb-8">DIGITAL APPRENTICE</h1>
//
//       <div className="bg-[#0A3D91] border-2 border-white p-6 rounded-lg w-80">
//         <input
//           className="w-full p-2 mb-4 rounded text-black"
//           placeholder="Username"
//         />
//         <input
//           className="w-full p-2 mb-4 rounded text-black"
//           placeholder="Password"
//           type="password"
//         />
//
//         <button
//           className="w-full p-2 rounded bg-[#FF7A00] text-white font-semibold hover:opacity-90"
//           onClick={handleLogin}
//         >
//           LOGIN
//         </button>
//
//       </div>
//     </div>
//   );
// }
