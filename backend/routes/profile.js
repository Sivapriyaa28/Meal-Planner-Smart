const express = require("express");
const router  = express.Router();
const UserProfile = require("../models/UserProfile");
const { protect } = require("../middleware/auth");

router.use(protect);

router.get("/", async (req, res) => {
  try {
    const profile = await UserProfile.findOne({ user: req.user._id });
    res.json({ profile: profile || null });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch profile." });
  }
});

router.post("/", async (req, res) => {
  try {
    const fields = ["goal","gender","activity","height","weight","targetWeight","age","bmi","bmiCategory","dailyCalories","dailyProtein","onboardingDone"];
    const update = {};
    fields.forEach(f => { if (req.body[f] !== undefined) update[f] = req.body[f]; });
    const profile = await UserProfile.findOneAndUpdate(
      { user: req.user._id },
      { ...update, user: req.user._id },
      { new: true, upsert: true }
    );
    res.json({ profile });
  } catch (err) {
    res.status(500).json({ message: "Failed to save profile." });
  }
});

// DELETE /api/profile
router.delete('/', async (req, res) => {
  try {
    await UserProfile.findOneAndDelete({ user: req.user._id });
    res.json({ message: 'Profile reset.' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to reset profile.' });
  }
});
module.exports = router;