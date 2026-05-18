
import { FiMenu, FiLogOut } from "react-icons/fi";
import { motion } from "framer-motion";

const Navbar = ({ setIsOpen }) => {
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <motion.div 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-30 backdrop-blur-xl bg-[#0F1117]/70 border-b border-[#2A2E3F]"
    >
      <div className="flex justify-between items-center px-6 py-4">
        <div className="flex items-center gap-4">
          <button 
            className="md:hidden text-white p-2"
            onClick={() => setIsOpen(true)}
          >
            <FiMenu size={24} />
          </button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gradient">
              Smart Expense Predictor
            </h1>
            <p className="text-sm text-[#A0A3BD] hidden md:block">
              AI-powered financial analytics dashboard | Track • Analyze • Predict
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white px-4 py-2 rounded-xl transition duration-300 font-semibold"
        >
          <FiLogOut />
          <span className="hidden md:inline">Logout</span>
        </button>
      </div>
    </motion.div>
  );
};

export default Navbar;
