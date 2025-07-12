import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  sender: { 
    type: String, 
    enum: ['user', 'bot'], 
    required: true 
  },
  text: { 
    type: String, 
    required: true 
  },
  timestamp: { 
    type: Date, 
    default: Date.now 
  },
  starred: { 
    type: Boolean, 
    default: false 
  },
  mood: {
    type: String,
    enum: ['happy', 'sad', 'anxious', 'angry', 'neutral', 'excited', 'stressed'],
    default: 'neutral'
  },
  category: {
    type: String,
    enum: ['general', 'mood', 'motivation', 'progress', 'goals', 'achievements', 'fun'],
    default: 'general'
  }
});

const sessionSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true,
    unique: true
  },
  messages: [messageSchema],
  lastUsed: { 
    type: Date, 
    default: Date.now 
  },
  userXP: {
    type: Number,
    default: 0
  },
  chatStreak: {
    type: Number,
    default: 0
  },
  totalSessions: {
    type: Number,
    default: 0
  },
  averageMood: {
    type: String,
    enum: ['happy', 'sad', 'anxious', 'angry', 'neutral', 'excited', 'stressed'],
    default: 'neutral'
  },
  preferences: {
    language: {
      type: String,
      default: 'en'
    },
    reminderFrequency: {
      type: String,
      enum: ['daily', 'weekly', 'monthly', 'never'],
      default: 'weekly'
    },
    preferredTopics: [{
      type: String,
      enum: ['anxiety', 'depression', 'stress', 'relationships', 'academic', 'career', 'general']
    }]
  },
  achievements: [{
    type: {
      type: String,
      enum: ['first_chat', 'streak_7', 'streak_30', 'mood_tracker', 'goal_setter', 'progress_maker'],
      required: true
    },
    unlockedAt: {
      type: Date,
      default: Date.now
    },
    title: String,
    description: String
  }]
}, {
  timestamps: true
});

// Index for better query performance
sessionSchema.index({ userId: 1, lastUsed: -1 });
sessionSchema.index({ 'messages.timestamp': -1 });

// Pre-save middleware to calculate stats
sessionSchema.pre('save', function(next) {
  if (this.isModified('messages')) {
    // Calculate XP based on messages
    const userMessages = this.messages.filter(msg => msg.sender === 'user');
    this.userXP = userMessages.length * 5;
    this.chatStreak = userMessages.length;
    this.totalSessions = Math.floor(userMessages.length / 5); // Every 5 messages = 1 session
    
    // Calculate average mood
    const moodMessages = this.messages.filter(msg => msg.mood && msg.mood !== 'neutral');
    if (moodMessages.length > 0) {
      // Simple mood calculation - you can make this more sophisticated
      const moodCounts = {};
      moodMessages.forEach(msg => {
        moodCounts[msg.mood] = (moodCounts[msg.mood] || 0) + 1;
      });
      this.averageMood = Object.keys(moodCounts).reduce((a, b) => 
        moodCounts[a] > moodCounts[b] ? a : b
      );
    }
  }
  next();
});

// Methods for achievements
sessionSchema.methods.unlockAchievement = function(type, title, description) {
  const existingAchievement = this.achievements.find(a => a.type === type);
  if (!existingAchievement) {
    this.achievements.push({
      type,
      title,
      description,
      unlockedAt: new Date()
    });
    return true;
  }
  return false;
};

sessionSchema.methods.checkAchievements = function() {
  const newAchievements = [];
  
  // First chat achievement
  if (this.messages.length >= 2 && !this.achievements.find(a => a.type === 'first_chat')) {
    this.unlockAchievement('first_chat', 'First Steps', 'Started your first CBT conversation!');
    newAchievements.push('first_chat');
  }
  
  // Streak achievements
  const userMessages = this.messages.filter(msg => msg.sender === 'user');
  if (userMessages.length >= 7 && !this.achievements.find(a => a.type === 'streak_7')) {
    this.unlockAchievement('streak_7', 'Week Warrior', 'Maintained a 7-day chat streak!');
    newAchievements.push('streak_7');
  }
  
  if (userMessages.length >= 30 && !this.achievements.find(a => a.type === 'streak_30')) {
    this.unlockAchievement('streak_30', 'Month Master', 'Maintained a 30-day chat streak!');
    newAchievements.push('streak_30');
  }
  
  return newAchievements;
};

const CBTSession = mongoose.model('CBTSession', sessionSchema);
export default CBTSession;