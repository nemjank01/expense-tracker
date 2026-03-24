import Income from "../models/incomeModel.js";

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
