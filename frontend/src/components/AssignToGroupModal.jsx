import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Users, Plus, Check } from "lucide-react";
import api from "../utils/api";
import { toast } from "react-hot-toast";

const AssignToGroupModal = ({ isOpen, onClose, student, onSuccess }) => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedGroups, setSelectedGroups] = useState([]);
  const [newGroupName, setNewGroupName] = useState("");
  const [showNewGroup, setShowNewGroup] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchGroups();
      if (student?.groups) {
        setSelectedGroups(student.groups);
      }
    }
  }, [isOpen, student]);

  const fetchGroups = async () => {
    try {
      const response = await api.get("/api/school/teacher/groups");
      setGroups(response.data.groups || []);
    } catch (error) {
      console.error("Error fetching groups:", error);
    }
  };

  const handleCreateGroup = async () => {
    if (!newGroupName.trim()) {
      toast.error("Please enter a group name");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("/api/school/teacher/groups", {
        name: newGroupName,
        description: `Student group: ${newGroupName}`
      });
      
      const newGroup = response.data.group;
      setGroups([...groups, newGroup]);
      setNewGroupName("");
      setShowNewGroup(false);
      toast.success("Group created successfully!");
    } catch (error) {
      console.error("Error creating group:", error);
      toast.error("Failed to create group");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleGroup = (groupId) => {
    setSelectedGroups(prev =>
      prev.includes(groupId)
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]
    );
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await api.put(`/api/school/teacher/student/${student._id}/groups`, {
        groups: selectedGroups
      });
      toast.success("Student groups updated!");
      onSuccess?.();
      handleClose();
    } catch (error) {
      console.error("Error updating student groups:", error);
      toast.error("Failed to update groups");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedGroups([]);
    setNewGroupName("");
    setShowNewGroup(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-amber-500 to-orange-600 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Assign to Group</h2>
                  <p className="text-amber-100 text-sm">{student?.name}</p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-white/20 rounded-lg transition-all"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 max-h-[60vh] overflow-y-auto">
            {/* New Group Button */}
            <div className="mb-4">
              {showNewGroup ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newGroupName}
                    onChange={(e) => setNewGroupName(e.target.value)}
                    placeholder="Enter group name..."
                    className="flex-1 px-4 py-2 border-2 border-amber-300 rounded-lg focus:border-amber-500 focus:outline-none"
                    onKeyPress={(e) => e.key === "Enter" && handleCreateGroup()}
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCreateGroup}
                    disabled={loading}
                    className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50"
                  >
                    <Check className="w-5 h-5" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setShowNewGroup(false);
                      setNewGroupName("");
                    }}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-all"
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                </div>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowNewGroup(true)}
                  className="w-full px-4 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Create New Group
                </motion.button>
              )}
            </div>

            {/* Groups List */}
            <div className="space-y-2">
              <p className="text-sm font-semibold text-gray-600 mb-2">Select Groups:</p>
              {groups.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500">No groups yet. Create one!</p>
                </div>
              ) : (
                groups.map((group) => (
                  <motion.button
                    key={group._id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleToggleGroup(group._id)}
                    className={`w-full px-4 py-3 rounded-xl border-2 font-semibold transition-all flex items-center justify-between ${
                      selectedGroups.includes(group._id)
                        ? "bg-gradient-to-r from-amber-500 to-orange-600 text-white border-amber-500"
                        : "bg-white text-gray-700 border-gray-200 hover:border-amber-300"
                    }`}
                  >
                    <span>{group.name}</span>
                    {selectedGroups.includes(group._id) && (
                      <Check className="w-5 h-5" />
                    )}
                  </motion.button>
                ))
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 border-t-2 border-gray-100 flex gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleClose}
              className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-all"
            >
              Cancel
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSave}
              disabled={loading}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Saving..." : "Save Changes"}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AssignToGroupModal;

