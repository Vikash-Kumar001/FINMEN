import mongoose from 'mongoose';

const moodLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  emoji: { type: String, required: true },
  journal: { type: String },
  date: { type: Date, default: Date.now },
});

const MoodLog = mongoose.model('MoodLog', moodLogSchema);
export default MoodLog;
