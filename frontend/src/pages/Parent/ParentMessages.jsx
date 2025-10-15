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
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
        <motion.div
          animate={{ rotate: 360, scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-20 h-20 border-4 border-purple-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 pb-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 text-white py-8 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between"
          >
            <div>
            <h1 className="text-4xl font-black mb-2 flex items-center gap-3">
              <Mail className="w-10 h-10" />
              {parentProfile?.name || "Parent"}'s Messages
            </h1>
            <p className="text-lg text-white/90">
              Stay connected with your child's school and teachers
            </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowComposeModal(true)}
              className="px-6 py-3 bg-white/20 backdrop-blur-md text-white rounded-xl font-bold hover:bg-white/30 transition-all flex items-center gap-2 border-2 border-white/30"
            >
              <Send className="w-5 h-5" />
              Compose
            </motion.button>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Messages List */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6"
            >
              {/* Search and Filter */}
              <div className="mb-6 space-y-4">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search messages..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all outline-none"
                  />
                </div>

                {/* Filter Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setFilterStatus("all")}
                    className={`flex-1 px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                      filterStatus === "all"
                        ? "bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-md"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setFilterStatus("unread")}
                    className={`flex-1 px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                      filterStatus === "unread"
                        ? "bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-md"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    Unread
                  </button>
                  <button
                    onClick={() => setFilterStatus("read")}
                    className={`flex-1 px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                      filterStatus === "read"
                        ? "bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-md"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    Read
                  </button>
                </div>
              </div>

              {/* Message Stats */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border-2 border-purple-200">
                  <p className="text-sm text-purple-600 font-semibold mb-1">Total</p>
                  <p className="text-3xl font-black text-purple-700">
                    {messages.length}
                  </p>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 border-2 border-blue-200">
                  <p className="text-sm text-blue-600 font-semibold mb-1">Unread</p>
                  <p className="text-3xl font-black text-blue-700">
                    {messages.filter((m) => !m.read).length}
                  </p>
                </div>
              </div>

              {/* Messages List */}
              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {filteredMessages.length === 0 ? (
                  <div className="text-center py-12 text-gray-400">
                    <MessageSquare className="w-16 h-16 mx-auto mb-3" />
                    <p className="font-semibold">No messages found</p>
                  </div>
                ) : (
                  filteredMessages.map((message, idx) => (
                    <motion.div
                      key={message._id || idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      whileHover={{ scale: 1.02, x: 5 }}
                      onClick={() => handleMessageClick(message)}
                      className={`p-4 rounded-xl cursor-pointer transition-all border-2 ${
                        selectedMessage?._id === message._id
                          ? "bg-gradient-to-r from-purple-50 to-pink-50 border-purple-300 shadow-md"
                          : message.read
                          ? "bg-gray-50 border-gray-200 hover:border-purple-300"
                          : "bg-white border-purple-200 hover:border-purple-400 shadow-sm"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-3 h-3 rounded-full mt-1.5 flex-shrink-0 ${
                            message.read ? "bg-gray-300" : "bg-purple-500 animate-pulse"
                          }`}
                        />
                        <div className="flex-1 min-w-0">
                          <p
                            className={`font-bold text-sm truncate ${
                              message.read ? "text-gray-700" : "text-gray-900"
                            }`}
                          >
                            {message.subject || "No Subject"}
                          </p>
                          <p className="text-xs text-gray-600 mb-1">
                            From: {message.sender || "Unknown"}
                          </p>
                          <p className="text-xs text-gray-500 line-clamp-2">
                            {message.message}
                          </p>
                          <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
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
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-8 min-h-[700px]"
            >
              {selectedMessage ? (
                <>
                  {/* Message Header */}
                  <div className="border-b-2 border-gray-100 pb-6 mb-6">
                    <div className="flex items-start justify-between mb-4">
                      <h2 className="text-2xl font-black text-gray-900">
                        {selectedMessage.subject || "No Subject"}
                      </h2>
                      <div className="flex gap-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 bg-yellow-50 text-yellow-600 rounded-lg hover:bg-yellow-100 transition-all"
                        >
                          <Star className="w-5 h-5" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all"
                        >
                          <Trash2 className="w-5 h-5" />
                        </motion.button>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold">
                          {selectedMessage.sender?.charAt(0) || "?"}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">
                            {selectedMessage.sender || "Unknown Sender"}
                          </p>
                          <p className="text-xs text-gray-500">
                            {selectedMessage.time || "Just now"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Message Body */}
                  <div className="mb-8">
                    <p className="text-gray-700 leading-relaxed text-lg whitespace-pre-wrap">
                      {selectedMessage.message}
                    </p>
                  </div>

                  {/* Reply Section */}
                  <div className="border-t-2 border-gray-100 pt-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Send className="w-5 h-5 text-purple-600" />
                      Reply
                    </h3>
                    <textarea
                      placeholder="Type your reply here..."
                      rows={6}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all outline-none resize-none"
                    />
                    <div className="flex justify-end gap-3 mt-4">
                      <button className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all">
                        Save Draft
                      </button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center gap-2"
                      >
                        <Send className="w-4 h-4" />
                        Send Reply
                      </motion.button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center py-20">
                  <Inbox className="w-24 h-24 text-gray-300 mb-6" />
                  <h3 className="text-2xl font-bold text-gray-600 mb-2">
                    No message selected
                  </h3>
                  <p className="text-gray-500">
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-8 max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Compose Message</h3>
              <button
                onClick={() => setShowComposeModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-all"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  To:
                </label>
                <select
                  value={composeData.recipient}
                  onChange={(e) =>
                    setComposeData({ ...composeData, recipient: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 outline-none"
                >
                  <option value="school">School Administration</option>
                  <option value="teacher">Child's Teacher</option>
                  <option value="support">Support Team</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Subject:
                </label>
                <input
                  type="text"
                  placeholder="Enter subject"
                  value={composeData.subject}
                  onChange={(e) =>
                    setComposeData({ ...composeData, subject: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Message:
                </label>
                <textarea
                  placeholder="Type your message here..."
                  value={composeData.message}
                  onChange={(e) =>
                    setComposeData({ ...composeData, message: e.target.value })
                  }
                  rows={8}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all outline-none resize-none"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowComposeModal(false)}
                className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSendMessage}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
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

