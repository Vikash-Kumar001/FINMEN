import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FileText, Download } from "lucide-react";

const ReportsGenerator = () => {
  const [reportOptions, setReportOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState("");

  useEffect(() => {
    // Fetch available report options from an API (replace with your endpoint)
    const fetchReportOptions = async () => {
      try {
        setLoading(true);
        // Example: Replace with your API call
        // const response = await fetch("/api/report-options", {
        //   headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        // });
        // const data = await response.json();
        // setReportOptions(data);
      } catch (error) {
        console.error("Error fetching report options:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReportOptions();
  }, []);

  const handleGenerateReport = () => {
    if (!selectedReport) {
      alert("Please select a report type");
      return;
    }
    // Implement API call to generate and download report
    alert(`Generating ${selectedReport} report - Implement download logic here`);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="p-6"
    >
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Reports Generation</h2>
      {loading ? (
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-2"></div>
          <div className="h-8 bg-gray-200 rounded"></div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-white p-4 rounded-lg shadow-md border border-gray-100">
            <div className="flex items-center gap-3 mb-2">
              <FileText className="w-6 h-6 text-green-600" />
              <h3 className="text-lg font-semibold text-gray-800">Select Report</h3>
            </div>
            <select
              value={selectedReport}
              onChange={(e) => setSelectedReport(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">-- Select a Report --</option>
              {reportOptions.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleGenerateReport}
            className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition-all flex items-center gap-2"
          >
            <Download className="w-4 h-4" /> Generate Report
          </motion.button>
        </div>
      )}
    </motion.div>
  );
};

export default ReportsGenerator;