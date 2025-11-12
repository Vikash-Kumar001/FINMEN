import mongoose from 'mongoose';

const calendarEventSchema = new mongoose.Schema({
  // Event Identification
  title: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  description: {
    type: String,
    default: ''
  },
  eventType: {
    type: String,
    enum: ['assessment', 'exam', 'event', 'fee_cycle', 'holiday', 'meeting', 'deadline', 'other'],
    required: true,
    index: true
  },
  
  // Date & Time
  startDate: {
    type: Date,
    required: true,
    index: true
  },
  endDate: {
    type: Date,
    required: true
  },
  allDay: {
    type: Boolean,
    default: false
  },
  timezone: {
    type: String,
    default: 'UTC'
  },
  
  // Recurrence
  isRecurring: {
    type: Boolean,
    default: false
  },
  recurrencePattern: {
    frequency: {
      type: String,
      enum: ['daily', 'weekly', 'monthly', 'yearly']
    },
    interval: Number,
    endDate: Date,
    occurrences: Number
  },
  
  // Organization Context
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    index: true
  },
  tenantId: String,
  
  // Participants
  participants: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    role: String,
    status: {
      type: String,
      enum: ['invited', 'confirmed', 'declined'],
      default: 'invited'
    }
  }],
  targetRoles: [{
    type: String,
    enum: ['student', 'parent', 'teacher', 'school_admin', 'admin']
  }],
  
  // Location
  location: {
    type: String,
    default: ''
  },
  isVirtual: {
    type: Boolean,
    default: false
  },
  meetingLink: String,
  
  // Event Specific Fields
  assessmentDetails: {
    subject: String,
    class: String,
    maxMarks: Number,
    duration: Number // in minutes
  },
  feeCycleDetails: {
    feeType: String,
    dueDate: Date,
    amount: Number,
    currency: String
  },
  
  // Status
  status: {
    type: String,
    enum: ['scheduled', 'in_progress', 'completed', 'cancelled', 'postponed'],
    default: 'scheduled',
    index: true
  },
  
  // Notifications
  notificationsSent: {
    type: Boolean,
    default: false
  },
  reminderSent: {
    type: Boolean,
    default: false
  },
  
  // Metadata
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  tags: [String],
  color: String,
  priority: {
    type: String,
    enum: ['low', 'normal', 'high', 'urgent'],
    default: 'normal'
  }
}, {
  timestamps: true
});

// Indexes
calendarEventSchema.index({ startDate: 1, endDate: 1 });
calendarEventSchema.index({ organizationId: 1, startDate: 1 });
calendarEventSchema.index({ eventType: 1, status: 1 });

const CalendarEvent = mongoose.model('CalendarEvent', calendarEventSchema);
export default CalendarEvent;

