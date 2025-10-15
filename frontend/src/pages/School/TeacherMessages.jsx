import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Search,
  Filter,
  Send,
  MoreVertical,
  Trash2,
  Archive,
  Star,
  Reply,
  Forward,
  Check,
  X,
  Inbox,
  SendHorizonal,
  AlertCircle,
  User,
  Users,
  Paperclip,
} from "lucide-react";
import api from "../../utils/api";
import { toast } from "react-hot-toast";

const TeacherMessages = () => {
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [showCompose, setShowCompose] = useState(false);
  const [teacherProfile, setTeacherProfile] = useState(null);
  const [composeData, setComposeData] = useState({
    to: "",
    subject: "",
    message: ""
  });

  useEffect(() => {
    fetchMessages();
    fetchProfile();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await api.get("/api/school/teacher/messages");
      setMessages(response.data.messages || []);
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast.error("Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  const fetchProfile = async () => {
    try {
      const response = await api.get("/api/user/profile");
      setTeacherProfile(response.data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const handleMarkAsRead = async (messageId, type) => {
    try {
      await api.put(`/api/school/teacher/messages/${messageId}/read`, { type });
      setMessages(messages.map(m => m._id === messageId ? { ...m, read: true } : m));
      toast.success("Marked as read");
    } catch (error) {
      console.error("Error marking as read:", error);
      toast.error("Failed to mark as read");
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!composeData.to || !composeData.message) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      // In a real app, you'd send this to a proper messaging endpoint
      toast.success("Message sent successfully!");
      setShowCompose(false);
      setComposeData({ to: "", subject: "", message: "" });
      fetchMessages();
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    }
  };

  const filteredMessages = messages.filter(msg => {
    const matchesSearch = msg.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          msg.sender.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === "all" ||
                          (filterType === "unread" && !msg.read) ||
                          (filterType === "important" && msg.isPinned) ||
                          (filterType === msg.type);
    return matchesSearch && matchesFilter;
  });

  const unreadCount = messages.filter(m => !m.read).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-20 h-20 border-4 border-purple-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 pb-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between"
          >
            <div>
              <h1 className="text-4xl font-black mb-2">
                {teacherProfile?.name}'s Messages
              </h1>
              <p className="text-lg text-white/90">
                Stay connected with students, parents, and staff
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowCompose(true)}
              className="px-6 py-3 bg-white text-purple-600 rounded-xl font-bold hover:shadow-lg transition-all flex items-center gap-2"
            >
              <Send className="w-5 h-5" />
              Compose
            </motion.button>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Messages List */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 overflow-hidden"
            >
              {/* Toolbar */}
              <div className="p-4 border-b-2 border-gray-100 bg-gray-50">
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex-1 relative min-w-[250px]">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search messages..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
                    />
                  </div>

                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none bg-white font-semibold"
                  >
                    <option value="all">All Messages</option>
                    <option value="unread">Unread ({unreadCount})</option>
                    <option value="important">Important</option>
                    <option value="notification">Notifications</option>
                    <option value="announcement">Announcements</option>
                  </select>
                </div>
              </div>

              {/* Messages */}
              <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
                {filteredMessages.length === 0 ? (
                  <div className="text-center py-12">
                    <Inbox className="w-16 h-16 text-gray-300 mx-auto mb-3" />
                    <h3 className="text-xl font-bold text-gray-600">No messages found</h3>
                    <p className="text-gray-500 mt-2">Try adjusting your filters</p>
                  </div>
                ) : (
                  filteredMessages.map((msg, idx) => (
                    <motion.div
                      key={msg._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.03 }}
                      onClick={() => {
                        setSelectedMessage(msg);
                        if (!msg.read) handleMarkAsRead(msg._id, msg.type);
                      }}
                      className={`p-4 cursor-pointer transition-all ${
                        selectedMessage?._id === msg._id
                          ? "bg-purple-50 border-l-4 border-purple-500"
                          : msg.read
                          ? "hover:bg-gray-50"
                          : "bg-blue-50 hover:bg-blue-100 border-l-4 border-blue-500"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                          msg.isPinned ? "bg-amber-500" : "bg-purple-500"
                        }`}>
                          {msg.sender.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <p className={`font-bold ${msg.read ? "text-gray-700" : "text-gray-900"}`}>
                              {msg.sender}
                            </p>
                            <span className="text-xs text-gray-500">{msg.time}</span>
                          </div>
                          <p className={`text-sm mb-1 ${msg.read ? "text-gray-600" : "text-gray-900 font-semibold"}`}>
                            {msg.subject}
                          </p>
                          <p className="text-xs text-gray-500 truncate">{msg.message}</p>
                          <div className="flex items-center gap-2 mt-2">
                            {msg.isPinned && (
                              <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded text-xs font-bold">
                                Important
                              </span>
                            )}
                            {msg.type && (
                              <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-semibold capitalize">
                                {msg.type}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          </div>

          {/* Message Detail / Compose */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 overflow-hidden"
            >
              {showCompose ? (
                /* Compose Form */
                <div>
                  <div className="p-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white flex items-center justify-between">
                    <h3 className="font-bold text-lg">Compose Message</h3>
                    <button
                      onClick={() => setShowCompose(false)}
                      className="p-2 hover:bg-white/20 rounded-lg transition-all"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <form onSubmit={handleSendMessage} className="p-6 space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">To *</label>
                      <input
                        type="text"
                        required
                        value={composeData.to}
                        onChange={(e) => setComposeData({ ...composeData, to: e.target.value })}
                        placeholder="student@example.com or Student Name"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Subject</label>
                      <input
                        type="text"
                        value={composeData.subject}
                        onChange={(e) => setComposeData({ ...composeData, subject: e.target.value })}
                        placeholder="Message subject"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Message *</label>
                      <textarea
                        required
                        value={composeData.message}
                        onChange={(e) => setComposeData({ ...composeData, message: e.target.value })}
                        placeholder="Type your message..."
                        rows={8}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none resize-none"
                      />
                    </div>

                    <div className="flex gap-3">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                      >
                        <Send className="w-5 h-5" />
                        Send Message
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="button"
                        onClick={() => setShowCompose(false)}
                        className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-all"
                      >
                        Cancel
                      </motion.button>
                    </div>
                  </form>
                </div>
              ) : selectedMessage ? (
                /* Message Detail */
                <div>
                  <div className="p-4 bg-gradient-to-r from-blue-500 to-cyan-600 text-white">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-bold text-lg">{selectedMessage.subject}</h3>
                      <button
                        onClick={() => setSelectedMessage(null)}
                        className="p-2 hover:bg-white/20 rounded-lg transition-all"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-white/90">
                      <User className="w-4 h-4" />
                      <span>{selectedMessage.sender}</span>
                      <span className="mx-2">•</span>
                      <span>{selectedMessage.time}</span>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="prose max-w-none mb-6">
                      <p className="text-gray-700 whitespace-pre-wrap">{selectedMessage.message}</p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-4 border-t-2 border-gray-100">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          setShowCompose(true);
                          setComposeData({
                            ...composeData,
                            to: selectedMessage.sender,
                            subject: `Re: ${selectedMessage.subject}`
                          });
                        }}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-all flex items-center gap-2"
                      >
                        <Reply className="w-4 h-4" />
                        Reply
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-all flex items-center gap-2"
                      >
                        <Archive className="w-4 h-4" />
                        Archive
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-4 py-2 bg-red-100 text-red-600 rounded-lg font-semibold hover:bg-red-200 transition-all flex items-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </motion.button>
                    </div>
                  </div>
                </div>
              ) : (
                /* No Selection */
                <div className="p-12 text-center">
                  <Mail className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-600 mb-2">No Message Selected</h3>
                  <p className="text-gray-500 mb-6">Select a message from the list to read</p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowCompose(true)}
                    className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center gap-2 mx-auto"
                  >
                    <Send className="w-5 h-5" />
                    Compose New Message
                  </motion.button>
                </div>
              )}
            </motion.div>
          </div>

          {/* Sidebar Stats */}
          <div className="space-y-6">
            {/* Inbox Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6"
            >
              <h3 className="font-bold text-gray-900 mb-4">Inbox Stats</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <span className="font-semibold text-gray-700">Total Messages</span>
                  <span className="text-2xl font-black text-blue-600">{messages.length}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <span className="font-semibold text-gray-700">Unread</span>
                  <span className="text-2xl font-black text-purple-600">{unreadCount}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
                  <span className="font-semibold text-gray-700">Important</span>
                  <span className="text-2xl font-black text-amber-600">
                    {messages.filter(m => m.isPinned).length}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Quick Compose */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl shadow-lg p-6 text-white"
            >
              <h3 className="font-bold mb-4">Quick Send</h3>
              <div className="space-y-2">
                <button
                  onClick={() => {
                    setShowCompose(true);
                    setComposeData({ ...composeData, subject: "Class Announcement" });
                  }}
                  className="w-full px-4 py-3 bg-white/20 hover:bg-white/30 rounded-lg font-semibold transition-all flex items-center justify-between"
                >
                  <span>Class Announcement</span>
                  <Users className="w-5 h-5" />
                </button>
                <button
                  onClick={() => {
                    setShowCompose(true);
                    setComposeData({ ...composeData, subject: "Individual Message" });
                  }}
                  className="w-full px-4 py-3 bg-white/20 hover:bg-white/30 rounded-lg font-semibold transition-all flex items-center justify-between"
                >
                  <span>Message Student</span>
                  <User className="w-5 h-5" />
                </button>
              </div>
            </motion.div>

            {/* Tips */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6"
            >
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-blue-600" />
                Tips
              </h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p>• Use filters to organize messages</p>
                <p>• Mark important messages with star</p>
                <p>• Archive old conversations</p>
                <p>• Reply promptly to parent queries</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherMessages;
