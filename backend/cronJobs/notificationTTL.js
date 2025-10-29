import Notification from "../models/Notification.js";

// Simple in-process TTL enforcement with realtime emit
// Useful during testing when MongoDB TTL monitor timing is uncertain
export function startNotificationTTL(io, { ttlSeconds = 1296000, intervalSeconds = 3600 } = {}) {
  const intervalMs = Math.max(5, intervalSeconds) * 1000;

  const tick = async () => {
    try {
      const cutoff = new Date(Date.now() - ttlSeconds * 1000);
      // Find IDs to delete first so we can emit after deletion
      const stale = await Notification.find({ createdAt: { $lt: cutoff } }).select("_id userId").lean();
      if (!stale.length) return;

      const ids = stale.map(n => n._id);
      await Notification.deleteMany({ _id: { $in: ids } });

      // Emit deletion to each user's room so clients can remove without refresh
      stale.forEach(n => {
        try { io.to(n.userId.toString()).emit("notification_deleted", { id: n._id.toString() }); } catch {}
      });
    } catch (err) {
      console.warn("[notificationTTL] cleanup error:", err.message);
    }
  };

  const timer = setInterval(tick, intervalMs);
  // Run once shortly after startup
  setTimeout(tick, 2000);
  return () => clearInterval(timer);
}


