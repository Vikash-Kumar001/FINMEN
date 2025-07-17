import mongoose from 'mongoose';

const contributionSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  date: {
    type: Date,
    default: Date.now
  },
  note: {
    type: String,
    trim: true
  }
});

const savingsGoalSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  targetAmount: {
    type: Number,
    required: true,
    min: 0
  },
  currentAmount: {
    type: Number,
    default: 0,
    min: 0
  },
  targetDate: {
    type: Date,
    required: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  icon: {
    type: String,
    default: '🎯'
  },
  color: {
    type: String,
    default: 'bg-blue-500'
  },
  contributions: [contributionSchema],
  completed: {
    type: Boolean,
    default: false
  },
  completedDate: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
savingsGoalSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  
  // Check if goal is completed
  if (this.currentAmount >= this.targetAmount && !this.completed) {
    this.completed = true;
    this.completedDate = new Date();
  }
  
  next();
});

const SavingsGoal = mongoose.model('SavingsGoal', savingsGoalSchema);

export default SavingsGoal;