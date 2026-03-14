const express = require("express");
const authRoutes = express.Router();

const {
  registerUser,
  loginUser,
} = require("../controllers/authController.js");

authRoutes.post("/register", registerUser);

authRoutes.post("/login", loginUser);


module.exports = authRoutes;