import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
    Gift,
    Star,
    Crown,
    Diamond,
    Trophy,
    Sparkles,
    Coins,
    Zap,
    Heart,
    Award,
    Target,
    Flame,
    Rocket,
    Shield,
    CheckCircle,
    Clock,
    AlertCircle,
    Loader2,
} from "lucide-react";
import { useWallet } from "../../context/WalletContext";
import api from "../../utils/api";

const RewardsPage = () => {
    const [rewards, setRewards] = useState([]);
    const [redeemed, setRedeemed] = useState([]);
    const [loading, setLoading] = useState(true);
    const [redeeming, setRedeeming] = useState(null);
    const [filter, setFilter] = useState("all");
    const [notification, setNotification] = useState(null);
    const { wallet, refreshWallet } = useWallet();

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [rewardRes, redeemRes] = await Promise.all([
                    api.get("/api/rewards"),
                    api.get("/api/rewards/redeemed"),
                ]);

                setRewards(rewardRes.data || []);
                setRedeemed(redeemRes.data || []);
            } catch (err) {
                console.error("Failed to load rewards:", err);
                showNotification("Failed to load rewards. Please try again.", "error");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const showNotification = (message, type = "success") => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 4000);
    };

    const handleRedeem = async (rewardId, rewardCost, rewardName) => {
        if (!wallet || wallet.balance < rewardCost) {
            showNotification(
                "Insufficient HealCoins! Complete more activities to earn coins.",
                "error"
            );
            return;
        }

        setRedeeming(rewardId);
        try {
            await api.post(`/api/rewards/redeem/${rewardId}`);
            showNotification(`🎉 Successfully redeemed ${rewardName}!`, "success");

            // Refresh wallet to update balance
            if (refreshWallet) {
                await refreshWallet();
            }

            // Refresh redeemed rewards
            const redeemRes = await api.get("/api/rewards/redeemed");
            setRedeemed(redeemRes.data || []);
        } catch (err) {
            console.error("Redeem failed:", err);
            const errorMessage =
                err.response?.data?.error || "Redemption failed. Please try again.";
            showNotification(errorMessage, "error");
        } finally {
            setRedeeming(null);
        }
    };

    const getRewardIcon = (index) => {
        const icons = [
            <Gift className="w-8 h-8" />,
            <Star className="w-8 h-8" />,
            <Crown className="w-8 h-8" />,
            <Diamond className="w-8 h-8" />,
            <Trophy className="w-8 h-8" />,
            <Award className="w-8 h-8" />,
            <Target className="w-8 h-8" />,
            <Rocket className="w-8 h-8" />,
            <Shield className="w-8 h-8" />,
            <Heart className="w-8 h-8" />,
        ];
        return icons[index % icons.length];
    };

    const getRewardGradient = (index) => {
        const gradients = [
            "from-pink-400 via-rose-400 to-red-400",
            "from-purple-400 via-violet-400 to-indigo-400",
            "from-amber-400 via-orange-400 to-red-400",
            "from-green-400 via-emerald-400 to-teal-400",
            "from-blue-400 via-cyan-400 to-teal-400",
            "from-yellow-400 via-orange-400 to-red-400",
            "from-indigo-400 via-purple-400 to-pink-400",
            "from-rose-400 via-pink-400 to-purple-400",
            "from-teal-400 via-green-400 to-emerald-400",
            "from-orange-400 via-red-400 to-pink-400",
        ];
        return gradients[index % gradients.length];
    };

    const canAfford = (cost) => wallet && wallet.balance >= cost;
    const isRedeemed = (rewardId) =>
        redeemed.some(
            (item) => item.rewardId === rewardId || item._id === rewardId
        );

    const filteredRewards =
        filter === "all"
            ? rewards
            : filter === "affordable"
                ? rewards.filter((reward) => canAfford(reward.cost))
                : rewards.filter((reward) => !canAfford(reward.cost));

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2,
            },
        },
    };

    const itemVariants = {
        hidden: { y: 30, opacity: 0 },
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
                <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-r from-blue-200 to-purple-200 rounded-full opacity-20 blur-3xl animate-pulse" />
                <div className="absolute top-1/3 right-20 w-80 h-80 bg-gradient-to-r from-pink-200 to-rose-200 rounded-full opacity-15 blur-3xl animate-pulse delay-1000" />
                <div className="absolute bottom-20 left-1/4 w-72 h-72 bg-gradient-to-r from-green-200 to-emerald-200 rounded-full opacity-20 blur-3xl animate-pulse delay-2000" />

                {/* Floating shapes */}
                <motion.div
                    className="absolute top-1/4 left-1/3 w-6 h-6 bg-yellow-400 rounded-full opacity-60"
                    animate={{
                        y: [0, -20, 0],
                        x: [0, 10, 0],
                        scale: [1, 1.2, 1],
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />
                <motion.div
                    className="absolute top-2/3 right-1/4 w-4 h-4 bg-pink-400 rotate-45 opacity-50"
                    animate={{
                        y: [0, -15, 0],
                        rotate: [45, 225, 45],
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 1,
                    }}
                />
            </div>

            {/* Notification */}
            {notification && (
                <motion.div
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -50 }}
                    className={`fixed top-4 right-4 z-50 p-4 rounded-2xl shadow-xl flex items-center gap-3 ${notification.type === "success"
                            ? "bg-green-500 text-white"
                            : "bg-red-500 text-white"
                        }`}
                >
                    {notification.type === "success" ? (
                        <CheckCircle className="w-5 h-5" />
                    ) : (
                        <AlertCircle className="w-5 h-5" />
                    )}
                    <span className="font-semibold">{notification.message}</span>
                </motion.div>
            )}

            <div className="relative z-10 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-8"
                >
                    <div className="relative inline-block">
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-3 flex items-center justify-center gap-2 text-center">
                            <span className="text-black dark:text-white">🎁</span>
                            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent drop-shadow-sm">
                                Reward Store
                            </span>
                        </h1>

                        <div className="absolute -top-2 -right-2 text-yellow-400 animate-bounce">
                            <Sparkles className="w-6 h-6" />
                        </div>
                        <div className="absolute -bottom-2 -left-2 text-pink-400 animate-bounce delay-300">
                            <Star className="w-5 h-5" />
                        </div>
                    </div>
                    <p className="text-gray-600 text-lg sm:text-xl font-medium tracking-wide">
                        Spend your HealCoins on amazing rewards! ✨
                    </p>
                </motion.div>

                {/* Wallet Balance */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6 }}
                    className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/50 mb-8 relative overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-green-500/8 via-emerald-500/8 to-teal-500/8" />
                    <div className="relative z-10 text-center">
                        <div className="flex items-center justify-center gap-3 mb-4">
                            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-lg">
                                <Coins className="w-8 h-8" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-gray-800">
                                    Your Balance
                                </h3>
                                <p className="text-3xl font-black text-green-600">
                                    {wallet?.balance || 0} HealCoins
                                </p>
                            </div>
                        </div>
                        <p className="text-gray-600 text-sm">
                            Complete activities to earn more HealCoins!
                        </p>
                    </div>
                </motion.div>

                {/* Filter Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mb-8"
                >
                    <div className="flex flex-wrap gap-3 justify-center">
                        {["all", "affordable", "expensive"].map((filterType) => (
                            <motion.button
                                key={filterType}
                                onClick={() => setFilter(filterType)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className={`px-6 py-3 rounded-full font-semibold transition-all ${filter === filterType
                                        ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg"
                                        : "bg-white/80 text-gray-700 hover:bg-white shadow-md"
                                    }`}
                            >
                                {filterType === "all" && "All Rewards"}
                                {filterType === "affordable" && "Affordable"}
                                {filterType === "expensive" && "Premium"}
                            </motion.button>
                        ))}
                    </div>
                </motion.div>

                {/* Loading State */}
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="text-center">
                            <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mx-auto mb-4" />
                            <p className="text-gray-600 text-lg font-medium">
                                Loading amazing rewards...
                            </p>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Rewards Grid */}
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8"
                        >
                            {filteredRewards.map((reward, index) => {
                                const affordable = canAfford(reward.cost);
                                const alreadyRedeemed = isRedeemed(reward._id);
                                const currentlyRedeeming = redeeming === reward._id;

                                return (
                                    <motion.div
                                        key={reward._id}
                                        variants={itemVariants}
                                        whileHover={{
                                            scale: 1.03,
                                            y: -8,
                                            transition: { duration: 0.2 },
                                        }}
                                        className="group relative"
                                    >
                                        <div
                                            className={`bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/40 transition-all duration-300 h-full relative overflow-hidden ${!affordable && !alreadyRedeemed ? "opacity-75" : ""
                                                }`}
                                        >
                                            {alreadyRedeemed && (
                                                <div className="absolute top-4 right-4 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                                                    <CheckCircle className="w-5 h-5 text-white" />
                                                </div>
                                            )}

                                            <div
                                                className={`absolute inset-0 bg-gradient-to-r ${getRewardGradient(
                                                    index
                                                )} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                                            />

                                            <div className="relative z-10 flex flex-col items-center text-center h-full">
                                                <motion.div
                                                    className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${getRewardGradient(
                                                        index
                                                    )} flex items-center justify-center text-white mb-4 shadow-lg`}
                                                    whileHover={{ rotate: 360 }}
                                                    transition={{ duration: 0.6 }}
                                                >
                                                    {getRewardIcon(index)}
                                                </motion.div>

                                                <h3 className="text-lg font-bold text-gray-800 mb-2">
                                                    {reward.name}
                                                </h3>

                                                <p className="text-sm text-gray-600 mb-4 flex-1">
                                                    {reward.description ||
                                                        "Amazing reward waiting for you!"}
                                                </p>

                                                <div className="flex items-center justify-center gap-2 mb-4">
                                                    <Coins className="w-5 h-5 text-yellow-500" />
                                                    <span className="text-xl font-bold text-gray-800">
                                                        {reward.cost}
                                                    </span>
                                                </div>

                                                <motion.button
                                                    onClick={() =>
                                                        handleRedeem(reward._id, reward.cost, reward.name)
                                                    }
                                                    disabled={
                                                        !affordable || alreadyRedeemed || currentlyRedeeming
                                                    }
                                                    whileHover={
                                                        affordable && !alreadyRedeemed
                                                            ? { scale: 1.05 }
                                                            : {}
                                                    }
                                                    whileTap={
                                                        affordable && !alreadyRedeemed
                                                            ? { scale: 0.95 }
                                                            : {}
                                                    }
                                                    className={`w-full px-4 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${alreadyRedeemed
                                                            ? "bg-green-100 text-green-800 cursor-not-allowed"
                                                            : affordable
                                                                ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:shadow-lg"
                                                                : "bg-gray-200 text-gray-500 cursor-not-allowed"
                                                        }`}
                                                >
                                                    {currentlyRedeeming ? (
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                    ) : alreadyRedeemed ? (
                                                        <>
                                                            <CheckCircle className="w-4 h-4" />
                                                            Redeemed
                                                        </>
                                                    ) : affordable ? (
                                                        <>
                                                            <Zap className="w-4 h-4" />
                                                            Redeem Now
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Clock className="w-4 h-4" />
                                                            Need More Coins
                                                        </>
                                                    )}
                                                </motion.button>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </motion.div>

                        {/* Empty State */}
                        {filteredRewards.length === 0 && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center py-20"
                            >
                                <div className="w-24 h-24 bg-gradient-to-r from-gray-300 to-gray-400 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                    <Gift className="w-12 h-12 text-white" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                                    No rewards found
                                </h3>
                                <p className="text-gray-600 mb-6">
                                    {filter === "affordable"
                                        ? "Complete more activities to earn HealCoins!"
                                        : "Check back later for new rewards!"}
                                </p>
                                <motion.button
                                    onClick={() => setFilter("all")}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-3 rounded-xl font-semibold"
                                >
                                    View All Rewards
                                </motion.button>
                            </motion.div>
                        )}
                    </>
                )}

                {/* Motivational Footer */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="text-center mt-12"
                >
                    <div className="inline-flex items-center gap-3 bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-8 py-4 rounded-full shadow-xl font-semibold text-lg">
                        <Flame className="w-6 h-6" />
                        <span>Keep earning HealCoins to unlock more rewards! 🌟</span>
                        <Sparkles className="w-6 h-6" />
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default RewardsPage;
