import React, { useEffect, useState } from "react";
import { useSocket } from "../../context/SocketContext";
import { useNotification } from "../../context/NotificationContext";
import { FaUsers, FaTools, FaGift } from "react-icons/fa";

import StudentManagement from "./StudentManagement";
import EducatorTools from "./EducatorTools";
import RedemptionRequests from "./RedemptionRequests";

const EducatorDashboard = () => {
  const socket = useSocket();                // ✅ Fixed: Correct socket context hook
  const { notify } = useNotification();      // ✅ Fixed: Correct notification hook

  const [activeTab, setActiveTab] = useState("students");

  useEffect(() => {
    if (!socket) return;

    socket.on("educator-notification", (data) => {
      notify(data?.message || "🔔 New update received");
    });

    return () => {
      socket.off("educator-notification");
    };
  }, [socket, notify]);

  const renderContent = () => {
    switch (activeTab) {
      case "students":
        return <StudentManagement />;
      case "tools":
        return <EducatorTools />;
      case "redemptions":
        return <RedemptionRequests />;
      default:
        return <StudentManagement />;
    }
  };

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-indigo-700 dark:text-white">
        👩‍🏫 Educator Dashboard
      </h2>

      <div className="flex flex-wrap gap-4 mb-6">
        <button
          onClick={() => setActiveTab("students")}
          className={`btn-tab ${activeTab === "students" ? "bg-indigo-600 text-white" : ""}`}
        >
          <FaUsers className="mr-2" /> Manage Students
        </button>
        <button
          onClick={() => setActiveTab("tools")}
          className={`btn-tab ${activeTab === "tools" ? "bg-indigo-600 text-white" : ""}`}
        >
          <FaTools className="mr-2" /> Tools
        </button>
        <button
          onClick={() => setActiveTab("redemptions")}
          className={`btn-tab ${activeTab === "redemptions" ? "bg-indigo-600 text-white" : ""}`}
        >
          <FaGift className="mr-2" /> Redemptions
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow rounded-xl p-6">
        {renderContent()}
      </div>
    </div>
  );
};

export default EducatorDashboard;
