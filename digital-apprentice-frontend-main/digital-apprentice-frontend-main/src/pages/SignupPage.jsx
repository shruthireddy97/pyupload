import React, { useState } from "react";

const SignupPage = () => {
  const [formState, setFormState] = useState({
    fullname: "",
    username: "",
    password: "",
    confirmpassword: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const { fullname, username, password, confirmpassword } = formState;

    if (!fullname || !username || !password || !confirmpassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (password !== confirmpassword) {
      setError("Passwords do not match.");
      return;
    }

    const newUser = {
      id: Date.now(),
      fullname,
      username,
      password,
      createdAt: new Date().toISOString(),
    };

    const existingUsers = JSON.parse(localStorage.getItem("users") || "[]");
    existingUsers.push(newUser);
    localStorage.setItem("users", JSON.stringify(existingUsers));

    console.log("User registered successfully:", newUser);

    setFormState({
      fullname: "",
      username: "",
      password: "",
      confirmpassword: "",
    });
    setError("");

    alert("Registration successful!");
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
                htmlFor="fullname"
                className="block text-sm font-medium text-white mb-1"
              >
                Full Name
              </label>
              <input
                type="text"
                id="fullname"
                name="fullname"
                value={formState.fullname}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter Full Name"
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
                htmlFor="confirmpassword"
                className="block text-sm font-medium text-white mb-1"
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmpassword"
                name="confirmpassword"
                value={formState.confirmpassword}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="••••••••"
                required
              />
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button
            type="submit"
            style={{ backgroundColor: "#FF6A00" }}
            className="w-full px-4 py-2 text-white rounded-md hover:opacity-90 transition"
>
             Signup
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
