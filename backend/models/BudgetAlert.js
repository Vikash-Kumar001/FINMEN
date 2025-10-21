import mongoose from 'mongoose';

const budgetAlertSchema = new mongoose.Schema({
  // Alert Identification
  alertId: {
    type: String,
    required: true,
    unique: true
  },
  alertType: {
    type: String,
    enum: ['threshold_warning', 'budget_exceeded', 'low_balance', 'unusual_spending', 'approval_required'],
    required: true
  },
  
  // Campaign and Organization Reference
  campaignId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Campaign'
  },
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true
  },
  
  // Budget Information
  budgetInfo: {
    totalBudget: Number,
    allocatedBudget: Number,
    spentBudget: Number,
    remainingBudget: Number,
    thresholdPercentage: Number, // e.g., 80 for 80% threshold
    thresholdAmount: Number, // calculated threshold amount
    currency: {
      type: String,
      default: 'INR'
    }
  },
  
  // HealCoins Information
  healCoinsInfo: {
    totalHealCoins: Number,
    allocatedHealCoins: Number,
    spentHealCoins: Number,
    remainingHealCoins: Number,
    thresholdPercentage: Number,
    thresholdAmount: Number
  },
  
  // Alert Details
  alertDetails: {
    title: String,
    message: String,
    severity: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium'
    },
    currentSpendPercentage: Number,
    projectedSpendPercentage: Number,
    daysUntilProjectedExhaustion: Number,
    recommendedAction: String
  },
  
  // Alert Status
  status: {
    type: String,
    enum: ['active', 'acknowledged', 'resolved', 'dismissed'],
    default: 'active'
  },
  
  // Acknowledgment
  acknowledgment: {
    acknowledgedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    acknowledgedAt: Date,
    acknowledgmentNotes: String,
    actionTaken: String
  },
  
  // Resolution
  resolution: {
    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    resolvedAt: Date,
    resolutionNotes: String,
    resolutionAction: String
  },
  
  // Notification Settings
  notificationSettings: {
    emailEnabled: {
      type: Boolean,
      default: true
    },
    smsEnabled: {
      type: Boolean,
      default: false
    },
    inAppEnabled: {
      type: Boolean,
      default: true
    },
    recipients: [{
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      email: String,
      phone: String,
      role: String
    }]
  },
  
  // Alert History
  alertHistory: [{
    action: String,
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    details: String,
    oldValue: mongoose.Schema.Types.Mixed,
    newValue: mongoose.Schema.Types.Mixed
  }],
  
  // Escalation
  escalation: {
    isEscalated: {
      type: Boolean,
      default: false
    },
    escalatedAt: Date,
    escalatedTo: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    escalationReason: String,
    escalationLevel: {
      type: Number,
      default: 1
    }
  },
  
  // Metadata
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  lastModifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Indexes for better performance
budgetAlertSchema.index({ organizationId: 1, status: 1 });
budgetAlertSchema.index({ campaignId: 1, alertType: 1 });
budgetAlertSchema.index({ alertType: 1, status: 1 });
budgetAlertSchema.index({ createdAt: -1 });
budgetAlertSchema.index({ 'escalation.isEscalated': 1 });

// Pre-save middleware to generate alert ID
budgetAlertSchema.pre('save', function(next) {
  if (this.isNew && !this.alertId) {
    this.alertId = `ALERT_${Date.now()}_${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  }
  next();
});

// Virtual for alert age in days
budgetAlertSchema.virtual('alertAge').get(function() {
  const now = new Date();
  const diffTime = now - this.createdAt;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Virtual for urgency score
budgetAlertSchema.virtual('urgencyScore').get(function() {
  let score = 0;
  
  // Base score from severity
  switch (this.alertDetails.severity) {
    case 'low': score += 1; break;
    case 'medium': score += 2; break;
    case 'high': score += 3; break;
    case 'critical': score += 4; break;
  }
  
  // Add score based on spend percentage
  if (this.alertDetails.currentSpendPercentage >= 90) score += 2;
  else if (this.alertDetails.currentSpendPercentage >= 80) score += 1;
  
  // Add score based on alert age
  if (this.alertAge > 7) score += 2;
  else if (this.alertAge > 3) score += 1;
  
  return Math.min(score, 10); // Cap at 10
});

// Method to acknowledge alert
budgetAlertSchema.methods.acknowledge = function(acknowledgedBy, notes, action) {
  this.status = 'acknowledged';
  this.acknowledgment = {
    acknowledgedBy,
    acknowledgedAt: new Date(),
    acknowledgmentNotes: notes,
    actionTaken: action
  };
  
  this.addHistoryEntry('acknowledged', acknowledgedBy, 'Alert acknowledged', null, this.acknowledgment);
};

// Method to resolve alert
budgetAlertSchema.methods.resolve = function(resolvedBy, notes, action) {
  this.status = 'resolved';
  this.resolution = {
    resolvedBy,
    resolvedAt: new Date(),
    resolutionNotes: notes,
    resolutionAction: action
  };
  
  this.addHistoryEntry('resolved', resolvedBy, 'Alert resolved', null, this.resolution);
};

// Method to escalate alert
budgetAlertSchema.methods.escalate = function(escalatedTo, reason) {
  this.escalation = {
    isEscalated: true,
    escalatedAt: new Date(),
    escalatedTo,
    escalationReason: reason,
    escalationLevel: (this.escalation?.escalationLevel || 0) + 1
  };
  
  this.addHistoryEntry('escalated', null, `Alert escalated: ${reason}`, null, this.escalation);
};

// Method to add history entry
budgetAlertSchema.methods.addHistoryEntry = function(action, performedBy, details, oldValue, newValue) {
  this.alertHistory.push({
    action,
    performedBy,
    details,
    oldValue,
    newValue
  });
};

// Static method to check for threshold alerts
budgetAlertSchema.statics.checkThresholdAlerts = async function(organizationId, campaignId = null) {
  const alerts = [];
  
  // Get active campaigns for the organization
  const campaigns = campaignId ? 
    [{ _id: campaignId }] : 
    await mongoose.model('Campaign').find({ organizationId, status: { $in: ['active', 'pilot', 'rollout'] } });
  
  for (const campaign of campaigns) {
    // Calculate current spend
    const spendData = await mongoose.model('SpendLedger').aggregate([
      {
        $match: {
          organizationId: new mongoose.Types.ObjectId(organizationId),
          campaignId: campaign._id,
          direction: 'outbound'
        }
      },
      {
        $group: {
          _id: null,
          totalSpent: { $sum: '$amount' },
          totalHealCoinsSpent: { $sum: '$healCoinsAmount' }
        }
      }
    ]);
    
    const totalSpent = spendData[0]?.totalSpent || 0;
    const totalHealCoinsSpent = spendData[0]?.totalHealCoinsSpent || 0;
    
    // Check budget thresholds
    const budgetThresholds = [80, 90, 95, 100];
    
    for (const threshold of budgetThresholds) {
      const thresholdAmount = (campaign.budget.totalBudget * threshold) / 100;
      const spendPercentage = (totalSpent / campaign.budget.totalBudget) * 100;
      
      if (totalSpent >= thresholdAmount && spendPercentage >= threshold) {
        // Check if alert already exists
        const existingAlert = await this.findOne({
          organizationId,
          campaignId: campaign._id,
          alertType: 'threshold_warning',
          'budgetInfo.thresholdPercentage': threshold,
          status: { $in: ['active', 'acknowledged'] }
        });
        
        if (!existingAlert) {
          const alert = new this({
            organizationId,
            campaignId: campaign._id,
            alertType: 'threshold_warning',
            budgetInfo: {
              totalBudget: campaign.budget.totalBudget,
              allocatedBudget: campaign.budget.allocatedBudget,
              spentBudget: totalSpent,
              remainingBudget: campaign.budget.totalBudget - totalSpent,
              thresholdPercentage: threshold,
              thresholdAmount: thresholdAmount,
              currency: campaign.budget.currency
            },
            alertDetails: {
              title: `Budget ${threshold}% Threshold Reached`,
              message: `Campaign "${campaign.title}" has reached ${threshold}% of its budget (₹${totalSpent.toLocaleString()} of ₹${campaign.budget.totalBudget.toLocaleString()})`,
              severity: threshold >= 95 ? 'critical' : threshold >= 90 ? 'high' : 'medium',
              currentSpendPercentage: spendPercentage,
              recommendedAction: threshold >= 95 ? 'Immediate budget review required' : 'Consider budget adjustment or campaign scope review'
            },
            createdBy: campaign.createdBy
          });
          
          alerts.push(alert);
        }
      }
    }
  }
  
  return alerts;
};

const BudgetAlert = mongoose.model('BudgetAlert', budgetAlertSchema);

export default BudgetAlert;
