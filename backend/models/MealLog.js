const mongoose = require('mongoose');
const mealLogSchema = new mongoose.Schema({
  user:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date:     { type: String, required: true },
  mealType: { type: String, enum: ['breakfast','lunch','dinner','snack'], required: true },
  foodName: { type: String, required: true, trim: true },
  calories: { type: Number, default: 0 },
  protein:  { type: Number, default: 0 },
  carbs:    { type: Number, default: 0 },
  fat:      { type: Number, default: 0 },
  quantity: { type: Number, default: 100 },
}, { timestamps: true });
mealLogSchema.index({ user: 1, date: 1 });
module.exports = mongoose.model('MealLog', mealLogSchema);
