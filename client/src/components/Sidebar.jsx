
import { Link, useLocation } from "react-router-dom";
import { FiHome, FiPieChart, FiDollarSign, FiActivity, FiSettings } from "react-icons/fi";
import { motion } from "framer-motion";

const Sidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", icon: <FiHome />, path: "/dashboard" },
    { name: "Analytics", icon: <FiPieChart />, path: "/analytics" },
    { name: "Expenses", icon: <FiDollarSign />, path: "/expenses" },
    { name: "Predictions", icon: <FiActivity />, path: "/predictions" },
    { name: "Settings", icon: <FiSettings />, path: "/settings" },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Content */}
      <motion.div 
        className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-[#151823] border-r border-[#2A2E3F] transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-300 ease-in-out flex flex-col`}
      >
        <div className="p-6 flex items-center justify-center border-b border-[#2A2E3F]">
          <h2 className="text-xl font-bold text-gradient">Smart Expensor</h2>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {menuItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={index}
                to={item.path}
                className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 ${
                  isActive 
                    ? "bg-[#7C4DFF]/20 text-[#7C4DFF] border border-[#7C4DFF]/30" 
                    : "text-[#A0A3BD] hover:bg-white/5 hover:text-white"
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-[#2A2E3F]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#7C4DFF] to-[#00C2FF] flex items-center justify-center text-white font-bold">
              U
            </div>
            <div>
              <p className="text-sm font-semibold text-white">User</p>
              <p className="text-xs text-[#A0A3BD]">Premium Plan</p>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default Sidebar;
