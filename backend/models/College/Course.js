import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
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
    departmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    code: {
      type: String,
      required: true,
      uppercase: true,
    },
    type: {
      type: String,
      enum: ["UG", "PG", "Diploma", "Certificate"],
      required: true,
    },
    duration: {
      years: {
        type: Number,
        required: true,
      },
      semesters: {
        type: Number,
        required: true,
      },
    },
    totalSeats: {
      type: Number,
      default: 60,
    },
    currentStrength: {
      type: Number,
      default: 0,
    },
    subjects: [{
      semester: {
        type: Number,
        required: true,
      },
      subjectName: {
        type: String,
        required: true,
      },
      subjectCode: String,
      credits: {
        type: Number,
        required: true,
      },
      isElective: {
        type: Boolean,
        default: false,
      },
      facultyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    }],
    fees: {
      admissionFee: Number,
      semesterFee: Number,
      examFee: Number,
      otherFees: [{
        name: String,
        amount: Number,
      }],
    },
    eligibility: {
      minimumPercentage: Number,
      requiredSubjects: [String],
      entranceExam: String,
    },
    syllabus: {
      type: String, // URL or file path
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
courseSchema.index({ tenantId: 1, code: 1 }, { unique: true });
courseSchema.index({ tenantId: 1, departmentId: 1 });
courseSchema.index({ tenantId: 1, type: 1 });

// Ensure tenant isolation
courseSchema.pre(/^find/, function() {
  if (this.getQuery().tenantId) {
    return;
  }
  throw new Error("TenantId is required for all queries");
});

const Course = mongoose.model("Course", courseSchema);
export default Course;