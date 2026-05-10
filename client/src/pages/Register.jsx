import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Register() {

  const navigate = useNavigate();

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const handleRegister = async (e) => {

    e.preventDefault();

    setError("");

    setLoading(true);

    try {

      await axios.post(
        "https://smart-expense-predictor.onrender.com/api/auth/register",
        {
          name,
          email,
          password,
        }
      );

      navigate("/");

    } catch (err) {

      setError(
        err.response?.data?.message ||
        "Registration Failed"
      );

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 flex items-center justify-center px-4">

      {/* Background Glow */}
      <div className="absolute w-72 h-72 bg-green-500/20 blur-3xl rounded-full top-10 left-10"></div>

      <div className="absolute w-72 h-72 bg-blue-500/20 blur-3xl rounded-full bottom-10 right-10"></div>

      {/* Register Card */}
      <div className="relative z-10 w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">

        {/* Title */}
        <div className="text-center mb-8">

          <h1 className="text-4xl font-bold text-white">

            Smart Expense Predictor 💰

          </h1>

          <p className="text-gray-300 mt-3">

            Create your account

          </p>

        </div>

        {/* Error */}
        {
          error && (

            <div className="bg-red-500/20 border border-red-500 text-red-300 p-3 rounded-xl mb-5 text-sm">

              {error}

            </div>

          )
        }

        {/* Form */}
        <form
          onSubmit={handleRegister}
          className="space-y-5"
        >

          {/* Name */}
          <input
            type="text"
            placeholder="Enter Name"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
            required
            className="w-full p-4 rounded-2xl bg-slate-800/80 text-white placeholder-gray-400 outline-none border border-transparent focus:border-green-500"
          />

          {/* Email */}
          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            required
            className="w-full p-4 rounded-2xl bg-slate-800/80 text-white placeholder-gray-400 outline-none border border-transparent focus:border-green-500"
          />

          {/* Password */}
          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            required
            className="w-full p-4 rounded-2xl bg-slate-800/80 text-white placeholder-gray-400 outline-none border border-transparent focus:border-green-500"
          />

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-500 hover:bg-green-600 transition py-4 rounded-2xl text-white font-bold text-lg"
          >

            {
              loading
                ? "Creating Account..."
                : "Register"
            }

          </button>

        </form>

        {/* Login Link */}
        <p className="text-center text-gray-300 mt-6">

          Already have an account?{" "}

          <Link
            to="/"
            className="text-green-400 hover:text-green-300 font-semibold"
          >
            Login
          </Link>

        </p>

      </div>

    </div>

  );

}

export default Register;