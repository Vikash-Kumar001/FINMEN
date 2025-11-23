import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const IndividualAccountSelection = () => {
    const navigate = useNavigate();
    const [selected, setSelected] = React.useState(null);
    const handleContinue = () => {
        if (selected === "student") {
            navigate("/register");
        } else if (selected === "parent") {
            navigate("/register-parent");
        }
    };
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-r from-blue-200 to-purple-200 rounded-full opacity-20 blur-3xl animate-pulse" />
            <div className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-r from-pink-200 to-rose-200 rounded-full opacity-15 blur-3xl animate-pulse delay-1000" />
            <div className="max-w-4xl mx-auto px-4 py-8 relative z-10">
                <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded flex items-center justify-center">
              <span className="text-white font-bold">FM</span>
            </div>
            <h1 className="ml-3 text-2xl font-semibold text-gray-800">Wise Student</h1>
          </div>
                    <button
                        className="text-gray-600 hover:text-gray-800 z-50"
                        onClick={() => navigate(-1)}
                    >
                        Back
                    </button>
                </div>
                <h2 className="text-4xl font-bold text-gray-900 text-center mb-2">Choose Your Account Type</h2>
                <p className="text-center text-gray-600 mb-6">Select whether you're registering as a Parent or Student to get started with the appropriate experience.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {/* Student Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        whileHover={{ scale: 1.02, boxShadow: "0 10px 20px rgba(0, 0, 0, 0.1)" }}
                        className={`bg-white rounded-xl p-4 shadow-lg hover:shadow-xl transition-all text-center cursor-pointer border-2 ${selected === "student" ? "border-purple-500" : "border-transparent"}`}
                        onClick={() => setSelected("student")}
                    >
                        <div className="w-full h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-t-xl mb-2" />
                        <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-10 h-10 text-white">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0v6m-4 0h8" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-1">Student</h3>
                        <p className="text-gray-600 mb-2">Access mental wellness, learning tools, gamified challenges, and personal progress tracking.</p>
                        <div className="text-left">
                            <span className="font-medium text-gray-800">Key Features:</span>
                            <ul className="mt-1 space-y-1 text-gray-700">
                                <li>✔ Classes & Learning Tools</li>
                                <li>✔ Personal Progress Tracking</li>
                                <li>✔ Mental Wellness Support</li>
                                <li>✔ Gamified Challenges</li>
                                <li>✔ Secure Account</li>
                            </ul>
                        </div>
                    </motion.div>
                    {/* Parent Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        whileHover={{ scale: 1.02, boxShadow: "0 10px 20px rgba(0, 0, 0, 0.1)" }}
                        className={`bg-white rounded-xl p-4 shadow-lg hover:shadow-xl transition-all text-center cursor-pointer border-2 ${selected === "parent" ? "border-green-500" : "border-transparent"}`}
                        onClick={() => setSelected("parent")}
                    >
                        <div className="w-full h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-t-xl mb-2" />
                        <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-10 h-10 text-white">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20h6M3 20h5v-2a4 4 0 013-3.87M6 8a6 6 0 1112 0A6 6 0 016 8zm6 6v6" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-1">Parent</h3>
                        <p className="text-gray-600 mb-2">Monitor your child's progress, support their wellness, and stay engaged with their learning journey.</p>
                        <div className="text-left">
                            <span className="font-medium text-gray-800">Key Features:</span>
                            <ul className="mt-1 space-y-1 text-gray-700">
                                <li>✔ Child Progress Monitoring</li>
                                <li>✔ Wellness & Activity Reports</li>
                                <li>✔ Parental Engagement Tools</li>
                                <li>✔ Secure Account</li>
                            </ul>
                        </div>
                    </motion.div>
                </div>
                <div className="text-center">
                    <button
                        className={`py-2 px-6 rounded-lg font-semibold transition-all ${selected ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-pink-500 hover:to-purple-500" : "bg-gray-200 text-gray-800 cursor-not-allowed"}`}
                        onClick={handleContinue}
                        disabled={!selected}
                    >
                        Continue to Registration →
                    </button>
                </div>
                <p className="text-center text-gray-600 mt-4">
                    Need help choosing? Contact our support team for guidance on selecting the right platform for your needs.
                </p>
            </div>
        </div>
    );
};

export default IndividualAccountSelection;