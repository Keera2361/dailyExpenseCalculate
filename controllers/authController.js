const User = require("../models/User.js");
const Session = require("../models/Session.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // create session and issue token with jti
    const jti = crypto.randomUUID();
    await Session.create({ userId: user._id, jti, ip: req.ip, userAgent: req.get('User-Agent') });
    const token = jwt.sign({ id: user._id, jti }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({
      message: "Register successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // create session and return token with jti
    const jti = crypto.randomUUID();
    await Session.create({ userId: user._id, jti, ip: req.ip, userAgent: req.get('User-Agent') });
    const token = jwt.sign({ id: user._id, jti }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({
      message: "Login successful",
      token : token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const logoutUser = async (req, res) => {
  try {
    // protect middleware will attach req.user with id and jti
    const { id, jti } = req.user || {};
    if (!id || !jti) return res.status(400).json({ message: 'Bad request' });

    await Session.updateOne({ userId: id, jti }, { revoked: true });
    return res.json({ message: 'Logged out' });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
};
