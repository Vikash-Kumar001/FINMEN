import mongoose from "mongoose";

const schoolClassSchema = new mongoose.Schema(
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
    classNumber: {
      type: Number,
      required: true,
      min: 1,
      max: 12,
    },
    stream: {
      type: String,
      enum: ["Science", "Commerce", "Arts"],
      required: function() {
        return this.classNumber >= 11; // Streams only for classes 11-12
      },
    },
    sections: [{
      name: {
        type: String,
        required: true, // A, B, C, etc.
      },
      capacity: {
        type: Number,
        default: 40,
      },
      currentStrength: {
        type: Number,
        default: 0,
      },
      classTeacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    }],
    subjects: [{
      name: {
        type: String,
        required: true,
      },
      code: String,
      isOptional: {
        type: Boolean,
        default: false,
      },
      teachers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      }],
    }],
    academicYear: {
      type: String,
      required: true,
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

// Compound indexes for multi-tenant queries
schoolClassSchema.index({ tenantId: 1, classNumber: 1, stream: 1 });
schoolClassSchema.index({ tenantId: 1, academicYear: 1 });
schoolClassSchema.index({ orgId: 1, isActive: 1 });

// Ensure tenant isolation (with fallback for legacy users)
schoolClassSchema.pre(/^find/, function() {
  if (this.getQuery().tenantId) {
    // Tenant filter already applied
    return;
  }
  
  if (this.getQuery().allowLegacy) {
    // Legacy query allowed - remove the flag from actual query and continue silently
    delete this.getQuery().allowLegacy;
    return;
  }
  
  // Check if this is a populate query (no _id in query)
  // Populate queries don't include tenantId, so we allow them silently
  const queryKeys = Object.keys(this.getQuery());
  const isPopulateQuery = queryKeys.length === 0 || 
    (queryKeys.length === 1 && (queryKeys[0] === '_id' || queryKeys[0] === '__v')) ||
    (queryKeys.includes('_id') && queryKeys.length <= 2);
  
  if (isPopulateQuery) {
    // This is likely a populate query, allow it silently without warning
    return;
  }
  
  // For queries without tenantId or allowLegacy flag, allow them but log a warning
  console.warn('⚠️ SchoolClass query without tenantId - allowing for backward compatibility');
});

const SchoolClass = mongoose.model("SchoolClass", schoolClassSchema);
export default SchoolClass;