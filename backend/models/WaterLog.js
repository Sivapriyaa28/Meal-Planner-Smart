const mongoose = require('mongoose');
const waterLogSchema = new mongoose.Schema({
  user:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date:    { type: String, required: true },
  glasses: { type: Number, default: 0, min: 0, max: 20 },
}, { timestamps: true });
waterLogSchema.index({ user: 1, date: 1 }, { unique: true });
module.exports = mongoose.model('WaterLog', waterLogSchema);
