import mongoose from 'mongoose';

const incomeSchema = new mongoose.Schema({
  source: {
    type: String,
    required: true,
    trim: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  frequency: {
    type: String,
    enum: ['one-time', 'weekly', 'bi-weekly', 'monthly', 'quarterly', 'annually'],
    default: 'monthly'
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const expenseSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  frequency: {
    type: String,
    enum: ['one-time', 'weekly', 'bi-weekly', 'monthly', 'quarterly', 'annually'],
    default: 'monthly'
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const budgetSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true,
    default: 'My Budget'
  },
  incomes: [incomeSchema],
  expenses: [expenseSchema],
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
budgetSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Budget = mongoose.model('Budget', budgetSchema);

export default Budget;