/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import DashboardLayout from "../layouts/DashboardLayout";
import { motion } from "framer-motion";
import { FiDownload } from "react-icons/fi";

function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [amount, setAmount] = useState(500);
  const [category, setCategory] = useState("Food");
  const [customCategory, setCustomCategory] = useState("");
  const currentMonth = new Date().getMonth();
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);

  const finalCategory = category === "Others" ? customCategory : category;

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

  const addExpense = async (type) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "https://smart-expense-predictor.onrender.com/api/expenses",
        {
          amount,
          category: finalCategory,
          type,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
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

  const deleteExpense = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `https://smart-expense-predictor.onrender.com/api/expenses/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchExpenses();
    } catch (error) {
      console.log(error);
    }
  };

  const exportCSV = () => {
    const headers = ["Category", "Type", "Amount", "Date"];
    const rows = filteredExpenses.map((item) => [
      item.category,
      item.type,
      item.amount,
      new Date(item.date).toLocaleDateString(),
    ]);

    let csvContent = headers.join(",") + "\n";
    rows.forEach((row) => {
      csvContent += row.join(",") + "\n";
    });

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "expenses.csv";
    a.click();
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Expense Report", 14, 20);

    const tableData = filteredExpenses.map((item) => [
      item.category,
      item.type,
      `₹${item.amount}`,
      new Date(item.date).toLocaleDateString(),
    ]);

    autoTable(doc, {
      startY: 30,
      head: [["Category", "Type", "Amount", "Date"]],
      body: tableData,
    });

    doc.save("expense-report.pdf");
  };

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gradient">Transaction Manager</h2>
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side - Add Transaction */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="glass-card p-6 h-fit"
        >
          <h3 className="text-xl font-bold mb-5">Add Transaction</h3>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm text-[#A0A3BD] mb-2 block">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="input-modern"
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
            </div>

            {category === "Others" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
              >
                <label className="text-sm text-[#A0A3BD] mb-2 block">Custom Category</label>
                <input
                  type="text"
                  placeholder="Custom Category"
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  className="input-modern"
                />
              </motion.div>
            )}

            <div>
              <label className="text-sm text-[#A0A3BD] mb-2 block">Amount</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="input-modern"
              />
              <input
                type="range"
                min="0"
                max="100000"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full mt-4 accent-[#7C4DFF]"
              />
              <p className="mt-2 text-green-400 font-semibold text-right">
                ₹{amount}
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => addExpense("income")}
                className="flex-1 btn-glow bg-green-500 hover:bg-green-600"
              >
                Income
              </button>
              <button
                onClick={() => addExpense("expense")}
                className="flex-1 btn-glow bg-red-500 hover:bg-red-600"
              >
                Expense
              </button>
            </div>
          </div>
        </motion.div>

        {/* Right Side - Logs */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="lg:col-span-2 glass-card p-6"
        >
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
            <div>
              <h3 className="text-xl font-bold">
                {months[selectedMonth]} Transactions
              </h3>
              <p className="text-[#A0A3BD] text-sm">
                Manage your income and expenses
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={exportCSV}
                className="btn-glow flex items-center gap-2 text-sm py-2"
              >
                <FiDownload /> CSV
              </button>
              <button
                onClick={exportPDF}
                className="btn-glow flex items-center gap-2 text-sm py-2"
              >
                <FiDownload /> PDF
              </button>
            </div>
          </div>

          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
            {filteredExpenses.length === 0 ? (
              <div className="h-[200px] flex items-center justify-center text-[#A0A3BD]">
                No transactions recorded this month.
              </div>
            ) : (
              filteredExpenses.map((item) => (
                <div
                  key={item._id}
                  className="bg-[#1A1D29]/50 border border-[#2A2E3F]/40 rounded-xl p-4 flex justify-between items-center hover:translate-x-1 transition duration-300"
                >
                  <div>
                    <h4 className="font-semibold text-lg">{item.category}</h4>
                    <p className="text-xs text-[#A0A3BD]">
                      {new Date(item.date).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <span
                      className={`font-bold text-lg ${
                        item.type === "income" ? "text-green-400" : "text-red-400"
                      }`}
                    >
                      {item.type === "income" ? "+" : "-"} ₹{item.amount}
                    </span>
                    <button
                      onClick={() => deleteExpense(item._id)}
                      className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white px-3 py-1.5 rounded-lg text-sm font-semibold transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}

export default Expenses;
