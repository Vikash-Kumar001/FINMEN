import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Mail, Phone, Building2, X, RefreshCw } from 'lucide-react';
import { useSocket } from '../../context/SocketContext';

const ExpiredSubscriptionModal = ({ isOpen, onClose, schoolName, schoolContact, onRefresh }) => {
  const socket = useSocket()?.socket;

  // Listen for subscription renewal updates
  React.useEffect(() => {
    if (!socket || !isOpen) return;

    const handleAccessUpdate = (data) => {
      if (data && data.hasAccess === true) {
        // Subscription renewed, refresh access
        if (onRefresh) {
          onRefresh();
        }
      }
    };

    socket.on('teacher:access:updated', handleAccessUpdate);

    return () => {
      socket.off('teacher:access:updated', handleAccessUpdate);
    };
  }, [socket, isOpen, onRefresh]);

  if (!isOpen) return null;

  const contactEmail = schoolContact?.email || 'your school administrator';
  const contactPhone = schoolContact?.phone || null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-2xl h-[calc(100vh-2rem)] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        >
          {/* Header with gradient */}
          <div className="relative bg-gradient-to-r from-red-500 via-red-600 to-orange-600 px-8 py-6">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                  <AlertTriangle className="w-8 h-8 text-white" strokeWidth={2.5} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Subscription Expired</h2>
                  <p className="text-red-100 text-sm mt-1">Access Temporarily Restricted</p>
                </div>
              </div>
              {onClose && (
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  aria-label="Close"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="px-8 py-8 flex-1 overflow-y-auto">
            {/* Main Message */}
            <div className="mb-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="p-3 bg-red-50 rounded-xl">
                  <Building2 className="w-6 h-6 text-red-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {schoolName ? `${schoolName}'s subscription has expired` : 'Your school\'s subscription has expired'}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    We're unable to provide access to the platform at this time. Your school administrator needs to renew the subscription to restore full access for all teachers and students.
                  </p>
                </div>
              </div>

              {/* What this means */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-6">
                <h4 className="font-semibold text-amber-900 mb-2 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  What this means:
                </h4>
                <ul className="space-y-2 text-amber-800 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 mt-1">•</span>
                    <span>You cannot access any features or data on the platform</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 mt-1">•</span>
                    <span>All dashboard features are temporarily unavailable</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 mt-1">•</span>
                    <span>Access will be automatically restored once the subscription is renewed</span>
                  </li>
                </ul>
              </div>

              {/* Contact Information */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
                <h4 className="font-semibold text-blue-900 mb-4 flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  Next Steps - Contact Your School
                </h4>
                <div className="space-y-3">
                  <p className="text-blue-800 text-sm">
                    Please reach out to your school administrator to renew the subscription:
                  </p>
                  <div className="space-y-2">
                    {contactEmail && (
                      <a
                        href={`mailto:${contactEmail}?subject=Subscription Renewal Required&body=Hello,%0D%0A%0D%0AOur school's subscription has expired. Please renew it to restore access to the platform.%0D%0A%0D%0AThank you.`}
                        className="flex items-center gap-3 p-3 bg-white rounded-lg hover:bg-blue-100 transition-colors group"
                      >
                        <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                          <Mail className="w-4 h-4 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 text-sm">Email Administrator</p>
                          <p className="text-xs text-gray-600">{contactEmail}</p>
                        </div>
                      </a>
                    )}
                    {contactPhone && (
                      <a
                        href={`tel:${contactPhone}`}
                        className="flex items-center gap-3 p-3 bg-white rounded-lg hover:bg-blue-100 transition-colors group"
                      >
                        <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                          <Phone className="w-4 h-4 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 text-sm">Call Administrator</p>
                          <p className="text-xs text-gray-600">{contactPhone}</p>
                        </div>
                      </a>
                    )}
                    {!contactEmail && !contactPhone && (
                      <p className="text-blue-800 text-sm italic">
                        Please contact your school administrator directly for subscription renewal.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between gap-4 pt-6 border-t border-gray-200">
              <button
                onClick={onRefresh}
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Check Again
              </button>
              <div className="text-xs text-gray-500">
                Access will be restored automatically once renewed
              </div>
            </div>
          </div>

          {/* Footer note */}
          <div className="px-8 py-4 bg-gray-50 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              This is an automated notification. Your access status is checked in real-time.
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ExpiredSubscriptionModal;

