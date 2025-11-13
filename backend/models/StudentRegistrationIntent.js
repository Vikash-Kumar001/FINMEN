import mongoose from 'mongoose';

const studentRegistrationIntentSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    fullName: {
      type: String,
      required: true,
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
    },
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false, // Not required for standalone registration
    },
    selectedPlan: {
      type: String,
      enum: ['free', 'student_premium', 'student_parent_premium_pro'],
      required: true,
    },
    status: {
      type: String,
      enum: ['payment_pending', 'payment_completed', 'completed', 'failed'],
      default: 'payment_pending',
    },
    razorpayOrderId: {
      type: String,
    },
    razorpayPaymentId: {
      type: String,
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
studentRegistrationIntentSchema.index({ email: 1 });
studentRegistrationIntentSchema.index({ parentId: 1 });
studentRegistrationIntentSchema.index({ razorpayOrderId: 1 });
studentRegistrationIntentSchema.index({ status: 1 });

const StudentRegistrationIntent = mongoose.model('StudentRegistrationIntent', studentRegistrationIntentSchema);

export default StudentRegistrationIntent;

