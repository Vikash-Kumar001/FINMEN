import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Plus, Trash2, Edit2, DollarSign, CreditCard, 
  Calendar, Filter, Download, TrendingUp, TrendingDown, AlertCircle,
  CheckCircle2, Info, Clock, Wallet, Target, Lightbulb, 
  History, X, Check, BarChart3, PieChart, AlertTriangle, TrendingUp as TrendingUpIcon, FileText
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { logActivity } from '../../services/activityService';
import { toast } from 'react-hot-toast';

const DebtTracker = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [debts, setDebts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingDebtId, setEditingDebtId] = useState(null);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'debts', 'payments', 'strategies'
  const [autoSaveTimer, setAutoSaveTimer] = useState(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [selectedDebt, setSelectedDebt] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);

  const [newDebt, setNewDebt] = useState({
    name: '',
    type: 'Credit Card',
    originalAmount: '',
    currentBalance: '',
    interestRate: '',
    minimumPayment: '',
    dueDate: '',
    startDate: new Date().toISOString().split('T')[0],
    notes: '',
  });

  // Calculate user age
  const userAge = useMemo(() => {
    if (!user) return null;
    const dob = user.dateOfBirth || user.dob;
    if (!dob) return null;
    
    const dobDate = typeof dob === 'string' ? new Date(dob) : new Date(dob);
    if (isNaN(dobDate.getTime())) return null;
    
    const today = new Date();
    let age = today.getFullYear() - dobDate.getFullYear();
    const monthDiff = today.getMonth() - dobDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dobDate.getDate())) {
      age--;
    }
    
    return age;
  }, [user]);

  // Determine age group
  const ageGroup = useMemo(() => {
    if (userAge === null) return 'adults';
    if (userAge < 13) return 'kids';
    if (userAge < 18) return 'teens';
    return 'adults';
  }, [userAge]);

  // Age-appropriate configuration
  const config = useMemo(() => {
    if (ageGroup === 'kids') {
      return {
        debtTypes: ['Allowance Owed', 'Lunch Money', 'Other'],
        minAmount: 0,
        maxAmount: 100,
        theme: 'fun',
        language: 'simple',
        showAdvanced: false,
      };
    } else if (ageGroup === 'teens') {
      return {
        debtTypes: ['Credit Card', 'Student Loan', 'Personal Loan', 'Other'],
        minAmount: 0,
        maxAmount: 10000,
        theme: 'modern',
        language: 'balanced',
        showAdvanced: true,
      };
    } else {
      return {
        debtTypes: ['Credit Card', 'Personal Loan', 'Auto Loan', 'Student Loan', 'Mortgage', 'Medical Debt', 'Other'],
        minAmount: 0,
        maxAmount: 1000000,
        theme: 'professional',
        language: 'detailed',
        showAdvanced: true,
      };
    }
  }, [ageGroup]);

  // Load data on mount
  useEffect(() => {
    const loadDebtData = async () => {
      try {
        setLoading(true);
        // Load from localStorage as fallback
        const savedDebts = localStorage.getItem('debts');
        
        if (savedDebts) {
          setDebts(JSON.parse(savedDebts));
        }

        logActivity({
          activityType: 'page_view',
          description: 'Viewed debt tracker',
          metadata: {
            page: '/student/finance/debt-tracker',
            ageGroup,
            timestamp: new Date().toISOString(),
          },
          pageUrl: window.location.pathname,
        });
      } catch (error) {
        console.error('Error loading debt data:', error);
        toast.error('Failed to load debt data');
      } finally {
        setLoading(false);
      }
    };

    loadDebtData();
  }, [ageGroup]);

  // Auto-save functionality
  useEffect(() => {
    if (hasUnsavedChanges) {
      if (autoSaveTimer) {
        clearTimeout(autoSaveTimer);
      }

      const timer = setTimeout(() => {
        localStorage.setItem('debts', JSON.stringify(debts));
        setHasUnsavedChanges(false);
        toast.success('Debt data saved! 💾', { duration: 2000, position: 'bottom-center' });
      }, 2000);

      setAutoSaveTimer(timer);
    }

    return () => {
      if (autoSaveTimer) {
        clearTimeout(autoSaveTimer);
      }
    };
  }, [debts, hasUnsavedChanges, autoSaveTimer]);

  // Calculate debt statistics
  const debtStats = useMemo(() => {
    const totalDebt = debts.reduce((sum, debt) => sum + (parseFloat(debt.currentBalance) || 0), 0);
    const originalTotal = debts.reduce((sum, debt) => sum + (parseFloat(debt.originalAmount) || 0), 0);
    const totalPaid = originalTotal - totalDebt;
    const totalMinimumPayments = debts.reduce((sum, debt) => sum + (parseFloat(debt.minimumPayment) || 0), 0);
    const totalInterest = debts.reduce((sum, debt) => {
      const interest = (parseFloat(debt.currentBalance) || 0) * (parseFloat(debt.interestRate) || 0) / 100 / 12;
      return sum + interest;
    }, 0);
    const debtsCount = debts.length;
    const paidOffCount = debts.filter(debt => (parseFloat(debt.currentBalance) || 0) <= 0).length;

    // Calculate average interest rate
    const avgInterestRate = debts.length > 0
      ? debts.reduce((sum, debt) => sum + (parseFloat(debt.interestRate) || 0), 0) / debts.length
      : 0;

    // Calculate estimated payoff time (simplified)
    const estimatedPayoffMonths = totalDebt > 0 && totalMinimumPayments > 0
      ? Math.ceil(totalDebt / totalMinimumPayments)
      : 0;

    return {
      totalDebt,
      originalTotal,
      totalPaid,
      totalMinimumPayments,
      totalInterest,
      debtsCount,
      paidOffCount,
      avgInterestRate,
      estimatedPayoffMonths,
      progressPercentage: originalTotal > 0 ? (totalPaid / originalTotal) * 100 : 0,
    };
  }, [debts]);

  // Handle add/edit debt
  const handleSaveDebt = () => {
    if (!newDebt.name || !newDebt.originalAmount) {
      toast.error('Please fill in all required fields');
      return;
    }

    const debtData = {
      _id: editingDebtId || `debt_${Date.now()}`,
      ...newDebt,
      originalAmount: parseFloat(newDebt.originalAmount),
      currentBalance: parseFloat(newDebt.currentBalance) || parseFloat(newDebt.originalAmount),
      interestRate: parseFloat(newDebt.interestRate) || 0,
      minimumPayment: parseFloat(newDebt.minimumPayment) || 0,
      payments: editingDebtId ? debts.find(d => d._id === editingDebtId)?.payments || [] : [],
      createdAt: editingDebtId ? debts.find(d => d._id === editingDebtId)?.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (editingDebtId) {
      setDebts(debts.map(debt => debt._id === editingDebtId ? debtData : debt));
      toast.success('Debt updated successfully!');
    } else {
      setDebts([...debts, debtData]);
      toast.success('Debt added successfully!');
    }

    resetForm();
    setHasUnsavedChanges(true);
  };

  const handleEditDebt = (debt) => {
    setEditingDebtId(debt._id);
    setNewDebt({
      name: debt.name,
      type: debt.type,
      originalAmount: debt.originalAmount.toString(),
      currentBalance: debt.currentBalance.toString(),
      interestRate: debt.interestRate?.toString() || '',
      minimumPayment: debt.minimumPayment?.toString() || '',
      dueDate: debt.dueDate || '',
      startDate: debt.startDate || new Date().toISOString().split('T')[0],
      notes: debt.notes || '',
    });
    setShowAddForm(true);
  };

  const handleDeleteDebt = (id) => {
    if (window.confirm('Are you sure you want to delete this debt?')) {
      setDebts(debts.filter(debt => debt._id !== id));
      toast.success('Debt deleted successfully');
      setHasUnsavedChanges(true);
    }
  };

  const handleMakePayment = () => {
    if (!selectedDebt || !paymentAmount || parseFloat(paymentAmount) <= 0) {
      toast.error('Please enter a valid payment amount');
      return;
    }

    const payment = parseFloat(paymentAmount);
    const updatedDebts = debts.map(debt => {
      if (debt._id === selectedDebt._id) {
        const newBalance = Math.max(0, (parseFloat(debt.currentBalance) || 0) - payment);
        const paymentRecord = {
          amount: payment,
          date: paymentDate,
          previousBalance: parseFloat(debt.currentBalance) || 0,
          newBalance,
        };
        return {
          ...debt,
          currentBalance: newBalance,
          payments: [...(debt.payments || []), paymentRecord],
          updatedAt: new Date().toISOString(),
        };
      }
      return debt;
    });

    setDebts(updatedDebts);
    setShowPaymentModal(false);
    setPaymentAmount('');
    setSelectedDebt(null);
    toast.success(`Payment of $${payment.toLocaleString()} recorded! 💰`);
    setHasUnsavedChanges(true);
  };

  const openPaymentModal = (debt) => {
    setSelectedDebt(debt);
    setPaymentAmount(debt.minimumPayment?.toString() || '');
    setShowPaymentModal(true);
  };

  const resetForm = () => {
    setNewDebt({
      name: '',
      type: 'Credit Card',
      originalAmount: '',
      currentBalance: '',
      interestRate: '',
      minimumPayment: '',
      dueDate: '',
      startDate: new Date().toISOString().split('T')[0],
      notes: '',
    });
    setEditingDebtId(null);
    setShowAddForm(false);
  };

  const getDebtTypeColor = (type) => {
    const colors = {
      'Credit Card': 'bg-red-100 text-red-700',
      'Personal Loan': 'bg-blue-100 text-blue-700',
      'Auto Loan': 'bg-green-100 text-green-700',
      'Student Loan': 'bg-purple-100 text-purple-700',
      'Mortgage': 'bg-orange-100 text-orange-700',
      'Medical Debt': 'bg-pink-100 text-pink-700',
      'Other': 'bg-gray-100 text-gray-700',
    };
    return colors[type] || colors['Other'];
  };

  const calculatePayoffTime = (debt) => {
    if (!debt.currentBalance || !debt.minimumPayment || debt.minimumPayment <= 0) return null;
    const balance = parseFloat(debt.currentBalance);
    const monthlyPayment = parseFloat(debt.minimumPayment);
    const interestRate = parseFloat(debt.interestRate) || 0;
    
    if (interestRate === 0) {
      return Math.ceil(balance / monthlyPayment);
    }
    
    // Simplified calculation (doesn't account for compound interest perfectly)
    let months = 0;
    let remaining = balance;
    while (remaining > 0 && months < 600) { // Max 50 years
      const interest = remaining * (interestRate / 100 / 12);
      remaining = remaining + interest - monthlyPayment;
      months++;
      if (remaining >= balance) return null; // Will never pay off
    }
    return months <= 600 ? months : null;
  };

  if (loading) {
    return (
      <div className={`min-h-screen bg-gradient-to-br ${
        ageGroup === 'kids' ? 'from-pink-50 via-yellow-50 to-purple-50' :
        ageGroup === 'teens' ? 'from-blue-50 via-cyan-50 to-indigo-50' :
        'from-gray-50 via-white to-slate-50'
      } flex items-center justify-center`}>
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className={`w-16 h-16 border-4 ${
              ageGroup === 'kids' ? 'border-pink-500' :
              ageGroup === 'teens' ? 'border-blue-500' :
              'border-orange-500'
            } border-t-transparent rounded-full mx-auto mb-4`}
          />
          <p className="text-gray-600">Loading your debt information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${
      ageGroup === 'kids' ? 'from-pink-50 via-yellow-50 to-purple-50' :
      ageGroup === 'teens' ? 'from-blue-50 via-cyan-50 to-indigo-50' :
      'from-gray-50 via-white to-slate-50'
    } p-4 sm:p-6 lg:p-8`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/student/dashboard/financial-literacy')}
            className="flex items-center text-orange-600 hover:text-orange-800 transition-colors mb-4 group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Financial Literacy
          </button>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className={`text-3xl sm:text-4xl lg:text-5xl font-black mb-2 ${
                ageGroup === 'kids' ? 'bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent leading-tight' :
                ageGroup === 'teens' ? 'bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent leading-tight' :
                'text-gray-900'
              }`}>
                {ageGroup === 'kids' && '📊 '}
                Debt Tracker
                {ageGroup === 'kids' && ' 📊'}
              </h1>
              <p className={`text-lg ${
                ageGroup === 'kids' ? 'text-purple-600' :
                ageGroup === 'teens' ? 'text-blue-600' :
                'text-gray-600'
              }`}>
                {ageGroup === 'kids' && "Track what you owe in a fun way! 🎯"}
                {ageGroup === 'teens' && "Track and manage your debts to build financial freedom"}
                {ageGroup === 'adults' && "Track, manage, and pay off your debts strategically"}
              </p>
            </div>
            
            {hasUnsavedChanges && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-2 text-sm text-gray-600 bg-white px-4 py-2 rounded-full shadow-md"
              >
                <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
                Auto-saving...
              </motion.div>
            )}
          </div>
        </div>

        {/* Statistics Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-red-500"
          >
            <div className="p-3 rounded-xl bg-red-100 mb-2">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <p className="text-sm text-gray-500 mb-1">Total Debt</p>
            <p className="text-3xl font-black text-gray-800">
              ${debtStats.totalDebt.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <p className="text-xs text-gray-400 mt-1">{debtStats.debtsCount} account{debtStats.debtsCount !== 1 ? 's' : ''}</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-green-500"
          >
            <div className="p-3 rounded-xl bg-green-100 mb-2">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
            </div>
            <p className="text-sm text-gray-500 mb-1">Total Paid</p>
            <p className="text-3xl font-black text-gray-800">
              ${debtStats.totalPaid.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {debtStats.progressPercentage.toFixed(1)}% paid off
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-orange-500"
          >
            <div className="p-3 rounded-xl bg-orange-100 mb-2">
              <Calendar className="w-6 h-6 text-orange-600" />
            </div>
            <p className="text-sm text-gray-500 mb-1">Monthly Payments</p>
            <p className="text-3xl font-black text-gray-800">
              ${debtStats.totalMinimumPayments.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <p className="text-xs text-gray-400 mt-1">Minimum payments due</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-purple-500"
          >
            <div className="p-3 rounded-xl bg-purple-100 mb-2">
              <Clock className="w-6 h-6 text-purple-600" />
            </div>
            <p className="text-sm text-gray-500 mb-1">Est. Payoff Time</p>
            <p className="text-3xl font-black text-gray-800">
              {debtStats.estimatedPayoffMonths > 0 
                ? debtStats.estimatedPayoffMonths < 12
                  ? `${debtStats.estimatedPayoffMonths} mo`
                  : `${Math.floor(debtStats.estimatedPayoffMonths / 12)} yr`
                : 'N/A'}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {debtStats.paidOffCount > 0 ? `${debtStats.paidOffCount} paid off! 🎉` : 'Keep going!'}
            </p>
          </motion.div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg mb-6"
        >
          <div className="flex border-b border-gray-200 overflow-x-auto">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-6 py-4 font-black text-sm transition-all ${
                activeTab === 'overview'
                  ? ageGroup === 'kids'
                    ? 'text-pink-600 border-b-4 border-pink-600'
                    : ageGroup === 'teens'
                    ? 'text-blue-600 border-b-4 border-blue-600'
                    : 'text-orange-600 border-b-4 border-orange-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <BarChart3 className="w-5 h-5 inline mr-2" />
              Overview
            </button>
            <button
              onClick={() => setActiveTab('debts')}
              className={`px-6 py-4 font-black text-sm transition-all ${
                activeTab === 'debts'
                  ? ageGroup === 'kids'
                    ? 'text-pink-600 border-b-4 border-pink-600'
                    : ageGroup === 'teens'
                    ? 'text-blue-600 border-b-4 border-blue-600'
                    : 'text-orange-600 border-b-4 border-orange-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <FileText className="w-5 h-5 inline mr-2" />
              Debts
            </button>
            {config.showAdvanced && (
              <button
                onClick={() => setActiveTab('strategies')}
                className={`px-6 py-4 font-black text-sm transition-all ${
                  activeTab === 'strategies'
                    ? ageGroup === 'kids'
                      ? 'text-pink-600 border-b-4 border-pink-600'
                      : ageGroup === 'teens'
                      ? 'text-blue-600 border-b-4 border-blue-600'
                      : 'text-orange-600 border-b-4 border-orange-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Lightbulb className="w-5 h-5 inline mr-2" />
                Strategies
              </button>
            )}
          </div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="p-6"
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Debt Progress */}
                  <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-6 border-2 border-orange-200">
                    <h3 className="text-lg font-black text-gray-800 mb-4 flex items-center gap-2">
                      <Target className="w-5 h-5 text-orange-600" />
                      Debt Payoff Progress
                    </h3>
                    <div className="relative">
                      <div className="w-full h-64 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-6xl font-black mb-2 text-orange-600">
                            {debtStats.progressPercentage.toFixed(1)}%
                          </div>
                          <p className="text-gray-600 text-sm mb-4">
                            {debtStats.totalPaid > 0 
                              ? `You've paid $${debtStats.totalPaid.toLocaleString()}! 🎉` 
                              : 'Start making payments to see progress'}
                          </p>
                          <div className="w-full bg-gray-200 rounded-full h-4">
                            <div
                              className="bg-gradient-to-r from-orange-500 to-red-500 h-4 rounded-full"
                              style={{ width: `${Math.min(100, debtStats.progressPercentage)}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Debt Breakdown */}
                  <div className="bg-white rounded-xl p-6 border-2 border-gray-200">
                    <h3 className="text-lg font-black text-gray-800 mb-4 flex items-center gap-2">
                      <PieChart className="w-5 h-5 text-orange-600" />
                      Debt Breakdown
                    </h3>
                    {debts.length > 0 ? (
                      <div className="space-y-4">
                        {debts.map((debt) => {
                          const percentage = debtStats.totalDebt > 0 
                            ? ((parseFloat(debt.currentBalance) || 0) / debtStats.totalDebt) * 100 
                            : 0;
                          return (
                            <div key={debt._id}>
                              <div className="flex justify-between mb-1">
                                <span className="text-sm font-bold text-gray-700">{debt.name}</span>
                                <span className="text-sm font-black text-gray-800">
                                  ${(parseFloat(debt.currentBalance) || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-orange-500 h-2 rounded-full"
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm text-center py-8">No debts to display</p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'debts' && (
              <motion.div
                key="debts"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="p-6"
              >
                {/* Add Debt Button */}
                <div className="mb-6">
                  <button
                    onClick={() => {
                      resetForm();
                      setShowAddForm(!showAddForm);
                    }}
                    className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all ${
                      showAddForm
                        ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        : ageGroup === 'kids'
                        ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:from-pink-600 hover:to-purple-600 shadow-lg'
                        : ageGroup === 'teens'
                        ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600 shadow-lg'
                        : 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600 shadow-lg'
                    }`}
                  >
                    {showAddForm ? (
                      <>
                        <X className="w-5 h-5" />
                        Cancel
                      </>
                    ) : (
                      <>
                        <Plus className="w-5 h-5" />
                        {ageGroup === 'kids' ? 'Add Debt 📊' : 'Add Debt'}
                      </>
                    )}
                  </button>
                </div>

                {/* Add/Edit Form */}
                <AnimatePresence>
                  {showAddForm && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mb-8 overflow-hidden"
                    >
                      <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-orange-200">
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                          {editingDebtId ? (
                            <>
                              <Edit2 className="w-6 h-6 text-orange-600" />
                              Edit Debt
                            </>
                          ) : (
                            <>
                              <Plus className="w-6 h-6 text-orange-600" />
                              Add New Debt
                            </>
                          )}
                        </h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                              Debt Name <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              className="w-full p-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                              placeholder={ageGroup === 'kids' ? "e.g., Lunch Money 🍕" : "e.g., Chase Credit Card"}
                              value={newDebt.name}
                              onChange={(e) => setNewDebt({ ...newDebt, name: e.target.value })}
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                              Debt Type <span className="text-red-500">*</span>
                            </label>
                            <select
                              className="w-full p-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                              value={newDebt.type}
                              onChange={(e) => setNewDebt({ ...newDebt, type: e.target.value })}
                            >
                              {config.debtTypes.map(type => (
                                <option key={type} value={type}>{type}</option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                              Original Amount <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                              <input
                                type="number"
                                className="w-full pl-10 pr-3 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                                placeholder="0.00"
                                value={newDebt.originalAmount}
                                onChange={(e) => setNewDebt({ ...newDebt, originalAmount: e.target.value })}
                                min={config.minAmount}
                                max={config.maxAmount}
                                step="0.01"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                              Current Balance
                            </label>
                            <div className="relative">
                              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                              <input
                                type="number"
                                className="w-full pl-10 pr-3 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                                placeholder="0.00"
                                value={newDebt.currentBalance}
                                onChange={(e) => setNewDebt({ ...newDebt, currentBalance: e.target.value })}
                                min="0"
                                step="0.01"
                              />
                            </div>
                          </div>

                          {config.showAdvanced && (
                            <>
                              <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                  Interest Rate (%)
                                </label>
                                <input
                                  type="number"
                                  className="w-full p-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                                  placeholder="0.00"
                                  value={newDebt.interestRate}
                                  onChange={(e) => setNewDebt({ ...newDebt, interestRate: e.target.value })}
                                  min="0"
                                  max="100"
                                  step="0.01"
                                />
                              </div>

                              <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                  Minimum Payment
                                </label>
                                <div className="relative">
                                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                  <input
                                    type="number"
                                    className="w-full pl-10 pr-3 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                                    placeholder="0.00"
                                    value={newDebt.minimumPayment}
                                    onChange={(e) => setNewDebt({ ...newDebt, minimumPayment: e.target.value })}
                                    min="0"
                                    step="0.01"
                                  />
                                </div>
                              </div>

                              <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                  Payment Due Date
                                </label>
                                <input
                                  type="date"
                                  className="w-full p-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                                  value={newDebt.dueDate}
                                  onChange={(e) => setNewDebt({ ...newDebt, dueDate: e.target.value })}
                                />
                              </div>

                              <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                  Start Date
                                </label>
                                <input
                                  type="date"
                                  className="w-full p-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                                  value={newDebt.startDate}
                                  onChange={(e) => setNewDebt({ ...newDebt, startDate: e.target.value })}
                                />
                              </div>

                              <div className="md:col-span-2">
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                  Notes (optional)
                                </label>
                                <textarea
                                  className="w-full p-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                                  placeholder="Additional details..."
                                  rows="3"
                                  value={newDebt.notes}
                                  onChange={(e) => setNewDebt({ ...newDebt, notes: e.target.value })}
                                />
                              </div>
                            </>
                          )}
                        </div>

                        <div className="mt-6 flex justify-end gap-3">
                          <button
                            onClick={resetForm}
                            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300 transition-all"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleSaveDebt}
                            className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg ${
                              ageGroup === 'kids'
                                ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:from-pink-600 hover:to-purple-600'
                                : ageGroup === 'teens'
                                ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600'
                                : 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600'
                            }`}
                          >
                            <Check className="w-5 h-5" />
                            {editingDebtId ? 'Update Debt' : 'Save Debt'}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Debts List */}
                {debts.length > 0 ? (
                  <div className="space-y-4">
                    {debts.map((debt, index) => {
                      const currentBalance = parseFloat(debt.currentBalance) || 0;
                      const originalAmount = parseFloat(debt.originalAmount) || 0;
                      const paidAmount = originalAmount - currentBalance;
                      const progress = originalAmount > 0 ? (paidAmount / originalAmount) * 100 : 0;
                      const isPaidOff = currentBalance <= 0;
                      const payoffTime = calculatePayoffTime(debt);
                      
                      return (
                        <motion.div
                          key={debt._id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className={`bg-white border-2 rounded-xl p-6 transition-all ${
                            isPaidOff ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-orange-300'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <h3 className="text-2xl font-black text-gray-800">{debt.name}</h3>
                              <div className="flex items-center gap-2 mt-1">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${getDebtTypeColor(debt.type)}`}>
                                  {debt.type}
                                </span>
                                {isPaidOff && (
                                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
                                    Paid Off! 🎉
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="flex gap-2">
                              {!isPaidOff && (
                                <button
                                  onClick={() => openPaymentModal(debt)}
                                  className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${
                                    ageGroup === 'kids'
                                      ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white'
                                      : ageGroup === 'teens'
                                      ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                                      : 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
                                  }`}
                                >
                                  Make Payment
                                </button>
                              )}
                              <button
                                onClick={() => handleEditDebt(debt)}
                                className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all"
                                title="Edit debt"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteDebt(debt._id)}
                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                title="Delete debt"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Original Amount</p>
                              <p className="font-black text-gray-800">
                                ${originalAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Current Balance</p>
                              <p className={`font-black ${isPaidOff ? 'text-green-600' : 'text-red-600'}`}>
                                ${currentBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Amount Paid</p>
                              <p className="font-black text-green-600">
                                ${paidAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Progress</p>
                              <p className="font-black text-gray-800">
                                {progress.toFixed(1)}%
                              </p>
                            </div>
                          </div>

                          <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                            <div
                              className={`h-3 rounded-full ${
                                isPaidOff ? 'bg-green-500' : 'bg-gradient-to-r from-orange-500 to-red-500'
                              }`}
                              style={{ width: `${Math.min(100, progress)}%` }}
                            />
                          </div>

                          {config.showAdvanced && (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              {debt.interestRate > 0 && (
                                <div>
                                  <p className="text-xs text-gray-500 mb-1">Interest Rate</p>
                                  <p className="font-bold text-gray-800">{debt.interestRate}%</p>
                                </div>
                              )}
                              {debt.minimumPayment > 0 && (
                                <div>
                                  <p className="text-xs text-gray-500 mb-1">Min. Payment</p>
                                  <p className="font-bold text-gray-800">
                                    ${debt.minimumPayment.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                  </p>
                                </div>
                              )}
                              {payoffTime && (
                                <div>
                                  <p className="text-xs text-gray-500 mb-1">Payoff Time</p>
                                  <p className="font-bold text-gray-800">
                                    {payoffTime < 12 ? `${payoffTime} months` : `${Math.floor(payoffTime / 12)} years`}
                                  </p>
                                </div>
                              )}
                              {debt.dueDate && (
                                <div>
                                  <p className="text-xs text-gray-500 mb-1">Due Date</p>
                                  <p className="font-bold text-gray-800">
                                    {new Date(debt.dueDate).toLocaleDateString()}
                                  </p>
                                </div>
                              )}
                            </div>
                          )}

                          {debt.payments && debt.payments.length > 0 && (
                            <div className="mt-4 pt-4 border-t border-gray-200">
                              <p className="text-xs text-gray-500 mb-2">Recent Payments</p>
                              <div className="space-y-1">
                                {debt.payments.slice(-3).reverse().map((payment, idx) => (
                                  <div key={idx} className="flex justify-between text-xs">
                                    <span className="text-gray-600">
                                      {new Date(payment.date).toLocaleDateString()}
                                    </span>
                                    <span className="font-bold text-green-600">
                                      -${payment.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </motion.div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-white border-2 border-dashed border-gray-300 rounded-xl">
                    <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-2xl font-black text-gray-800 mb-2">No Debts Tracked Yet</h3>
                    <p className="text-gray-600 mb-6">
                      {ageGroup === 'kids' 
                        ? "Add your first debt to start learning about managing money! 🚀"
                        : "Add your first debt to start tracking and managing it!"}
                    </p>
                    <button
                      onClick={() => setShowAddForm(true)}
                      className={`px-8 py-4 rounded-xl font-black text-lg inline-flex items-center gap-2 ${
                        ageGroup === 'kids'
                          ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white'
                          : ageGroup === 'teens'
                          ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                          : 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
                      }`}
                    >
                      <Plus className="w-6 h-6" />
                      Add Debt
                    </button>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'strategies' && config.showAdvanced && (
              <motion.div
                key="strategies"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="p-6"
              >
                <div className={`rounded-2xl shadow-lg overflow-hidden ${
                  ageGroup === 'kids' 
                    ? 'bg-gradient-to-br from-pink-100 to-purple-100 border-2 border-pink-200' :
                    ageGroup === 'teens'
                    ? 'bg-gradient-to-br from-blue-100 to-cyan-100 border-2 border-blue-200'
                    : 'bg-gradient-to-br from-orange-100 to-red-100 border-2 border-orange-200'
                }`}>
                  <div className="p-6">
                    <h3 className="font-black text-gray-800 mb-4 flex items-center gap-2 text-xl">
                      <Lightbulb className={`w-6 h-6 ${
                        ageGroup === 'kids' ? 'text-pink-600' :
                        ageGroup === 'teens' ? 'text-blue-600' :
                        'text-orange-600'
                      }`} />
                      Debt Payoff Strategies
                    </h3>
                    <ul className="space-y-3 text-sm text-gray-700">
                      {ageGroup === 'teens' ? (
                        <>
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                            <span><strong>Snowball Method:</strong> Pay off smallest debts first for quick wins and motivation</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                            <span><strong>Avalanche Method:</strong> Pay off highest interest rate debts first to save money</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                            <span><strong>Pay more than minimum:</strong> Even small extra payments can save significant interest</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                            <span><strong>Consolidate if possible:</strong> Combine multiple debts into one lower-rate loan</span>
                          </li>
                        </>
                      ) : (
                        <>
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                            <span><strong>Debt Snowball Method:</strong> Pay minimums on all debts, then put extra money toward the smallest debt. Once paid off, roll that payment to the next smallest. This provides psychological wins and momentum.</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                            <span><strong>Debt Avalanche Method:</strong> Pay minimums on all debts, then put extra money toward the debt with the highest interest rate. This saves the most money in interest over time.</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                            <span><strong>Pay More Than Minimum:</strong> Always pay more than the minimum payment when possible. Even an extra $50-100 per month can significantly reduce payoff time and interest paid.</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                            <span><strong>Debt Consolidation:</strong> Consider consolidating multiple high-interest debts into a single lower-interest loan. This simplifies payments and can reduce total interest.</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                            <span><strong>Balance Transfer:</strong> Transfer high-interest credit card debt to a card with 0% introductory APR. Make sure to pay it off before the promotional period ends.</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                            <span><strong>Create a Budget:</strong> Track your income and expenses to find extra money for debt payments. Cut unnecessary expenses and redirect that money to debt payoff.</span>
                          </li>
                        </>
                      )}
                    </ul>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Payment Modal */}
      <AnimatePresence>
        {showPaymentModal && selectedDebt && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowPaymentModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full border-2 border-orange-200 relative overflow-hidden"
            >
              <div className={`bg-gradient-to-r ${
                ageGroup === 'kids' ? 'from-pink-500 to-purple-500' :
                ageGroup === 'teens' ? 'from-blue-500 to-cyan-500' :
                'from-orange-500 to-red-500'
              } px-6 py-4 flex items-center justify-between`}>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-full">
                    <DollarSign className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Make Payment</h3>
                </div>
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="p-1 hover:bg-white/20 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
              <div className="p-6">
                <div className="mb-4">
                  <p className="text-sm text-gray-500 mb-1">Debt</p>
                  <p className="text-lg font-black text-gray-800">{selectedDebt.name}</p>
                  <p className="text-sm text-gray-600">Current Balance: ${(parseFloat(selectedDebt.currentBalance) || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Payment Amount <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="number"
                      className="w-full pl-10 pr-3 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="0.00"
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(e.target.value)}
                      min="0"
                      max={parseFloat(selectedDebt.currentBalance) || 0}
                      step="0.01"
                      autoFocus
                    />
                  </div>
                  {selectedDebt.minimumPayment > 0 && (
                    <p className="text-xs text-gray-500 mt-1">
                      Minimum payment: ${selectedDebt.minimumPayment.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  )}
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Payment Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    className="w-full p-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    value={paymentDate}
                    onChange={(e) => setPaymentDate(e.target.value)}
                    max={new Date().toISOString().split('T')[0]}
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowPaymentModal(false)}
                    className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleMakePayment}
                    className={`flex-1 px-4 py-3 rounded-xl font-bold transition-all shadow-lg ${
                      ageGroup === 'kids'
                        ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:from-pink-600 hover:to-purple-600'
                        : ageGroup === 'teens'
                        ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600'
                        : 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600'
                    }`}
                  >
                    Record Payment
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DebtTracker;

