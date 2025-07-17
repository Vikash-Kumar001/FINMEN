import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  BarChart3,
  Calendar,
  Clock,
  Activity,
  Smile,
  Book,
  Award,
  Zap,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  RefreshCw,
  Download,
  Filter,
} from "lucide-react";
import { fetchStudentActivity, fetchStudentProgress } from "../../services/educatorService";

const StudentActivityTracker = () => {
  const { studentId } = useParams();
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("week");
  const [studentData, setStudentData] = useState(null);
  const [activityData, setActivityData] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const loadStudentData = async () => {
      try {
        setLoading(true);
        const data = await fetchStudentProgress(studentId);
        setStudentData(data);
      } catch (err) {
        console.error("Failed to fetch student data:", err);
      }
    };

    loadStudentData();
  }, [studentId]);

  useEffect(() => {
    const loadActivityData = async () => {
      try {
        setLoading(true);
        const data = await fetchStudentActivity(studentId, period);
        setActivityData(data);
      } catch (err) {
        console.error("Failed to fetch activity data:", err);
      } finally {
        setLoading(false);
      }
    };

    loadActivityData();
  }, [studentId, period]);

  const handlePeriodChange = (newPeriod) => {
    setPeriod(newPeriod);
  };

  const handleRefresh = async () => {
    setLoading(true);
    try {
      const [progressData, activity] = await Promise.all([
        fetchStudentProgress(studentId),
        fetchStudentActivity(studentId, period),
      ]);
      setStudentData(progressData);
      setActivityData(activity);
    } catch (err) {
      console.error("Failed to refresh data:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!studentData || !activityData) {
    return (
      <div className="p-6 flex justify-center items-center min-h-[400px]">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 bg-blue-200 rounded-full mb-4"></div>
          <div className="h-4 w-48 bg-blue-200 rounded mb-2"></div>
          <div className="h-3 w-32 bg-blue-100 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header with student info */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <div className="flex items-center gap-2">
            <ArrowLeft
              className="w-5 h-5 cursor-pointer hover:text-blue-600"
              onClick={() => window.history.back()}
            />
            <h1 className="text-2xl font-bold">
              {studentData.student?.name || "Student"}'s Activity
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-300">
            Level {studentData.stats?.level || 1} • {studentData.stats?.totalXp || 0} XP
          </p>
        </div>

        <div className="flex gap-2 mt-4 md:mt-0">
          <button
            onClick={handleRefresh}
            className="flex items-center gap-1 px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>

          <div className="relative">
            <button className="flex items-center gap-1 px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700">
              <Filter className="w-4 h-4" />
              <span className="capitalize">{period}</span>
              <ChevronDown className="w-4 h-4" />
            </button>
            <div className="absolute right-0 mt-1 w-36 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-lg z-10 hidden">
              {["day", "week", "month", "year"].map((p) => (
                <button
                  key={p}
                  onClick={() => handlePeriodChange(p)}
                  className={`w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 ${p === period ? "bg-blue-50 dark:bg-blue-900/20" : ""}`}
                >
                  <span className="capitalize">{p}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-300 dark:border-gray-700 mb-6">
        <button
          onClick={() => setActiveTab("overview")}
          className={`px-4 py-2 font-medium ${activeTab === "overview" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-600 dark:text-gray-300"}`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab("mood")}
          className={`px-4 py-2 font-medium ${activeTab === "mood" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-600 dark:text-gray-300"}`}
        >
          Mood Tracking
        </button>
        <button
          onClick={() => setActiveTab("activities")}
          className={`px-4 py-2 font-medium ${activeTab === "activities" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-600 dark:text-gray-300"}`}
        >
          Activities
        </button>
      </div>

      {/* Content based on active tab */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Summary Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md col-span-1 md:col-span-2 lg:col-span-3"
          >
            <h2 className="text-xl font-semibold mb-4">Activity Summary</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-5 h-5 text-blue-600" />
                  <h3 className="font-medium">XP Earned</h3>
                </div>
                <p className="text-2xl font-bold">{activityData.summary?.totalXpEarned || 0}</p>
              </div>

              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Smile className="w-5 h-5 text-green-600" />
                  <h3 className="font-medium">Mood Check-ins</h3>
                </div>
                <p className="text-2xl font-bold">{activityData.summary?.totalMoodCheckins || 0}</p>
              </div>

              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Book className="w-5 h-5 text-purple-600" />
                  <h3 className="font-medium">Journal Entries</h3>
                </div>
                <p className="text-2xl font-bold">{activityData.summary?.totalJournalEntries || 0}</p>
              </div>

              <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="w-5 h-5 text-amber-600" />
                  <h3 className="font-medium">Activity Types</h3>
                </div>
                <p className="text-2xl font-bold">
                  {Object.keys(activityData.summary?.activityBreakdown || {}).length}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Activity Breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md"
          >
            <h2 className="text-xl font-semibold mb-4">Activity Breakdown</h2>
            <div className="space-y-3">
              {Object.entries(activityData.summary?.activityBreakdown || {}).map(([type, xp]) => (
                <div key={type} className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span className="capitalize">{type.replace(/_/g, " ")}</span>
                  </div>
                  <span className="font-medium">{xp} XP</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Recent Activities */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md col-span-1 md:col-span-2 lg:col-span-1"
          >
            <h2 className="text-xl font-semibold mb-4">Recent Activities</h2>
            <div className="space-y-3 max-h-[300px] overflow-y-auto">
              {activityData.activityData?.slice(0, 10).map((activity, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md"
                >
                  <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30">
                    <Activity className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium capitalize">
                      {activity.type.replace(/_/g, " ")}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(activity.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-green-600 dark:text-green-400 font-medium">
                    +{activity.xp} XP
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Mood Tracking Preview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Mood Tracking</h2>
              <button
                onClick={() => setActiveTab("mood")}
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium"
              >
                View Details
              </button>
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
              {activityData.moodData?.slice(0, 7).map((mood, idx) => (
                <div
                  key={idx}
                  className="flex flex-col items-center p-2 bg-gray-50 dark:bg-gray-700 rounded-md w-14"
                >
                  <span className="text-2xl">{mood.emoji}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(mood.date).toLocaleDateString(undefined, { weekday: "short" })}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      )}

      {activeTab === "mood" && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Mood Tracking History</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium mb-3">Mood Calendar</h3>
              <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: 28 }, (_, i) => {
                  const date = new Date();
                  date.setDate(date.getDate() - (27 - i));
                  const mood = activityData.moodData?.find(
                    (m) =>
                      new Date(m.date).toDateString() === date.toDateString()
                  );
                  return (
                    <div
                      key={i}
                      className={`p-2 rounded-md flex flex-col items-center ${mood ? "bg-blue-50 dark:bg-blue-900/20" : "bg-gray-50 dark:bg-gray-700"}`}
                    >
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {date.getDate()}
                      </span>
                      <span className="text-xl">{mood?.emoji || ""}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-3">Mood Distribution</h3>
              <div className="space-y-3">
                {/* Calculate mood distribution */}
                {(() => {
                  const distribution = activityData.moodData?.reduce((acc, mood) => {
                    acc[mood.emoji] = (acc[mood.emoji] || 0) + 1;
                    return acc;
                  }, {});

                  return Object.entries(distribution || {}).map(([emoji, count]) => {
                    const percentage = Math.round(
                      (count / activityData.moodData?.length) * 100
                    );
                    return (
                      <div key={emoji} className="space-y-1">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <span className="text-xl">{emoji}</span>
                            <span className="text-sm">{count} times</span>
                          </div>
                          <span className="text-sm">{percentage}%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "activities" && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Activity History</h2>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Activity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    XP
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                {activityData.activityData?.map((activity, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {new Date(activity.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm capitalize">
                      {activity.type.replace(/_/g, " ")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600 dark:text-green-400">
                      +{activity.xp}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentActivityTracker;