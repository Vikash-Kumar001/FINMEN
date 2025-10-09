import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { X, Menu } from "lucide-react";

const MainNavbar = ({
    handlePillarsClick,
    handleWhyChooseClick,
    handlePricingClick,
    handleStudentServicesClick,
    handleFooterClick,
    showMobileMenu,
    setShowMobileMenu
}) => {
    const navigate = useNavigate();

    return (
        <nav className="bg-white shadow-md py-4 relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center">
                    <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded flex items-center justify-center">
                            <span className="text-white font-bold">WS</span>
                        </div>
                        <h1 className="ml-3 text-xl font-semibold text-gray-900">
                            Wise Student
                        </h1>
                    </div>

                    {/* Desktop Navigation - hidden on mobile */}
                    <div className="hidden md:flex items-center space-x-4">
                        <button
                            onClick={handlePillarsClick}
                            className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                        >
                            Pillars
                        </button>

                        <button
                            onClick={handleWhyChooseClick}
                            className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                        >
                            Why Choose Us
                        </button>

                        <button
                            onClick={handlePricingClick}
                            className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                        >
                            Pricing
                        </button>

                        <button
                            onClick={handleStudentServicesClick}
                            className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                        >
                            Services
                        </button>

                        <button
                            onClick={handleFooterClick}
                            className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                        >
                            Contact
                        </button>

                        <button
                            onClick={() => navigate("/login")}
                            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition-all text-sm font-medium"
                        >
                            Sign In
                        </button>
                    </div>

                    {/* Mobile menu button - visible only on mobile */}
                    <button
                        className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
                        onClick={() => setShowMobileMenu(!showMobileMenu)}
                    >
                        {showMobileMenu ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>

                {/* Mobile Menu Overlay - visible only on mobile */}
                <AnimatePresence>
                    {showMobileMenu && (
                        <motion.div
                            className="md:hidden fixed inset-0 z-50"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            {/* Dark overlay background */}
                            <motion.div
                                className="fixed inset-0 bg-black/30 backdrop-blur-sm"
                                onClick={() => setShowMobileMenu(false)}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                            />

                            {/* Mobile menu panel */}
                            <motion.div
                                className="fixed top-0 left-0 bottom-0 w-4/5 max-w-sm bg-white shadow-xl"
                                initial={{ x: '-100%' }}
                                animate={{ x: 0 }}
                                exit={{ x: '-100%' }}
                                transition={{
                                    type: "spring",
                                    damping: 25,
                                    stiffness: 300,
                                    mass: 0.8
                                }}
                            >
                                <div className="flex flex-col h-full">
                                    {/* Menu header */}
                                    <div className="flex items-center justify-between p-4 border-b border-gray-200">
                                        <div className="flex items-center">
                                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded flex items-center justify-center">
                                                <span className="text-white font-bold text-sm">WS</span>
                                            </div>
                                            <h2 className="ml-2 text-lg font-semibold text-gray-900">Wise Student</h2>
                                        </div>
                                        <button
                                            className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                                            onClick={() => setShowMobileMenu(false)}
                                        >
                                            <X className="h-6 w-6" />
                                        </button>
                                    </div>

                                    {/* Menu items */}
                                    <div className="flex flex-col p-4 space-y-4 flex-grow">
                                        <motion.button
                                            onClick={() => {
                                                handlePillarsClick();
                                                setShowMobileMenu(false);
                                            }}
                                            className="text-left px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors font-medium"
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            Pillars
                                        </motion.button>

                                        <motion.button
                                            onClick={() => {
                                                handleWhyChooseClick();
                                                setShowMobileMenu(false);
                                            }}
                                            className="text-left px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors font-medium"
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            Why Choose Us
                                        </motion.button>

                                        <motion.button
                                            onClick={() => {
                                                handlePricingClick();
                                                setShowMobileMenu(false);
                                            }}
                                            className="text-left px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors font-medium"
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            Pricing
                                        </motion.button>

                                        <motion.button
                                            onClick={() => {
                                                handleStudentServicesClick();
                                                setShowMobileMenu(false);
                                            }}
                                            className="text-left px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors font-medium"
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            Services
                                        </motion.button>

                                        <motion.button
                                            onClick={() => {
                                                handleFooterClick();
                                                setShowMobileMenu(false);
                                            }}
                                            className="text-left px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors font-medium"
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            Contact
                                        </motion.button>

                                        <motion.button
                                            onClick={() => {
                                                navigate("/login");
                                                setShowMobileMenu(false);
                                            }}
                                            className="text-left px-4 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:opacity-90 transition-all font-medium mt-auto"
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            Sign In
                                        </motion.button>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </nav>
    );
};

export default MainNavbar;