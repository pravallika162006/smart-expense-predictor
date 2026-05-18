import { useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { motion } from "framer-motion";
import { FiSliders, FiBell, FiUser } from "react-icons/fi";

function Settings() {
  const [budget, setBudget] = useState(() => {
    const savedBudget = localStorage.getItem("monthlyBudget");
    return savedBudget ? Number(savedBudget) : 25000;
  });

  const handleBudgetChange = (e) => {
    const newBudget = Number(e.target.value);
    setBudget(newBudget);
    localStorage.setItem("monthlyBudget", newBudget);
  };

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gradient">System Settings</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Budget Setting Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="glass-card p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <FiSliders className="text-[#7C4DFF]" size={20} />
            <h3 className="text-lg font-bold">Monthly Budgeting</h3>
          </div>

          <div className="space-y-4">
            <p className="text-sm text-[#A0A3BD]">
              Adjust your target monthly spending. When you exceed 80% of this budget, the dashboard will warn you.
            </p>

            <div>
              <label className="text-sm text-[#A0A3BD] mb-2 block">Limit (₹)</label>
              <input
                type="number"
                value={budget}
                onChange={handleBudgetChange}
                className="input-modern"
              />
            </div>
            
            <p className="text-xs text-[#A0A3BD] italic">
              Budget settings are saved automatically to your device session.
            </p>
          </div>
        </motion.div>

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="glass-card p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <FiUser className="text-[#00C2FF]" size={20} />
            <h3 className="text-lg font-bold">User Account</h3>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#7C4DFF] to-[#00C2FF] flex items-center justify-center text-white text-2xl font-bold">
              U
            </div>
            <div>
              <h4 className="font-semibold text-lg">Active Premium Account</h4>
              <p className="text-sm text-[#A0A3BD]">user@example.com</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm p-3 bg-[#1A1D29]/50 border border-[#2A2E3F]/40 rounded-xl">
              <span className="text-[#A0A3BD]">Account Status</span>
              <span className="text-green-400 font-semibold">Active</span>
            </div>
            <div className="flex justify-between items-center text-sm p-3 bg-[#1A1D29]/50 border border-[#2A2E3F]/40 rounded-xl">
              <span className="text-[#A0A3BD]">Sync Status</span>
              <span className="text-blue-400 font-semibold">Synced</span>
            </div>
          </div>
        </motion.div>

        {/* Preferences / Alerts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="glass-card p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <FiBell className="text-yellow-400" size={20} />
            <h3 className="text-lg font-bold">Alert System Settings</h3>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-medium text-sm">Over-Budget Warnings</h4>
                <p className="text-xs text-[#A0A3BD]">Get warned when you hit 80% limit</p>
              </div>
              <input type="checkbox" defaultChecked className="accent-[#7C4DFF] w-4 h-4" />
            </div>

            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-medium text-sm">AI Financial Suggestions</h4>
                <p className="text-xs text-[#A0A3BD]">Show active AI notifications on Dashboard</p>
              </div>
              <input type="checkbox" defaultChecked className="accent-[#7C4DFF] w-4 h-4" />
            </div>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}

export default Settings;
