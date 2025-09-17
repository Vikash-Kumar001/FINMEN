import mongoose from "mongoose";

const placementApplicationSchema = new mongoose.Schema(
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
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CollegeStudent",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PlacementCompany",
      required: true,
    },
    jobRoleId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    applicationDate: {
      type: Date,
      default: Date.now,
    },
    studentDetails: {
      name: String,
      email: String,
      phone: String,
      courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
      },
      departmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Department",
      },
      currentSemester: Number,
      cgpa: Number,
      backlogs: Number,
      skills: [String],
      resume: String, // File path or URL
      portfolioUrl: String,
    },
    selectionProcess: [{
      roundName: String,
      roundType: String,
      scheduledDate: Date,
      actualDate: Date,
      status: {
        type: String,
        enum: ["Scheduled", "Completed", "Cleared", "Rejected", "Absent"],
        default: "Scheduled",
      },
      score: Number,
      feedback: String,
      interviewerName: String,
      notes: String,
    }],
    overallStatus: {
      type: String,
      enum: ["Applied", "Under Review", "Shortlisted", "In Process", "Selected", "Rejected", "Withdrawn"],
      default: "Applied",
    },
    offerDetails: {
      isOffered: {
        type: Boolean,
        default: false,
      },
      offerDate: Date,
      joiningDate: Date,
      salary: {
        base: Number,
        variable: Number,
        total: Number,
        currency: {
          type: String,
          default: "INR",
        },
      },
      location: String,
      designation: String,
      offerLetter: String, // File path or URL
      offerStatus: {
        type: String,
        enum: ["Pending", "Accepted", "Rejected", "Expired"],
        default: "Pending",
      },
      acceptanceDate: Date,
      rejectionReason: String,
    },
    placementOfficerNotes: String,
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
placementApplicationSchema.index({ tenantId: 1, studentId: 1, companyId: 1 }, { unique: true });
placementApplicationSchema.index({ tenantId: 1, overallStatus: 1 });
placementApplicationSchema.index({ tenantId: 1, applicationDate: 1 });
placementApplicationSchema.index({ "offerDetails.isOffered": 1, "offerDetails.offerStatus": 1 });

// Update company application count
placementApplicationSchema.post("save", async function() {
  if (this.isNew) {
    await mongoose.model("PlacementCompany").findByIdAndUpdate(
      this.companyId,
      { $inc: { "visitDetails.currentApplications": 1 } }
    );
  }
});

// Ensure tenant isolation
placementApplicationSchema.pre(/^find/, function() {
  if (this.getQuery().tenantId) {
    return;
  }
  throw new Error("TenantId is required for all queries");
});

const PlacementApplication = mongoose.model("PlacementApplication", placementApplicationSchema);
export default PlacementApplication;