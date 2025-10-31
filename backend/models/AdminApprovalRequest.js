import mongoose from 'mongoose';

const adminApprovalRequestSchema = new mongoose.Schema(
  {
    requestedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    approvalType: {
      type: String,
      enum: ['student_data_drilldown', 'export_data', 'delete_user', 'modify_settings'],
      required: true
    },
    targetType: {
      type: String,
      enum: ['student', 'school', 'organization', 'platform'],
      required: true
    },
    targetId: {
      type: String,
      required: true
    },
    justification: {
      type: String,
      required: true
    },
    approvedBy: [{
      admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      approvedAt: {
        type: Date
      },
      comments: {
        type: String
      }
    }],
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'expired'],
      default: 'pending'
    },
    expiryDate: {
      type: Date,
      default: () => new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
    },
    dataAccessed: {
      accessedAt: Date,
      accessedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      fieldsAccessed: [String],
      ipAddress: String,
      userAgent: String
    },
    auditTrail: [{
      action: {
        type: String,
        enum: ['created', 'approved', 'rejected', 'accessed', 'expired'],
        required: true
      },
      performedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      performedAt: {
        type: Date,
        default: Date.now
      },
      metadata: mongoose.Schema.Types.Mixed
    }]
  },
  {
    timestamps: true
  }
);

// Indexes for efficient queries
adminApprovalRequestSchema.index({ requestedBy: 1, status: 1 });
adminApprovalRequestSchema.index({ approvalType: 1, status: 1 });
adminApprovalRequestSchema.index({ expiryDate: 1 });
adminApprovalRequestSchema.index({ 'approvedBy.admin': 1 });

const AdminApprovalRequest = mongoose.model('AdminApprovalRequest', adminApprovalRequestSchema);
export default AdminApprovalRequest;

