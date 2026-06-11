const express = require("express");
const router = express.Router();

const {
    addExpense,
    getExpenses,
    deleteExpense
} = require("../controllers/expenseController");
 
const { deleteAllExpenses } = require("../controllers/expenseController");

const { protect } = require("../middlewares/auth.middleware");

router.post("/add", protect, addExpense);
router.get("/", protect, getExpenses);
router.delete("/delete/:id", protect, deleteExpense);
router.delete("/delete/all", protect, deleteAllExpenses);

module.exports = router;