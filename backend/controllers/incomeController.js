import Income from "../models/incomeModel.js";
import XSLX from "xlsx";
import getDateRange from "../utils/dateFilter.js";

export async function addIncome(req, res) {
  const userId = req.user._id;
  const { description, category, amount, date } = req.body;

  try {
    if (!description || !category || !amount || !date) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    const newIncome = new Income({
      userId,
      description,
      category,
      amount,
      date: new Date(date),
    });

    await newIncome.save();

    return res.status(201).json({
      success: true,
      message: "Income created successfully!",
      data: newIncome,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
}

export async function getAllIncomes(req, res) {
  const userId = req.user._id;

  try {
    const incomes = await Income.find({ userId }).sort({ date: -1 });
    return res.status(200).json({ success: true, data: incomes });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
}

export async function updateIncome(req, res) {
  const { id } = req.params;
  const userId = req.user._id;
  const { description, amount } = req.body;

  try {
    const updatedIncome = await Income.findOneAndUpdate(
      { _id: id, userId },
      { description, amount },
      { new: true },
    );

    if (!updateIncome) {
      return res
        .status(404)
        .json({ success: false, message: "Income not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Income updated successfully.",
      data: updatedIncome,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
}

export async function deleteIncome(req, res) {
  const { id } = req.params;

  try {
    const income = await Income.findByIdAndDelete({ _id: id });

    if (!income) {
      return res
        .status(404)
        .json({ success: false, message: "Income not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Income deleted successfully.",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
}

export async function downloadIncomeExcel(req, res) {
  const userId = req.user._id;

  try {
    const incomes = await Income.find({ userId }).sort({ date: -1 });
    const plainData = incomes.map((income) => ({
      Description: income.description,
      Amount: income.amount,
      Date: new Date(income.date).toLocaleDateString(),
    }));

    const worksheet = XSLX.utils.json_to_sheet(plainData);
    const workbook = XSLX.utils.book_new();
    XSLX.utils.book_append_sheet(workbook, worksheet, "incomeModel");
    XSLX.writeFile(workbook, "income_details.xlsx");

    res.download("income_details.xlsx");
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
}

export async function getIncomeOverview(req, res) {
  const userId = req.user._id;

  try {
    const { range = "monthly" } = req.query;
    const { start, end } = getDateRange(range);

    const incomes = await Income.find({
      userId,
      date: { $gte: start, $lte: end },
    }).sort({ date: -1 });

    const totalIncome = incomes.reduce((acc, cur) => acc + cur.amount, 0);
    const averageIncome = incomes.length > 0 ? totalIncome / incomes.length : 0;
    const numberOfTransactions = incomes.length;
    const recentTransactions = incomes.slice(0, 9);

    res.status(200).json({
      success: true,
      data: {
        totalIncome,
        averageIncome,
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
