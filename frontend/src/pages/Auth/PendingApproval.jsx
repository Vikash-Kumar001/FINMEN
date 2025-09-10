import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Clock, Mail, ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";

const PendingApproval = () => {
    const location = useLocation();
    const navigate = useNavigate();
    
    const { message, user } = location.state || {};
    const defaultMessage = "Your account is currently under review. You will be notified once approved.";
    
    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center"
            >
                {/* Icon */}
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="w-20 h-20 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                    <Clock className="w-10 h-10 text-white" />
                </motion.div>

                {/* Title */}
                <motion.h1
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-2xl font-bold text-gray-900 mb-4"
                >
                    Account Under Review
                </motion.h1>

                {/* Message */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-gray-600 mb-6 leading-relaxed"
                >
                    {message || defaultMessage}
                </motion.p>

                {/* User Email */}
                {user?.email && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="bg-gray-50 rounded-lg p-4 mb-6"
                    >
                        <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                            <Mail className="w-4 h-4" />
                            <span>{user.email}</span>
                        </div>
                    </motion.div>
                )}

                {/* Status Steps */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="space-y-3 mb-8"
                >
                    <div className="flex items-center gap-3 text-sm">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span className="text-gray-700">Application submitted</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                        <div className="w-5 h-5 rounded-full border-2 border-amber-400 flex items-center justify-center">
                            <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
                        </div>
                        <span className="text-gray-700">Under admin review</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                        <div className="w-5 h-5 rounded-full border-2 border-gray-300"></div>
                        <span className="text-gray-400">Account activation</span>
                    </div>
                </motion.div>

                {/* Info Box */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6"
                >
                    <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                        <div className="text-sm text-blue-700">
                            <p className="font-medium mb-1">What happens next?</p>
                            <p>Our admin team will review your application within 24-48 hours. You'll receive an email notification once your account is approved.</p>
                        </div>
                    </div>
                </motion.div>

                {/* Actions */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="space-y-3"
                >
                    <button
                        onClick={() => navigate("/login")}
                        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Login
                    </button>
                    
                    <p className="text-xs text-gray-500">
                        Need help? Contact support at{" "}
                        <a href="mailto:support@finmen.com" className="text-indigo-600 hover:underline">
                            support@finmen.com
                        </a>
                    </p>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default PendingApproval;