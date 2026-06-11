const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db.js");
const authRoutes = require("./routes/auth.routes");
const expenseRoutes = require("./routes/expenseRoutes");

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.get("/", (req,res) => {
    res.send("Welcome to the Daily Expenses...");
});

app.use("/api/user", authRoutes);
app.use("/api/expenses", expenseRoutes);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
