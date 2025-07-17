import mongoose from 'mongoose';

const stockSchema = new mongoose.Schema({
  symbol: {
    type: String,
    required: true,
    trim: true,
    uppercase: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  shares: {
    type: Number,
    required: true,
    min: 0
  },
  purchasePrice: {
    type: Number,
    required: true,
    min: 0
  },
  currentPrice: {
    type: Number,
    required: true,
    min: 0
  },
  purchaseDate: {
    type: Date,
    default: Date.now
  }
});

const transactionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['buy', 'sell'],
    required: true
  },
  symbol: {
    type: String,
    required: true,
    trim: true,
    uppercase: true
  },
  shares: {
    type: Number,
    required: true,
    min: 0
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  total: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const simulationHistorySchema = new mongoose.Schema({
  day: {
    type: Number,
    required: true
  },
  cash: {
    type: Number,
    required: true
  },
  investments: {
    type: Number,
    required: true
  },
  total: {
    type: Number,
    required: true
  }
});

const investmentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  cash: {
    type: Number,
    required: true,
    default: 10000, // Starting with $10,000 virtual cash
    min: 0
  },
  stocks: [stockSchema],
  transactions: [transactionSchema],
  simulationHistory: [simulationHistorySchema],
  currentDay: {
    type: Number,
    default: 1
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
investmentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Investment = mongoose.model('Investment', investmentSchema);

export default Investment;