import mongoose from 'mongoose';

const escalationChainSchema = new mongoose.Schema({
  tenantId: {
    type: String,
    required: true,
  },
  orgId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true,
  },
  
  // Chain details
  name: {
    type: String,
    required: true,
  },
  triggerType: {
    type: String,
    enum: [
      'wellbeing_flag_high',
      'wellbeing_flag_medium',
      'academic_concern',
      'behavioral_issue',
      'attendance_low',
      'health_emergency',
      'safety_concern',
      'bullying_report',
      'mental_health_crisis',
      'custom',
    ],
    required: true,
  },
  description: String,
  
  // Escalation levels
  levels: [{
    level: {
      type: Number,
      required: true,
    },
    role: {
      type: String,
      enum: ['teacher', 'counselor', 'campus_admin', 'school_admin', 'parent', 'custom'],
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    notificationMethod: {
      type: String,
      enum: ['email', 'sms', 'push', 'in_app', 'all'],
      default: 'email',
    },
    escalateAfter: {
      value: Number,
      unit: {
        type: String,
        enum: ['minutes', 'hours', 'days'],
        default: 'hours',
      },
    },
    requiresAcknowledgment: {
      type: Boolean,
      default: false,
    },
    autoEscalate: {
      type: Boolean,
      default: true,
    },
  }],
  
  // Trigger conditions
  conditions: {
    severity: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
    },
    requiresImmediate: {
      type: Boolean,
      default: false,
    },
    campusSpecific: {
      type: Boolean,
      default: false,
    },
    campusIds: [String],
  },
  
  // Status
  isActive: {
    type: Boolean,
    default: true,
  },
  
  // Usage stats
  timesTriggered: {
    type: Number,
    default: 0,
  },
  lastTriggeredAt: Date,
  averageResolutionTime: Number, // in minutes
  
  // Audit
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  
}, {
  timestamps: true,
});

escalationChainSchema.index({ tenantId: 1, triggerType: 1 });
escalationChainSchema.index({ isActive: 1 });

const EscalationChain = mongoose.model('EscalationChain', escalationChainSchema);
export default EscalationChain;

