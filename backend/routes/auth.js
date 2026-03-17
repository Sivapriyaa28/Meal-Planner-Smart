const express = require("express");
const router  = express.Router();
const User    = require("../models/User");
const { signToken } = require("../utils/jwt");
const { protect }   = require("../middleware/auth");

function sendToken(res, user, status) {
  const token = signToken({ id: user._id, email: user.email });
  res.cookie("smp_token", token, { httpOnly: true, sameSite: "lax", maxAge: 7*24*60*60*1000 });
  res.status(status).json({ token, user: user.toPublicJSON() });
}

router.post("/register", async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    if (!firstName || !lastName || !email || !password)
      return res.status(400).json({ message: "All fields are required." });
    if (password.length < 8)
      return res.status(400).json({ message: "Password must be at least 8 characters." });
    const exists = await User.findOne({ email: email.toLowerCase().trim() });
    if (exists)
      return res.status(409).json({ message: "An account with this email already exists." });
    const user = await User.create({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.toLowerCase().trim(),
      password
    });
    sendToken(res, user, 201);
  } catch (err) {
    if (err.code === 11000)
      return res.status(409).json({ message: "Email already registered." });
    res.status(500).json({ message: "Registration failed." });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Email and password are required." });
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user)
      return res.status(401).json({ message: "Invalid email or password." });
    const match = await user.comparePassword(password);
    if (!match)
      return res.status(401).json({ message: "Invalid email or password." });
    user.lastLogin = new Date();
    await user.save();
    sendToken(res, user, 200);
  } catch (err) {
    res.status(500).json({ message: "Login failed." });
  }
});

router.post("/logout", (req, res) => {
  res.cookie("smp_token", "", { maxAge: 0 });
  res.json({ message: "Logged out." });
});

router.get("/me", protect, (req, res) => {
  res.json({ user: req.user.toPublicJSON() });
});

module.exports = router;