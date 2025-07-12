// Create a PendingApproval component for educators
import React from "react";
import { motion } from "framer-motion";
import { Clock, Shield, Mail, Phone } from "lucide-react";

const PendingApproval = ({ user }) => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
            {/* Animated background */}
            <motion.div
                className="absolute inset-0 overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
            >
                <motion.div
                    className="absolute -top-20 -left-20 w-96 h-96 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl"
                    animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                />
                <motion.div
                    className="absolute -bottom-20 -right-20 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl"
                    animate={{ scale: [1.2, 1, 1.2], rotate: [360, 180, 0] }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                />
            </motion.div>

            <div className="relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
                <motion.div
                    className="w-full max-w-2xl"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 sm:p-10 shadow-2xl">
                        <div className="text-center mb-8">
                            <motion.div
                                className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full mb-6"
                                animate={{
                                    scale: [1, 1.05, 1],
                                    rotateY: [0, 180, 360],
                                }}
                                transition={{
                                    duration: 3,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                }}
                            >
                                <Clock className="w-10 h-10 text-white" />
                            </motion.div>

                            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
                                🚧 Pending Approval
                            </h1>

                            <p className="text-gray-300 text-lg leading-relaxed max-w-lg mx-auto">
                                Your educator account is currently under review. You will be
                                notified once approved.
                            </p>
                        </div>

                        {/* User Info Card */}
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
                            <div className="flex items-center mb-4">
                                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mr-4">
                                    <Shield className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-white">
                                        {user?.name}
                                    </h3>
                                    <p className="text-gray-400 text-sm">{user?.email}</p>
                                </div>
                            </div>

                            {user?.position && (
                                <div className="mb-2">
                                    <span className="text-gray-400 text-sm">Position: </span>
                                    <span className="text-white">{user.position}</span>
                                </div>
                            )}

                            {user?.subjects && (
                                <div className="mb-2">
                                    <span className="text-gray-400 text-sm">Subjects: </span>
                                    <span className="text-white">{user.subjects}</span>
                                </div>
                            )}

                            <div className="flex items-center mt-4">
                                <div className="w-3 h-3 bg-orange-500 rounded-full mr-3 animate-pulse"></div>
                                <span className="text-orange-400 font-medium">
                                    Status: Pending Review
                                </span>
                            </div>
                        </div>

                        {/* What's Next Section */}
                        <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-2xl p-6 mb-8">
                            <h3 className="text-xl font-semibold text-white mb-4">
                                What's Next?
                            </h3>
                            <ul className="space-y-3 text-gray-300">
                                <li className="flex items-start">
                                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                                        <span className="text-white text-sm font-bold">1</span>
                                    </div>
                                    <span>
                                        Admin team will review your application and credentials
                                    </span>
                                </li>
                                <li className="flex items-start">
                                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                                        <span className="text-white text-sm font-bold">2</span>
                                    </div>
                                    <span>
                                        You'll receive an email notification once approved
                                    </span>
                                </li>
                                <li className="flex items-start">
                                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                                        <span className="text-white text-sm font-bold">3</span>
                                    </div>
                                    <span>Access will be granted to your educator dashboard</span>
                                </li>
                            </ul>
                        </div>

                        {/* Contact Section */}
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
                            <h3 className="text-lg font-semibold text-white mb-3">
                                Need Help?
                            </h3>
                            <p className="text-gray-300 text-sm mb-4">
                                If you have questions about your application status, please
                                contact our support team.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <motion.button
                                    className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium rounded-xl transition-all duration-300"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Mail className="w-4 h-4 mr-2" />
                                    Contact Support
                                </motion.button>
                                <motion.button
                                    className="inline-flex items-center justify-center px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-medium rounded-xl transition-all duration-300 border border-white/20"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Phone className="w-4 h-4 mr-2" />
                                    Call Us
                                </motion.button>
                            </div>
                        </div>

                        {/* Logout Button */}
                        <div className="text-center mt-8">
                            <motion.button
                                className="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
                                whileHover={{ scale: 1.05 }}
                                onClick={() => {
                                    // Add logout logic here
                                    localStorage.removeItem("finmen_token");
                                    window.location.href = "/login";
                                }}
                            >
                                Sign Out
                            </motion.button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default PendingApproval;
