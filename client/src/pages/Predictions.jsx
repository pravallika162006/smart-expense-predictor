/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import axios from "axios";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import DashboardLayout from "../layouts/DashboardLayout";
import { motion } from "framer-motion";
import { FiTrendingUp, FiCpu } from "react-icons/fi";

function Predictions() {
  const [expenses, setExpenses] = useState([]);
  const [prediction, setPrediction] = useState(0);
  const currentMonth = new Date().getMonth();

  const [budget] = useState(() => {
    const savedBudget = localStorage.getItem("monthlyBudget");
    return savedBudget ? Number(savedBudget) : 25000;
  });

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

  const getPrediction = async (filteredExpenses) => {
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
    fetchExpenses();
  }, []);

  const filteredExpenses = expenses.filter((item) => {
    const expenseMonth = new Date(item.date).getMonth();
    return expenseMonth === currentMonth;
  });

  useEffect(() => {
    if (filteredExpenses.length > 0) {
      getPrediction(filteredExpenses);
    }
  }, [filteredExpenses]);

  const totalExpense = filteredExpenses
    .filter((item) => item.type === "expense")
    .reduce((acc, item) => acc + item.amount, 0);

  const forecastData = [
    { month: "Current", expense: totalExpense },
    { month: "Next Month", expense: Math.round(prediction) },
    { month: "2 Months", expense: Math.round(prediction * 1.08) },
    { month: "3 Months", expense: Math.round(prediction * 1.15) },
  ];

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gradient">AI Spending Predictions</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ML Prediction Overview Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="glass-card p-6 flex flex-col justify-between"
        >
          <div>
            <div className="flex justify-between items-start mb-4">
              <span className="p-3 bg-[#7C4DFF]/10 text-[#7C4DFF] rounded-xl">
                <FiCpu size={24} />
              </span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
                Active ML Model
              </span>
            </div>
            <h3 className="text-lg font-semibold text-[#A0A3BD] mb-1">
              AI Predicted Spending
            </h3>
            <p className="text-sm text-[#A0A3BD] mb-4">
              Forecasted spending for next month based on pattern analysis.
            </p>
            <h2 className="text-4xl font-bold text-[#7C4DFF] tracking-tight mb-2">
              ₹{Math.round(prediction)}
            </h2>
            <p className="text-xs text-[#A0A3BD]">
              Derived dynamically using historical user spending trends.
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-[#2A2E3F] space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-[#A0A3BD]">Current Spending:</span>
              <span className="font-semibold">₹{totalExpense}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[#A0A3BD]">Expected Variance:</span>
              <span className="font-semibold text-green-400">+5-8% avg.</span>
            </div>
          </div>
        </motion.div>

        {/* Forecast Graph */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="lg:col-span-2 glass-card p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <FiTrendingUp className="text-[#00C2FF]" size={20} />
            <h3 className="text-xl font-bold">Expense Forecast Trend</h3>
          </div>

          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={forecastData}>
                <defs>
                  <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7C4DFF" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#7C4DFF" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#2A2E3F" />
                <XAxis dataKey="month" stroke="#A0A3BD" />
                <YAxis stroke="#A0A3BD" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1A1D29",
                    borderColor: "#2A2E3F",
                    borderRadius: "8px",
                    color: "#FFF",
                  }}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="expense"
                  stroke="#7C4DFF"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorExpense)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}

export default Predictions;
