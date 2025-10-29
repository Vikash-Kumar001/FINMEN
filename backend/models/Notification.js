import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["info", "success", "warning", "alert"],
      default: "info",
    },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Auto-delete notifications after 15 days
notificationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 1296000 }); // 15 days (15 * 24 * 60 * 60)

const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;
