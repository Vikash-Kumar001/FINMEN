import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell, Search, Filter, Calendar, Users, AlertCircle, Clock,
  CheckCircle, X, Star, Pin, MessageSquare, FileText, Target,
  Zap, Eye, ChevronDown, ChevronUp, Plus, Send, Save
} from "lucide-react";
import api from "../../utils/api";
import { toast } from "react-hot-toast";
import { useAuth } from "../../context/AuthUtils";

const Announcements = () => {
  const { user } = useAuth();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [expandedAnnouncements, setExpandedAnnouncements] = useState(new Set());
  const [showFilters, setShowFilters] = useState(false);
  
  // Modals
  const [showViewModal, setShowViewModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  
  // Form data for creating announcements
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    type: "general",
    priority: "normal",
    targetAudience: "all",
    targetClassNames: [],
    publishDate: "",
    expiryDate: "",
    isPinned: false
  });

  const announcementTypes = [
    { value: "general", label: "General", icon: MessageSquare, color: "blue" },
    { value: "urgent", label: "Urgent", icon: AlertCircle, color: "red" },
    { value: "event", label: "Event", icon: Calendar, color: "green" },
    { value: "holiday", label: "Holiday", icon: Star, color: "yellow" },
    { value: "exam", label: "Exam", icon: FileText, color: "purple" },
    { value: "fee", label: "Fee", icon: Target, color: "orange" },
    { value: "meeting", label: "Meeting", icon: Users, color: "indigo" }
  ];

  const priorityLevels = [
    { value: "low", label: "Low", color: "gray" },
    { value: "normal", label: "Normal", color: "blue" },
    { value: "high", label: "High", color: "orange" },
    { value: "urgent", label: "Urgent", color: "red" }
  ];

  const targetAudiences = [
    { value: "all", label: "Everyone" },
    { value: "students", label: "Students Only" },
    { value: "teachers", label: "Teachers Only" },
    { value: "parents", label: "Parents Only" },
    { value: "specific_class", label: "Specific Classes" }
  ];

  useEffect(() => {
    fetchAnnouncements();
  }, [currentPage, filterType, filterPriority]);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage,
        limit: 10,
        ...(filterType !== "all" && { type: filterType }),
        ...(filterPriority !== "all" && { priority: filterPriority })
      });

      let endpoint = "";
      if (user?.role === "school_student" || user?.role === "student") {
        endpoint = `/api/announcements/student?${params}`;
      } else if (user?.role === "school_teacher") {
        endpoint = `/api/announcements/teacher?${params}`;
      } else if (user?.role === "school_parent" || user?.role === "parent") {
        endpoint = `/api/announcements/parent?${params}`;
      }

      if (endpoint) {
        const response = await api.get(endpoint);
        setAnnouncements(response.data.announcements);
        setTotalPages(response.data.totalPages);
      }
    } catch (error) {
      console.error("Error fetching announcements:", error);
      toast.error("Failed to load announcements");
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (announcementId) => {
    try {
      await api.patch(`/api/announcements/${user?.role === "school_student" || user?.role === "student" ? "student" : user?.role === "school_teacher" ? "teacher" : "parent"}/${announcementId}/read`);
      // Update local state to reflect read status
      setAnnouncements(prev => 
        prev.map(announcement => 
          announcement._id === announcementId 
            ? { ...announcement, isRead: true }
            : announcement
        )
      );
    } catch (error) {
      console.error("Error marking announcement as read:", error);
    }
  };

  const toggleExpanded = (announcementId) => {
    setExpandedAnnouncements(prev => {
      const newSet = new Set(prev);
      if (newSet.has(announcementId)) {
        newSet.delete(announcementId);
      } else {
        newSet.add(announcementId);
      }
      return newSet;
    });
  };

  const openViewModal = (announcement) => {
    setSelectedAnnouncement(announcement);
    setShowViewModal(true);
    markAsRead(announcement._id);
  };

  const handleCreateAnnouncement = async (e) => {
    e.preventDefault();
    try {
      await api.post("/api/announcements", formData);
      toast.success("Announcement created successfully!");
      setShowCreateModal(false);
      resetForm();
      fetchAnnouncements();
    } catch (error) {
      console.error("Error creating announcement:", error);
      toast.error(error.response?.data?.message || "Failed to create announcement");
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      message: "",
      type: "general",
      priority: "normal",
      targetAudience: "all",
      targetClassNames: [],
      publishDate: "",
      expiryDate: "",
      isPinned: false
    });
  };

  const getTypeIcon = (type) => {
    const typeConfig = announcementTypes.find(t => t.value === type);
    return typeConfig ? typeConfig.icon : MessageSquare;
  };

  const getTypeColor = (type) => {
    const typeConfig = announcementTypes.find(t => t.value === type);
    return typeConfig ? typeConfig.color : "blue";
  };

  const getPriorityColor = (priority) => {
    const priorityConfig = priorityLevels.find(p => p.value === priority);
    return priorityConfig ? priorityConfig.color : "blue";
  };

  const filteredAnnouncements = announcements.filter(announcement =>
    announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    announcement.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleLabel = () => {
    switch (user?.role) {
      case "school_student":
      case "student":
        return "Student";
      case "school_teacher":
        return "Teacher";
      case "school_parent":
      case "parent":
        return "Parent";
      default:
        return "User";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Bell className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Announcements</h1>
              <p className="text-gray-600">Stay updated with school announcements</p>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow mb-6 p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search announcements..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Filter className="w-4 h-4" />
                Filters
                {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              
              {(user?.role === "school_teacher" || user?.role === "school_admin") && (
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Create Announcement
                </button>
              )}
            </div>
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 pt-4 border-t border-gray-200"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Type
                    </label>
                    <select
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="all">All Types</option>
                      {announcementTypes.map(type => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Priority
                    </label>
                    <select
                      value={filterPriority}
                      onChange={(e) => setFilterPriority(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="all">All Priorities</option>
                      {priorityLevels.map(priority => (
                        <option key={priority.value} value={priority.value}>{priority.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Announcements List */}
        <div className="space-y-4">
          {loading ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading announcements...</p>
            </div>
          ) : filteredAnnouncements.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No announcements found</p>
            </div>
          ) : (
            filteredAnnouncements.map((announcement, index) => {
              const TypeIcon = getTypeIcon(announcement.type);
              const typeColor = getTypeColor(announcement.type);
              const priorityColor = getPriorityColor(announcement.priority);
              const isExpanded = expandedAnnouncements.has(announcement._id);
              
              return (
                <motion.div
                  key={announcement._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`bg-white rounded-lg shadow hover:shadow-md transition-shadow ${
                    announcement.isPinned ? 'border-l-4 border-yellow-400 bg-yellow-50' : ''
                  }`}
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          {announcement.isPinned && (
                            <Pin className="w-4 h-4 text-yellow-600" />
                          )}
                          <TypeIcon className={`w-5 h-5 text-${typeColor}-600`} />
                          <h3 className="text-lg font-semibold text-gray-900">
                            {announcement.title}
                          </h3>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full bg-${priorityColor}-100 text-${priorityColor}-800`}>
                            {announcement.priority}
                          </span>
                        </div>
                        
                        <p className={`text-gray-600 ${isExpanded ? '' : 'line-clamp-2'}`}>
                          {announcement.message}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-2 ml-4">
                        <button
                          onClick={() => openViewModal(announcement)}
                          className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => toggleExpanded(announcement._id)}
                          className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                          title={isExpanded ? "Show Less" : "Show More"}
                        >
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <span>{announcement.targetAudience}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(announcement.publishDate).toLocaleDateString()}</span>
                        </div>
                        {announcement.createdBy && (
                          <div className="flex items-center gap-1">
                            <span>By {announcement.createdBy.name}</span>
                          </div>
                        )}
                      </div>
                      
                      {announcement.expiryDate && (
                        <div className="flex items-center gap-1 text-orange-600">
                          <Clock className="w-4 h-4" />
                          <span>Expires {new Date(announcement.expiryDate).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex justify-center">
            <div className="flex gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-2 rounded-lg ${
                    page === currentPage
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* View Announcement Modal */}
      <AnimatePresence>
        {showViewModal && selectedAnnouncement && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Announcement Details</h2>
                  <button
                    onClick={() => setShowViewModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {selectedAnnouncement.title}
                  </h3>
                  <div className="flex items-center gap-4 mb-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full bg-${getTypeColor(selectedAnnouncement.type)}-100 text-${getTypeColor(selectedAnnouncement.type)}-800`}>
                      {selectedAnnouncement.type}
                    </span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full bg-${getPriorityColor(selectedAnnouncement.priority)}-100 text-${getPriorityColor(selectedAnnouncement.priority)}-800`}>
                      {selectedAnnouncement.priority}
                    </span>
                    {selectedAnnouncement.isPinned && (
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800 flex items-center gap-1">
                        <Pin className="w-3 h-3" />
                        Pinned
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Message</h4>
                  <p className="text-gray-600 whitespace-pre-wrap">{selectedAnnouncement.message}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Target Audience</h4>
                    <p className="text-gray-600">{selectedAnnouncement.targetAudience}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Publish Date</h4>
                    <p className="text-gray-600">{new Date(selectedAnnouncement.publishDate).toLocaleDateString()}</p>
                  </div>
                  {selectedAnnouncement.expiryDate && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Expiry Date</h4>
                      <p className="text-gray-600">{new Date(selectedAnnouncement.expiryDate).toLocaleDateString()}</p>
                    </div>
                  )}
                  {selectedAnnouncement.createdBy && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Created By</h4>
                      <p className="text-gray-600">{selectedAnnouncement.createdBy.name}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-6 border-t border-gray-200">
                <button
                  onClick={() => setShowViewModal(false)}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create Announcement Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Create Announcement</h2>
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <form onSubmit={handleCreateAnnouncement} className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Type
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {announcementTypes.map(type => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Priority
                    </label>
                    <select
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {priorityLevels.map(priority => (
                        <option key={priority.value} value={priority.value}>{priority.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Target Audience *
                  </label>
                  <select
                    value={formData.targetAudience}
                    onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    {targetAudiences.map(audience => (
                      <option key={audience.value} value={audience.value}>{audience.label}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Publish Date
                    </label>
                    <input
                      type="date"
                      value={formData.publishDate}
                      onChange={(e) => setFormData({ ...formData, publishDate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Expiry Date (Optional)
                    </label>
                    <input
                      type="date"
                      value={formData.expiryDate}
                      onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isPinned"
                    checked={formData.isPinned}
                    onChange={(e) => setFormData({ ...formData, isPinned: e.target.checked })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isPinned" className="ml-2 block text-sm text-gray-700">
                    Pin this announcement to the top
                  </label>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    Create Announcement
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Announcements;
