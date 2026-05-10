const express = require("express");

const {
  addExpense,
  getExpenses,
  deleteExpense,
} = require("../controllers/expenseController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, addExpense);

router.get("/", protect, getExpenses);

router.delete("/:id", protect, deleteExpense);

module.exports = router;