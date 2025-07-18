import React, { useEffect, useState } from "react";
import { useSocket } from "../../context/SocketContext";
import { useAuth } from "../../hooks/useAuth";
import { useNotification } from "../../context/NotificationContext";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import {
  Activity,
  Clock,
  Eye,
  FileText,
  BarChart,
  Users,
  Calendar,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  Search,
  UserPlus,
  Mail,
  User,
  Briefcase,
  BookOpen
} from "lucide-react";

const EducatorTracker = () => {
  const { user } = useAuth();
  const socket = useSocket();
  const { notify } = useNotification();
  const [educators, setEducators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState([]);
  const [selectedEducator, setSelectedEducator] = useState(null);
  const [educatorActivities, setEducatorActivities] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newEducator, setNewEducator] = useState({
    name: "",
    email: "",
    password: "",
    position: "",
    subjects: ""
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (socket && user) {
      // Subscribe to educator activity tracking
      socket.socket.emit("admin:educator:activity:subscribe", { adminId: user._id });

      // Listen for educator data
      socket.socket.on("admin:educator:activity:data", (data) => {
        setEducators(data);
        setFiltered(data);
        setLoading(false);
      });

      // Listen for educator tracking data
      socket.socket.on("admin:educator:track:data", (data) => {
        setSelectedEducator(data.educator);
        setEducatorActivities(data.activities);
      });

      // Listen for errors
      socket.socket.on("admin:educator:activity:error", (error) => {
        notify(error.message || "Error tracking educators", "error");
        setLoading(false);
      });

      // Listen for educator creation success
      socket.socket.on("admin:educator:create:success", (data) => {
        notify(data.message || "Educator created successfully", "success");
        setShowCreateForm(false);
        setNewEducator({
          name: "",
          email: "",
          password: "",
          position: "",
          subjects: ""
        });
      });

      // Listen for educator creation errors
      socket.socket.on("admin:educator:create:error", (error) => {
        notify(error.message || "Error creating educator", "error");
        setFormErrors({ general: error.message });
      });

      return () => {
        socket.socket.off("admin:educator:activity:data");
        socket.socket.off("admin:educator:track:data");
        socket.socket.off("admin:educator:activity:error");
        socket.socket.off("admin:educator:create:success");
        socket.socket.off("admin:educator:create:error");
        
        // Untrack educator if one is selected
        if (selectedEducator) {
          socket.socket.emit("admin:educator:untrack", { 
            adminId: user._id, 
            educatorId: selectedEducator._id 
          });
        }
      };
    }
  }, [socket, user]);

  useEffect(() => {
    const lower = search.toLowerCase();
    const filteredList = educators.filter(
      (e) =>
        e.name.toLowerCase().includes(lower) ||
        e.email.toLowerCase().includes(lower) ||
        e.position?.toLowerCase().includes(lower)
    );
    setFiltered(filteredList);
  }, [search, educators]);

  const handleTrackEducator = (educatorId) => {
    if (!socket || !socket.socket) {
      console.error("❌ Socket not available for tracking educator");
      notify("Connection error. Please try again.", "error");
      return;
    }
    
    try {
      // Untrack current educator if one is selected
      if (selectedEducator) {
        socket.socket.emit("admin:educator:untrack", { 
          adminId: user._id, 
          educatorId: selectedEducator._id 
        });
      }
      
      // Track new educator
      socket.socket.emit("admin:educator:track", { 
        adminId: user._id, 
        educatorId 
      });
    } catch (err) {
      console.error("❌ Error tracking educator:", err.message);
      notify("Failed to track educator", "error");
    }
  };

  const handleUntrackEducator = () => {
    if (!socket || !socket.socket) {
      console.error("❌ Socket not available for untracking educator");
      notify("Connection error. Please try again.", "error");
      return;
    }
    
    if (selectedEducator) {
      try {
        socket.socket.emit("admin:educator:untrack", { 
          adminId: user._id, 
          educatorId: selectedEducator._id 
        });
        setSelectedEducator(null);
        setEducatorActivities([]);
      } catch (err) {
        console.error("❌ Error untracking educator:", err.message);
        notify("Failed to untrack educator", "error");
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEducator(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!newEducator.name) errors.name = "Name is required";
    if (!newEducator.email) errors.email = "Email is required";
    if (!newEducator.password) errors.password = "Password is required";
    if (!newEducator.position) errors.position = "Position is required";
    if (!newEducator.subjects) errors.subjects = "Subjects are required";
    
    // Email validation
    if (newEducator.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEducator.email)) {
      errors.email = "Invalid email format";
    }
    
    // Password validation
    if (newEducator.password && newEducator.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreateEducator = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    if (!socket || !socket.socket) {
      console.error("❌ Socket not available for creating educator");
      notify("Connection error. Please try again.", "error");
      setFormErrors({ general: "Connection error. Please try again." });
      return;
    }
    
    try {
      socket.socket.emit("admin:educator:create", {
        adminId: user._id,
        educatorData: newEducator
      });
    } catch (err) {
      console.error("❌ Error creating educator:", err.message);
      notify("Failed to create educator", "error");
      setFormErrors({ general: err.message || "Failed to create educator" });
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case "login":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "logout":
        return <XCircle className="w-4 h-4 text-red-500" />;
      case "student_view":
        return <Eye className="w-4 h-4 text-blue-500" />;
      case "report_view":
        return <FileText className="w-4 h-4 text-purple-500" />;
      case "analytics_view":
        return <BarChart className="w-4 h-4 text-indigo-500" />;
      case "student_interaction":
        return <Users className="w-4 h-4 text-orange-500" />;
      default:
        return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="p-6 h-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          <Activity className="mr-2 text-indigo-600" /> Educator Activity Tracker
        </h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            {showCreateForm ? "Cancel" : "Create Educator"}
          </button>
        </div>
      </div>

      {/* Create Educator Form */}
      {showCreateForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-lg shadow-md mb-6"
        >
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Create New Educator Account</h3>
          <form onSubmit={handleCreateEducator} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="name"
                  value={newEducator.name}
                  onChange={handleInputChange}
                  className={`pl-10 w-full p-2 border rounded-md ${formErrors.name ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="Full Name"
                />
              </div>
              {formErrors.name && <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={newEducator.email}
                  onChange={handleInputChange}
                  className={`pl-10 w-full p-2 border rounded-md ${formErrors.email ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="Email Address"
                />
              </div>
              {formErrors.email && <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                name="password"
                value={newEducator.password}
                onChange={handleInputChange}
                className={`w-full p-2 border rounded-md ${formErrors.password ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Password"
              />
              {formErrors.password && <p className="text-red-500 text-xs mt-1">{formErrors.password}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Briefcase className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="position"
                  value={newEducator.position}
                  onChange={handleInputChange}
                  className={`pl-10 w-full p-2 border rounded-md ${formErrors.position ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="e.g. Math Teacher, Counselor"
                />
              </div>
              {formErrors.position && <p className="text-red-500 text-xs mt-1">{formErrors.position}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Subjects/Specialization</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <BookOpen className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="subjects"
                  value={newEducator.subjects}
                  onChange={handleInputChange}
                  className={`pl-10 w-full p-2 border rounded-md ${formErrors.subjects ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="e.g. Mathematics, Science, Career Guidance"
                />
              </div>
              {formErrors.subjects && <p className="text-red-500 text-xs mt-1">{formErrors.subjects}</p>}
            </div>

            {formErrors.general && (
              <div className="md:col-span-2">
                <p className="text-red-500 text-sm p-2 bg-red-50 rounded-md">{formErrors.general}</p>
              </div>
            )}

            <div className="md:col-span-2 flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
              >
                Create Educator
              </button>
            </div>
          </form>
        </motion.div>
      )}

      <div className="flex flex-col md:flex-row gap-6 h-[calc(100vh-220px)]">
        {/* Educators List */}
        <div className="w-full md:w-1/3 bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
          <div className="p-4 border-b">
            <div className="relative">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search educators..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex-1 flex items-center justify-center p-6">
              <RefreshCw className="w-8 h-8 text-indigo-500 animate-spin" />
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto">
              {filtered.length > 0 ? (
                filtered.map((educator) => (
                  <div
                    key={educator._id}
                    onClick={() => handleTrackEducator(educator._id)}
                    className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${selectedEducator?._id === educator._id ? 'bg-indigo-50 border-l-4 border-l-indigo-500' : ''}`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900">{educator.name}</h3>
                        <p className="text-sm text-gray-500">{educator.email}</p>
                        <p className="text-xs text-gray-400 mt-1">{educator.position}</p>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-xs text-gray-400">
                          {educator.lastActive ? (
                            `Active ${formatDistanceToNow(new Date(educator.lastActive), { addSuffix: true })}`
                          ) : (
                            "Never active"
                          )}
                        </span>
                        <div className="mt-1">
                          {selectedEducator?._id === educator._id ? (
                            <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                              <Eye className="w-3 h-3 mr-1" /> Tracking
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                              <Clock className="w-3 h-3 mr-1" /> Track
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-gray-500">
                  <AlertCircle className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <p>No educators found matching your search.</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Educator Activity */}
        <div className="w-full md:w-2/3 bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
          {selectedEducator ? (
            <>
              <div className="p-4 border-b bg-indigo-50 flex justify-between items-center">
                <div>
                  <h3 className="font-medium text-gray-900">{selectedEducator.name}</h3>
                  <p className="text-sm text-gray-500">{selectedEducator.position} • {selectedEducator.subjects}</p>
                </div>
                <button
                  onClick={handleUntrackEducator}
                  className="px-3 py-1 text-xs bg-gray-200 hover:bg-gray-300 rounded-md transition-colors"
                >
                  Stop Tracking
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Educator Information</h4>
                  <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-md">
                    <div>
                      <p className="text-xs text-gray-500">Email</p>
                      <p className="text-sm">{selectedEducator.email}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Last Active</p>
                      <p className="text-sm">
                        {selectedEducator.lastActive ? (
                          formatDistanceToNow(new Date(selectedEducator.lastActive), { addSuffix: true })
                        ) : (
                          "Never active"
                        )}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Account Created</p>
                      <p className="text-sm">
                        {selectedEducator.createdAt ? (
                          formatDistanceToNow(new Date(selectedEducator.createdAt), { addSuffix: true })
                        ) : (
                          "Unknown"
                        )}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Approval Status</p>
                      <p className="text-sm">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${selectedEducator.approvalStatus === 'approved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                          {selectedEducator.approvalStatus}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>

                <h4 className="text-sm font-medium text-gray-700 mb-2">Recent Activity</h4>
                {educatorActivities.length > 0 ? (
                  <div className="space-y-2">
                    {educatorActivities.map((activity) => (
                      <div key={activity._id} className="p-3 bg-gray-50 rounded-md">
                        <div className="flex items-start">
                          <div className="mr-3 mt-1">
                            {getActivityIcon(activity.activityType)}
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <p className="text-sm font-medium">{activity.activityType.replace(/_/g, ' ')}</p>
                              <p className="text-xs text-gray-500">
                                {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                              </p>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                              {activity.details ? JSON.stringify(activity.details) : 'No details available'}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center p-8 text-gray-500">
                    <Calendar className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                    <p>No recent activity recorded for this educator.</p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-gray-500">
              <Eye className="w-16 h-16 text-gray-300 mb-4" />
              <h3 className="text-xl font-medium mb-2">Select an Educator to Track</h3>
              <p className="text-center max-w-md">
                Click on an educator from the list to view their activity and information in real-time.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EducatorTracker;