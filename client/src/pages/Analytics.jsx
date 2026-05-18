/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from "recharts";
import DashboardLayout from "../layouts/DashboardLayout";
import { motion } from "framer-motion";

function Analytics() {
  const [expenses, setExpenses] = useState([]);
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

  const categoryData = [];
  filteredExpenses.forEach((item) => {
    if (item.type === "expense") {
      const existing = categoryData.find((data) => data.name === item.category);
      if (existing) {
        existing.value += item.amount;
      } else {
        categoryData.push({
          name: item.category,
          value: item.amount,
        });
      }
    }
  });

  const totalIncome = filteredExpenses
    .filter((item) => item.type === "income")
    .reduce((acc, item) => acc + item.amount, 0);

  const totalExpense = filteredExpenses
    .filter((item) => item.type === "expense")
    .reduce((acc, item) => acc + item.amount, 0);

  const COLORS = ["#22c55e", "#3b82f6", "#ef4444", "#f59e0b", "#a855f7"];
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gradient">Visual Analytics</h2>
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

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {/* Pie Chart Card */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold mb-6 text-center">
            Expense by Categories ({months[selectedMonth]})
          </h3>
          {categoryData.length === 0 ? (
            <div className="h-[250px] flex items-center justify-center text-[#A0A3BD]">
              No expenses recorded for this month.
            </div>
          ) : (
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={80}
                    cx="50%"
                    cy="50%"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1A1D29",
                      borderColor: "#2A2E3F",
                      borderRadius: "8px",
                      color: "#FFF",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Bar Chart Card */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold mb-6 text-center">
            Income vs Expense Balance ({months[selectedMonth]})
          </h3>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={[
                  { name: "Income", amount: totalIncome, fill: "#00C2FF" },
                  { name: "Expense", amount: totalExpense, fill: "#7C4DFF" },
                ]}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <XAxis dataKey="name" stroke="#A0A3BD" />
                <YAxis stroke="#A0A3BD" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1A1D29",
                    borderColor: "#2A2E3F",
                    borderRadius: "8px",
                    color: "#FFF",
                  }}
                />
                <Bar dataKey="amount" radius={[8, 8, 0, 0]}>
                  <Cell fill="#00C2FF" />
                  <Cell fill="#7C4DFF" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
}

export default Analytics;
