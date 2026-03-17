const mongoose = require('mongoose');
const userProfileSchema = new mongoose.Schema({
  user:          { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  goal:          { type: String, enum: ['lose','maintain','gain'], default: 'maintain' },
  gender:        { type: String, enum: ['male','female','other'], default: 'other' },
  activity:      { type: String, enum: ['sedentary','light','moderate','very_active'], default: 'moderate' },
  height:        { type: Number, default: 170 },
  weight:        { type: Number, default: 70 },
  targetWeight:  { type: Number, default: 65 },
  age:           { type: Number, default: 25 },
  bmi:           { type: Number, default: 0 },
  bmiCategory:   { type: String, default: '' },
  dailyCalories: { type: Number, default: 2000 },
  dailyProtein:  { type: Number, default: 100 },
  onboardingDone:{ type: Boolean, default: false },
}, { timestamps: true });
module.exports = mongoose.model('UserProfile', userProfileSchema);
