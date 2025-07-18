import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    Wallet,
    Coins,
    CreditCard,
    Gift,
    Trophy,
    Star,
    Sparkles,
    ArrowRight,
    CheckCircle,
    AlertTriangle,
    Clock,
    Zap,
    Target,
    Crown,
    Diamond,
    Heart,
    TrendingUp,
    Award,
    Flame
} from "lucide-react";
import { useSocket } from "../../context/SocketContext";
import { useAuth } from "../../hooks/useAuth";

const RedeemPage = () => {
    const [wallet, setWallet] = useState(null);
    const [amount, setAmount] = useState("");
    const [upiId, setUpiId] = useState("");
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState(""); // success, error, info
    const [loading, setLoading] = useState(false);
    const [selectedQuickAmount, setSelectedQuickAmount] = useState(null);
    const socket = useSocket();
    const { user } = useAuth();

    // Quick amount options
    const quickAmounts = [100, 250, 500, 1000, 2000, 5000];

    // Rewards tier system
    const rewardTiers = [
        { min: 0, max: 499, title: "Bronze Explorer", icon: <Trophy className="w-5 h-5" />, color: "from-amber-400 to-orange-500" },
        { min: 500, max: 1999, title: "Silver Achiever", icon: <Star className="w-5 h-5" />, color: "from-gray-400 to-gray-600" },
        { min: 2000, max: 4999, title: "Gold Champion", icon: <Crown className="w-5 h-5" />, color: "from-yellow-400 to-yellow-600" },
        { min: 5000, max: Infinity, title: "Diamond Legend", icon: <Diamond className="w-5 h-5" />, color: "from-blue-400 to-purple-600" }
    ];

    const getCurrentTier = (balance) => {
        return rewardTiers.find(tier => balance >= tier.min && balance <= tier.max) || rewardTiers[0];
    };

    const getNextTier = (balance) => {
        const currentIndex = rewardTiers.findIndex(tier => balance >= tier.min && balance <= tier.max);
        return currentIndex < rewardTiers.length - 1 ? rewardTiers[currentIndex + 1] : null;
    };

    useEffect(() => {
        if (socket && socket.socket && user) {
            try {
                socket.socket.emit('student:wallet:subscribe', { studentId: user._id });
            } catch (err) {
                console.error("❌ Error subscribing to wallet:", err.message);
            }
            
            socket.socket.on('student:wallet:data', data => setWallet(data.wallet));
            
            return () => {
                try {
                    if (socket && socket.socket) {
                        socket.socket.off('student:wallet:data');
                    }
                } catch (err) {
                    console.error("❌ Error cleaning up wallet socket listeners:", err.message);
                }
            };
        }
    }, [socket, user]);

    const handleQuickAmount = (quickAmount) => {
        setAmount(quickAmount.toString());
        setSelectedQuickAmount(quickAmount);
    };

    const handleRedeem = () => {
        if (!amount || !upiId) {
            setMessage("Please enter amount and UPI ID");
            setMessageType("error");
            return;
        }
        if (parseFloat(amount) > (wallet?.balance || 0)) {
            setMessage("You cannot redeem more than your wallet balance.");
            setMessageType("error");
            return;
        }
        if (parseFloat(amount) < 100) {
            setMessage("Minimum redemption amount is ₹100");
            setMessageType("error");
            return;
        }

        setLoading(true);
        try {
            socket.socket.emit('student:wallet:redeem', { studentId: user._id, amount, upiId });
            setMessage("🎉 Redemption request submitted successfully!");
            setMessageType("success");
            setAmount("");
            setUpiId("");
            setSelectedQuickAmount(null);
        } catch (err) {
            console.error("❌ Error submitting redemption request:", err.message);
            setMessage("Failed to submit redemption request. Please try again.");
            setMessageType("error");
        } finally {
            setLoading(false);
        }
    };

    const currentTier = getCurrentTier(wallet?.balance || 0);
    const nextTier = getNextTier(wallet?.balance || 0);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 15,
            },
        },
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-r from-green-200 to-emerald-200 rounded-full opacity-20 blur-3xl animate-pulse" />
                <div className="absolute top-1/3 right-20 w-80 h-80 bg-gradient-to-r from-blue-200 to-cyan-200 rounded-full opacity-15 blur-3xl animate-pulse delay-1000" />
                <div className="absolute bottom-20 left-1/4 w-72 h-72 bg-gradient-to-r from-purple-200 to-pink-200 rounded-full opacity-20 blur-3xl animate-pulse delay-2000" />

                {/* Floating coins */}
                <motion.div
                    className="absolute top-1/4 left-1/3 w-8 h-8 bg-yellow-400 rounded-full opacity-60 flex items-center justify-center"
                    animate={{
                        y: [0, -20, 0],
                        x: [0, 10, 0],
                        rotate: [0, 180, 360]
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                >
                    <Coins className="w-4 h-4 text-yellow-800" />
                </motion.div>
                <motion.div
                    className="absolute top-2/3 right-1/4 w-6 h-6 bg-green-400 rounded-full opacity-50 flex items-center justify-center"
                    animate={{
                        y: [0, -15, 0],
                        rotate: [0, -180, -360]
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 1
                    }}
                >
                    <Gift className="w-3 h-3 text-green-800" />
                </motion.div>
            </div>

            <div className="relative z-10 p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-8"
                >
                    <div className="relative inline-block">
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-3 flex items-center justify-center gap-2 text-center">
                            <span className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent drop-shadow-sm">
                                Cash Out Your Coins!
                            </span>
                            <span className="text-black dark:text-white">💰</span>
                        </h1>

                        <div className="absolute -top-2 -right-2 text-yellow-400 animate-bounce">
                            <Sparkles className="w-6 h-6" />
                        </div>
                    </div>
                    <p className="text-gray-600 text-lg sm:text-xl font-medium tracking-wide">
                        Turn your HealCoins into real money ✨
                    </p>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 lg:grid-cols-2 gap-8"
                >
                    {/* Wallet Overview */}
                    <motion.div
                        variants={itemVariants}
                        className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/50 relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-green-500/8 via-emerald-500/8 to-teal-500/8" />

                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center">
                                    <Wallet className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-800">Your Wallet</h2>
                                    <p className="text-gray-600 text-sm">HealCoins Balance</p>
                                </div>
                            </div>

                            <div className="text-center mb-6">
                                <motion.div
                                    className="text-5xl font-black text-green-600 mb-2"
                                    animate={{ scale: [1, 1.05, 1] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                >
                                    ₹{wallet?.balance || 0}
                                </motion.div>
                                <p className="text-gray-500 text-sm">Available for redemption</p>
                            </div>

                            {/* Tier Progress */}
                            <div className="mb-6">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${currentTier.color} flex items-center justify-center text-white`}>
                                            {currentTier.icon}
                                        </div>
                                        <span className="font-semibold text-gray-700">{currentTier.title}</span>
                                    </div>
                                    {nextTier && (
                                        <div className="text-sm text-gray-500">
                                            Next: {nextTier.title}
                                        </div>
                                    )}
                                </div>
                                {nextTier && (
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className={`h-2 rounded-full bg-gradient-to-r ${currentTier.color}`}
                                            style={{ width: `${Math.min(((wallet?.balance || 0) / nextTier.min) * 100, 100)}%` }}
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Quick Stats */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-gradient-to-r from-blue-100 to-cyan-100 p-4 rounded-xl text-center">
                                    <TrendingUp className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                                    <div className="text-sm font-semibold text-blue-700">This Month</div>
                                    <div className="text-xl font-bold text-blue-600">+{Math.floor(Math.random() * 500) + 200}</div>
                                </div>
                                <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-4 rounded-xl text-center">
                                    <Award className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                                    <div className="text-sm font-semibold text-purple-700">Rank</div>
                                    <div className="text-xl font-bold text-purple-600">#{Math.floor(Math.random() * 100) + 1}</div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Redemption Form */}
                    <motion.div
                        variants={itemVariants}
                        className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/50 relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/8 via-purple-500/8 to-pink-500/8" />

                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center">
                                    <CreditCard className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-800">Cash Out</h2>
                                    <p className="text-gray-600 text-sm">Redeem your coins</p>
                                </div>
                            </div>

                            {/* Quick Amount Selection */}
                            <div className="mb-6">
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                    Quick Select Amount
                                </label>
                                <div className="grid grid-cols-3 gap-2">
                                    {quickAmounts.map((quickAmount) => (
                                        <motion.button
                                            key={quickAmount}
                                            onClick={() => handleQuickAmount(quickAmount)}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className={`p-3 rounded-xl border-2 transition-all font-semibold text-sm ${selectedQuickAmount === quickAmount
                                                    ? 'border-blue-500 bg-blue-50 text-blue-600'
                                                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                                                }`}
                                            disabled={quickAmount > (wallet?.balance || 0)}
                                        >
                                            ₹{quickAmount}
                                        </motion.button>
                                    ))}
                                </div>
                            </div>

                            {/* Custom Amount Input */}
                            <div className="mb-6">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Custom Amount (Min: ₹100)
                                </label>
                                <div className="relative">
                                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                        ₹
                                    </div>
                                    <input
                                        type="number"
                                        placeholder="Enter amount"
                                        value={amount}
                                        onChange={(e) => {
                                            setAmount(e.target.value);
                                            setSelectedQuickAmount(null);
                                        }}
                                        className="w-full pl-8 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all font-semibold text-lg"
                                        min="100"
                                        max={wallet?.balance || 0}
                                    />
                                </div>
                            </div>

                            {/* UPI ID Input */}
                            <div className="mb-6">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    UPI ID
                                </label>
                                <input
                                    type="text"
                                    placeholder="yourname@upi"
                                    value={upiId}
                                    onChange={(e) => setUpiId(e.target.value)}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all font-semibold"
                                />
                            </div>

                            {/* Redeem Button */}
                            <motion.button
                                onClick={handleRedeem}
                                disabled={loading || !amount || !upiId}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className={`w-full py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 ${loading || !amount || !upiId
                                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 shadow-lg hover:shadow-xl'
                                    }`}
                            >
                                {loading ? (
                                    <>
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                        >
                                            <Clock className="w-5 h-5" />
                                        </motion.div>
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <Zap className="w-5 h-5" />
                                        Redeem Now
                                        <ArrowRight className="w-5 h-5" />
                                    </>
                                )}
                            </motion.button>

                            {/* Message */}
                            {message && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`mt-4 p-4 rounded-xl flex items-center gap-2 ${messageType === 'success'
                                            ? 'bg-green-100 text-green-800 border border-green-200'
                                            : messageType === 'error'
                                                ? 'bg-red-100 text-red-800 border border-red-200'
                                                : 'bg-blue-100 text-blue-800 border border-blue-200'
                                        }`}
                                >
                                    {messageType === 'success' && <CheckCircle className="w-5 h-5" />}
                                    {messageType === 'error' && <AlertTriangle className="w-5 h-5" />}
                                    <span className="font-medium">{message}</span>
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                </motion.div>

                {/* Redemption Info */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mt-8 bg-white/95 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/50"
                >
                    <div className="text-center mb-6">
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">How It Works</h3>
                        <p className="text-gray-600">Simple steps to cash out your HealCoins</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <span className="text-white font-bold text-2xl">1</span>
                            </div>
                            <h4 className="font-semibold text-gray-800 mb-2">Select Amount</h4>
                            <p className="text-gray-600 text-sm">Choose how much you want to redeem (min ₹100)</p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <span className="text-white font-bold text-2xl">2</span>
                            </div>
                            <h4 className="font-semibold text-gray-800 mb-2">Enter UPI ID</h4>
                            <p className="text-gray-600 text-sm">Provide your UPI ID for instant transfer</p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <span className="text-white font-bold text-2xl">3</span>
                            </div>
                            <h4 className="font-semibold text-gray-800 mb-2">Get Money</h4>
                            <p className="text-gray-600 text-sm">Receive money in your account within 24 hours</p>
                        </div>
                    </div>
                </motion.div>

                {/* Motivational Footer */}
                <div className="text-center mt-8">
                    <div className="inline-flex items-center gap-3 bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-8 py-4 rounded-full shadow-xl font-semibold text-lg">
                        <Flame className="w-6 h-6" />
                        <span>Keep earning, keep growing! 🚀</span>
                        <Heart className="w-6 h-6" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RedeemPage;