import mongoose from "mongoose";

const collegeStudentSchema = new mongoose.Schema(
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
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    registrationNumber: {
      type: String,
      required: true,
      unique: true,
    },
    rollNumber: String,
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    departmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: true,
    },
    currentSemester: {
      type: Number,
      required: true,
      min: 1,
    },
    academicYear: {
      type: String,
      required: true,
    },
    parentIds: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // At least one parent is mandatory
    }],
    personalInfo: {
      dateOfBirth: Date,
      gender: {
        type: String,
        enum: ["Male", "Female", "Other"],
      },
      bloodGroup: String,
      category: {
        type: String,
        enum: ["General", "OBC", "SC", "ST", "EWS"],
      },
      address: {
        permanent: {
          street: String,
          city: String,
          state: String,
          pincode: String,
        },
        current: {
          street: String,
          city: String,
          state: String,
          pincode: String,
        },
      },
      emergencyContact: {
        name: String,
        phone: String,
        relation: String,
      },
    },
    academicInfo: {
      admissionDate: {
        type: Date,
        default: Date.now,
      },
      admissionType: {
        type: String,
        enum: ["Regular", "Lateral Entry", "Transfer"],
        default: "Regular",
      },
      previousEducation: {
        instituteName: String,
        percentage: Number,
        yearOfPassing: Number,
      },
      registeredSubjects: [{
        semester: Number,
        subjectId: mongoose.Schema.Types.ObjectId,
        subjectName: String,
        credits: Number,
        grade: String,
        marks: Number,
      }],
      cgpa: {
        type: Number,
        default: 0,
      },
      backlogs: [{
        subjectId: mongoose.Schema.Types.ObjectId,
        subjectName: String,
        semester: Number,
        attempts: Number,
      }],
    },
    fees: {
      totalFees: Number,
      paidAmount: {
        type: Number,
        default: 0,
      },
      pendingAmount: {
        type: Number,
        default: 0,
      },
      lastPaymentDate: Date,
      paymentHistory: [{
        semester: Number,
        amount: Number,
        date: Date,
        receiptNumber: String,
        paymentMode: {
          type: String,
          enum: ["cash", "cheque", "online", "card"],
        },
      }],
    },
    attendance: {
      totalClasses: {
        type: Number,
        default: 0,
      },
      attendedClasses: {
        type: Number,
        default: 0,
      },
      percentage: {
        type: Number,
        default: 0,
      },
    },
    hostel: {
      isResident: {
        type: Boolean,
        default: false,
      },
      roomNumber: String,
      blockName: String,
      fees: Number,
    },
    transport: {
      isUsing: {
        type: Boolean,
        default: false,
      },
      routeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "TransportRoute",
      },
      stopName: String,
      fees: Number,
    },
    placement: {
      isEligible: {
        type: Boolean,
        default: false,
      },
      cgpaRequirement: Number,
      backlogRestriction: Boolean,
      placementStatus: {
        type: String,
        enum: ["Not Started", "In Progress", "Placed", "Not Placed"],
        default: "Not Started",
      },
      offers: [{
        companyName: String,
        position: String,
        package: Number,
        offerDate: Date,
        status: {
          type: String,
          enum: ["Pending", "Accepted", "Rejected"],
        },
      }],
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
collegeStudentSchema.index({ tenantId: 1, registrationNumber: 1 });
collegeStudentSchema.index({ tenantId: 1, courseId: 1, currentSemester: 1 });
collegeStudentSchema.index({ tenantId: 1, academicYear: 1 });
collegeStudentSchema.index({ userId: 1, tenantId: 1 });

// Validate at least one parent
collegeStudentSchema.pre("save", function(next) {
  if (!this.parentIds || this.parentIds.length === 0) {
    return next(new Error("At least one parent is required for each student"));
  }
  
  // Calculate pending fees
  if (this.fees.totalFees && this.fees.paidAmount) {
    this.fees.pendingAmount = this.fees.totalFees - this.fees.paidAmount;
  }
  
  // Calculate attendance percentage
  if (this.attendance.totalClasses > 0) {
    this.attendance.percentage = (this.attendance.attendedClasses / this.attendance.totalClasses) * 100;
  }
  
  // Calculate CGPA
  if (this.academicInfo.registeredSubjects.length > 0) {
    const totalCredits = this.academicInfo.registeredSubjects.reduce((sum, subject) => sum + subject.credits, 0);
    const weightedGrades = this.academicInfo.registeredSubjects.reduce((sum, subject) => {
      const gradePoint = this.convertGradeToPoint(subject.grade);
      return sum + (gradePoint * subject.credits);
    }, 0);
    this.academicInfo.cgpa = totalCredits > 0 ? (weightedGrades / totalCredits).toFixed(2) : 0;
  }
  
  next();
});

// Helper method to convert grade to grade point
collegeStudentSchema.methods.convertGradeToPoint = function(grade) {
  const gradeMap = {
    'A+': 10, 'A': 9, 'B+': 8, 'B': 7, 'C+': 6, 'C': 5, 'D': 4, 'F': 0
  };
  return gradeMap[grade] || 0;
};

// Ensure tenant isolation
collegeStudentSchema.pre(/^find/, function() {
  if (this.getQuery().tenantId) {
    return;
  }
  throw new Error("TenantId is required for all queries");
});

const CollegeStudent = mongoose.model("CollegeStudent", collegeStudentSchema);
export default CollegeStudent;