const Expense = require("../models/expenseModel");

exports.addExpense = async (req, res) => {
    try {
        const expense = new Expense(req.body);
        await expense.save();
        res.status(201).json(expense);
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.getExpenses = async (req, res) => {
    try {
        const expenses = await Expense.find();
        res.status(200).json(expenses);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.deleteExpense = async (req, res) => {
    try {
        await Expense.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Expense deleted" });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.deleteAllExpenses = async (req, res) => {
    try {
        await Expense.deleteMany({});
        res.status(200).json({ message: "All expenses deleted" });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
};
