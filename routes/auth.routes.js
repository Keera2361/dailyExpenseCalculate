const express = require("express");
const authRoutes = express.Router();

const {
  registerUser,
  loginUser,
  logoutUser,
} = require("../controllers/authController.js");

const { protect } = require("../middlewares/auth.middleware");

authRoutes.post("/register", registerUser);

authRoutes.post("/login", loginUser);

authRoutes.post('/logout', protect, logoutUser);


module.exports = authRoutes;