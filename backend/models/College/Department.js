import mongoose from "mongoose";

const departmentSchema = new mongoose.Schema(
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
    hodId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // HOD (Head of Department)
    },
    faculty: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }],
    courses: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    }],
    description: String,
    establishedYear: Number,
    totalSeats: {
      type: Number,
      default: 60,
    },
    currentStrength: {
      type: Number,
      default: 0,
    },
    facilities: [String], // Labs, Library, etc.
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
departmentSchema.index({ tenantId: 1, code: 1 }, { unique: true });
departmentSchema.index({ tenantId: 1, name: 1 });
departmentSchema.index({ orgId: 1, isActive: 1 });

// Ensure tenant isolation
departmentSchema.pre(/^find/, function() {
  if (this.getQuery().tenantId) {
    return;
  }
  throw new Error("TenantId is required for all queries");
});

const Department = mongoose.model("Department", departmentSchema);
export default Department;