const Expense = require("../models/Expense");


// ADD EXPENSE / INCOME
const addExpense = async (req, res) => {

  try {

    const { amount, category, type } = req.body;

    const expense = await Expense.create({
      user: req.user._id,
      amount,
      category,
      type,
    });

    res.status(201).json(expense);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};


// GET ALL
const getExpenses = async (req, res) => {

  try {

    const expenses = await Expense.find({
      user: req.user._id,
    });

    res.status(200).json(expenses);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};


// DELETE
const deleteExpense = async (req, res) => {

  try {

    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({
        message: "Expense not found",
      });
    }

    await expense.deleteOne();

    res.status(200).json({
      message: "Deleted Successfully",
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};

module.exports = {
  addExpense,
  getExpenses,
  deleteExpense,
};