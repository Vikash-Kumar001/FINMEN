import mongoose from "mongoose";

const impactMetricsSchema = new mongoose.Schema(
  {
    csrId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    region: {
      type: String,
      required: true,
    },
    studentsImpacted: {
      type: Number,
      default: 0,
    },
    itemsDistributed: {
      type: Number,
      default: 0,
    },
    totalValueFunded: {
      type: Number,
      default: 0,
    },
    schoolsReached: {
      type: Number,
      default: 0,
    },
    moduleProgress: {
      finance: {
        progress: { type: Number, default: 0 },
        students: { type: Number, default: 0 },
        completion: { type: Number, default: 0 },
      },
      mental: {
        progress: { type: Number, default: 0 },
        students: { type: Number, default: 0 },
        completion: { type: Number, default: 0 },
      },
      values: {
        progress: { type: Number, default: 0 },
        students: { type: Number, default: 0 },
        completion: { type: Number, default: 0 },
      },
      ai: {
        progress: { type: Number, default: 0 },
        students: { type: Number, default: 0 },
        completion: { type: Number, default: 0 },
      },
    },
    reportingPeriod: {
      type: String,
      enum: ["weekly", "monthly", "quarterly", "yearly"],
      required: true,
    },
    periodStart: {
      type: Date,
      required: true,
    },
    periodEnd: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const ImpactMetrics = mongoose.model("ImpactMetrics", impactMetricsSchema);
export default ImpactMetrics;