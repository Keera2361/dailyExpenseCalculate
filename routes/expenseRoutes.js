const express = require("express");
const router = express.Router();

const {
    addExpense,
    getExpenses,
    deleteExpense,
    deleteAllExpenses
} = require("../controllers/expenseController");

router.post("/add", addExpense);
router.get("/", getExpenses);
router.delete("/delete/all", deleteAllExpenses);
router.delete("/delete/:id", deleteExpense);

module.exports = router;