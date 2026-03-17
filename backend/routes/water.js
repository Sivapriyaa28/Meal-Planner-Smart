const express  = require('express');
const router   = express.Router();
const WaterLog = require('../models/WaterLog');
const { protect } = require('../middleware/auth');
router.use(protect);
router.get('/', async (req, res) => {
  try {
    const date = req.query.date || new Date().toISOString().split('T')[0];
    const log  = await WaterLog.findOne({ user: req.user._id, date });
    res.json({ date, glasses: log ? log.glasses : 0 });
  } catch (err) { res.status(500).json({ message: 'Failed to fetch water log.' }); }
});
router.post('/', async (req, res) => {
  try {
    const date    = req.body.date || new Date().toISOString().split('T')[0];
    const glasses = Math.min(20, Math.max(0, req.body.glasses || 0));
    const log = await WaterLog.findOneAndUpdate(
      { user: req.user._id, date },
      { glasses },
      { new: true, upsert: true }
    );
    res.json({ date, glasses: log.glasses });
  } catch (err) { res.status(500).json({ message: 'Failed to save water log.' }); }
});
// DELETE /api/water/all
router.delete('/all', async (req, res) => {
  try {
    await WaterLog.deleteMany({ user: req.user._id });
    res.json({ message: 'All water logs cleared.' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to clear water logs.' });
  }
});
module.exports = router;
