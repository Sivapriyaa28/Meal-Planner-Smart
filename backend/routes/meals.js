const express = require("express");
const router  = express.Router();
const MealLog = require("../models/MealLog");
const { protect } = require("../middleware/auth");

router.use(protect);

// GET /api/meals
router.get("/", async (req, res) => {
  try {
    const q = { user: req.user._id };
    if (req.query.date) q.date = req.query.date;
    const meals = await MealLog.find(q).sort({ createdAt: 1 });
    res.json({ meals });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch meals." });
  }
});

// POST /api/meals
router.post("/", async (req, res) => {
  try {
    const { mealType, foodName, calories, protein, carbs, fat, quantity, date } = req.body;
    if (!mealType || !foodName)
      return res.status(400).json({ message: "Meal type and food name are required." });
    const meal = await MealLog.create({
      user: req.user._id,
      date: date || new Date().toISOString().split("T")[0],
      mealType, foodName,
      calories: calories || 0,
      protein:  protein  || 0,
      carbs:    carbs    || 0,
      fat:      fat      || 0,
      quantity: quantity || 100
    });
    res.status(201).json({ meal });
  } catch (err) {
    res.status(500).json({ message: "Failed to save meal." });
  }
});

// DELETE /api/meals/all  ← MUST BE BEFORE /:id
router.delete("/all", async (req, res) => {
  try {
    await MealLog.deleteMany({ user: req.user._id });
    res.json({ message: "All meals cleared." });
  } catch (err) {
    res.status(500).json({ message: "Failed to clear meals." });
  }
});

// DELETE /api/meals/:id  ← MUST BE AFTER /all
router.delete("/:id", async (req, res) => {
  try {
    const meal = await MealLog.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!meal) return res.status(404).json({ message: "Meal not found." });
    res.json({ message: "Deleted." });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete meal." });
  }
});

module.exports = router;