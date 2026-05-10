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
  LineChart,
  Line,
  CartesianGrid,
  Legend,
} from "recharts";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function Dashboard() {

  const [expenses, setExpenses] = useState([]);

  const [amount, setAmount] = useState(500);

  const [category, setCategory] =
    useState("Food");

  const [customCategory,
    setCustomCategory] = useState("");

  const [budget, setBudget] =
    useState(25000);

  const [prediction,
    setPrediction] = useState(0);

  const currentMonth =
    new Date().getMonth();

  const [selectedMonth,
    setSelectedMonth] =
    useState(currentMonth);

  // Final Category
  const finalCategory =
    category === "Others"
      ? customCategory
      : category;

  // Fetch Expenses
  const fetchExpenses = async () => {

    try {

      const token =
        localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/api/expenses",
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      setExpenses(res.data);

    } catch (error) {

      console.log(error);

    }

  };

  // Filter Expenses
  const filteredExpenses =
    expenses.filter((item) => {

      const expenseMonth =
        new Date(item.date).getMonth();

      return expenseMonth === selectedMonth;

    });

  // ML Prediction
  const getPrediction = async () => {

    try {

      const expenseAmounts =
        filteredExpenses
          .filter(
            (item) =>
              item.type === "expense"
          )
          .map(
            (item) => item.amount
          );

      const res = await axios.post(
        "http://127.0.0.1:8000/predict",
        {
          expenses: expenseAmounts,
        }
      );

      setPrediction(
        res.data.prediction
      );

    } catch (error) {

      console.log(error);

    }

  };

  useEffect(() => {

    fetchExpenses();

  }, []);

  useEffect(() => {

    if (
      filteredExpenses.length > 0
    ) {

      getPrediction();

    }

  }, [filteredExpenses]);

  // Add Expense
  const addExpense = async (type) => {

    try {

      const token =
        localStorage.getItem("token");

      await axios.post(
        "http://localhost:5000/api/expenses",
        {
          amount,
          category: finalCategory,
          type,
        },
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      fetchExpenses();

      setAmount(500);

      setCategory("Food");

      setCustomCategory("");

    } catch (error) {

      console.log(error);

    }

  };

  // Delete
  const deleteExpense = async (id) => {

    try {

      const token =
        localStorage.getItem("token");

      await axios.delete(
        `http://localhost:5000/api/expenses/${id}`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      fetchExpenses();

    } catch (error) {

      console.log(error);

    }

  };

  // Export CSV
  const exportCSV = () => {

    const headers = [
      "Category",
      "Type",
      "Amount",
      "Date",
    ];

    const rows =
      filteredExpenses.map((item) => [

        item.category,

        item.type,

        item.amount,

        new Date(item.date)
          .toLocaleDateString(),

      ]);

    let csvContent =
      headers.join(",") + "\n";

    rows.forEach((row) => {

      csvContent +=
        row.join(",") + "\n";

    });

    const blob = new Blob(
      [csvContent],
      { type: "text/csv" }
    );

    const url =
      window.URL.createObjectURL(blob);

    const a =
      document.createElement("a");

    a.href = url;

    a.download = "expenses.csv";

    a.click();

  };

  // Export PDF
  const exportPDF = () => {

    const doc = new jsPDF();

    doc.setFontSize(18);

    doc.text(
      "Expense Report",
      14,
      20
    );

    const tableData =
      filteredExpenses.map((item) => [

        item.category,

        item.type,

        `₹${item.amount}`,

        new Date(item.date)
          .toLocaleDateString(),

      ]);

    autoTable(doc, {

      startY: 30,

      head: [[
        "Category",
        "Type",
        "Amount",
        "Date",
      ]],

      body: tableData,

    });

    doc.save(
      "expense-report.pdf"
    );

  };

  // Totals
  const totalIncome =
    filteredExpenses
      .filter(
        (item) =>
          item.type === "income"
      )
      .reduce(
        (acc, item) =>
          acc + item.amount,
        0
      );

  const totalExpense =
    filteredExpenses
      .filter(
        (item) =>
          item.type === "expense"
      )
      .reduce(
        (acc, item) =>
          acc + item.amount,
        0
      );

  const balance =
    totalIncome - totalExpense;

  // Budget
  const budgetUsed =
    budget > 0
      ? (
        (totalExpense / budget) * 100
      ).toFixed(1)
      : 0;

  // Financial Health Score
  let healthScore = 100;

  // Expense ratio analysis
  if (totalIncome > 0) {

    const expenseRatio =
      (totalExpense / totalIncome) * 100;

    if (expenseRatio > 90) {

      healthScore -= 40;

    } else if (expenseRatio > 70) {

      healthScore -= 25;

    } else if (expenseRatio > 50) {

      healthScore -= 10;

    }

  }

  // Budget analysis
  if (budgetUsed > 100) {

    healthScore -= 30;

  } else if (budgetUsed > 80) {

    healthScore -= 15;

  }

  // Negative balance
  if (balance < 0) {

    healthScore -= 20;

  }

  // Minimum score
  healthScore = Math.max(
    healthScore,
    0
  );

  // Chart Data
  const categoryData = [];

  filteredExpenses.forEach((item) => {

    const existing =
      categoryData.find(
        (data) =>
          data.name === item.category
      );

    if (existing) {

      existing.value += item.amount;

    } else {

      categoryData.push({

        name: item.category,

        value: item.amount,

      });

    }

  });

  // AI Suggestions
  const suggestions = [];

  categoryData.forEach((item) => {

    if (
      item.name === "Food" &&
      item.value > 5000
    ) {

      suggestions.push(
        "🍔 Food expenses are high this month."
      );

    }

    if (
      item.name === "Shopping" &&
      item.value > 7000
    ) {

      suggestions.push(
        "🛍 Reduce shopping expenses to save more."
      );

    }

  });

  if (budgetUsed < 50) {

    suggestions.push(
      "✅ Excellent budgeting this month."
    );

  }

  if (budgetUsed > 90) {

    suggestions.push(
      "⚠ You are close to exceeding your budget."
    );

  }

  const COLORS = [
    "#22c55e",
    "#3b82f6",
    "#ef4444",
    "#f59e0b",
    "#a855f7",
  ];

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const forecastData = [
    {
      month: "Current",
      expense: totalExpense,
    },
    {
      month: "Next",
      expense: Math.round(prediction),
    },
    {
      month: "2 Months",
      expense: Math.round(prediction * 1.08),
    },
    {
      month: "3 Months",
      expense: Math.round(prediction * 1.15),
    },
  ];

  return (

    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white">

      {/* Navbar */}
      <div className="sticky top-0 z-50 backdrop-blur-xl bg-slate-900/70 border-b border-white/10">

        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

          <h1 className="text-3xl font-bold">

            Smart Expense Predictor 💰

          </h1>

          <button
            onClick={() => {

              localStorage.removeItem("token");

              window.location.href = "/";

            }}
            className="bg-red-500 hover:bg-red-600 px-5 py-2 rounded-xl font-semibold transition"
          >
            Logout
          </button>

        </div>

      </div>

      {/* Main */}
      <div className="max-w-7xl mx-auto p-6">

        {/* Month Filter */}
        <div className="flex justify-end mb-6">

          <select
            value={selectedMonth}
            onChange={(e) =>
              setSelectedMonth(
                Number(e.target.value)
              )
            }
            className="bg-white/10 border border-white/10 backdrop-blur-lg px-4 py-3 rounded-xl outline-none"
          >

            {
              months.map((month, index) => (

                <option
                  key={index}
                  value={index}
                  className="bg-slate-900"
                >
                  {month}
                </option>

              ))
            }

          </select>

        </div>

        {/* Cards */}
        {/* Cards */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

  {/* Income */}
  <div className="bg-white/10 border border-white/10 backdrop-blur-lg rounded-2xl p-4 hover:scale-[1.02] transition duration-300">

    <p className="text-gray-300">
      Income
    </p>

    <h2 className="text-2xl font-bold text-green-400 mt-3">
      ₹{totalIncome}
    </h2>

  </div>

  {/* Expense */}
  <div className="bg-white/10 border border-white/10 backdrop-blur-lg rounded-2xl p-4 hover:scale-[1.02] transition duration-300">

    <p className="text-gray-300">
      Expense
    </p>

    <h2 className="text-2xl font-bold text-red-400 mt-3">
      ₹{totalExpense}
    </h2>

  </div>

  {/* Balance */}
  <div className="bg-white/10 border border-white/10 backdrop-blur-lg rounded-2xl p-4 hover:scale-[1.02] transition duration-300">

    <p className="text-gray-300">
      Balance
    </p>

    <h2 className="text-2xl font-bold text-blue-400 mt-3">
      ₹{balance}
    </h2>

  </div>

  {/* Budget */}
  <div className="bg-white/10 border border-white/10 backdrop-blur-lg rounded-2xl p-4 hover:scale-[1.02] transition duration-300">

    <p className="text-gray-300">
      Monthly Budget
    </p>

    <input
      type="number"
      value={budget}
      onChange={(e) =>
        setBudget(
          Number(e.target.value)
        )
      }
      className="w-full mt-3 bg-slate-800/70 p-3 rounded-xl outline-none"
    />

    <p className="text-yellow-400 mt-3 font-semibold">
      {
        budgetUsed > 100
          ? `Exceeded by ${(budgetUsed - 100).toFixed(1)}%`
          : `Used: ${budgetUsed}%`
      }
    </p>

  </div>

  {/* ML Prediction */}
  <div className="bg-white/10 border border-white/10 backdrop-blur-lg rounded-2xl p-4 hover:scale-[1.02] transition duration-300">

    <p className="text-gray-300">
      Predicted Expense
    </p>

    <h2 className="text-2xl font-bold text-purple-400 mt-3">

      ₹{Math.round(prediction)}

    </h2>

    <p className="text-sm text-gray-400 mt-2">

      Based on ML analysis

    </p>

  </div>

  {/* Financial Health */}
  <div className="bg-white/10 border border-white/10 backdrop-blur-lg rounded-2xl p-4 hover:scale-[1.02] transition duration-300">

    <p className="text-gray-300">
      Financial Health
    </p>

    <h2 className="text-2xl font-bold text-cyan-400 mt-3">

      {healthScore}/100

    </h2>

    <p className="text-sm text-gray-400 mt-2">

      AI Financial Analysis

    </p>

  </div>

</div>

        {/* Alerts */}
        {
          budgetUsed >= 80 &&
          budgetUsed < 100 && (

            <div className="mt-6 bg-yellow-500/20 border border-yellow-500 text-yellow-300 p-4 rounded-2xl">

              ⚠ Warning:
              You used {budgetUsed}% of budget.

            </div>

          )
        }

        {
          budgetUsed >= 100 && (

            <div className="mt-6 bg-red-500/20 border border-red-500 text-red-300 p-4 rounded-2xl">

              🚨 Budget exceeded!

            </div>

          )
        }

        {/* Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">

          {/* LEFT */}
          <div className="lg:col-span-2 space-y-6">

            {/* Transactions */}
            <div className="bg-white/10 border border-white/10 backdrop-blur-lg rounded-2xl p-6">

              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">

                <div>

                  <h2 className="text-2xl font-bold">

                    {months[selectedMonth]} Transactions

                  </h2>

                  <p className="text-green-400 mt-1">
                    Total: ₹{totalExpense}
                  </p>

                </div>

                <div className="flex gap-3">

                  <button
                    onClick={exportCSV}
                    className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-xl"
                  >
                    CSV
                  </button>

                  <button
                    onClick={exportPDF}
                    className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-xl"
                  >
                    PDF
                  </button>

                </div>

              </div>

              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">

                {
                  filteredExpenses.length === 0 ? (

                    <p className="text-gray-300">
                      No transactions available.
                    </p>

                  ) : (

                    filteredExpenses.map((item) => (

                      <div
                        key={item._id}
                        className="bg-slate-800/70 rounded-xl p-3 flex justify-between items-center hover:scale-[1.02] transition duration-300"
                      >

                        <div>

                          <h3 className="font-semibold text-lg">
                            {item.category}
                          </h3>

                          <p className="text-sm text-gray-400">
                            {
                              new Date(item.date)
                                .toLocaleDateString()
                            }
                          </p>

                        </div>

                        <div className="flex items-center gap-4">

                          <p
                            className={`font-bold ${
                              item.type === "income"
                                ? "text-green-400"
                                : "text-red-400"
                            }`}
                          >
                            {item.type === "income"
                              ? "+"
                              : "-"} ₹
                            {item.amount}
                          </p>

                          <button
                            onClick={() =>
                              deleteExpense(item._id)
                            }
                            className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-xl text-sm font-semibold transition"
                          >
                            Delete
                          </button>

                        </div>

                      </div>

                    ))

                  )
                }

              </div>

            </div>

          </div>

          {/* RIGHT */}
          <div className="space-y-5">

            {/* Add Transaction */}
            <div className="bg-white/10 border border-white/10 backdrop-blur-lg rounded-2xl p-6">

              <h2 className="text-2xl font-bold mb-5">

                Add Transaction

              </h2>

              {/* Category */}
              <select
                value={category}
                onChange={(e) =>
                  setCategory(
                    e.target.value
                  )
                }
                className="w-full bg-slate-800/70 p-3 rounded-xl outline-none"
              >

                <option>Food</option>
                <option>Travel</option>
                <option>Shopping</option>
                <option>Bills</option>
                <option>Education</option>
                <option>Entertainment</option>
                <option>Health</option>
                <option>Others</option>

              </select>

              {/* Custom */}
              {
                category === "Others" && (

                  <input
                    type="text"
                    placeholder="Custom Category"
                    value={customCategory}
                    onChange={(e) =>
                      setCustomCategory(
                        e.target.value
                      )
                    }
                    className="w-full mt-4 bg-slate-800/70 p-3 rounded-xl outline-none"
                  />

                )
              }

              {/* Amount */}
              <div className="mt-5">

                <input
                  type="number"
                  value={amount}
                  onChange={(e) =>
                    setAmount(
                      Number(e.target.value)
                    )
                  }
                  className="w-full bg-slate-800/70 p-3 rounded-xl outline-none"
                />

                <input
                  type="range"
                  min="0"
                  max="100000"
                  value={amount}
                  onChange={(e) =>
                    setAmount(
                      Number(e.target.value)
                    )
                  }
                  className="w-full mt-4 accent-green-500"
                />

                <p className="mt-2 text-green-400 font-semibold">
                  ₹{amount}
                </p>

              </div>

              {/* Buttons */}
              <div className="flex gap-3 mt-5">

                <button
                  onClick={() =>
                    addExpense("income")
                  }
                  className="flex-1 bg-green-500 hover:bg-green-600 py-3 rounded-xl font-semibold"
                >
                  Income
                </button>

                <button
                  onClick={() =>
                    addExpense("expense")
                  }
                  className="flex-1 bg-red-500 hover:bg-red-600 py-3 rounded-xl font-semibold"
                >
                  Expense
                </button>

              </div>

            </div>

            {/* Analytics */}
            <div className="bg-white/10 border border-white/10 backdrop-blur-lg rounded-2xl p-6">

              <h2 className="text-2xl font-bold mb-5">

                Analytics

              </h2>

              <div className="grid grid-cols-2 gap-4 mt-6 items-center">

                {/* Pie Chart */}
                <div className="flex flex-col items-center justify-center">

                  <h3 className="text-lg font-semibold mb-3 text-center">
                    Expense Categories
                  </h3>

                  <ResponsiveContainer
                    width="100%"
                    height={220}
                  >

                    <PieChart>

                      <Pie
                        data={categoryData}
                        dataKey="value"
                        nameKey="name"
                        outerRadius={70}
                        cx="50%"
                        cy="50%"
                      >

                        {
                          categoryData.map(
                            (entry, index) => (

                              <Cell
                                key={index}
                                fill={
                                  COLORS[
                                    index %
                                    COLORS.length
                                  ]
                                }
                              />

                            )
                          )
                        }

                      </Pie>

                      <Tooltip />

                    </PieChart>

                  </ResponsiveContainer>

                </div>

                {/* Bar Chart */}
                <div className="flex flex-col items-center justify-center">

                  <h3 className="text-lg font-semibold mb-3 text-center">
                    Income vs Expense
                  </h3>

                  <ResponsiveContainer
                    width="100%"
                    height={220}
                  >

                    <BarChart
                      data={[
                        {
                          name: "Income",
                          amount: totalIncome,
                        },
                        {
                          name: "Expense",
                          amount: totalExpense,
                        },
                      ]}
                    >

                      <XAxis dataKey="name" />

                      <YAxis />

                      <Tooltip />

                      <Bar
                        dataKey="amount"
                        fill="#22c55e"
                        barSize={40}
                      />

                    </BarChart>

                  </ResponsiveContainer>

                </div>

              </div>

            </div>

          </div>

        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">

          {/* Forecast Trend */}
          <div className="bg-white/10 border border-white/10 backdrop-blur-lg rounded-2xl p-6 hover:scale-[1.02] transition duration-300">

            <h2 className="text-2xl font-bold mb-5">

              Expense Forecast Trend 📈

            </h2>

            <ResponsiveContainer
              width="100%"
              height={250}
            >

              <LineChart data={forecastData}>

                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#444"
                />

                <XAxis dataKey="month" />

                <YAxis />

                <Tooltip />

                <Legend />

                <Line
                  type="monotone"
                  dataKey="expense"
                  stroke="#a855f7"
                  strokeWidth={3}
                />

              </LineChart>

            </ResponsiveContainer>

          </div>

          {/* AI Suggestions */}
          <div className="bg-white/10 border border-white/10 backdrop-blur-lg rounded-2xl p-6 hover:scale-[1.02] transition duration-300">

            <h2 className="text-2xl font-bold mb-5">

              AI Saving Suggestions 💡

            </h2>

            <div className="space-y-3">

              {
                suggestions.length === 0 ? (

                  <p className="text-gray-300">
                    No suggestions available.
                  </p>

                ) : (

                  suggestions.map(
                    (tip, index) => (

                      <div
                        key={index}
                        className="bg-slate-800/70 p-4 rounded-xl"
                      >

                        {tip}

                      </div>

                    )
                  )

                )
              }

            </div>

          </div>

        </div>

      </div>

    </div>

  );

}

export default Dashboard;