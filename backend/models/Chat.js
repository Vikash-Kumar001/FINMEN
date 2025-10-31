import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema({
  tenantId: {
    type: String,
    required: true,
  },
  participants: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    role: {
      type: String,
      enum: ['teacher', 'parent', 'student'],
      required: true
    },
    joinedAt: {
      type: Date,
      default: Date.now
    }
  }],
  chatType: {
    type: String,
    enum: ['teacher-parent', 'teacher-student'],
    default: 'teacher-parent'
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  lastMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  },
  lastMessageAt: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  },
  unreadCount: {
    teacher: {
      type: Number,
      default: 0
    },
    parent: {
      type: Number,
      default: 0
    },
    student: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true
});

// Indexes for efficient queries
chatSchema.index({ tenantId: 1, studentId: 1, chatType: 1 });
chatSchema.index({ 'participants.userId': 1 });
chatSchema.index({ lastMessageAt: -1 });

export default mongoose.model('Chat', chatSchema);
