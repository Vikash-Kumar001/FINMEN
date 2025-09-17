import mongoose from "mongoose";

const alumniSchema = new mongoose.Schema({
  // Tenant Information
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organization",
    required: true,
    // index removed, only keep schema.index()
  },
  tenantId: {
    type: String,
    required: true,
    // index removed, only keep schema.index()
  },

  // User Reference
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  // Academic Information
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CollegeStudent",
    required: true,
  },
  graduationYear: {
    type: Number,
    required: true,
    index: true,
  },
  degree: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  cgpa: {
    type: Number,
    min: 0,
    max: 10,
  },

  // Professional Information
  currentEmployment: {
    companyName: {
      type: String,
      required: true,
    },
    position: {
      type: String,
      required: true,
    },
    industry: {
      type: String,
      required: true,
    },
    workLocation: {
      city: String,
      state: String,
      country: String,
    },
    salary: {
      amount: Number,
      currency: {
        type: String,
        default: "INR",
      },
    },
    startDate: {
      type: Date,
      required: true,
    },
    isCurrentJob: {
      type: Boolean,
      default: true,
    },
  },

  // Career History
  careerHistory: [{
    companyName: {
      type: String,
      required: true,
    },
    position: {
      type: String,
      required: true,
    },
    industry: String,
    startDate: {
      type: Date,
      required: true,
    },
    endDate: Date,
    description: String,
    achievements: [String],
  }],

  // Contact Information
  contactInfo: {
    email: {
      type: String,
      required: true,
    },
    phone: String,
    linkedIn: String,
    github: String,
    portfolio: String,
    isPublic: {
      type: Boolean,
      default: false,
    },
  },

  // Alumni Network Participation
  networkParticipation: {
    isActive: {
      type: Boolean,
      default: true,
    },
    mentorshipAvailable: {
      type: Boolean,
      default: false,
    },
    mentorshipAreas: [String],
    eventsAttended: [{
      eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "AlumniEvent",
      },
      attendedDate: Date,
    }],
    contributions: [{
      type: {
        type: String,
        enum: ["donation", "guest_lecture", "mentorship", "job_referral", "other"],
      },
      description: String,
      date: Date,
      amount: Number, // For donations
    }],
  },

  // Achievements & Recognition
  achievements: [{
    title: {
      type: String,
      required: true,
    },
    description: String,
    date: Date,
    category: {
      type: String,
      enum: ["award", "promotion", "publication", "patent", "startup", "other"],
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
  }],

  // Social Features
  social: {
    bio: String,
    profilePicture: String,
    posts: [{
      content: String,
      images: [String],
      createdAt: {
        type: Date,
        default: Date.now,
      },
      likes: [{
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        likedAt: {
          type: Date,
          default: Date.now,
        },
      }],
      comments: [{
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        content: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      }],
    }],
    connections: [{
      alumniId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Alumni",
      },
      connectedAt: {
        type: Date,
        default: Date.now,
      },
      status: {
        type: String,
        enum: ["pending", "accepted", "blocked"],
        default: "accepted",
      },
    }],
  },

  // Privacy Settings
  privacy: {
    profileVisibility: {
      type: String,
      enum: ["public", "alumni_only", "private"],
      default: "alumni_only",
    },
    contactVisibility: {
      type: String,
      enum: ["public", "alumni_only", "private"],
      default: "alumni_only",
    },
    careerVisibility: {
      type: String,
      enum: ["public", "alumni_only", "private"],
      default: "alumni_only",
    },
  },

  // Verification Status
  verification: {
    isVerified: {
      type: Boolean,
      default: false,
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    verifiedAt: Date,
    documents: [{
      type: String, // Document URLs
    }],
  },

  // Metadata
  isActive: {
    type: Boolean,
    default: true,
  },
  lastLoginAt: Date,
  profileCompleteness: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
  },
}, {
  timestamps: true,
});

// Indexes
alumniSchema.index({ organizationId: 1, tenantId: 1 });
alumniSchema.index({ graduationYear: 1, department: 1 });
alumniSchema.index({ "currentEmployment.companyName": 1 });
alumniSchema.index({ "currentEmployment.industry": 1 });
alumniSchema.index({ "networkParticipation.isActive": 1 });
alumniSchema.index({ "verification.isVerified": 1 });

// Virtual for full name
alumniSchema.virtual('fullName').get(function() {
  return this.populated('userId') ? this.userId.name : '';
});

// Calculate profile completeness
alumniSchema.methods.calculateProfileCompleteness = function() {
  let score = 0;
  const maxScore = 100;
  
  // Basic info (30 points)
  if (this.currentEmployment.companyName) score += 10;
  if (this.currentEmployment.position) score += 10;
  if (this.contactInfo.email) score += 10;
  
  // Career history (20 points)
  if (this.careerHistory.length > 0) score += 20;
  
  // Social profile (20 points)
  if (this.social.bio) score += 10;
  if (this.social.profilePicture) score += 10;
  
  // Achievements (15 points)
  if (this.achievements.length > 0) score += 15;
  
  // Network participation (15 points)
  if (this.networkParticipation.mentorshipAvailable) score += 10;
  if (this.networkParticipation.contributions.length > 0) score += 5;
  
  this.profileCompleteness = Math.min(score, maxScore);
  return this.profileCompleteness;
};

// Static method to get alumni statistics
alumniSchema.statics.getAlumniStats = async function(organizationId, tenantId) {
  const stats = await this.aggregate([
    {
      $match: {
        organizationId: new mongoose.Types.ObjectId(organizationId),
        tenantId: tenantId,
        isActive: true,
      }
    },
    {
      $group: {
        _id: null,
        totalAlumni: { $sum: 1 },
        activeAlumni: {
          $sum: {
            $cond: [{ $eq: ["$networkParticipation.isActive", true] }, 1, 0]
          }
        },
        mentorsAvailable: {
          $sum: {
            $cond: [{ $eq: ["$networkParticipation.mentorshipAvailable", true] }, 1, 0]
          }
        },
        verifiedAlumni: {
          $sum: {
            $cond: [{ $eq: ["$verification.isVerified", true] }, 1, 0]
          }
        },
        avgProfileCompleteness: { $avg: "$profileCompleteness" },
      }
    }
  ]);
  
  return stats[0] || {
    totalAlumni: 0,
    activeAlumni: 0,
    mentorsAvailable: 0,
    verifiedAlumni: 0,
    avgProfileCompleteness: 0,
  };
};

export default mongoose.model("Alumni", alumniSchema);