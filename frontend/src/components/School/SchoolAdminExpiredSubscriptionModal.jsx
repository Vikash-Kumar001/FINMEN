import React, { useEffect, useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle, X, Calendar, Clock, ArrowRight, CreditCard, Mail, Phone, RefreshCw, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSocket } from '../../context/SocketContext';
import { toast } from 'react-hot-toast';

// eslint-disable-next-line no-unused-vars
const SchoolAdminExpiredSubscriptionModal = ({ isOpen, onClose, subscription, schoolInfo, onRenew }) => {
  const navigate = useNavigate();
  const socket = useSocket()?.socket;
  const [dismissed, setDismissed] = useState(false);
  const [daysExpired, setDaysExpired] = useState(0);

  useEffect(() => {
    if (subscription?.endDate) {
      const now = new Date();
      const expirationDate = new Date(subscription.endDate);
      const days = Math.floor((now - expirationDate) / (1000 * 60 * 60 * 24));
      setDaysExpired(Math.max(0, days));
    }
  }, [subscription]);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      // Save current overflow style
      const originalOverflow = document.body.style.overflow;
      // Disable scrolling
      document.body.style.overflow = 'hidden';
      
      return () => {
        // Restore original overflow style when modal closes
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  // Listen for subscription renewal updates
  useEffect(() => {
    if (!socket || !isOpen) return;

    const handleSubscriptionUpdate = (data) => {
      if (data && data.status === 'active') {
        toast.success('Subscription renewed! Access restored.', {
          duration: 5000,
          position: 'top-center',
          icon: '✅',
        });
        if (onClose) {
          onClose();
        }
      }
    };

    socket.on('school:subscription:updated', handleSubscriptionUpdate);

    return () => {
      socket.off('school:subscription:updated', handleSubscriptionUpdate);
    };
  }, [socket, isOpen, onClose]);

  const handleDismiss = () => {
    setDismissed(true);
    if (onClose) {
      onClose();
    }
  };

  const handleRenew = () => {
    if (onRenew) {
      onRenew();
    } else {
      navigate('/school/admin/payment-tracker');
    }
  };

  const handleRefresh = async () => {
    // Refresh subscription status
    window.location.reload();
  };

  if (!isOpen || dismissed) return null;

  const expirationDate = subscription?.endDate ? new Date(subscription.endDate).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }) : 'N/A';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-3xl h-[calc(100vh-2rem)] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        >
          {/* Header with gradient */}
          <div className="relative bg-gradient-to-r from-red-600 via-red-700 to-orange-600 px-8 py-6 flex-shrink-0">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                  <AlertTriangle className="w-10 h-10 text-white" strokeWidth={2.5} />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-white">Subscription Expired</h2>
                  <p className="text-red-100 text-sm mt-1">Immediate Action Required</p>
                </div>
              </div>
              <button
                onClick={handleDismiss}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                aria-label="Close"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </div>
          </div>

          {/* Content - Scrollable */}
          <div className="px-8 py-8 flex-1 overflow-y-auto">
            {/* Critical Alert */}
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6 mb-6">
              <div className="flex items-start gap-4">
                <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-red-900 mb-2">
                    Your School's Subscription Has Expired
                  </h3>
                  <p className="text-red-800 text-sm leading-relaxed">
                    Your subscription expired on <span className="font-semibold">{expirationDate}</span>
                    {daysExpired > 0 && (
                      <span> ({daysExpired} {daysExpired === 1 ? 'day' : 'days'} ago)</span>
                    )}. 
                    All premium features are currently unavailable, and your students and teachers have been downgraded to freemium access.
                  </p>
                </div>
              </div>
            </div>

            {/* Impact Section */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-6">
              <h4 className="font-semibold text-amber-900 mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Current Impact:
              </h4>
              <ul className="space-y-3 text-amber-800 text-sm">
                <li className="flex items-start gap-3">
                  <span className="text-amber-600 mt-1">•</span>
                  <span><strong>All students</strong> linked to your school have been automatically downgraded to the freemium plan (limited to 5 games per pillar)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-amber-600 mt-1">•</span>
                  <span><strong>All teachers</strong> cannot access the platform until the subscription is renewed</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-amber-600 mt-1">•</span>
                  <span><strong>Premium features</strong> including advanced analytics, unlimited games, and full platform access are disabled</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-amber-600 mt-1">•</span>
                  <span><strong>Access will be automatically restored</strong> for all users once you renew the subscription</span>
                </li>
              </ul>
            </div>

            {/* Subscription Details */}
            {subscription && (
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-6">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-gray-600" />
                  Subscription Details:
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600 mb-1">Expired On:</p>
                    <p className="font-semibold text-gray-900">{expirationDate}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 mb-1">Days Expired:</p>
                    <p className="font-semibold text-red-600">{daysExpired} {daysExpired === 1 ? 'day' : 'days'}</p>
                  </div>
                  {subscription.planName && (
                    <div>
                      <p className="text-gray-600 mb-1">Previous Plan:</p>
                      <p className="font-semibold text-gray-900">{subscription.planName}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Next Steps */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
              <h4 className="font-semibold text-blue-900 mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                What You Need to Do:
              </h4>
              <ol className="space-y-3 text-blue-800 text-sm list-decimal list-inside">
                <li>Click the "Renew Subscription" button below to go to the payment tracker</li>
                <li>Review your subscription details and select your preferred plan</li>
                <li>Submit a renewal request (requires admin approval)</li>
                <li>Once approved, your subscription will be activated and all access will be restored automatically</li>
              </ol>
            </div>

            {/* Support Information */}
            <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-6">
              <h4 className="font-semibold text-indigo-900 mb-4 flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Need Help?
              </h4>
              <p className="text-indigo-800 text-sm mb-3">
                If you have questions or need assistance with renewal, please contact our support team:
              </p>
              <div className="space-y-2">
                <a
                  href="mailto:support@wisestudent.org?subject=Subscription Renewal Assistance"
                  className="flex items-center gap-3 p-3 bg-white rounded-lg hover:bg-indigo-100 transition-colors group"
                >
                  <div className="p-2 bg-indigo-100 rounded-lg group-hover:bg-indigo-200 transition-colors">
                    <Mail className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 text-sm">Email Support</p>
                    <p className="text-xs text-gray-600">support@wisestudent.org</p>
                  </div>
                </a>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="px-8 py-6 bg-gray-50 border-t border-gray-200 flex items-center justify-between gap-4 flex-shrink-0">
            <button
              onClick={handleRefresh}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh Status
            </button>
            <div className="flex items-center gap-3">
              <button
                onClick={handleDismiss}
                className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors"
              >
                Dismiss
              </button>
              <button
                onClick={handleRenew}
                className="flex items-center gap-2 px-6 py-3 text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-lg shadow-lg hover:shadow-xl transition-all"
              >
                <CreditCard className="w-5 h-5" />
                Renew Subscription
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default SchoolAdminExpiredSubscriptionModal;

