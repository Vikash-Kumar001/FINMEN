import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Search,
  Send,
  Inbox,
  Star,
  Trash2,
  MessageSquare,
  Clock,
  User,
  Filter,
  Bell,
  X,
} from "lucide-react";
import api from "../../utils/api";
import { toast } from "react-hot-toast";

const ParentMessages = () => {
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [parentProfile, setParentProfile] = useState(null);
  const [showComposeModal, setShowComposeModal] = useState(false);
  const [composeData, setComposeData] = useState({
    subject: "",
    message: "",
    recipient: "school",
  });

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const [messagesRes, profileRes] = await Promise.all([
        api.get("/api/parent/messages"),
        api.get("/api/user/profile").catch(() => ({ data: null }))
      ]);
      setMessages(messagesRes.data.messages || []);
      setParentProfile(profileRes.data);
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast.error("Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  const filteredMessages = messages.filter((msg) => {
    const matchesSearch =
      msg.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.message?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.sender?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterStatus === "all" ||
      (filterStatus === "read" && msg.read) ||
      (filterStatus === "unread" && !msg.read);

    return matchesSearch && matchesFilter;
  });

  const handleMessageClick = async (message) => {
    setSelectedMessage(message);
    if (!message.read) {
      try {
        await api.put(`/api/parent/messages/${message._id}/read`);
        const updatedMessages = messages.map((msg) =>
          msg._id === message._id ? { ...msg, read: true } : msg
        );
        setMessages(updatedMessages);
      } catch (error) {
        console.error("Error marking message as read:", error);
      }
    }
  };

  const handleSendMessage = async () => {
    if (!composeData.subject.trim() || !composeData.message.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      await api.post("/api/parent/messages", composeData);
      toast.success("Message sent successfully");
      setShowComposeModal(false);
      setComposeData({ subject: "", message: "", recipient: "school" });
      fetchMessages();
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl border border-slate-200 shadow-sm mb-6"
        >
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-6 py-6 rounded-t-xl">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-white mb-1 flex items-center gap-2">
                  <Mail className="w-6 h-6" />
                  Messages
                </h1>
                <p className="text-sm text-white/80">
                  Stay connected with your child's school and teachers
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowComposeModal(true)}
                className="px-4 py-2 bg-white/20 backdrop-blur text-white rounded-lg font-medium hover:bg-white/30 transition flex items-center gap-2 text-sm"
              >
                <Send className="w-4 h-4" />
                Compose
              </motion.button>
            </div>
          </div>
        </motion.div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Messages List */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-xl border border-slate-200 shadow-sm p-4"
            >
              {/* Search and Filter */}
              <div className="mb-4 space-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search messages..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none text-sm"
                  />
                </div>

                {/* Filter Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setFilterStatus("all")}
                    className={`flex-1 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                      filterStatus === "all"
                        ? "bg-indigo-600 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setFilterStatus("unread")}
                    className={`flex-1 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                      filterStatus === "unread"
                        ? "bg-indigo-600 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    Unread
                  </button>
                  <button
                    onClick={() => setFilterStatus("read")}
                    className={`flex-1 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                      filterStatus === "read"
                        ? "bg-indigo-600 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    Read
                  </button>
                </div>
              </div>

              {/* Message Stats */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="bg-indigo-50 rounded-lg p-3 border border-indigo-200">
                  <p className="text-xs text-indigo-600 font-medium mb-1">Total</p>
                  <p className="text-xl font-bold text-indigo-700">
                    {messages.length}
                  </p>
                </div>
                <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                  <p className="text-xs text-blue-600 font-medium mb-1">Unread</p>
                  <p className="text-xl font-bold text-blue-700">
                    {messages.filter((m) => !m.read).length}
                  </p>
                </div>
              </div>

              {/* Messages List */}
              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {filteredMessages.length === 0 ? (
                  <div className="text-center py-8 text-slate-400">
                    <MessageSquare className="w-12 h-12 mx-auto mb-2" />
                    <p className="text-sm font-medium">No messages found</p>
                  </div>
                ) : (
                  filteredMessages.map((message, idx) => (
                    <motion.div
                      key={message._id || idx}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.02 }}
                      whileHover={{ y: -1 }}
                      onClick={() => handleMessageClick(message)}
                      className={`p-3 rounded-lg cursor-pointer transition-all border ${
                        selectedMessage?._id === message._id
                          ? "bg-indigo-50 border-indigo-300 shadow-sm"
                          : message.read
                          ? "bg-slate-50 border-slate-200 hover:border-indigo-300"
                          : "bg-white border-indigo-200 hover:border-indigo-400 shadow-sm"
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        <div
                          className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                            message.read ? "bg-slate-300" : "bg-indigo-500"
                          }`}
                        />
                        <div className="flex-1 min-w-0">
                          <p
                            className={`font-semibold text-sm truncate mb-0.5 ${
                              message.read ? "text-slate-700" : "text-slate-900"
                            }`}
                          >
                            {message.subject || "No Subject"}
                          </p>
                          <p className="text-xs text-slate-600 mb-1">
                            From: {message.sender || "Unknown"}
                          </p>
                          <p className="text-xs text-slate-500 line-clamp-2 mb-1.5">
                            {message.message}
                          </p>
                          <p className="text-xs text-slate-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {message.time || "Just now"}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          </div>

          {/* Message Detail */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 min-h-[600px]"
            >
              {selectedMessage ? (
                <>
                  {/* Message Header */}
                  <div className="border-b border-slate-200 pb-4 mb-5">
                    <div className="flex items-start justify-between mb-3">
                      <h2 className="text-lg font-bold text-slate-900">
                        {selectedMessage.subject || "No Subject"}
                      </h2>
                      <div className="flex gap-1.5">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="p-2 bg-amber-50 text-amber-600 rounded-lg hover:bg-amber-100 transition"
                        >
                          <Star className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-sm text-slate-600">
                      <div className="flex items-center gap-2">
                        <div className="w-9 h-9 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-semibold text-sm">
                          {selectedMessage.sender?.charAt(0) || "?"}
                        </div>
                        <div>
                          <p className="font-medium text-slate-900 text-sm">
                            {selectedMessage.sender || "Unknown Sender"}
                          </p>
                          <p className="text-xs text-slate-500">
                            {selectedMessage.time || "Just now"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Message Body */}
                  <div className="mb-6">
                    <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                      {selectedMessage.message}
                    </p>
                  </div>

                  {/* Reply Section */}
                  <div className="border-t border-slate-200 pt-5">
                    <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                      <Send className="w-4 h-4 text-indigo-600" />
                      Reply
                    </h3>
                    <textarea
                      placeholder="Type your reply here..."
                      rows={5}
                      className="w-full px-3 py-2.5 rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none resize-none text-sm"
                    />
                    <div className="flex justify-end gap-2 mt-3">
                      <button className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200 transition text-sm">
                        Save Draft
                      </button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition flex items-center gap-2 text-sm"
                      >
                        <Send className="w-4 h-4" />
                        Send Reply
                      </motion.button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center py-16">
                  <Inbox className="w-16 h-16 text-slate-300 mb-4" />
                  <h3 className="text-lg font-semibold text-slate-600 mb-1">
                    No message selected
                  </h3>
                  <p className="text-sm text-slate-500">
                    Select a message from the list to view its contents
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Compose Modal */}
      {showComposeModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-6 max-w-2xl w-full shadow-xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-slate-900">Compose Message</h3>
              <button
                onClick={() => setShowComposeModal(false)}
                className="p-2 hover:bg-slate-100 rounded-lg transition"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  To:
                </label>
                <select
                  value={composeData.recipient}
                  onChange={(e) =>
                    setComposeData({ ...composeData, recipient: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none text-sm bg-white"
                >
                  <option value="school">School Administration</option>
                  <option value="teacher">Child's Teacher</option>
                  <option value="support">Support Team</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Subject:
                </label>
                <input
                  type="text"
                  placeholder="Enter subject"
                  value={composeData.subject}
                  onChange={(e) =>
                    setComposeData({ ...composeData, subject: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Message:
                </label>
                <textarea
                  placeholder="Type your message here..."
                  value={composeData.message}
                  onChange={(e) =>
                    setComposeData({ ...composeData, message: e.target.value })
                  }
                  rows={8}
                  className="w-full px-3 py-2.5 rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none resize-none text-sm"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-5 pt-4 border-t border-slate-200">
              <button
                onClick={() => setShowComposeModal(false)}
                className="flex-1 px-4 py-2.5 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSendMessage}
                className="flex-1 px-4 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                Send Message
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ParentMessages;

