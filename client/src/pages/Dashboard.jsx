/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import axios from "axios";
import DashboardLayout from "../layouts/DashboardLayout";
import { motion } from "framer-motion";
import { FiTrendingUp, FiTrendingDown, FiDollarSign, FiCpu, FiShield } from "react-icons/fi";

function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [prediction, setPrediction] = useState(0);

  const [budget] = useState(() => {
    const savedBudget = localStorage.getItem("monthlyBudget");
    return savedBudget ? Number(savedBudget) : 25000;
  });

  const currentMonth = new Date().getMonth();
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);

  const fetchExpenses = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        "https://smart-expense-predictor.onrender.com/api/expenses",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setExpenses(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const filteredExpenses = expenses.filter((item) => {
    const expenseMonth = new Date(item.date).getMonth();
    return expenseMonth === selectedMonth;
  });

  const getPrediction = async () => {
    const expenseAmounts = filteredExpenses
      .filter((item) => item.type === "expense")
      .map((item) => item.amount);

    const calculateFallback = () => {
      const n = expenseAmounts.length;
      if (n === 0) {
        return budget > 0 ? Math.round(budget * 0.8) : 5000;
      }
      if (n === 1) {
        return Math.round(expenseAmounts[0] * 1.08);
      }
      const xs = Array.from({ length: n }, (_, i) => i);
      const ys = expenseAmounts;
      const sumX = xs.reduce((a, b) => a + b, 0);
      const sumY = ys.reduce((a, b) => a + b, 0);
      const sumXY = xs.reduce((sum, x, i) => sum + x * ys[i], 0);
      const sumXX = xs.reduce((sum, x) => sum + x * x, 0);
      const denominator = n * sumXX - sumX * sumX;
      
      let slope = 0;
      let intercept = sumY / n;
      if (denominator !== 0) {
        slope = (n * sumXY - sumX * sumY) / denominator;
        intercept = (sumY - slope * sumX) / n;
      }
      
      const nextMonthPred = slope * n + intercept;
      return Math.max(100, Math.round(nextMonthPred));
    };

    try {
      const res = await axios.post("http://127.0.0.1:8000/predict", {
        expenses: expenseAmounts,
      });
      if (res.data.prediction === 0 || !res.data.prediction) {
        setPrediction(calculateFallback());
      } else {
        setPrediction(res.data.prediction);
      }
    } catch {
      console.log("Local ML backend offline. Falling back to client-side ML calculation.");
      setPrediction(calculateFallback());
    }
  };

  useEffect(() => {
    if (filteredExpenses.length > 0) {
      getPrediction();
    }
  }, [filteredExpenses]);

  // Totals
  const totalIncome = filteredExpenses
    .filter((item) => item.type === "income")
    .reduce((acc, item) => acc + item.amount, 0);

  const totalExpense = filteredExpenses
    .filter((item) => item.type === "expense")
    .reduce((acc, item) => acc + item.amount, 0);

  const balance = totalIncome - totalExpense;

  // Budget
  const budgetUsed = budget > 0 ? ((totalExpense / budget) * 100).toFixed(1) : 0;

  // Financial Health Score
  let healthScore = 100;
  if (totalIncome > 0) {
    const expenseRatio = (totalExpense / totalIncome) * 100;
    if (expenseRatio > 90) healthScore -= 40;
    else if (expenseRatio > 70) healthScore -= 25;
    else if (expenseRatio > 50) healthScore -= 10;
  }
  if (budgetUsed > 100) healthScore -= 30;
  else if (budgetUsed > 80) healthScore -= 15;
  if (balance < 0) healthScore -= 20;
  healthScore = Math.max(healthScore, 0);

  // Category wise compilation for AI suggestions
  const categoryData = [];
  filteredExpenses.forEach((item) => {
    const existing = categoryData.find((data) => data.name === item.category);
    if (existing) {
      existing.value += item.amount;
    } else {
      categoryData.push({ name: item.category, value: item.amount });
    }
  });

  // AI Suggestions
  const suggestions = [];
  categoryData.forEach((item) => {
    if (item.name === "Food" && item.value > 5000) {
      suggestions.push("🍔 Food expenses are quite high this month. Consider cooking at home.");
    }
    if (item.name === "Shopping" && item.value > 7000) {
      suggestions.push("🛍 Review shopping habits. Postponing luxury purchases can save 15% this month.");
    }
  });
  if (budgetUsed < 50 && totalExpense > 0) {
    suggestions.push("✅ Excellent budgeting! You are well within your limits.");
  }
  if (budgetUsed > 90) {
    suggestions.push("⚠ Danger Zone: You have exhausted almost your entire budget.");
  }

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Recent 5 transactions
  const recentTransactions = [...filteredExpenses]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  return (
    <DashboardLayout>
      {/* Month Filter */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gradient">Financial Summary</h2>
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(Number(e.target.value))}
          className="input-modern w-48"
        >
          {months.map((month, index) => (
            <option key={index} value={index} className="bg-slate-900">
              {month}
            </option>
          ))}
        </select>
      </div>

      {/* Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
      >
        {/* Income Card */}
        <div className="glass-card p-6 flex items-center justify-between">
          <div>
            <p className="text-[#A0A3BD] text-sm">Income</p>
            <h2 className="text-3xl font-bold text-green-400 mt-2">₹{totalIncome}</h2>
          </div>
          <span className="p-3 bg-green-500/10 text-green-400 rounded-xl">
            <FiTrendingUp size={24} />
          </span>
        </div>

        {/* Expense Card */}
        <div className="glass-card p-6 flex items-center justify-between">
          <div>
            <p className="text-[#A0A3BD] text-sm">Expenses</p>
            <h2 className="text-3xl font-bold text-red-400 mt-2">₹{totalExpense}</h2>
          </div>
          <span className="p-3 bg-red-500/10 text-red-400 rounded-xl">
            <FiTrendingDown size={24} />
          </span>
        </div>

        {/* Balance Card */}
        <div className="glass-card p-6 flex items-center justify-between">
          <div>
            <p className="text-[#A0A3BD] text-sm">Balance</p>
            <h2 className={`text-3xl font-bold mt-2 ${balance >= 0 ? "text-blue-400" : "text-amber-500"}`}>
              ₹{balance}
            </h2>
          </div>
          <span className={`p-3 rounded-xl ${balance >= 0 ? "bg-blue-500/10 text-blue-400" : "bg-amber-500/10 text-amber-500"}`}>
            <FiDollarSign size={24} />
          </span>
        </div>

        {/* Health Index Card */}
        <div className="glass-card p-6 flex items-center justify-between">
          <div>
            <p className="text-[#A0A3BD] text-sm">Financial Health</p>
            <h2 className="text-3xl font-bold text-cyan-400 mt-2">{healthScore}/100</h2>
          </div>
          <span className="p-3 bg-cyan-500/10 text-cyan-400 rounded-xl">
            <FiShield size={24} />
          </span>
        </div>

        {/* Predict Spending Overview Card */}
        <div className="glass-card p-6 flex items-center justify-between">
          <div>
            <p className="text-[#A0A3BD] text-sm">AI Prediction</p>
            <h2 className="text-3xl font-bold text-purple-400 mt-2">₹{Math.round(prediction)}</h2>
          </div>
          <span className="p-3 bg-purple-500/10 text-purple-400 rounded-xl">
            <FiCpu size={24} />
          </span>
        </div>

        {/* Budget overview Card */}
        <div className="glass-card p-6">
          <div className="flex justify-between items-center mb-2">
            <p className="text-[#A0A3BD] text-sm">Monthly Budget Limit</p>
            <span className="text-sm font-semibold text-yellow-400">{budgetUsed}%</span>
          </div>
          <div className="w-full bg-[#2A2E3F] h-2.5 rounded-full overflow-hidden mt-3">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                budgetUsed > 100
                  ? "bg-red-500"
                  : budgetUsed > 80
                  ? "bg-yellow-500"
                  : "bg-[#7C4DFF]"
              }`}
              style={{ width: `${Math.min(budgetUsed, 100)}%` }}
            />
          </div>
        </div>
      </motion.div>

      {/* Warnings & Alerts */}
      {budgetUsed >= 80 && budgetUsed < 100 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 p-4 rounded-xl text-sm"
        >
          ⚠️ Warning: You've consumed {budgetUsed}% of your allocated monthly budget. Consider restricting non-essential purchases.
        </motion.div>
      )}
      {budgetUsed >= 100 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm font-semibold"
        >
          🚨 Budget Exceeded: You have spent ₹{totalExpense - budget} over your monthly limit!
        </motion.div>
      )}

      {/* Main Content Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6"
      >
        {/* Left column: Recent transactions */}
        <div className="lg:col-span-2 glass-card p-6">
          <h3 className="text-xl font-bold mb-4">Recent Transactions</h3>
          <p className="text-sm text-[#A0A3BD] mb-6">Latest activities for the selected month</p>

          <div className="space-y-3">
            {recentTransactions.length === 0 ? (
              <div className="h-[200px] flex items-center justify-center text-[#A0A3BD]">
                No transactions recorded this month.
              </div>
            ) : (
              recentTransactions.map((item) => (
                <div
                  key={item._id}
                  className="bg-[#1A1D29]/50 border border-[#2A2E3F]/40 rounded-xl p-4 flex justify-between items-center"
                >
                  <div>
                    <h4 className="font-semibold text-base">{item.category}</h4>
                    <p className="text-xs text-[#A0A3BD]">
                      {new Date(item.date).toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className={`font-bold text-base ${
                      item.type === "income" ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {item.type === "income" ? "+" : "-"} ₹{item.amount}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right column: AI saving tips */}
        <div className="glass-card p-6 h-fit">
          <h3 className="text-xl font-bold mb-4">AI Saving Suggestions 💡</h3>
          <p className="text-sm text-[#A0A3BD] mb-6">Personalized AI recommendations based on your spending</p>

          <div className="space-y-3">
            {suggestions.length === 0 ? (
              <div className="p-4 bg-[#1A1D29]/30 rounded-xl text-[#A0A3BD] text-sm">
                No active recommendations. Keep maintaining healthy financial discipline!
              </div>
            ) : (
              suggestions.map((tip, index) => (
                <div
                  key={index}
                  className="p-4 bg-[#1A1D29]/50 border border-[#2A2E3F]/40 rounded-xl text-sm leading-relaxed"
                >
                  {tip}
                </div>
              ))
            )}
          </div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
}

export default Dashboard;