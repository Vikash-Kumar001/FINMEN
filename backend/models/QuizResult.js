import mongoose from 'mongoose';

const answerSchema = new mongoose.Schema({
  questionId: {
    type: String,
    required: true
  },
  question: {
    type: String,
    required: true
  },
  userAnswer: {
    type: String,
    required: true
  },
  correctAnswer: {
    type: String,
    required: true
  },
  isCorrect: {
    type: Boolean,
    required: true
  }
});

const quizResultSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  quizId: {
    type: String,
    required: true
  },
  quizTitle: {
    type: String,
    required: true
  },
  score: {
    type: Number,
    required: true,
    min: 0
  },
  totalQuestions: {
    type: Number,
    required: true,
    min: 1
  },
  percentageScore: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  timeTaken: {
    type: Number, // in seconds
    required: true,
    min: 0
  },
  answers: [answerSchema],
  xpEarned: {
    type: Number,
    default: 0,
    min: 0
  },
  completedAt: {
    type: Date,
    default: Date.now
  }
});

// Calculate percentage score before saving
quizResultSchema.pre('save', function(next) {
  if (this.isNew) {
    this.percentageScore = (this.score / this.totalQuestions) * 100;
    
    // Calculate XP earned based on score
    // Base XP for completing the quiz
    let xp = 10;
    
    // Additional XP based on percentage score
    if (this.percentageScore >= 90) {
      xp += 40; // Excellent performance
    } else if (this.percentageScore >= 75) {
      xp += 25; // Good performance
    } else if (this.percentageScore >= 50) {
      xp += 15; // Average performance
    } else {
      xp += 5; // Poor performance but still get some XP for trying
    }
    
    this.xpEarned = xp;
  }
  
  next();
});

const QuizResult = mongoose.model('QuizResult', quizResultSchema);

export default QuizResult;