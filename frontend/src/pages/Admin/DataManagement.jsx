import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Database, Download, Upload } from "lucide-react";

const DataManagement = () => {
  const [dataStatus, setDataStatus] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch data management status from an API (replace with your endpoint)
    const fetchDataStatus = async () => {
      try {
        setLoading(true);
        // Example: Replace with your API call
        // const response = await fetch("/api/data-status", {
        //   headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        // });
        // const data = await response.json();
        // setDataStatus(data);
      } catch (error) {
        console.error("Error fetching data status:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDataStatus();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="p-6"
    >
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Management</h2>
      {loading ? (
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-2"></div>
          <div className="h-8 bg-gray-200 rounded"></div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-white p-4 rounded-lg shadow-md border border-gray-100">
            <div className="flex items-center gap-3 mb-2">
              <Database className="w-6 h-6 text-indigo-600" />
              <h3 className="text-lg font-semibold text-gray-800">Data Status</h3>
            </div>
            <p className="text-gray-600">
              {dataStatus.status || "Awaiting data"} - Last backup{" "}
              {new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}
            </p>
          </div>
          <div className="flex gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition-all flex items-center gap-2"
              onClick={() => alert("Initiate backup - Implement API call here")}
            >
              <Download className="w-4 h-4" /> Backup Data
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-purple-700 transition-all flex items-center gap-2"
              onClick={() => alert("Initiate migration - Implement API call here")}
            >
              <Upload className="w-4 h-4" /> Migrate Data
            </motion.button>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default DataManagement;