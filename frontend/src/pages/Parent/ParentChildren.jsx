import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Search,
  Plus,
  Eye,
  Trash2,
  Filter,
  Grid,
  List,
  TrendingUp,
  Zap,
  Coins,
  Heart,
  Brain,
  Star,
  Activity,
  BookOpen,
  Trophy,
  AlertTriangle,
  X,
} from "lucide-react";
import api from "../../utils/api";
import { toast } from "react-hot-toast";

const ParentChildren = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [children, setChildren] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [parentProfile, setParentProfile] = useState(null);
  const [showAddChildModal, setShowAddChildModal] = useState(false);
  const [childEmail, setChildEmail] = useState("");
  const [addingChild, setAddingChild] = useState(false);

  useEffect(() => {
    fetchChildren();
  }, []);

  const fetchChildren = async () => {
    try {
      setLoading(true);
      const [childrenRes, profileRes] = await Promise.all([
        api.get("/api/parent/children"),
        api.get("/api/user/profile").catch(() => ({ data: null }))
      ]);
      setChildren(childrenRes.data.children || []);
      setParentProfile(profileRes.data);
    } catch (error) {
      console.error("Error fetching children:", error);
      toast.error("Failed to load children");
    } finally {
      setLoading(false);
    }
  };

  const handleAddChild = async () => {
    if (!childEmail.trim()) {
      toast.error("Please enter child's email");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(childEmail)) {
      toast.error("Please enter a valid email address");
      return;
    }

    try {
      setAddingChild(true);
      const response = await api.post("/api/parent/link-child", {
        childEmail: childEmail.trim(),
      });
      toast.success(response.data.message || "Child linked successfully!");
      setShowAddChildModal(false);
      setChildEmail("");
      fetchChildren();
    } catch (error) {
      console.error("Error linking child:", error);
      toast.error(error.response?.data?.message || "Failed to link child");
    } finally {
      setAddingChild(false);
    }
  };

  const handleRemoveChild = async (childId, childName) => {
    if (!window.confirm(`Are you sure you want to unlink ${childName}?`)) {
      return;
    }

    try {
      await api.delete(`/api/parent/child/${childId}/unlink`);
      toast.success("Child unlinked successfully");
      fetchChildren();
    } catch (error) {
      console.error("Error unlinking child:", error);
      toast.error("Failed to unlink child");
    }
  };

  const filteredChildren = children.filter((child) =>
    child.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          >
            <h1 className="text-4xl font-black mb-2 flex items-center gap-3">
              <Users className="w-10 h-10" />
              {parentProfile?.name || "Parent"}'s Children
            </h1>
            <p className="text-lg text-white/90">
              Manage and monitor all your children's accounts
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-4">
        {/* Search and Actions Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6 mb-6"
        >
          <div className="flex flex-wrap items-center gap-4">
            {/* Search */}
            <div className="flex-1 min-w-[250px] relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search children by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all outline-none"
              />
            </div>

            {/* View Mode Toggle */}
            <div className="flex gap-2 bg-gray-100 rounded-xl p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  viewMode === "grid"
                    ? "bg-white text-purple-600 shadow"
                    : "text-gray-600 hover:bg-gray-200"
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  viewMode === "list"
                    ? "bg-white text-purple-600 shadow"
                    : "text-gray-600 hover:bg-gray-200"
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            {/* Add Child Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAddChildModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Link Child
            </motion.button>
          </div>
        </motion.div>

        {/* Children Display */}
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredChildren.map((child, idx) => (
              <motion.div
                key={child._id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-100 hover:border-purple-300 hover:shadow-xl transition-all"
              >
                <div className="flex items-center gap-4 mb-6">
                  <img
                    src={child.avatar || "/avatars/avatar1.png"}
                    alt={child.name}
                    className="w-20 h-20 rounded-full border-4 border-purple-300 shadow-lg"
                  />
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900">
                      {child.name}
                    </h3>
                    <p className="text-sm text-gray-600">{child.grade || "Student"}</p>
                    <p className="text-xs text-gray-500">{child.email}</p>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-blue-50 rounded-lg p-3 text-center">
                    <Zap className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                    <p className="text-xl font-black text-blue-700">
                      {child.level || 1}
                    </p>
                    <p className="text-xs text-blue-600">Level</p>
                  </div>
                  <div className="bg-amber-50 rounded-lg p-3 text-center">
                    <Star className="w-5 h-5 text-amber-600 mx-auto mb-1" />
                    <p className="text-xl font-black text-amber-700">
                      {child.xp || 0}
                    </p>
                    <p className="text-xs text-amber-600">XP</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-3 text-center">
                    <Coins className="w-5 h-5 text-green-600 mx-auto mb-1" />
                    <p className="text-xl font-black text-green-700">
                      {child.healCoins || 0}
                    </p>
                    <p className="text-xs text-green-600">Coins</p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-3 text-center">
                    <Trophy className="w-5 h-5 text-purple-600 mx-auto mb-1" />
                    <p className="text-xl font-black text-purple-700">
                      {child.streak || 0}
                    </p>
                    <p className="text-xs text-purple-600">Streak</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate(`/parent/child/${child._id}/analytics`)}
                    className="flex-1 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    View Progress
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleRemoveChild(child._id, child.name)}
                    className="px-4 py-2.5 bg-red-50 text-red-600 rounded-lg font-semibold hover:bg-red-100 transition-all border-2 border-red-200"
                  >
                    <Trash2 className="w-4 h-4" />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg border-2 border-gray-100 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-purple-500 to-pink-600 text-white">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold">Child</th>
                  <th className="px-6 py-4 text-center font-semibold">Level</th>
                  <th className="px-6 py-4 text-center font-semibold">XP</th>
                  <th className="px-6 py-4 text-center font-semibold">Coins</th>
                  <th className="px-6 py-4 text-center font-semibold">Streak</th>
                  <th className="px-6 py-4 text-center font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredChildren.map((child, idx) => (
                  <motion.tr
                    key={child._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="border-b border-gray-100 hover:bg-purple-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={child.avatar || "/avatars/avatar1.png"}
                          alt={child.name}
                          className="w-12 h-12 rounded-full border-2 border-purple-300"
                        />
                        <div>
                          <p className="font-semibold text-gray-900">{child.name}</p>
                          <p className="text-xs text-gray-500">{child.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="font-bold text-blue-600">
                        {child.level || 1}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="font-bold text-amber-600">
                        {child.xp || 0}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="font-bold text-green-600">
                        {child.healCoins || 0}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="font-bold text-purple-600">
                        {child.streak || 0}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => navigate(`/parent/child/${child._id}/analytics`)}
                          className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all flex items-center gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleRemoveChild(child._id, child.name)}
                          className="px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all border-2 border-red-200"
                        >
                          <Trash2 className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {filteredChildren.length === 0 && (
          <div className="bg-white rounded-xl shadow-lg border-2 border-gray-100 p-12 text-center">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-xl font-bold text-gray-600">No children found</p>
            <p className="text-gray-500 mt-2">
              {searchTerm
                ? "Try adjusting your search"
                : "Link your first child to get started"}
            </p>
          </div>
        )}
      </div>

      {/* Add Child Modal */}
      {showAddChildModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Link Child Account</h3>
              <button
                onClick={() => setShowAddChildModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-all"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            <p className="text-gray-600 mb-4">
              Enter your child's registered email address to link their account
            </p>
            <input
              type="email"
              placeholder="child@example.com"
              value={childEmail}
              onChange={(e) => setChildEmail(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleAddChild()}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none mb-6"
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowAddChildModal(false)}
                className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleAddChild}
                disabled={addingChild}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {addingChild ? "Linking..." : "Link Child"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ParentChildren;
