import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Shield, Key } from 'lucide-react';

const ResetPasswordModal = ({
  showResetPasswordModal,
  setShowResetPasswordModal,
  resetPasswordData,
  setResetPasswordData,
  handleResetPassword
}) => {
  return (
    <AnimatePresence>
      {showResetPasswordModal && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowResetPasswordModal(false)}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full pointer-events-auto"
            >
              <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white p-6 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-black mb-1">Reset Password</h2>
                    <p className="text-sm text-white/80">
                      {resetPasswordData.studentName}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowResetPasswordModal(false)}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <form onSubmit={handleResetPassword} className="p-6 space-y-4">
                <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 mb-4">
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-700 font-semibold">
                        Set a new password for this student. They can login immediately with the new password.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    New Password *
                  </label>
                  <input
                    type="password"
                    value={resetPasswordData.newPassword}
                    onChange={(e) => setResetPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none font-semibold"
                    placeholder="Enter new password"
                    required
                    minLength="6"
                    autoComplete="new-password"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Minimum 6 characters
                  </p>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowResetPasswordModal(false)}
                    className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-bold hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-lg font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <Key className="w-5 h-5" />
                    Reset Password
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default React.memo(ResetPasswordModal);
