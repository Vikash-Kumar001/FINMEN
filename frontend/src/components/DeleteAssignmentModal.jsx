import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle, User, Users } from 'lucide-react';

const DeleteAssignmentModal = ({ isOpen, onClose, onDeleteForMe, onDeleteForEveryone, assignment }) => {
  if (!isOpen || !assignment) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-red-500 to-rose-600 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <AlertTriangle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Delete Assignment</h2>
                  <p className="text-red-100 text-sm">Choose how to delete this assignment</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-lg transition-all"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                "{assignment.title}"
              </h3>
              <p className="text-gray-600 text-sm">
                Subject: {assignment.subject} • Due: {new Date(assignment.dueDate).toLocaleDateString()}
              </p>
            </div>

            <div className="space-y-4">
              {/* Delete for Me Option */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onDeleteForMe}
                className="w-full p-4 border-2 border-orange-200 rounded-xl hover:border-orange-300 hover:bg-orange-50 transition-all text-left group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 rounded-lg group-hover:bg-orange-200 transition-colors">
                    <User className="w-5 h-5 text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">Delete for Me Only</h4>
                    <p className="text-sm text-gray-600">
                      Remove this assignment from your view. Students can still see and access it.
                    </p>
                  </div>
                </div>
              </motion.button>

              {/* Delete for Everyone Option */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onDeleteForEveryone}
                className="w-full p-4 border-2 border-red-200 rounded-xl hover:border-red-300 hover:bg-red-50 transition-all text-left group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 rounded-lg group-hover:bg-red-200 transition-colors">
                    <Users className="w-5 h-5 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">Delete for Everyone</h4>
                    <p className="text-sm text-gray-600">
                      Permanently delete this assignment. No one can access it anymore.
                    </p>
                  </div>
                </div>
              </motion.button>
            </div>

            {/* Warning */}
            <div className="mt-6 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-yellow-800">
                  <strong>Warning:</strong> "Delete for Everyone" cannot be undone. Students will lose access to this assignment and any progress they've made.
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <div className="flex justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default DeleteAssignmentModal;
