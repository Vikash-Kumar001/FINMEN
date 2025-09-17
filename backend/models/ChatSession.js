import mongoose from 'mongoose';

const chatMessageSchema = new mongoose.Schema({
  sender: {
    type: String,
    required: true,
    enum: ['user', 'bot']
  },
  text: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  mood: {
    type: String,
    enum: ['happy', 'excited', 'supportive', 'playful', 'wise', 'neutral'],
    default: 'neutral'
  },
  category: {
    type: String,
    enum: ['mood', 'goals', 'progress', 'achievements', 'motivation', 'fun', 'general'],
    default: 'general'
  },
  starred: {
    type: Boolean,
    default: false
  }
});

const chatSessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  sessionId: {
    type: String,
    required: true
  },
  messages: [chatMessageSchema],
  lastUsed: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  // User stats for this chat session
  userXP: {
    type: Number,
    default: 0
  },
  chatStreak: {
    type: Number,
    default: 0
  },
  achievements: [{
    type: String
  }],
  averageMood: {
    type: String,
    enum: ['happy', 'sad', 'anxious', 'angry', 'excited', 'stressed', 'neutral'],
    default: 'neutral'
  }
});

// Index for faster queries
chatSessionSchema.index({ userId: 1 });
chatSessionSchema.index({ lastUsed: -1 });

// Update lastUsed on save
chatSessionSchema.pre('save', function(next) {
  this.lastUsed = new Date();
  next();
});

// Calculate chat streak and user XP
chatSessionSchema.methods.updateStats = function() {
  const userMessages = this.messages.filter(msg => msg.sender === 'user');
  this.chatStreak = userMessages.length;
  this.userXP = userMessages.length * 5; // 5 XP per message
  
  // Calculate average mood from bot messages
  const botMessages = this.messages.filter(msg => msg.sender === 'bot' && msg.mood);
  if (botMessages.length > 0) {
    const moodCounts = {};
    botMessages.forEach(msg => {
      moodCounts[msg.mood] = (moodCounts[msg.mood] || 0) + 1;
    });
    
    const mostFrequentMood = Object.keys(moodCounts).reduce((a, b) => 
      moodCounts[a] > moodCounts[b] ? a : b
    );
    this.averageMood = mostFrequentMood;
  }
  
  return this;
};

const ChatSession = mongoose.model('ChatSession', chatSessionSchema);

export default ChatSession;