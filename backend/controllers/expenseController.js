import Expense from "../models/expenseModel.js";
import getDateRange from "../utils/dateFilter.js";
import XSLX from "xlsx";

export async function addExpense(req, res) {
  const userId = req.user._id;
  const { description, category, amount, date } = req.body;

  try {
    if (!description || !category || !amount || !date) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    const newExpense = new Expense({
      userId,
      description,
      category,
      amount,
      date: new Date(date),
    });

    await newExpense.save();

    return res.status(201).json({
      success: true,
      message: "Expense created successfully!",
      data: newExpense,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
}

export async function getAllExpenses(req, res) {
  const userId = req.user._id;

  try {
    const expenses = await Expense.find({ userId }).sort({ date: -1 });
    return res.status(200).json({ success: true, data: expenses });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
}

export async function updateExpense(req, res) {
  const { id } = req.params;
  const userId = req.user._id;
  const { description, amount } = req.body;

  try {
    const updatedExpense = await Expense.findOneAndUpdate(
      { _id: id, userId },
      { description, amount },
      { new: true },
    );

    if (!updateExpense) {
      return res
        .status(404)
        .json({ success: false, message: "Expense not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Expense updated successfully.",
      data: updatedExpense,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
}

export async function deleteExpense(req, res) {
  const { id } = req.params;

  try {
    const expense = await Expense.findByIdAndDelete({ _id: id });

    if (!expense) {
      return res
        .status(404)
        .json({ success: false, message: "Expense not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Expense deleted successfully.",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
}

export async function downloadExpenseExcel(req, res) {
  const userId = req.user._id;

  try {
    const expenses = await Expense.find({ userId }).sort({ date: -1 });
    const plainData = expenses.map((expense) => ({
      Description: expense.description,
      Amount: expense.amount,
      Date: new Date(expense.date).toLocaleDateString(),
    }));

    const worksheet = XSLX.utils.json_to_sheet(plainData);
    const workbook = XSLX.utils.book_new();
    XSLX.utils.book_append_sheet(workbook, worksheet, "expenseModel");
    XSLX.writeFile(workbook, "expense_details.xlsx");

    res.download("expense_details.xlsx");
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
}

export async function getExpenseOverview(req, res) {
  const userId = req.user._id;

  try {
    const { range = "monthly" } = req.query;
    const { start, end } = getDateRange(range);

    const expense = await Expense.find({
      userId,
      date: { $gte: start, $lte: end },
    }).sort({ date: -1 });

    const totalExpense = expense.reduce((acc, cur) => acc + cur.amount, 0);
    const averageExpense =
      expense.length > 0 ? totalExpense / expense.length : 0;
    const numberOfTransactions = expense.length;
    const recentTransactions = expense.slice(0, 5);

    res.status(200).json({
      success: true,
      data: {
        totalExpense,
        averageExpense,
        numberOfTransactions,
        recentTransactions,
        range,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
}
