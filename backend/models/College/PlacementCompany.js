import mongoose from "mongoose";

const placementCompanySchema = new mongoose.Schema(
  {
    tenantId: {
      type: String,
      required: true,
      // index removed, only keep schema.index()
    },
    orgId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
    companyName: {
      type: String,
      required: true,
      trim: true,
    },
    companyType: {
      type: String,
      enum: ["Product", "Service", "Startup", "MNC", "Government", "NGO"],
      required: true,
    },
    industry: {
      type: String,
      required: true,
    },
    companySize: {
      type: String,
      enum: ["1-10", "11-50", "51-200", "201-500", "501-1000", "1000+"],
    },
    contactDetails: {
      hrName: String,
      hrEmail: {
        type: String,
        required: true,
      },
      hrPhone: String,
      companyAddress: {
        street: String,
        city: String,
        state: String,
        country: String,
        pincode: String,
      },
      website: String,
      linkedinProfile: String,
    },
    jobRoles: [{
      title: {
        type: String,
        required: true,
      },
      description: String,
      department: String,
      skillsRequired: [String],
      experience: {
        min: Number,
        max: Number,
      },
      salary: {
        min: Number,
        max: Number,
        currency: {
          type: String,
          default: "INR",
        },
      },
      location: String,
      jobType: {
        type: String,
        enum: ["Full-time", "Part-time", "Internship", "Contract"],
        default: "Full-time",
      },
      isActive: {
        type: Boolean,
        default: true,
      },
    }],
    eligibilityCriteria: {
      minimumCGPA: {
        type: Number,
        default: 6.0,
      },
      allowedCourses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
      }],
      allowedDepartments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Department",
      }],
      maxBacklogs: {
        type: Number,
        default: 0,
      },
      graduationYear: [Number],
      additionalCriteria: String,
    },
    visitDetails: {
      visitDate: Date,
      visitType: {
        type: String,
        enum: ["On-campus", "Virtual", "Off-campus"],
        default: "On-campus",
      },
      rounds: [{
        roundName: String,
        roundType: {
          type: String,
          enum: ["Written Test", "Technical Interview", "HR Interview", "Group Discussion", "Presentation"],
        },
        duration: Number, // in minutes
        description: String,
      }],
      registrationDeadline: Date,
      maxApplications: Number,
      currentApplications: {
        type: Number,
        default: 0,
      },
    },
    placementStats: {
      totalOffers: {
        type: Number,
        default: 0,
      },
      totalSelected: {
        type: Number,
        default: 0,
      },
      averagePackage: {
        type: Number,
        default: 0,
      },
      highestPackage: {
        type: Number,
        default: 0,
      },
    },
    status: {
      type: String,
      enum: ["Active", "Completed", "Cancelled", "Postponed"],
      default: "Active",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
placementCompanySchema.index({ tenantId: 1, companyName: 1 });
placementCompanySchema.index({ tenantId: 1, status: 1, isActive: 1 });
placementCompanySchema.index({ "visitDetails.visitDate": 1 });
placementCompanySchema.index({ "visitDetails.registrationDeadline": 1 });

// Ensure tenant isolation
placementCompanySchema.pre(/^find/, function() {
  if (this.getQuery().tenantId) {
    return;
  }
  throw new Error("TenantId is required for all queries");
});

const PlacementCompany = mongoose.model("PlacementCompany", placementCompanySchema);
export default PlacementCompany;