import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { FiUser, FiMail, FiLock, FiTrendingUp } from "react-icons/fi";

function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
        "Registration Failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#0F1117] text-white relative overflow-hidden font-sans">
      {/* Background Glow Blobs */}
      <div className="absolute top-[-20%] left-[-20%] w-[600px] h-[600px] rounded-full bg-[#7C4DFF]/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[600px] h-[600px] rounded-full bg-[#00C2FF]/10 blur-[120px] pointer-events-none" />

      {/* Left Section - Promo */}
      <div className="hidden lg:flex w-1/2 flex-col justify-between p-12 relative z-10 border-r border-[#2A2E3F]/40 bg-[#151823]/30 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <span className="p-2.5 bg-gradient-to-tr from-[#7C4DFF] to-[#00C2FF] rounded-xl text-white">
            <FiTrendingUp size={22} />
          </span>
          <span className="font-bold text-xl tracking-tight text-gradient">Smart Expensor</span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-md space-y-6 my-auto"
        >
          <h1 className="text-5xl font-extrabold leading-tight tracking-tight">
            Join the Next <br />
            Generation of <span className="text-gradient">Money Management</span>.
          </h1>
          <p className="text-[#A0A3BD] text-lg leading-relaxed">
            Create an account to gain full access to visual analytics, advanced transaction logs, AI budget thresholds, and forecasting tools.
          </p>

          <div className="flex gap-4 pt-4">
            <div className="glass-card p-4 flex-1 text-center hover:translate-y-0 hover:scale-[1.02] transition duration-300">
              <h3 className="font-bold text-xl text-[#00C2FF]">Secure</h3>
              <p className="text-xs text-[#A0A3BD] mt-1">Encrypted user storage</p>
            </div>
            <div className="glass-card p-4 flex-1 text-center hover:translate-y-0 hover:scale-[1.02] transition duration-300">
              <h3 className="font-bold text-xl text-[#7C4DFF]">Free</h3>
              <p className="text-xs text-[#A0A3BD] mt-1">Comprehensive tools</p>
            </div>
          </div>
        </motion.div>

        <p className="text-xs text-[#A0A3BD]">
          Smart Expense Predictor © 2026. Built with AI & Data Analytics.
        </p>
      </div>

      {/* Right Section - Form */}
      <div className="flex w-full lg:w-1/2 items-center justify-center px-6 py-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="glass-card p-8 md:p-12 w-full max-w-md hover:translate-y-0 hover:shadow-2xl transition duration-300"
        >
          {/* Title */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2">Create Account ✨</h2>
            <p className="text-sm text-[#A0A3BD]">Sign up to start tracking and predicting</p>
          </div>

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center font-medium"
            >
              {error}
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleRegister} className="space-y-5">
            {/* Dummy inputs to capture browser autofill on load */}
            <input type="text" name="name" style={{ position: "absolute", opacity: 0, width: 0, height: 0, pointerEvents: "none" }} autoComplete="off" />
            <input type="text" name="email" style={{ position: "absolute", opacity: 0, width: 0, height: 0, pointerEvents: "none" }} autoComplete="off" />
            <input type="password" name="password" style={{ position: "absolute", opacity: 0, width: 0, height: 0, pointerEvents: "none" }} autoComplete="new-password" />

            <div>
              <label className="text-sm text-[#A0A3BD] block mb-2 font-medium">Full Name</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-[#A0A3BD]">
                  <FiUser size={18} />
                </span>
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-modern"
                  style={{ paddingLeft: "45px" }}
                  autoComplete="off"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-sm text-[#A0A3BD] block mb-2 font-medium">Email Address</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-[#A0A3BD]">
                  <FiMail size={18} />
                </span>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-modern"
                  style={{ paddingLeft: "45px" }}
                  autoComplete="off"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-sm text-[#A0A3BD] block mb-2 font-medium">Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-[#A0A3BD]">
                  <FiLock size={18} />
                </span>
                <input
                  type={passwordFocused || password ? "password" : "text"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => {
                    if (!password) setPasswordFocused(false);
                  }}
                  className="input-modern"
                  style={{ paddingLeft: "45px" }}
                  autoComplete="new-password"
                  required
                />
              </div>
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-glow flex items-center justify-center gap-2 mt-8 py-3.5 text-base"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="text-center text-sm pt-6 text-[#A0A3BD]">
            Already have an account?{" "}
            <Link to="/" className="text-[#00C2FF] font-semibold hover:underline">
              Login
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Register;