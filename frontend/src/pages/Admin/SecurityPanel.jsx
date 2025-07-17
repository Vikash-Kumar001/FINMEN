import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Lock, AlertTriangle, ShieldCheck } from "lucide-react";

const SecurityPanel = () => {
  const [securityStatus, setSecurityStatus] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch security status from an API (replace with your endpoint)
    const fetchSecurityStatus = async () => {
      try {
        setLoading(true);
        // Example: Replace with your API call
        // const response = await fetch("/api/security-status", {
        //   headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        // });
        // const data = await response.json();
        // setSecurityStatus(data);
      } catch (error) {
        console.error("Error fetching security status:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSecurityStatus();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="p-6"
    >
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Security Management</h2>
      {loading ? (
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-2"></div>
          <div className="h-8 bg-gray-200 rounded"></div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-white p-4 rounded-lg shadow-md border border-gray-100">
            <div className="flex items-center gap-3 mb-2">
              <ShieldCheck className="w-6 h-6 text-green-600" />
              <h3 className="text-lg font-semibold text-gray-800">Security Overview</h3>
            </div>
            <p className="text-gray-600">
              {securityStatus.status || "Awaiting data"} - Last updated{" "}
              {new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md border border-gray-100">
            <div className="flex items-center gap-3 mb-2">
              <AlertTriangle className="w-6 h-6 text-yellow-600" />
              <h3 className="text-lg font-semibold text-gray-800">Alerts</h3>
            </div>
            <p className="text-gray-600">
              {securityStatus.alerts || "No active alerts"} - Check logs for details
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition-all"
            onClick={() => alert("Initiate security scan - Implement API call here")}
          >
            Run Security Scan
          </motion.button>
        </div>
      )}
    </motion.div>
  );
};

export default SecurityPanel;