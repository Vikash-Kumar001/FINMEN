import mongoose from 'mongoose';

const parentRegistrationIntentSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    index: true,
  },
  name: {
    type: String,
    required: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  flow: {
    type: String,
    enum: ['child_not_created', 'child_existing'],
    required: true,
  },
  childUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  childSubscriptionPlan: {
    type: String,
    enum: ['free', 'student_premium', 'student_parent_premium_pro', 'educational_institutions_premium', null],
    default: null,
  },
  planType: {
    type: String,
    enum: ['student_parent_premium_pro', 'parent_dashboard'],
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    default: 'INR',
  },
  razorpayOrderId: {
    type: String,
  },
  status: {
    type: String,
    enum: ['initiated', 'payment_pending', 'payment_failed', 'completed', 'cancelled'],
    default: 'initiated',
    index: true,
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  expiresAt: {
    type: Date,
    index: true,
  },
}, {
  timestamps: true,
});

parentRegistrationIntentSchema.index({ createdAt: 1 }, { expireAfterSeconds: 7 * 24 * 60 * 60, partialFilterExpression: { status: { $ne: 'completed' } } });

const ParentRegistrationIntent = mongoose.model('ParentRegistrationIntent', parentRegistrationIntentSchema);

export default ParentRegistrationIntent;

