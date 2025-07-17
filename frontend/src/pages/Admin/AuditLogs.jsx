import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true);
        // Replace with your API call
        // const response = await fetch("/api/audit-logs");
        // const data = await response.json();
        // setLogs(data);
      } catch (error) {
        console.error("Error fetching audit logs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="p-6"
    >
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Audit Logs</h2>
      {loading ? (
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-2"></div>
          <div className="h-8 bg-gray-200 rounded mb-2"></div>
          <div className="h-8 bg-gray-200 rounded"></div>
        </div>
      ) : logs.length === 0 ? (
        <p className="text-gray-600">No audit logs available.</p>
      ) : (
        <div className="space-y-4">
          {logs.map((log, index) => (
            <div
              key={index}
              className="bg-white p-4 rounded-lg shadow-md border border-gray-100"
            >
              <p className="text-sm text-gray-700">
                {log.message || "Log entry"} -{" "}
                {new Date(log.timestamp).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default AuditLogs;