import mongoose from 'mongoose';

const xpLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  xp: {
    type: Number,
    required: true,
  },
  reason: {
    type: String,
    enum: ['mood_checkin', 'journal_entry', 'game_played', 'reward_redeemed', 'admin_adjustment'],
    default: 'mood_checkin',
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const XPLog = mongoose.model('XPLog', xpLogSchema);
export default XPLog;
