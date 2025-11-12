import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { Users, GraduationCap, AlertTriangle, X, ArrowRightCircle } from 'lucide-react';

const roleConfig = {
  student: {
    title: 'Student Limit Reached',
    icon: Users,
    accent: 'from-amber-500 to-orange-500',
    mailSubject: 'Request to increase student limit'
  },
  teacher: {
    title: 'Teacher Limit Reached',
    icon: GraduationCap,
    accent: 'from-amber-600 to-orange-500',
    mailSubject: 'Request to increase teacher limit'
  }
};

const LimitReachedModal = ({
  open,
  onClose,
  onRequest,
  message,
  type = 'student',
  supportEmail = 'support@finmen.com'
}) => {
  const config = roleConfig[type] || roleConfig.student;
  const Icon = config.icon;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose?.();
    }
  };

  const handleRequestClick = () => {
    toast.success('Request functionality is coming soon!');
    if (onRequest) {
      onRequest();
    } else {
      onClose?.();
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-[100]"
          />
          <motion.div
            className="fixed inset-0 z-[105] flex items-center justify-center px-4 py-6"
            onMouseDown={handleBackdropClick}
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.2 }}
          >
            <div
              onMouseDown={(e) => e.stopPropagation()}
              className="relative w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-amber-100"
            >
              <div className={`relative bg-gradient-to-r ${config.accent} px-8 py-10 text-white`}>
                <div className="absolute right-4 top-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="rounded-full p-2 text-white/80 transition hover:bg-white/15 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                    aria-label="Close limit reached dialog"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 backdrop-blur">
                    <Icon className="h-8 w-8" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-wide text-white/80">Limit notice</p>
                    <h2 className="text-3xl font-black">{config.title}</h2>
                  </div>
                </div>
              </div>

              <div className="space-y-6 px-6 pb-8 pt-8 md:px-8">
                <div className="rounded-2xl border border-amber-200 bg-amber-50/80 p-5 md:p-6">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 rounded-xl bg-white p-2 shadow-sm ring-1 ring-amber-200">
                      <AlertTriangle className="h-5 w-5 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-base font-semibold text-amber-900">
                        {message || 'You have reached the onboarding limit provided in your approved registration details.'}
                      </p>
                      <p className="mt-3 text-sm text-amber-800/80">
                        You can close this dialog and adjust your roster, or send us a request to expand your limit.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={onClose}
                    className="w-full rounded-xl border border-amber-200 px-6 py-3 text-sm font-semibold text-amber-700 transition hover:bg-amber-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/70 sm:w-auto"
                  >
                    Ok
                  </button>
                  <button
                    type="button"
                    onClick={handleRequestClick}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-amber-400/30 transition hover:from-amber-600 hover:to-orange-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/70 sm:w-auto"
                  >
                    <ArrowRightCircle className="h-4 w-4" />
                    Request
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default React.memo(LimitReachedModal);


