import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X, Calendar, Clock, ArrowRight, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { toast } from 'react-hot-toast';

const SubscriptionExpirationBanner = ({ subscription, onDismiss, onRenew }) => {
  const navigate = useNavigate();
  const [dismissed, setDismissed] = useState(false);
  const [daysRemaining, setDaysRemaining] = useState(null);

  useEffect(() => {
    if (subscription?.endDate) {
      const now = new Date();
      const expirationDate = new Date(subscription.endDate);
      const days = Math.ceil((expirationDate - now) / (1000 * 60 * 60 * 24));
      setDaysRemaining(days);
    }
  }, [subscription]);

  const handleDismiss = () => {
    setDismissed(true);
    if (onDismiss) {
      onDismiss();
    }
  };

  const handleRenew = () => {
    if (onRenew) {
      onRenew();
    } else {
      navigate('/school/admin/payment-tracker');
    }
  };

  if (dismissed || !subscription || !subscription.endDate) {
    return null;
  }

  const now = new Date();
  const expirationDate = new Date(subscription.endDate);
  const isExpired = expirationDate <= now;
  const days = daysRemaining !== null ? daysRemaining : Math.ceil((expirationDate - now) / (1000 * 60 * 60 * 24));

  // Only show banner if subscription is expired or expiring within 60 days
  // Don't show for subscriptions that are far from expiration
  if (!isExpired && days > 60) {
    return null;
  }

  // Determine urgency level
  let urgencyLevel = 'low';
  let bgColor = 'from-blue-500 to-cyan-600';
  let borderColor = 'border-blue-200';
  let textColor = 'text-blue-900';
  let iconColor = 'text-blue-600';

  if (isExpired) {
    urgencyLevel = 'critical';
    bgColor = 'from-red-500 to-red-600';
    borderColor = 'border-red-200';
    textColor = 'text-red-900';
    iconColor = 'text-red-600';
  } else if (days <= 7) {
    urgencyLevel = 'high';
    bgColor = 'from-orange-500 to-red-500';
    borderColor = 'border-orange-200';
    textColor = 'text-orange-900';
    iconColor = 'text-orange-600';
  } else if (days <= 30) {
    urgencyLevel = 'medium';
    bgColor = 'from-amber-500 to-orange-500';
    borderColor = 'border-amber-200';
    textColor = 'text-amber-900';
    iconColor = 'text-amber-600';
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <AnimatePresence>
      {!dismissed && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={`relative overflow-hidden rounded-2xl border-2 ${borderColor} bg-gradient-to-r ${bgColor} shadow-xl mb-6`}
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
              backgroundSize: '24px 24px',
            }}></div>
          </div>

          <div className="relative p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4 flex-1">
                {/* Icon */}
                <div className={`p-3 bg-white/20 rounded-xl backdrop-blur-sm ${iconColor}`}>
                  {isExpired ? (
                    <AlertTriangle className="w-6 h-6 text-white" strokeWidth={2.5} />
                  ) : (
                    <Clock className="w-6 h-6 text-white" strokeWidth={2.5} />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className={`text-xl font-bold ${textColor}`}>
                      {isExpired 
                        ? '🚨 Subscription Expired' 
                        : days <= 7 
                          ? '⚠️ Subscription Expiring Soon'
                          : '📅 Subscription Expiring'
                      }
                    </h3>
                    {urgencyLevel === 'critical' && (
                      <span className="px-3 py-1 bg-white/30 backdrop-blur-sm rounded-full text-xs font-bold text-white">
                        URGENT
                      </span>
                    )}
                  </div>

                  <p className={`text-sm ${textColor} mb-4 leading-relaxed`}>
                    {isExpired ? (
                      <>
                        Your <strong>Educational Institutions Premium Plan</strong> expired on{' '}
                        <strong>{formatDate(expirationDate)}</strong>. Renew immediately to restore access for all teachers and students.
                      </>
                    ) : (
                      <>
                        Your <strong>Educational Institutions Premium Plan</strong> expires in{' '}
                        <strong>{days} day{days !== 1 ? 's' : ''}</strong> on{' '}
                        <strong>{formatDate(expirationDate)}</strong>. Renew now to avoid service interruption.
                      </>
                    )}
                  </p>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-3 flex-wrap">
                    <button
                      onClick={handleRenew}
                      className={`px-6 py-2.5 bg-white ${isExpired ? 'text-red-600' : 'text-blue-600'} rounded-lg font-semibold hover:bg-white/90 transition-all shadow-lg flex items-center gap-2`}
                    >
                      {isExpired ? 'Renew Now' : 'Renew Subscription'}
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <a
                      href="/school/admin/payment-tracker"
                      className={`px-4 py-2.5 bg-white/20 backdrop-blur-sm ${textColor} rounded-lg font-medium hover:bg-white/30 transition-all flex items-center gap-2`}
                    >
                      <Calendar className="w-4 h-4" />
                      View Details
                    </a>
                  </div>

                  {/* Impact Summary */}
                  {isExpired && (
                    <div className="mt-4 p-3 bg-white/20 backdrop-blur-sm rounded-lg">
                      <p className={`text-xs ${textColor} font-medium mb-1`}>Current Impact:</p>
                      <ul className={`text-xs ${textColor} space-y-1`}>
                        <li>• Teachers cannot access the platform</li>
                        <li>• Students have been downgraded to freemium</li>
                        <li>• Advanced features are disabled</li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {/* Dismiss Button */}
              <button
                onClick={handleDismiss}
                className={`p-2 ${textColor} hover:bg-white/20 rounded-lg transition-colors`}
                aria-label="Dismiss"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SubscriptionExpirationBanner;

