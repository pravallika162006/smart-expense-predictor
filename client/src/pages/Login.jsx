import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {

    try {

      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email,
          password,
        }
      );

      // Store token
      localStorage.setItem("token", res.data.token);

      // Redirect
      navigate("/dashboard");

    } catch (error) {

      alert("Invalid Email or Password");

    }
  };

  return (
    <div className="min-h-screen flex bg-slate-950">

      {/* Left Section */}
      <div className="hidden md:flex w-1/2 bg-gradient-to-br from-green-500 to-emerald-700 items-center justify-center p-10">

        <div>

          <h1 className="text-6xl font-bold text-white leading-tight">
            Smart Expense
            <br />
            Predictor 💰
          </h1>

          <p className="text-white text-lg mt-6 max-w-md">
            Track your spending, manage your budget,
            and predict future expenses with smart analytics.
          </p>

        </div>

      </div>

      {/* Right Section */}
      <div className="flex w-full md:w-1/2 items-center justify-center px-6">

        <div className="bg-slate-800 p-8 rounded-2xl shadow-2xl w-full max-w-md">

          {/* Heading */}
          <h1 className="text-3xl font-bold text-white text-center mb-2">
            Welcome Back 👋
          </h1>

          <p className="text-gray-300 text-center mb-6">
            Login to continue
          </p>

          {/* Email */}
          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 mb-4 rounded-lg bg-slate-700 text-white outline-none"
          />

          {/* Password */}
          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 mb-5 rounded-lg bg-slate-700 text-white outline-none"
          />

          {/* Login Button */}
          <button
            onClick={handleLogin}
            className="w-full bg-green-500 hover:bg-green-600 transition duration-300 text-white p-3 rounded-lg font-semibold"
          >
            Login
          </button>

          {/* Register Link */}
          <p className="text-gray-300 text-center mt-5">
            Don’t have an account?{" "}
            <Link
              to="/register"
              className="text-green-400 hover:text-green-300"
            >
              Register
            </Link>
          </p>

        </div>

      </div>

    </div>
  );
}

export default Login;