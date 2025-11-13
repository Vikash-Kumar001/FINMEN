import mongoose from 'mongoose';

const childCreationIntentSchema = new mongoose.Schema(
  {
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    gender: {
      type: String,
      required: true,
      enum: ['male', 'female', 'non_binary', 'prefer_not_to_say', 'other'],
    },
    planType: {
      type: String,
      enum: ['student_parent_premium_pro'],
      default: 'student_parent_premium_pro',
    },
    amount: {
      type: Number,
      required: true,
      default: 4999,
    },
    razorpayOrderId: {
      type: String,
    },
    razorpayPaymentId: {
      type: String,
    },
    status: {
      type: String,
      enum: ['payment_pending', 'payment_completed', 'completed', 'cancelled'],
      default: 'payment_pending',
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster lookups
childCreationIntentSchema.index({ parentId: 1 });
childCreationIntentSchema.index({ email: 1 });
childCreationIntentSchema.index({ status: 1 });

const ChildCreationIntent = mongoose.model('ChildCreationIntent', childCreationIntentSchema);

export default ChildCreationIntent;

