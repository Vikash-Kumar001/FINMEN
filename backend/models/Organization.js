import mongoose from "mongoose";

const organizationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["school"],
      required: true,
    },
    tenantId: {
      type: String,
      required: true,
      unique: true,
      // index removed, only unique
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    admins: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }],
    settings: {
      academicYear: {
        startDate: Date,
        endDate: Date,
      },
      timezone: {
        type: String,
        default: "Asia/Kolkata",
      },
      currency: {
        type: String,
        default: "INR",
      },
      logo: String,
      address: {
        street: String,
        city: String,
        state: String,
        pincode: String,
        country: {
          type: String,
          default: "India",
        },
      },
      contactInfo: {
        phone: String,
        email: String,
        website: String,
      },
      // School specific settings
      schoolSettings: {
        hasStreams: {
          type: Boolean,
          default: true,
        },
        streams: [{
          name: {
            type: String,
            enum: ["Science", "Commerce", "Arts"],
          },
          classes: [Number], // Which classes have this stream
        }],
        gradingSystem: {
          type: String,
          enum: ["percentage", "gpa", "cgpa"],
          default: "percentage",
        },
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    userCount: {
      type: Number,
      default: 0,
    },
    maxUsers: {
      type: Number,
      default: 100, // Based on subscription
    },
    // Multi-campus support
    campuses: [{
      campusId: {
        type: String,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      code: String, // Short code like "MAIN", "EAST", "WEST"
      location: {
        street: String,
        city: String,
        state: String,
        pincode: String,
        country: String,
      },
      contactInfo: {
        phone: String,
        email: String,
      },
      principal: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      isMain: {
        type: Boolean,
        default: false,
      },
      isActive: {
        type: Boolean,
        default: true,
      },
      studentCount: {
        type: Number,
        default: 0,
      },
      teacherCount: {
        type: Number,
        default: 0,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    }],
    subscriptionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subscription',
    },
  },
  {
    timestamps: true,
  }
);

// Only keep companyId and type+tenantId indexes, tenantId is already unique
organizationSchema.index({ companyId: 1 });
organizationSchema.index({ type: 1, tenantId: 1 });

// Generate unique tenantId before saving
organizationSchema.pre("save", function (next) {
  if (!this.tenantId) {
    this.tenantId = `${this.type}_${this._id.toString()}`;
  }
  next();
});

const Organization = mongoose.model("Organization", organizationSchema);
export default Organization;