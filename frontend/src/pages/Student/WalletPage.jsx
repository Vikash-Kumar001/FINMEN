import React, { useState, useEffect } from "react";
import api from "../../utils/api";
import { motion, AnimatePresence } from "framer-motion";
import {
    Wallet,
    Coins,
    TrendingUp,
    TrendingDown,
    Gift,
    Search,
    Calendar,
    ArrowUpRight,
    ArrowDownLeft,
    Sparkles,
    Star,
    Crown,
    Trophy,
    Zap,
    CheckCircle,
    History,
    Target,
    Award,
    DollarSign,
    Eye,
    EyeOff,
    Send
} from "lucide-react";

const WalletPage = () => {
    const [wallet, setWallet] = useState({
        balance: 0,
        totalEarned: 0,
        lastUpdated: new Date().toISOString(),
        rank: 0,
        nextMilestone: 100,
        achievements: []
    });
    const [transactions, setTransactions] = useState([]);
    
    useEffect(() => {
        // Fetch wallet data from API
        const fetchWalletData = async () => {
            try {
                const walletResponse = await api.get('/api/wallet');
                setWallet(walletResponse.data);
                
                const transactionsResponse = await api.get('/api/wallet/transactions');
                setTransactions(transactionsResponse.data);
            } catch (error) {
                console.error('Error fetching wallet data:', error);
                // Keep default values if fetch fails
            }
        };
        
        fetchWalletData();
    }, []);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [typeFilter, setTypeFilter] = useState("all");
    const [sortBy, setSortBy] = useState("newest");
    const [amount, setAmount] = useState("");
    const [upiId, setUpiId] = useState("");
    const [statusMsg, setStatusMsg] = useState("");
    const [showBalance, setShowBalance] = useState(true);
    const [activeTab, setActiveTab] = useState("overview");

    // Animation variants
    const pulseVariants = {
        animate: {
            scale: [1, 1.05, 1],
            transition: {
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
            },
        },
    };

    // Filter and sort transactions
    const filteredTxns = transactions
        .filter((txn) => {
            const matchesSearch = txn.description
                ?.toLowerCase()
                .includes(search.toLowerCase());
            const matchesType = typeFilter === "all" || txn.type === typeFilter;
            return matchesSearch && matchesType;
        })
        .sort((a, b) => {
            return sortBy === "newest"
                ? new Date(b.createdAt) - new Date(a.createdAt)
                : new Date(a.createdAt) - new Date(b.createdAt);
        });

    const handleRedeem = () => {
        if (!amount || !upiId) {
            setStatusMsg("Please enter both amount and UPI ID");
            return;
        }
        if (parseInt(amount) > wallet.balance) {
            setStatusMsg("Insufficient balance");
            return;
        }
        setLoading(true);
        setTimeout(() => {
            setStatusMsg("✅ Redemption request submitted successfully!");
            setAmount("");
            setUpiId("");
            setLoading(false);
            // Add to transactions
            const newTransaction = {
                _id: Date.now().toString(),
                type: "redeem",
                amount: parseInt(amount),
                description: `UPI redemption to ${upiId}`,
                createdAt: new Date().toISOString(),
                status: "pending",
                upiId: upiId
            };
            setTransactions(prev => [newTransaction, ...prev]);
            setWallet(prev => ({ ...prev, balance: prev.balance - parseInt(amount) }));
            setTimeout(() => setStatusMsg(""), 3000);
        }, 1000);
    };

    const getTransactionIcon = (type) => {
        switch (type) {
            case "credit":
                return <ArrowUpRight className="w-5 h-5 text-green-500" />;
            case "debit":
                return <ArrowDownLeft className="w-5 h-5 text-red-500" />;
            case "redeem":
                return <Send className="w-5 h-5 text-blue-500" />;
            default:
                return <Coins className="w-5 h-5 text-gray-500" />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "completed":
                return "text-green-600 bg-green-100";
            case "pending":
                return "text-yellow-600 bg-yellow-100";
            case "failed":
                return "text-red-600 bg-red-100";
            default:
                return "text-gray-600 bg-gray-100";
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
        if (diffInHours < 1) return "Just now";
        if (diffInHours < 24) return `${diffInHours}h ago`;
        if (diffInHours < 48) return "Yesterday";
        return date.toLocaleDateString();
    };

    const progressToMilestone = (wallet.balance / wallet.nextMilestone) * 100;

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-r from-green-200 to-emerald-200 rounded-full opacity-20 blur-3xl animate-pulse" />
                <div className="absolute top-1/3 right-20 w-80 h-80 bg-gradient-to-r from-yellow-200 to-orange-200 rounded-full opacity-15 blur-3xl animate-pulse delay-1000" />
                <div className="absolute bottom-20 left-1/4 w-72 h-72 bg-gradient-to-r from-blue-200 to-cyan-200 rounded-full opacity-20 blur-3xl animate-pulse delay-2000" />
                {/* Floating coin elements */}
                <motion.div
                    className="absolute top-1/4 left-1/3 w-8 h-8 bg-yellow-400 rounded-full opacity-60 flex items-center justify-center text-white font-bold"
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
                    ₹
                </motion.div>
                <motion.div
                    className="absolute top-2/3 right-1/4 w-6 h-6 bg-green-400 rounded-full opacity-50 flex items-center justify-center text-white text-xs font-bold"
                    animate={{
                        y: [0, -15, 0],
                        rotate: [0, 360, 0]
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 1
                    }}
                >
                    💰
                </motion.div>
            </div>

            <div className="relative z-10 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-8"
                >
                    <motion.div
                        className="relative inline-block"
                        variants={pulseVariants}
                        animate="animate"
                    >
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-3 flex items-center justify-center gap-2 text-center">
                            <span className="text-black dark:text-white">💰</span>
                            <span className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent drop-shadow-sm">
                                HealCoin Wallet
                            </span>
                        </h1>

                        <div className="absolute -top-2 -right-2 text-yellow-400 animate-bounce">
                            <Sparkles className="w-6 h-6" />
                        </div>
                    </motion.div>
                    <motion.p
                        className="text-gray-600 text-lg sm:text-xl font-medium tracking-wide"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        Your wellness rewards, your way ✨
                    </motion.p>
                </motion.div>

                {/* Balance Overview */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6 }}
                    className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/50 mb-8 relative overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-green-500/8 via-emerald-500/8 to-teal-500/8" />
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <motion.div
                                    className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-xl"
                                    whileHover={{ scale: 1.1, rotate: 5 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <Wallet className="w-8 h-8" />
                                </motion.div>
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800">Current Balance</h2>
                                    <p className="text-gray-600">Last updated: {formatDate(wallet.lastUpdated)}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowBalance(!showBalance)}
                                className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
                            >
                                {showBalance ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Main Balance */}
                            <motion.div
                                className="bg-gradient-to-br from-green-100 to-emerald-100 p-6 rounded-2xl border border-green-200 shadow-lg"
                                whileHover={{ scale: 1.02 }}
                                transition={{ duration: 0.2 }}
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <Coins className="w-6 h-6 text-green-600" />
                                        <span className="text-sm font-bold text-green-700">HealCoins</span>
                                    </div>
                                    <Crown className="w-6 h-6 text-yellow-500" />
                                </div>
                                <div className="text-4xl font-black text-green-600 mb-2">
                                    {showBalance ? `₹${wallet.balance.toLocaleString()}` : "••••"}
                                </div>
                                <div className="text-sm text-green-600 font-medium">Available Balance</div>
                            </motion.div>
                            {/* Total Earned */}
                            <motion.div
                                className="bg-gradient-to-br from-blue-100 to-cyan-100 p-6 rounded-2xl border border-blue-200 shadow-lg"
                                whileHover={{ scale: 1.02 }}
                                transition={{ duration: 0.2 }}
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <TrendingUp className="w-6 h-6 text-blue-600" />
                                        <span className="text-sm font-bold text-blue-700">Total Earned</span>
                                    </div>
                                    <Trophy className="w-6 h-6 text-yellow-500" />
                                </div>
                                <div className="text-4xl font-black text-blue-600 mb-2">
                                    {showBalance ? `₹${wallet.totalEarned.toLocaleString()}` : "••••"}
                                </div>
                                <div className="text-sm text-blue-600 font-medium">All Time</div>
                            </motion.div>
                            {/* Next Milestone */}
                            <motion.div
                                className="bg-gradient-to-br from-purple-100 to-pink-100 p-6 rounded-2xl border border-purple-200 shadow-lg"
                                whileHover={{ scale: 1.02 }}
                                transition={{ duration: 0.2 }}
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <Target className="w-6 h-6 text-purple-600" />
                                        <span className="text-sm font-bold text-purple-700">Next Goal</span>
                                    </div>
                                    <Star className="w-6 h-6 text-yellow-500" />
                                </div>
                                <div className="text-4xl font-black text-purple-600 mb-2">
                                    ₹{wallet.nextMilestone.toLocaleString()}
                                </div>
                                <div className="w-full bg-purple-200 rounded-full h-2 mb-2">
                                    <motion.div
                                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${progressToMilestone}%` }}
                                        transition={{ duration: 1.5, ease: "easeOut" }}
                                    />
                                </div>
                                <div className="text-sm text-purple-600 font-medium">
                                    {Math.round(progressToMilestone)}% Complete
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>

                {/* Tab Navigation */}
                <div className="flex gap-2 mb-6">
                    {["overview", "transactions", "redeem"].map((tab) => (
                        <motion.button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`px-6 py-3 rounded-2xl font-semibold transition-all capitalize ${activeTab === tab
                                    ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg'
                                    : 'bg-white/80 text-gray-700 hover:bg-white shadow-md'
                                }`}
                        >
                            {tab === "overview" && <Trophy className="w-5 h-5 inline mr-2" />}
                            {tab === "transactions" && <History className="w-5 h-5 inline mr-2" />}
                            {tab === "redeem" && <Gift className="w-5 h-5 inline mr-2" />}
                            {tab}
                        </motion.button>
                    ))}
                </div>

                <AnimatePresence mode="wait">
                    {activeTab === "overview" && (
                        <motion.div
                            key="overview"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            {/* Achievements */}
                            <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/50 mb-8">
                                <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                    <Award className="w-6 h-6 text-yellow-500" />
                                    Your Achievements
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    {wallet.achievements.map((achievement, i) => (
                                        <motion.div
                                            key={i}
                                            whileHover={{ scale: 1.05, y: -2 }}
                                            className="bg-gradient-to-br from-yellow-100 to-orange-100 p-4 rounded-2xl border border-yellow-200 shadow-lg text-center"
                                        >
                                            <div className="text-4xl mb-2">{achievement.icon}</div>
                                            <h4 className="font-bold text-gray-800 mb-1">{achievement.title}</h4>
                                            <p className="text-sm text-gray-600">{achievement.description}</p>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                            {/* Quick Stats */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-6 rounded-3xl text-white shadow-xl">
                                    <div className="flex items-center gap-3 mb-3">
                                        <TrendingUp className="w-8 h-8" />
                                        <h3 className="text-xl font-bold">Global Rank</h3>
                                    </div>
                                    <div className="text-3xl font-black">#{wallet.rank}</div>
                                    <p className="text-green-100 text-sm">Out of all users</p>
                                </div>
                                <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 rounded-3xl text-white shadow-xl">
                                    <div className="flex items-center gap-3 mb-3">
                                        <Calendar className="w-8 h-8" />
                                        <h3 className="text-xl font-bold">This Month</h3>
                                    </div>
                                    <div className="text-3xl font-black">₹{Math.floor(wallet.totalEarned * 0.3)}</div>
                                    <p className="text-purple-100 text-sm">Earned in {new Date().toLocaleDateString('en-US', { month: 'long' })}</p>
                                </div>
                                <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-6 rounded-3xl text-white shadow-xl">
                                    <div className="flex items-center gap-3 mb-3">
                                        <Zap className="w-8 h-8" />
                                        <h3 className="text-xl font-bold">Activities</h3>
                                    </div>
                                    <div className="text-3xl font-black">{transactions.filter(t => t.type === 'credit').length}</div>
                                    <p className="text-blue-100 text-sm">Completed tasks</p>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === "transactions" && (
                        <motion.div
                            key="transactions"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            {/* Filters */}
                            <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/50 mb-6">
                                <div className="flex flex-wrap gap-4 items-center">
                                    <div className="flex items-center gap-2 bg-gray-100 rounded-xl px-4 py-2">
                                        <Search className="w-5 h-5 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="Search transactions..."
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                            className="bg-transparent outline-none text-gray-700 placeholder-gray-400"
                                        />
                                    </div>
                                    <select
                                        value={typeFilter}
                                        onChange={(e) => setTypeFilter(e.target.value)}
                                        className="px-4 py-2 rounded-xl border border-gray-200 bg-white shadow-sm outline-none"
                                    >
                                        <option value="all">All Types</option>
                                        <option value="credit">💰 Earned</option>
                                        <option value="debit">💸 Spent</option>
                                        <option value="redeem">🎁 Redeemed</option>
                                    </select>
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        className="px-4 py-2 rounded-xl border border-gray-200 bg-white shadow-sm outline-none"
                                    >
                                        <option value="newest">⏰ Newest First</option>
                                        <option value="oldest">📅 Oldest First</option>
                                    </select>
                                </div>
                            </div>
                            {/* Transactions List */}
                            <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden">
                                <div className="p-6 border-b border-gray-100">
                                    <h3 className="text-2xl font-bold flex items-center gap-2">
                                        <History className="w-6 h-6 text-indigo-500" />
                                        Transaction History
                                    </h3>
                                </div>
                                <div className="overflow-x-auto">
                                    {filteredTxns.length === 0 ? (
                                        <div className="text-center py-12">
                                            <div className="text-6xl mb-4">🔍</div>
                                            <p className="text-gray-500 text-lg">No transactions found</p>
                                        </div>
                                    ) : (
                                        <div className="divide-y divide-gray-100">
                                            {filteredTxns.map((txn) => (
                                                <motion.div
                                                    key={txn._id}
                                                    whileHover={{ backgroundColor: "#f8fafc" }}
                                                    className="p-6 flex items-center justify-between transition-colors"
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg ${txn.type === 'credit' ? 'bg-green-100' :
                                                                txn.type === 'debit' ? 'bg-red-100' : 'bg-blue-100'
                                                            }`}>
                                                            {getTransactionIcon(txn.type)}
                                                        </div>
                                                        <div>
                                                            <h4 className="font-semibold text-gray-800">{txn.description}</h4>
                                                            <p className="text-sm text-gray-500">{formatDate(txn.createdAt)}</p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className={`text-xl font-bold ${txn.type === 'credit' ? 'text-green-600' :
                                                                txn.type === 'debit' ? 'text-red-600' : 'text-blue-600'
                                                            }`}>
                                                            {txn.type === 'credit' ? '+' : '-'}₹{txn.amount}
                                                        </div>
                                                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(txn.status)}`}>
                                                            {txn.status}
                                                        </span>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === "redeem" && (
                        <motion.div
                            key="redeem"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/50">
                                <div className="text-center mb-8">
                                    <div className="text-6xl mb-4">🎁</div>
                                    <h3 className="text-3xl font-bold mb-2">Redeem HealCoins</h3>
                                    <p className="text-gray-600">Convert your coins to real money via UPI</p>
                                </div>
                                <div className="max-w-md mx-auto space-y-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Amount to Redeem
                                        </label>
                                        <div className="relative">
                                            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                            <input
                                                type="number"
                                                placeholder="Enter amount"
                                                value={amount}
                                                onChange={(e) => setAmount(e.target.value)}
                                                className="w-full pl-10 pr-4 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-lg"
                                            />
                                        </div>
                                        <div className="mt-2 text-sm text-gray-500">
                                            Available: ₹{wallet.balance.toLocaleString()}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Your UPI ID
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="e.g. user@upi"
                                            value={upiId}
                                            onChange={(e) => setUpiId(e.target.value)}
                                            className="w-full px-4 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-lg"
                                        />
                                    </div>
                                    <button
                                        onClick={handleRedeem}
                                        disabled={loading}
                                        className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold py-4 rounded-2xl shadow-lg hover:from-green-600 hover:to-emerald-600 transition-all text-lg disabled:opacity-60"
                                    >
                                        {loading ? "Processing..." : "Redeem Now"}
                                    </button>
                                    {statusMsg && (
                                        <div className="text-center mt-4 text-base font-medium text-green-600">
                                            {statusMsg}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default WalletPage;