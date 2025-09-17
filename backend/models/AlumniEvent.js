import mongoose from "mongoose";

const alumniEventSchema = new mongoose.Schema({
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

  // Event Basic Information
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  eventType: {
    type: String,
    enum: [
      "reunion",
      "networking",
      "guest_lecture",
      "workshop",
      "career_fair",
      "fundraising",
      "social_gathering",
      "webinar",
      "panel_discussion",
      "other"
    ],
    required: true,
  },

  // Event Scheduling
  schedule: {
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    timezone: {
      type: String,
      default: "Asia/Kolkata",
    },
    isAllDay: {
      type: Boolean,
      default: false,
    },
  },

  // Event Location
  location: {
    type: {
      type: String,
      enum: ["physical", "virtual", "hybrid"],
      required: true,
    },
    venue: {
      name: String,
      address: {
        street: String,
        city: String,
        state: String,
        country: String,
        zipCode: String,
      },
      coordinates: {
        latitude: Number,
        longitude: Number,
      },
    },
    virtualDetails: {
      platform: String, // Zoom, Teams, etc.
      meetingLink: String,
      meetingId: String,
      password: String,
    },
  },

  // Event Organization
  organizer: {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: String,
    email: String,
    phone: String,
  },
  coOrganizers: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    name: String,
    role: String,
  }],

  // Event Details
  agenda: [{
    time: String,
    title: String,
    description: String,
    speaker: {
      name: String,
      designation: String,
      company: String,
      bio: String,
      photo: String,
    },
  }],

  // Registration & Attendance
  registration: {
    isRequired: {
      type: Boolean,
      default: true,
    },
    deadline: Date,
    maxAttendees: Number,
    fees: {
      amount: {
        type: Number,
        default: 0,
      },
      currency: {
        type: String,
        default: "INR",
      },
      paymentRequired: {
        type: Boolean,
        default: false,
      },
    },
    fields: [{
      name: String,
      type: {
        type: String,
        enum: ["text", "email", "phone", "select", "checkbox", "textarea"],
      },
      required: Boolean,
      options: [String], // For select fields
    }],
  },

  // Attendees
  attendees: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    alumniId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Alumni",
    },
    registrationData: mongoose.Schema.Types.Mixed,
    registeredAt: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["registered", "confirmed", "attended", "cancelled", "no_show"],
      default: "registered",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "failed", "refunded"],
      default: "pending",
    },
    checkInTime: Date,
    checkOutTime: Date,
  }],

  // Event Resources
  resources: {
    images: [String],
    documents: [{
      name: String,
      url: String,
      type: String,
    }],
    videos: [{
      title: String,
      url: String,
      thumbnail: String,
    }],
  },

  // Event Settings
  settings: {
    isPublic: {
      type: Boolean,
      default: true,
    },
    allowGuestRegistration: {
      type: Boolean,
      default: false,
    },
    sendReminders: {
      type: Boolean,
      default: true,
    },
    enableNetworking: {
      type: Boolean,
      default: true,
    },
    recordEvent: {
      type: Boolean,
      default: false,
    },
  },

  // Event Status
  status: {
    type: String,
    enum: ["draft", "published", "ongoing", "completed", "cancelled"],
    default: "draft",
  },

  // Event Analytics
  analytics: {
    views: {
      type: Number,
      default: 0,
    },
    registrations: {
      type: Number,
      default: 0,
    },
    attendance: {
      type: Number,
      default: 0,
    },
    feedback: [{
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      rating: {
        type: Number,
        min: 1,
        max: 5,
      },
      comment: String,
      submittedAt: {
        type: Date,
        default: Date.now,
      },
    }],
    averageRating: {
      type: Number,
      default: 0,
    },
  },

  // Communication
  communications: [{
    type: {
      type: String,
      enum: ["email", "sms", "notification"],
    },
    subject: String,
    content: String,
    sentTo: [{
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      status: {
        type: String,
        enum: ["sent", "delivered", "failed"],
      },
    }],
    sentAt: Date,
    sentBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  }],

  // Metadata
  isActive: {
    type: Boolean,
    default: true,
  },
  tags: [String],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
}, {
  timestamps: true,
});

// Indexes
alumniEventSchema.index({ organizationId: 1, tenantId: 1 });
alumniEventSchema.index({ "schedule.startDate": 1 });
alumniEventSchema.index({ eventType: 1 });
alumniEventSchema.index({ status: 1 });
alumniEventSchema.index({ "settings.isPublic": 1 });

// Virtual for event duration
alumniEventSchema.virtual('duration').get(function() {
  if (this.schedule.startDate && this.schedule.endDate) {
    return this.schedule.endDate - this.schedule.startDate;
  }
  return 0;
});

// Method to check if registration is open
alumniEventSchema.methods.isRegistrationOpen = function() {
  const now = new Date();
  const deadline = this.registration.deadline || this.schedule.startDate;
  
  return this.status === 'published' && 
         this.registration.isRequired && 
         now < deadline &&
         (!this.registration.maxAttendees || this.attendees.length < this.registration.maxAttendees);
};

// Method to get available spots
alumniEventSchema.methods.getAvailableSpots = function() {
  if (!this.registration.maxAttendees) return null;
  return Math.max(0, this.registration.maxAttendees - this.attendees.length);
};

// Method to calculate attendance rate
alumniEventSchema.methods.getAttendanceRate = function() {
  const totalRegistered = this.attendees.length;
  const totalAttended = this.attendees.filter(a => a.status === 'attended').length;
  
  return totalRegistered > 0 ? (totalAttended / totalRegistered) * 100 : 0;
};

// Static method to get upcoming events
alumniEventSchema.statics.getUpcomingEvents = async function(organizationId, tenantId, limit = 10) {
  const now = new Date();
  
  return this.find({
    organizationId: new mongoose.Types.ObjectId(organizationId),
    tenantId: tenantId,
    "schedule.startDate": { $gte: now },
    status: "published",
    isActive: true,
  })
  .sort({ "schedule.startDate": 1 })
  .limit(limit)
  .populate('organizer.userId', 'name email')
  .populate('attendees.userId', 'name email');
};

// Static method to get event statistics
alumniEventSchema.statics.getEventStats = async function(organizationId, tenantId) {
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
        totalEvents: { $sum: 1 },
        upcomingEvents: {
          $sum: {
            $cond: [
              { $gte: ["$schedule.startDate", new Date()] },
              1,
              0
            ]
          }
        },
        completedEvents: {
          $sum: {
            $cond: [{ $eq: ["$status", "completed"] }, 1, 0]
          }
        },
        totalAttendees: { $sum: { $size: "$attendees" } },
        averageRating: { $avg: "$analytics.averageRating" },
      }
    }
  ]);
  
  return stats[0] || {
    totalEvents: 0,
    upcomingEvents: 0,
    completedEvents: 0,
    totalAttendees: 0,
    averageRating: 0,
  };
};

export default mongoose.model("AlumniEvent", alumniEventSchema);