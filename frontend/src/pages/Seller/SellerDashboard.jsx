import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Package,
    Plus,
    Edit,
    Trash2,
    QrCode,
    CheckCircle,
    XCircle,
    Clock,
    TrendingUp,
    DollarSign,
    Eye,
    Search,
    Download,
    BarChart3,
    ShoppingBag,
    Target,
    Award,
    Coins,
    Copy,
    Truck,
    PieChart,
    Activity,
    Bell,
    Star,
    MessageSquare,
    RefreshCw,
    Scan,
    FileText,
    Percent,
    Calculator,
} from "lucide-react";
import { Line, Doughnut, Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js';
import { toast } from "react-hot-toast";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const SellerDashboard = () => {
    const [activeTab, setActiveTab] = useState("overview");
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");
    const [selectedProducts] = useState([]);
    const [showQRScanner, setShowQRScanner] = useState(false);
    const [scannedQR, setScannedQR] = useState("");

    // Enhanced product data for stationery, uniforms, and food
    const [products, setProducts] = useState([
        {
            id: 1,
            name: "School Notebook Set (5 Books)",
            description: "High-quality ruled notebooks for students",
            category: "Stationery",
            price: 250,
            coinDiscount: 50, // ₹50 off with coins
            finalPrice: 200,
            healCoinsRequired: 500, // 500 HealCoins = ₹50 discount
            stock: 100,
            sold: 45,
            status: "active",
            image: "📚",
            rating: 4.8,
            reviews: 32,
        },
        {
            id: 2,
            name: "School Uniform Shirt",
            description: "Cotton school uniform shirt - all sizes",
            category: "Uniforms",
            price: 400,
            coinDiscount: 80, // ₹80 off with coins
            finalPrice: 320,
            healCoinsRequired: 800, // 800 HealCoins = ₹80 discount
            stock: 75,
            sold: 28,
            status: "active",
            image: "👕",
            rating: 4.6,
            reviews: 18,
        },
        {
            id: 3,
            name: "School Shoes",
            description: "Black leather school shoes - durable",
            category: "Uniforms",
            price: 800,
            coinDiscount: 120, // ₹120 off with coins
            finalPrice: 680,
            healCoinsRequired: 1200, // 1200 HealCoins = ₹120 discount
            stock: 50,
            sold: 15,
            status: "active",
            image: "👞",
            rating: 4.7,
            reviews: 12,
        },
        {
            id: 4,
            name: "Lunch Meal Coupon",
            description: "Healthy lunch meal voucher for school cafeteria",
            category: "Food",
            price: 100,
            coinDiscount: 25, // ₹25 off with coins
            finalPrice: 75,
            healCoinsRequired: 250, // 250 HealCoins = ₹25 discount
            stock: 200,
            sold: 89,
            status: "active",
            image: "🍱",
            rating: 4.5,
            reviews: 67,
        },
        {
            id: 5,
            name: "Art & Craft Kit",
            description: "Complete art supplies for creative projects",
            category: "Stationery",
            price: 350,
            coinDiscount: 70, // ₹70 off with coins
            finalPrice: 280,
            healCoinsRequired: 700, // 700 HealCoins = ₹70 discount
            stock: 30,
            sold: 22,
            status: "active",
            image: "🎨",
            rating: 4.9,
            reviews: 25,
        },
    ]);

    // Enhanced voucher data with QR codes
    const [vouchers, setVouchers] = useState([
        {
            id: 1,
            studentName: "Arjun Kumar",
            studentEmail: "arjun@example.com",
            productName: "School Notebook Set (5 Books)",
            healCoinsUsed: 500,
            discountGiven: 50,
            finalAmountPaid: 200,
            status: "pending",
            requestDate: "2025-01-09T10:30:00Z",
            qrCode: "QR123456789",
            studentId: "STU001",
            urgency: "normal",
        },
        {
            id: 2,
            studentName: "Priya Sharma",
            studentEmail: "priya@example.com",
            productName: "School Uniform Shirt",
            healCoinsUsed: 800,
            discountGiven: 80,
            finalAmountPaid: 320,
            status: "approved",
            requestDate: "2025-01-08T14:20:00Z",
            approvedDate: "2025-01-08T16:45:00Z",
            qrCode: "QR987654321",
            studentId: "STU002",
            voucherCode: "UNIFORM2025ABC",
            urgency: "high",
        },
        {
            id: 3,
            studentName: "Rahul Singh",
            studentEmail: "rahul@example.com",
            productName: "Lunch Meal Coupon",
            healCoinsUsed: 250,
            discountGiven: 25,
            finalAmountPaid: 75,
            status: "delivered",
            requestDate: "2025-01-07T09:15:00Z",
            approvedDate: "2025-01-07T11:30:00Z",
            deliveredDate: "2025-01-07T12:00:00Z",
            qrCode: "QR456789123",
            studentId: "STU003",
            voucherCode: "MEAL2025XYZ",
            urgency: "low",
        },
    ]);

    // Sales and commission data
    const [salesData] = useState({
        totalRevenue: 25750, // Total revenue from sales
        totalSales: 199, // Number of items sold
        totalDiscounts: 4200, // Total discounts given via HealCoins
        actualPayments: 21550, // Actual money received after discounts
      commissionToFINMEN: 2575, // 10% commission to Wise Student
        netEarnings: 18975, // Seller's net earnings
        monthlyGrowth: 15.2,
        avgOrderValue: 129.4,
        discountPercentage: 16.3, // Average discount percentage
    });

    // Commission tracking data
    const [commissionData] = useState({
      currentRate: 10, // 10% commission to Wise Student
        monthlyCommissions: [
            {
                month: "January 2025",
                revenue: 25750,
                commission: 2575,
                status: "Pending",
            },
            {
                month: "December 2024",
                revenue: 22400,
                commission: 2240,
                status: "Paid",
            },
            {
                month: "November 2024",
                revenue: 19800,
                commission: 1980,
                status: "Paid",
            },
            {
                month: "October 2024",
                revenue: 18200,
                commission: 1820,
                status: "Paid",
            },
        ],
    });

    // Chart data for analytics
    const salesTrendData = {
        labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
        datasets: [
            {
                label: "Revenue (₹)",
                data: [5200, 6800, 7200, 6550],
                borderColor: "#10B981",
                backgroundColor: "rgba(16, 185, 129, 0.1)",
                tension: 0.4,
                fill: true,
            },
            {
                label: "Discounts Given (₹)",
                data: [850, 1100, 1200, 1050],
                borderColor: "#EF4444",
                backgroundColor: "rgba(239, 68, 68, 0.1)",
                tension: 0.4,
                fill: true,
            },
        ],
    };

    const categoryDistribution = {
        labels: ["Stationery", "Uniforms", "Food", "Others"],
        datasets: [
            {
                data: [45, 30, 20, 5],
                backgroundColor: ["#10B981", "#3B82F6", "#F59E0B", "#8B5CF6"],
                borderWidth: 0,
            },
        ],
    };

    const commissionChart = {
        labels: commissionData.monthlyCommissions.map((c) => c.month.split(" ")[0]),
        datasets: [
            {
      label: "Commission to Wise Student (₹)",
                data: commissionData.monthlyCommissions.map((c) => c.commission),
                backgroundColor: "rgba(59, 130, 246, 0.8)",
                borderColor: "rgb(59, 130, 246)",
                borderWidth: 2,
            },
        ],
    };

    // Functions
    const handleProductAction = async (action, productId) => {
        setLoading(true);
        try {
            await new Promise((resolve) => setTimeout(resolve, 800));

            if (action === "delete") {
                setProducts(products.filter((p) => p.id !== productId));
                toast.success("Product deleted successfully");
            } else if (action === "edit") {
                toast.success("Edit functionality would open here");
            } else if (action === "duplicate") {
                const product = products.find((p) => p.id === productId);
                const newProduct = {
                    ...product,
                    id: Date.now(),
                    name: `${product.name} (Copy)`,
                    status: "inactive",
                };
                setProducts([newProduct, ...products]);
                toast.success("Product duplicated successfully");
            } else if (action === "toggle_status") {
                setProducts(
                    products.map((p) =>
                        p.id === productId
                            ? { ...p, status: p.status === "active" ? "inactive" : "active" }
                            : p
                    )
                );
                toast.success("Product status updated");
            }
        } catch {
            toast.error("Action failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleVoucherAction = async (
        action,
        voucherId,
        additionalData = {}
    ) => {
        setLoading(true);
        try {
            await new Promise((resolve) => setTimeout(resolve, 1000));

            setVouchers(
                vouchers.map((v) =>
                    v.id === voucherId
                        ? {
                            ...v,
                            status: action,
                            [`${action}Date`]: new Date().toISOString(),
                            ...additionalData,
                        }
                        : v
                )
            );

            const actionMessages = {
                approved: "Voucher approved successfully",
                rejected: "Voucher rejected",
                delivered: "Voucher marked as delivered",
            };

            toast.success(actionMessages[action] || "Action completed");
        } catch {
            toast.error("Action failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleQRScan = (qrData) => {
        setScannedQR(qrData);
        const voucher = vouchers.find((v) => v.qrCode === qrData);
        if (voucher) {
            toast.success(`QR Code validated for ${voucher.studentName}`);
            if (voucher.status === "approved") {
                handleVoucherAction("delivered", voucher.id);
            }
        } else {
            toast.error("Invalid QR Code");
        }
        setShowQRScanner(false);
    };

    const exportData = async (format, dataType) => {
        setLoading(true);
        try {
            await new Promise((resolve) => setTimeout(resolve, 2000));
            toast.success(`${dataType} exported as ${format.toUpperCase()}`);
        } catch {
            toast.error("Export failed");
        } finally {
            setLoading(false);
        }
    };

    // Filter functions
    const filteredProducts = products.filter((product) => {
        const matchesSearch =
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.category.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus =
            filterStatus === "all" || product.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const filteredVouchers = vouchers.filter((voucher) => {
        const matchesSearch =
            voucher.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            voucher.productName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus =
            filterStatus === "all" || voucher.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    // Real-time notifications
    useEffect(() => {
        const interval = setInterval(() => {
            const notifications = [
                "New voucher redemption request received",
                "Product running low on stock",
                "Commission payment processed",
                "Student completed voucher redemption",
            ];

            if (Math.random() > 0.8) {
                const randomNotification =
                    notifications[Math.floor(Math.random() * notifications.length)];
                toast.success(randomNotification, {
                    duration: 4000,
                    position: "top-right",
                });
            }
        }, 20000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                                Seller Dashboard
                            </h1>
                            <p className="text-gray-600 mt-2 flex items-center gap-2">
                                <Activity className="w-4 h-4" />
                                Manage products, vouchers, and track HealCoin redemptions
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setShowQRScanner(true)}
                                className="bg-purple-500 text-white px-4 py-2 rounded-xl shadow-md flex items-center gap-2 hover:shadow-lg transition-all"
                            >
                                <Scan className="w-4 h-4" />
                                QR Scanner
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => exportData("excel", "sales")}
                                className="bg-white px-4 py-2 rounded-xl shadow-md flex items-center gap-2 hover:shadow-lg transition-all"
                            >
                                <Download className="w-4 h-4" />
                                Export Data
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() =>
                                    toast.success("Add Product modal would open here")
                                }
                                className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-4 py-2 rounded-xl shadow-md flex items-center gap-2 hover:shadow-lg transition-all"
                            >
                                <Plus className="w-4 h-4" />
                                Add Product
                            </motion.button>
                        </div>
                    </div>

                    {/* Navigation Tabs */}
                    <div className="flex gap-2 bg-white p-2 rounded-2xl shadow-md overflow-x-auto">
                        {[
                            { id: "overview", label: "Overview", icon: BarChart3 },
                            { id: "products", label: "Product Management", icon: Package },
                            { id: "vouchers", label: "Voucher Redemption", icon: QrCode },
                            { id: "sales", label: "Sales Summary", icon: TrendingUp },
                            {
                                id: "commission",
                                label: "Commission Tracking",
                                icon: DollarSign,
                            },
                        ].map((tab) => (
                            <motion.button
                                key={tab.id}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all whitespace-nowrap ${activeTab === tab.id
                                        ? "bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-md"
                                        : "text-gray-600 hover:bg-gray-50"
                                    }`}
                            >
                                <tab.icon className="w-4 h-4" />
                                {tab.label}
                            </motion.button>
                        ))}
                    </div>
                </motion.div>

                {/* Overview Tab */}
                {activeTab === "overview" && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        {/* Key Metrics */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-green-500">
                                <div className="flex items-center justify-between mb-4">
                                    <DollarSign className="w-8 h-8 text-green-500" />
                                    <div className="text-sm text-green-600 font-medium">
                                        +{salesData.monthlyGrowth}%
                                    </div>
                                </div>
                                <div className="text-3xl font-bold text-green-600 mb-2">
                                    ₹{salesData.totalRevenue.toLocaleString()}
                                </div>
                                <div className="text-gray-600">Total Revenue</div>
                            </div>

                            <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-blue-500">
                                <div className="flex items-center justify-between mb-4">
                                    <ShoppingBag className="w-8 h-8 text-blue-500" />
                                    <div className="text-sm text-blue-600 font-medium">
                                        This Month
                                    </div>
                                </div>
                                <div className="text-3xl font-bold text-blue-600 mb-2">
                                    {salesData.totalSales}
                                </div>
                                <div className="text-gray-600">Items Sold</div>
                            </div>

                            <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-orange-500">
                                <div className="flex items-center justify-between mb-4">
                                    <Percent className="w-8 h-8 text-orange-500" />
                                    <div className="text-sm text-orange-600 font-medium">
                                        Avg Discount
                                    </div>
                                </div>
                                <div className="text-3xl font-bold text-orange-600 mb-2">
                                    {salesData.discountPercentage}%
                                </div>
                                <div className="text-gray-600">Via HealCoins</div>
                            </div>

                            <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-purple-500">
                                <div className="flex items-center justify-between mb-4">
                                    <Calculator className="w-8 h-8 text-purple-500" />
                                    <div className="text-sm text-purple-600 font-medium">
                                        Net Earnings
                                    </div>
                                </div>
                                <div className="text-3xl font-bold text-purple-600 mb-2">
                                    ₹{salesData.netEarnings.toLocaleString()}
                                </div>
                                <div className="text-gray-600">After Commission</div>
                            </div>
                        </div>

                        {/* Charts */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="bg-white rounded-2xl p-6 shadow-lg">
                                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                    <TrendingUp className="w-5 h-5 text-green-500" />
                                    Revenue vs Discounts
                                </h3>
                                <div className="h-64">
                                    <Line
                                        data={salesTrendData}
                                        options={{
                                            responsive: true,
                                            maintainAspectRatio: false,
                                            plugins: { legend: { position: "bottom" } },
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl p-6 shadow-lg">
                                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                    <PieChart className="w-5 h-5 text-purple-500" />
                                    Sales by Category
                                </h3>
                                <div className="h-64 flex items-center justify-center">
                                    <Doughnut
                                        data={categoryDistribution}
                                        options={{
                                            responsive: true,
                                            maintainAspectRatio: false,
                                            plugins: { legend: { position: "bottom" } },
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Products Tab */}
                {activeTab === "products" && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        {/* Search and Filters */}
                        <div className="bg-white rounded-2xl p-4 shadow-lg">
                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="flex-1 relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                    <input
                                        type="text"
                                        placeholder="Search products..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                                    />
                                </div>
                                <select
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                    className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                                >
                                    <option value="all">All Status</option>
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                    <option value="out_of_stock">Out of Stock</option>
                                </select>
                            </div>
                        </div>

                        {/* Products Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredProducts.map((product) => (
                                <motion.div
                                    key={product.id}
                                    whileHover={{ scale: 1.02, y: -4 }}
                                    className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="text-4xl">{product.image}</div>
                                        <div className="flex gap-1">
                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={() => handleProductAction("edit", product.id)}
                                                className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </motion.button>
                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={() =>
                                                    handleProductAction("delete", product.id)
                                                }
                                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </motion.button>
                                        </div>
                                    </div>

                                    <h3 className="font-bold text-lg mb-2">{product.name}</h3>
                                    <p className="text-gray-600 text-sm mb-3">
                                        {product.description}
                                    </p>
                                    <div className="bg-blue-50 px-3 py-1 rounded-full text-xs font-medium text-blue-800 mb-3 inline-block">
                                        {product.category}
                                    </div>

                                    {/* HealCoin Pricing */}
                                    <div className="space-y-2 mb-4 bg-gray-50 p-3 rounded-xl">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Original Price:</span>
                                            <span className="font-semibold">₹{product.price}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">HealCoin Discount:</span>
                                            <span className="text-green-600 font-semibold">
                                                ₹{product.coinDiscount}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">HealCoins Required:</span>
                                            <span className="text-purple-600 font-semibold flex items-center gap-1">
                                                <Coins className="w-4 h-4" />
                                                {product.healCoinsRequired}
                                            </span>
                                        </div>
                                        <div className="flex justify-between border-t pt-2">
                                            <span className="font-semibold">Final Price:</span>
                                            <span className="font-bold text-green-600">
                                                ₹{product.finalPrice}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center mb-4">
                                        <div className="text-center">
                                            <div className="text-lg font-bold text-blue-600">
                                                {product.stock}
                                            </div>
                                            <div className="text-xs text-gray-500">Stock</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-lg font-bold text-green-600">
                                                {product.sold}
                                            </div>
                                            <div className="text-xs text-gray-500">Sold</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="flex items-center gap-1">
                                                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                                <span className="text-sm font-medium">
                                                    {product.rating}
                                                </span>
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {product.reviews} reviews
                                            </div>
                                        </div>
                                    </div>

                                    <div
                                        className={`px-3 py-1 rounded-full text-xs font-medium text-center ${product.status === "active"
                                                ? "bg-green-100 text-green-800"
                                                : product.status === "out_of_stock"
                                                    ? "bg-red-100 text-red-800"
                                                    : "bg-gray-100 text-gray-800"
                                            }`}
                                    >
                                        {product.status.replace("_", " ").toUpperCase()}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Vouchers Tab */}
                {activeTab === "vouchers" && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        {/* Search and Filters */}
                        <div className="bg-white rounded-2xl p-4 shadow-lg">
                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="flex-1 relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                    <input
                                        type="text"
                                        placeholder="Search vouchers..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                                    />
                                </div>
                                <select
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                    className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                                >
                                    <option value="all">All Status</option>
                                    <option value="pending">Pending</option>
                                    <option value="approved">Approved</option>
                                    <option value="delivered">Delivered</option>
                                    <option value="rejected">Rejected</option>
                                </select>
                            </div>
                        </div>

                        {/* Vouchers Table */}
                        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                                                Student
                                            </th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                                                Product
                                            </th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                                                HealCoins & Payment
                                            </th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                                                QR Code
                                            </th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                                                Status
                                            </th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {filteredVouchers.map((voucher) => (
                                            <tr key={voucher.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4">
                                                    <div>
                                                        <div className="font-medium">
                                                            {voucher.studentName}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {voucher.studentEmail}
                                                        </div>
                                                        <div className="text-xs text-gray-400">
                                                            {voucher.studentId}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="font-medium">
                                                        {voucher.productName}
                                                    </div>
                                                    {voucher.voucherCode && (
                                                        <div className="text-sm text-green-600 font-mono">
                                                            Code: {voucher.voucherCode}
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-1 text-purple-600">
                                                            <Coins className="w-4 h-4" />
                                                            <span className="font-semibold">
                                                                {voucher.healCoinsUsed} HealCoins
                                                            </span>
                                                        </div>
                                                        <div className="text-sm text-green-600">
                                                            Discount: ₹{voucher.discountGiven}
                                                        </div>
                                                        <div className="text-sm text-gray-600">
                                                            Paid: ₹{voucher.finalAmountPaid}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                                                        {voucher.qrCode}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span
                                                        className={`px-3 py-1 rounded-full text-xs font-medium ${voucher.status === "pending"
                                                                ? "bg-yellow-100 text-yellow-800"
                                                                : voucher.status === "approved"
                                                                    ? "bg-green-100 text-green-800"
                                                                    : voucher.status === "delivered"
                                                                        ? "bg-blue-100 text-blue-800"
                                                                        : "bg-red-100 text-red-800"
                                                            }`}
                                                    >
                                                        {voucher.status.toUpperCase()}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex gap-2">
                                                        {voucher.status === "pending" && (
                                                            <>
                                                                <motion.button
                                                                    whileHover={{ scale: 1.1 }}
                                                                    whileTap={{ scale: 0.9 }}
                                                                    onClick={() =>
                                                                        handleVoucherAction(
                                                                            "approved",
                                                                            voucher.id,
                                                                            {
                                                                                voucherCode: `${voucher.productName
                                                                                    .split(" ")[0]
                                                                                    .toUpperCase()}${Date.now()
                                                                                        .toString()
                                                                                        .slice(-4)}`,
                                                                            }
                                                                        )
                                                                    }
                                                                    className="p-2 text-green-500 hover:bg-green-50 rounded-lg"
                                                                    title="Approve"
                                                                >
                                                                    <CheckCircle className="w-4 h-4" />
                                                                </motion.button>
                                                                <motion.button
                                                                    whileHover={{ scale: 1.1 }}
                                                                    whileTap={{ scale: 0.9 }}
                                                                    onClick={() =>
                                                                        handleVoucherAction("rejected", voucher.id)
                                                                    }
                                                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                                                                    title="Reject"
                                                                >
                                                                    <XCircle className="w-4 h-4" />
                                                                </motion.button>
                                                            </>
                                                        )}
                                                        {voucher.status === "approved" && (
                                                            <motion.button
                                                                whileHover={{ scale: 1.1 }}
                                                                whileTap={{ scale: 0.9 }}
                                                                onClick={() =>
                                                                    handleVoucherAction("delivered", voucher.id)
                                                                }
                                                                className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"
                                                                title="Mark as Delivered"
                                                            >
                                                                <Truck className="w-4 h-4" />
                                                            </motion.button>
                                                        )}
                                                        <motion.button
                                                            whileHover={{ scale: 1.1 }}
                                                            whileTap={{ scale: 0.9 }}
                                                            className="p-2 text-gray-500 hover:bg-gray-50 rounded-lg"
                                                            title="View Details"
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                        </motion.button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Sales Summary Tab */}
                {activeTab === "sales" && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        {/* Sales Summary Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div className="bg-white rounded-2xl p-6 shadow-lg">
                                <div className="flex items-center justify-between mb-4">
                                    <DollarSign className="w-8 h-8 text-green-500" />
                                    <div className="text-sm text-green-600 font-medium">
                                        Total
                                    </div>
                                </div>
                                <div className="text-2xl font-bold text-green-600 mb-1">
                                    ₹{salesData.totalRevenue.toLocaleString()}
                                </div>
                                <div className="text-gray-600 text-sm">
                                    Total Revenue Generated
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl p-6 shadow-lg">
                                <div className="flex items-center justify-between mb-4">
                                    <Percent className="w-8 h-8 text-orange-500" />
                                    <div className="text-sm text-orange-600 font-medium">
                                        Discounts
                                    </div>
                                </div>
                                <div className="text-2xl font-bold text-orange-600 mb-1">
                                    ₹{salesData.totalDiscounts.toLocaleString()}
                                </div>
                                <div className="text-gray-600 text-sm">
                                    Total Discounts via HealCoins
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl p-6 shadow-lg">
                                <div className="flex items-center justify-between mb-4">
                                    <Calculator className="w-8 h-8 text-blue-500" />
                                    <div className="text-sm text-blue-600 font-medium">
                                        Actual
                                    </div>
                                </div>
                                <div className="text-2xl font-bold text-blue-600 mb-1">
                                    ₹{salesData.actualPayments.toLocaleString()}
                                </div>
                                <div className="text-gray-600 text-sm">
                                    Actual Payments Received
                                </div>
                            </div>
                        </div>

                        {/* Detailed Breakdown */}
                        <div className="bg-white rounded-2xl p-6 shadow-lg">
                            <h3 className="text-xl font-bold mb-6">Sales Breakdown</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <h4 className="font-semibold text-gray-800">
                                        Revenue Analysis
                                    </h4>
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                                            <span>Total Revenue</span>
                                            <span className="font-bold text-green-600">
                                                ₹{salesData.totalRevenue.toLocaleString()}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                                            <span>Less: HealCoin Discounts</span>
                                            <span className="font-bold text-orange-600">
                                                -₹{salesData.totalDiscounts.toLocaleString()}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                                            <span>Actual Payments</span>
                                            <span className="font-bold text-blue-600">
                                                ₹{salesData.actualPayments.toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h4 className="font-semibold text-gray-800">
                                        Performance Metrics
                                    </h4>
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                            <span>Items Sold</span>
                                            <span className="font-bold">{salesData.totalSales}</span>
                                        </div>
                                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                            <span>Average Order Value</span>
                                            <span className="font-bold">
                                                ₹{salesData.avgOrderValue}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                            <span>Average Discount %</span>
                                            <span className="font-bold">
                                                {salesData.discountPercentage}%
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Commission Tracking Tab */}
                {activeTab === "commission" && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        {/* Commission Overview */}
                        <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl p-8 text-white shadow-lg">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="text-center">
                                    <div className="text-3xl font-bold mb-2">
                                        {commissionData.currentRate}%
                                    </div>
                                    <div className="text-purple-100">
            Commission Rate to Wise Student
                                    </div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold mb-2">
            ₹{salesData.commissionToFINMEN.toLocaleString()}
                                    </div>
                                    <div className="text-purple-100">This Month Commission</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold mb-2">
                                        ₹{salesData.netEarnings.toLocaleString()}
                                    </div>
                                    <div className="text-purple-100">Your Net Earnings</div>
                                </div>
                            </div>
                        </div>

                        {/* Commission Chart */}
                        <div className="bg-white rounded-2xl p-6 shadow-lg">
                            <h3 className="text-xl font-bold mb-6">
                                Monthly Commission Trend
                            </h3>
                            <div className="h-64">
                                <Bar
                                    data={commissionChart}
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        plugins: { legend: { position: "bottom" } },
                                    }}
                                />
                            </div>
                        </div>

                        {/* Auto-generated Invoices */}
                        <div className="bg-white rounded-2xl p-6 shadow-lg">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold">
                                    Auto-Generated Commission Invoices
                                </h3>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-4 py-2 rounded-xl flex items-center gap-2"
                                >
                                    <Download className="w-4 h-4" />
                                    Download All
                                </motion.button>
                            </div>

                            <div className="space-y-4">
                                {commissionData.monthlyCommissions.map((record, index) => (
                                    <div
                                        key={index}
                                        className="flex justify-between items-center p-4 bg-gray-50 rounded-xl"
                                    >
                                        <div>
                                            <div className="font-semibold">{record.month}</div>
                                            <div className="text-sm text-gray-600">
                                                Revenue: ₹{record.revenue.toLocaleString()}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-bold text-purple-600">
                                                ₹{record.commission.toLocaleString()}
                                            </div>
                                            <div
                                                className={`text-sm px-2 py-1 rounded-full ${record.status === "Paid"
                                                        ? "bg-green-100 text-green-800"
                                                        : "bg-yellow-100 text-yellow-800"
                                                    }`}
                                            >
                                                {record.status}
                                            </div>
                                        </div>
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"
                                        >
                                            <FileText className="w-4 h-4" />
                                        </motion.button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* QR Scanner Modal */}
                <AnimatePresence>
                    {showQRScanner && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        >
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                className="bg-white rounded-2xl p-6 shadow-2xl max-w-md w-full"
                            >
                                <div className="text-center mb-6">
                                    <QrCode className="w-16 h-16 text-purple-500 mx-auto mb-4" />
                                    <h3 className="text-xl font-bold mb-2">QR Code Scanner</h3>
                                    <p className="text-gray-600">
                                        Scan student voucher QR code for validation
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    <input
                                        type="text"
                                        placeholder="Or enter QR code manually"
                                        value={scannedQR}
                                        onChange={(e) => setScannedQR(e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    />

                                    <div className="flex gap-3">
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => handleQRScan(scannedQR)}
                                            className="flex-1 bg-purple-500 text-white py-3 rounded-xl font-semibold"
                                        >
                                            Validate QR
                                        </motion.button>
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => setShowQRScanner(false)}
                                            className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-xl font-semibold"
                                        >
                                            Cancel
                                        </motion.button>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Loading Overlay */}
                <AnimatePresence>
                    {loading && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center"
                        >
                            <div className="bg-white rounded-2xl p-8 shadow-2xl">
                                <div className="flex items-center gap-3">
                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
                                    <span className="text-lg font-semibold text-gray-800">
                                        Processing...
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default SellerDashboard;
