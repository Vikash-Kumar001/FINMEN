import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Search,
  Plus,
  Eye,
  Trash2,
  Filter,
  Grid,
  List,
  TrendingUp,
  Zap,
  Coins,
  Heart,
  Brain,
  Star,
  Activity,
  BookOpen,
  Trophy,
  AlertTriangle,
  X,
} from "lucide-react";
import api from "../../utils/api";
import { toast } from "react-hot-toast";
import { useSocket } from "../../context/SocketContext";

const loadRazorpay = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(window.Razorpay);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => {
      resolve(window.Razorpay);
    };
    script.onerror = () => {
      resolve(null);
    };
    document.body.appendChild(script);
  });
};

const ParentChildren = () => {
  const navigate = useNavigate();
  const { socket } = useSocket();
  const [loading, setLoading] = useState(true);
  const [children, setChildren] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [parentProfile, setParentProfile] = useState(null);
  const [showAddChildModal, setShowAddChildModal] = useState(false);
  const [modalView, setModalView] = useState("link"); // "link" or "create"
  const [childLinkingCode, setChildLinkingCode] = useState("");
  const [addingChild, setAddingChild] = useState(false);
  const [paymentData, setPaymentData] = useState(null);
  
  // Create child form state
  const [childFormData, setChildFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    dateOfBirth: "",
    gender: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [creatingChild, setCreatingChild] = useState(false);

  useEffect(() => {
    fetchChildren();
  }, []);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (showAddChildModal) {
      // Save current overflow style
      const originalOverflow = document.body.style.overflow;
      // Prevent scrolling
      document.body.style.overflow = 'hidden';
      
      return () => {
        // Restore original overflow style when modal closes
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [showAddChildModal]);

  // Listen for real-time child creation updates
  useEffect(() => {
    if (!socket) return;

    const handleChildCreated = (data) => {
      console.log('Child created event received:', data);
      fetchChildren();
      toast.success(`Child ${data.childName} has been added!`);
    };

    socket.on('child_created', handleChildCreated);

    return () => {
      socket.off('child_created', handleChildCreated);
    };
  }, [socket]);

  const fetchChildren = async () => {
    try {
      setLoading(true);
      const [childrenRes, profileRes] = await Promise.all([
        api.get("/api/parent/children"),
        api.get("/api/user/profile").catch(() => ({ data: null }))
      ]);
      setChildren(childrenRes.data.children || []);
      setParentProfile(profileRes.data);
    } catch (error) {
      console.error("Error fetching children:", error);
      toast.error("Failed to load children");
    } finally {
      setLoading(false);
    }
  };

  const initializeRazorpayPayment = async (orderId, keyId, amount, childId) => {
    try {
      const Razorpay = await loadRazorpay();
      if (!Razorpay) {
        throw new Error("Payment gateway not available right now.");
      }

      const options = {
        key: keyId,
        amount: amount * 100, // Convert to paise
        currency: "INR",
        name: "Wise Student",
        description: "Link Child Account - Premium Plan",
        order_id: orderId,
        handler: async (response) => {
          try {
            // Verify and confirm payment
            const confirmResponse = await api.post("/api/parent/link-child/confirm-payment", {
              childId,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id,
              razorpaySignature: response.razorpay_signature,
            });

            if (confirmResponse.data.success) {
              toast.success(confirmResponse.data.message || "Child linked successfully!");
              setShowAddChildModal(false);
              setChildLinkingCode("");
              setPaymentData(null);
              fetchChildren();
            } else {
              toast.error(confirmResponse.data.message || "Payment verification failed");
            }
          } catch (error) {
            console.error("Payment confirmation error:", error);
            toast.error(error.response?.data?.message || "Failed to confirm payment");
          } finally {
            setAddingChild(false);
          }
        },
        prefill: {
          name: parentProfile?.name || "",
          email: parentProfile?.email || "",
        },
        theme: {
          color: "#6366f1",
        },
        modal: {
          ondismiss: () => {
            setAddingChild(false);
            setPaymentData(null);
          },
        },
      };

      const razorpayInstance = new Razorpay(options);
      razorpayInstance.on("payment.failed", (response) => {
        console.error("Payment failed:", response);
        toast.error(`Payment failed: ${response.error.description || "Unknown error"}`);
        setAddingChild(false);
        setPaymentData(null);
      });

      razorpayInstance.open();
    } catch (error) {
      console.error("Razorpay initialization error:", error);
      toast.error("Failed to initialize payment gateway");
      setAddingChild(false);
      setPaymentData(null);
    }
  };

  const handleAddChild = async () => {
    if (!childLinkingCode.trim()) {
      toast.error("Please enter child's secret linking code");
      return;
    }

    try {
      setAddingChild(true);
      const response = await api.post("/api/parent/link-child", {
        childLinkingCode: childLinkingCode.trim().toUpperCase(),
      });

      // Check if payment is required
      if (response.data?.requiresPayment) {
        setPaymentData({
          orderId: response.data.orderId,
          keyId: response.data.keyId,
          amount: response.data.amount,
          childId: response.data.childId,
          childName: response.data.childName,
          childPlanType: response.data.childPlanType,
        });
        
        // Initialize Razorpay payment
        await initializeRazorpayPayment(
          response.data.orderId,
          response.data.keyId,
          response.data.amount,
          response.data.childId
        );
        return;
      }

      // No payment required - child linked directly
      if (response.data?.success) {
        toast.success(response.data.message || "Child linked successfully!");
        setShowAddChildModal(false);
        setChildLinkingCode("");
        fetchChildren();
      }
    } catch (error) {
      console.error("Error linking child:", error);
      toast.error(error.response?.data?.message || "Failed to link child");
    } finally {
      setAddingChild(false);
    }
  };

  const handleCreateChild = async (e) => {
    e.preventDefault();
    
    if (childFormData.password !== childFormData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (childFormData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      setCreatingChild(true);
      const response = await api.post("/api/parent/create-child", {
        fullName: childFormData.fullName.trim(),
        email: childFormData.email.trim(),
        password: childFormData.password,
        dateOfBirth: childFormData.dateOfBirth,
        gender: childFormData.gender,
      });

      // Check if payment is required
      if (response.data?.requiresPayment) {
        // Initialize Razorpay payment
        await initializeRazorpayPaymentForChildCreation(
          response.data.orderId,
          response.data.keyId,
          response.data.amount,
          response.data.childCreationIntentId
        );
        return;
      }

      if (response.data.success) {
        toast.success(response.data.message || "Child account created successfully!");
        setShowAddChildModal(false);
        setModalView("link");
        setChildFormData({
          fullName: "",
          email: "",
          password: "",
          confirmPassword: "",
          dateOfBirth: "",
          gender: "",
        });
        fetchChildren();
      }
    } catch (error) {
      console.error("Error creating child:", error);
      toast.error(error.response?.data?.message || "Failed to create child account");
    } finally {
      setCreatingChild(false);
    }
  };

  const initializeRazorpayPaymentForChildCreation = async (orderId, keyId, amount, childCreationIntentId) => {
    try {
      const Razorpay = await loadRazorpay();
      if (!Razorpay) {
        throw new Error("Payment gateway not available right now.");
      }

      const options = {
        key: keyId,
        amount: amount * 100, // Convert to paise
        currency: "INR",
        name: "Wise Student",
        description: "Create Child Account - Student + Parent Premium Pro Plan",
        order_id: orderId,
        handler: async (response) => {
          try {
            // Verify and confirm payment
            const confirmResponse = await api.post("/api/parent/create-child/confirm-payment", {
              childCreationIntentId,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id,
              razorpaySignature: response.razorpay_signature,
            });

            if (confirmResponse.data.success) {
              toast.success(confirmResponse.data.message || "Child account created successfully!");
              setShowAddChildModal(false);
              setModalView("link");
              setChildFormData({
                fullName: "",
                email: "",
                password: "",
                confirmPassword: "",
                dateOfBirth: "",
                gender: "",
              });
              fetchChildren();
            } else {
              toast.error(confirmResponse.data.message || "Payment verification failed");
            }
          } catch (error) {
            console.error("Payment confirmation error:", error);
            toast.error(error.response?.data?.message || "Failed to confirm payment");
          } finally {
            setCreatingChild(false);
          }
        },
        prefill: {
          name: parentProfile?.name || "",
          email: parentProfile?.email || "",
        },
        theme: {
          color: "#6366f1",
        },
        modal: {
          ondismiss: () => {
            setCreatingChild(false);
          },
        },
      };

      const razorpayInstance = new Razorpay(options);
      razorpayInstance.on("payment.failed", (response) => {
        console.error("Payment failed:", response);
        toast.error(`Payment failed: ${response.error.description || "Unknown error"}`);
        setCreatingChild(false);
      });

      razorpayInstance.open();
    } catch (error) {
      console.error("Razorpay initialization error:", error);
      toast.error("Failed to initialize payment gateway");
      setCreatingChild(false);
    }
  };

  const handleRemoveChild = async (childId, childName) => {
    if (!window.confirm(`Are you sure you want to unlink ${childName}?`)) {
      return;
    }

    try {
      const response = await api.delete(`/api/parent/child/${childId}/unlink`);
      toast.success(response.data?.message || "Child unlinked successfully");
      fetchChildren();
    } catch (error) {
      console.error("Error unlinking child:", error);
      const errorMessage = error.response?.data?.message || "Failed to unlink child";
      toast.error(errorMessage);
    }
  };

  const filteredChildren = children.filter((child) =>
    child.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
        <motion.div
          animate={{ rotate: 360, scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-20 h-20 border-4 border-purple-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 pb-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 text-white py-8 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl font-black mb-2 flex items-center gap-3">
              <Users className="w-10 h-10" />
              {parentProfile?.name || "Parent"}'s Children
            </h1>
            <p className="text-lg text-white/90">
              Manage and monitor all your children's accounts
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-4">
        {/* Search and Actions Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6 mb-6"
        >
          <div className="flex flex-wrap items-center gap-4">
            {/* Search */}
            <div className="flex-1 min-w-[250px] relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search children by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all outline-none"
              />
            </div>

            {/* View Mode Toggle */}
            <div className="flex gap-2 bg-gray-100 rounded-xl p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  viewMode === "grid"
                    ? "bg-white text-purple-600 shadow"
                    : "text-gray-600 hover:bg-gray-200"
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  viewMode === "list"
                    ? "bg-white text-purple-600 shadow"
                    : "text-gray-600 hover:bg-gray-200"
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            {/* Add Child Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAddChildModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Link Child
            </motion.button>
          </div>
        </motion.div>

        {/* Children Display */}
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredChildren.map((child, idx) => (
              <motion.div
                key={child._id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-100 hover:border-purple-300 hover:shadow-xl transition-all"
              >
                <div className="flex items-center gap-4 mb-6">
                  <img
                    src={child.avatar || "/avatars/avatar1.png"}
                    alt={child.name}
                    className="w-20 h-20 rounded-full border-4 border-purple-300 shadow-lg"
                  />
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900">
                      {child.name}
                    </h3>
                    <p className="text-sm text-gray-600">{child.grade || "Student"}</p>
                    <p className="text-xs text-gray-500">{child.email}</p>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-blue-50 rounded-lg p-3 text-center">
                    <Zap className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                    <p className="text-xl font-black text-blue-700">
                      {child.level || 1}
                    </p>
                    <p className="text-xs text-blue-600">Level</p>
                  </div>
                  <div className="bg-amber-50 rounded-lg p-3 text-center">
                    <Star className="w-5 h-5 text-amber-600 mx-auto mb-1" />
                    <p className="text-xl font-black text-amber-700">
                      {child.xp || 0}
                    </p>
                    <p className="text-xs text-amber-600">XP</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-3 text-center">
                    <Coins className="w-5 h-5 text-green-600 mx-auto mb-1" />
                    <p className="text-xl font-black text-green-700">
                      {child.healCoins || 0}
                    </p>
                    <p className="text-xs text-green-600">Coins</p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-3 text-center">
                    <Trophy className="w-5 h-5 text-purple-600 mx-auto mb-1" />
                    <p className="text-xl font-black text-purple-700">
                      {child.streak || 0}
                    </p>
                    <p className="text-xs text-purple-600">Streak</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate(`/parent/child/${child._id}/analytics`)}
                    className="flex-1 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    View Progress
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleRemoveChild(child._id, child.name)}
                    className="px-4 py-2.5 bg-red-50 text-red-600 rounded-lg font-semibold hover:bg-red-100 transition-all border-2 border-red-200"
                  >
                    <Trash2 className="w-4 h-4" />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg border-2 border-gray-100 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-purple-500 to-pink-600 text-white">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold">Child</th>
                  <th className="px-6 py-4 text-center font-semibold">Level</th>
                  <th className="px-6 py-4 text-center font-semibold">XP</th>
                  <th className="px-6 py-4 text-center font-semibold">Coins</th>
                  <th className="px-6 py-4 text-center font-semibold">Streak</th>
                  <th className="px-6 py-4 text-center font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredChildren.map((child, idx) => (
                  <motion.tr
                    key={child._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="border-b border-gray-100 hover:bg-purple-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={child.avatar || "/avatars/avatar1.png"}
                          alt={child.name}
                          className="w-12 h-12 rounded-full border-2 border-purple-300"
                        />
                        <div>
                          <p className="font-semibold text-gray-900">{child.name}</p>
                          <p className="text-xs text-gray-500">{child.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="font-bold text-blue-600">
                        {child.level || 1}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="font-bold text-amber-600">
                        {child.xp || 0}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="font-bold text-green-600">
                        {child.healCoins || 0}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="font-bold text-purple-600">
                        {child.streak || 0}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => navigate(`/parent/child/${child._id}/analytics`)}
                          className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all flex items-center gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleRemoveChild(child._id, child.name)}
                          className="px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all border-2 border-red-200"
                        >
                          <Trash2 className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {filteredChildren.length === 0 && (
          <div className="bg-white rounded-xl shadow-lg border-2 border-gray-100 p-12 text-center">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-xl font-bold text-gray-600">No children found</p>
            <p className="text-gray-500 mt-2">
              {searchTerm
                ? "Try adjusting your search"
                : "Link your first child to get started"}
            </p>
          </div>
        )}
      </div>

      {/* Add Child Modal */}
      {showAddChildModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-8 max-w-3xl w-full shadow-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">
                {modalView === "link" ? "Link Child Account" : "Create Child Account"}
              </h3>
              <button
                onClick={() => {
                  setShowAddChildModal(false);
                  setModalView("link");
                  setChildLinkingCode("");
                  setPaymentData(null);
                  setChildFormData({
                    fullName: "",
                    email: "",
                    password: "",
                    confirmPassword: "",
                    dateOfBirth: "",
                    gender: "",
                  });
                }}
                disabled={addingChild || creatingChild}
                className="p-2 hover:bg-gray-100 rounded-lg transition-all disabled:opacity-50"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {modalView === "link" ? (
              <>
                <p className="text-gray-600 mb-4">
                  Enter your child's secret linking code to link their account
                </p>
                {paymentData ? (
                  <div className="mb-6">
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4">
                      <p className="text-sm text-amber-800 font-semibold mb-2">
                        Payment Required
                      </p>
                      <p className="text-sm text-amber-700">
                        {paymentData.childPlanType === 'free' 
                          ? `To link ${paymentData.childName}, you need to upgrade to Student + Parent Premium Pro Plan (₹${paymentData.amount}).`
                          : `To link ${paymentData.childName}, you need to pay ₹${paymentData.amount} for parent dashboard access.`}
                      </p>
                    </div>
                    <p className="text-sm text-gray-600 text-center">
                      Razorpay payment window will open shortly...
                    </p>
                  </div>
                ) : (
                  <>
                    <input
                      type="text"
                      placeholder="e.g. ST-ABC123 or SST-XYZ789"
                      value={childLinkingCode}
                      onChange={(e) => setChildLinkingCode(e.target.value.toUpperCase())}
                      onKeyPress={(e) => e.key === "Enter" && !addingChild && handleAddChild()}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none mb-6 uppercase tracking-wider"
                      disabled={addingChild}
                    />
                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          setShowAddChildModal(false);
                          setChildLinkingCode("");
                          setPaymentData(null);
                        }}
                        disabled={addingChild}
                        className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all disabled:opacity-50"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleAddChild}
                        disabled={addingChild || !childLinkingCode.trim()}
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {addingChild ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            {paymentData ? "Processing Payment..." : "Linking..."}
                          </>
                        ) : (
                          "Link Child"
                        )}
                      </button>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-sm text-center text-gray-600 mb-2">
                        Doesn't have an account?
                      </p>
                      <button
                        onClick={() => setModalView("create")}
                        disabled={addingChild}
                        className="w-full px-4 py-2 text-sm font-semibold text-purple-600 hover:bg-purple-50 rounded-lg transition-all disabled:opacity-50"
                      >
                        Create Child Account
                      </button>
                    </div>
                  </>
                )}
              </>
            ) : (
              <>
                <p className="text-gray-600 mb-6">
                  Create a new account for your child
                </p>
                <form onSubmit={handleCreateChild} className="space-y-4">
                  {/* Full Name and Date of Birth - Side by side */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={childFormData.fullName}
                        onChange={(e) => setChildFormData({ ...childFormData, fullName: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-gray-400 focus:ring-2 focus:ring-gray-200 outline-none"
                        placeholder="Enter child's full name"
                        disabled={creatingChild}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date of Birth *
                      </label>
                      <input
                        type="date"
                        required
                        value={childFormData.dateOfBirth}
                        onChange={(e) => setChildFormData({ ...childFormData, dateOfBirth: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-gray-400 focus:ring-2 focus:ring-gray-200 outline-none"
                        max={new Date().toISOString().split('T')[0]}
                        disabled={creatingChild}
                      />
                    </div>
                  </div>

                  {/* Email and Gender - Side by side */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={childFormData.email}
                        onChange={(e) => setChildFormData({ ...childFormData, email: e.target.value.toLowerCase() })}
                        className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-gray-400 focus:ring-2 focus:ring-gray-200 outline-none"
                        placeholder="Enter child's email"
                        disabled={creatingChild}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Gender *
                      </label>
                      <select
                        required
                        value={childFormData.gender}
                        onChange={(e) => setChildFormData({ ...childFormData, gender: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-gray-400 focus:ring-2 focus:ring-gray-200 outline-none"
                        disabled={creatingChild}
                      >
                        <option value="">Select gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="non_binary">Non-binary</option>
                        <option value="prefer_not_to_say">Prefer not to say</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  {/* Password and Confirm Password - Side by side */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Password *
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          required
                          value={childFormData.password}
                          onChange={(e) => setChildFormData({ ...childFormData, password: e.target.value })}
                          className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-gray-400 focus:ring-2 focus:ring-gray-200 outline-none pr-10"
                          placeholder="Enter password (min 6 characters)"
                          minLength={6}
                          disabled={creatingChild}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 text-sm"
                          disabled={creatingChild}
                        >
                          {showPassword ? "Hide" : "Show"}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Confirm Password *
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          required
                          value={childFormData.confirmPassword}
                          onChange={(e) => setChildFormData({ ...childFormData, confirmPassword: e.target.value })}
                          className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-gray-400 focus:ring-2 focus:ring-gray-200 outline-none pr-10"
                          placeholder="Confirm password"
                          disabled={creatingChild}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 text-sm"
                          disabled={creatingChild}
                        >
                          {showConfirmPassword ? "Hide" : "Show"}
                        </button>
                      </div>
                    </div>
                  </div>

                  {childFormData.password && childFormData.confirmPassword && childFormData.password !== childFormData.confirmPassword && (
                    <p className="text-sm text-red-600">Passwords do not match</p>
                  )}

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setModalView("link");
                        setChildFormData({
                          fullName: "",
                          email: "",
                          password: "",
                          confirmPassword: "",
                          dateOfBirth: "",
                          gender: "",
                        });
                      }}
                      disabled={creatingChild}
                      className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all disabled:opacity-50"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={creatingChild || childFormData.password !== childFormData.confirmPassword || !childFormData.fullName || !childFormData.email || !childFormData.dateOfBirth || !childFormData.gender || childFormData.password.length < 6}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {creatingChild ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Creating...
                        </>
                      ) : (
                        "Create Account"
                      )}
                    </button>
                  </div>
                </form>
              </>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ParentChildren;
