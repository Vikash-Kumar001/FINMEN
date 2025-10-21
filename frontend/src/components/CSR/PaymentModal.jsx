import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, DollarSign, CreditCard, Upload, Calendar, AlertCircle,
  CheckCircle, Clock, Banknote, Coins, Target, Building
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import csrFinancialService from '../../services/csrFinancialService';

const PaymentModal = ({ isOpen, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [paymentData, setPaymentData] = useState({
    paymentType: 'per_campaign',
    campaignId: '',
    amount: '',
    currency: 'INR',
    healCoinsAmount: '',
    paymentMethod: 'bank_transfer',
    budgetCategory: 'campaign_funding',
    paymentSchedule: 'immediate',
    scheduledDate: '',
    description: '',
    supportingDocuments: []
  });

  const paymentTypes = [
    { value: 'per_campaign', label: 'Per Campaign Payment', icon: Target },
    { value: 'healcoins_pool', label: 'HealCoins Pool Funding', icon: Coins },
    { value: 'subscription', label: 'Subscription Payment', icon: Calendar },
    { value: 'one_time', label: 'One-time Payment', icon: Banknote }
  ];

  const budgetCategories = [
    { value: 'campaign_funding', label: 'Campaign Funding' },
    { value: 'healcoins_pool', label: 'HealCoins Pool' },
    { value: 'platform_fees', label: 'Platform Fees' },
    { value: 'admin_costs', label: 'Admin Costs' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'infrastructure', label: 'Infrastructure' }
  ];

  const paymentMethods = [
    { value: 'bank_transfer', label: 'Bank Transfer' },
    { value: 'upi', label: 'UPI' },
    { value: 'credit_card', label: 'Credit Card' },
    { value: 'debit_card', label: 'Debit Card' },
    { value: 'net_banking', label: 'Net Banking' },
    { value: 'wallet', label: 'Wallet' }
  ];

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await csrFinancialService.createPayment(paymentData);
      toast.success('Payment created successfully!');
      onSuccess();
      onClose();
    } catch (error) {
      toast.error('Failed to create payment');
      console.error('Error creating payment:', error);
    } finally {
      setLoading(false);
    }
  };

  const updatePaymentData = (updates) => {
    setPaymentData(prev => ({ ...prev, ...updates }));
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <PaymentTypeStep data={paymentData} updateData={updatePaymentData} paymentTypes={paymentTypes} />;
      case 2:
        return <PaymentDetailsStep data={paymentData} updateData={updatePaymentData} budgetCategories={budgetCategories} />;
      case 3:
        return <PaymentMethodStep data={paymentData} updateData={updatePaymentData} paymentMethods={paymentMethods} />;
      case 4:
        return <PaymentReviewStep data={paymentData} onSubmit={handleSubmit} loading={loading} />;
      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Create Payment</h2>
              <p className="text-gray-600">Step {currentStep} of 4</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              {[1, 2, 3, 4].map((step) => (
                <div key={step} className="flex items-center">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                    step <= currentStep ? 'bg-purple-500 border-purple-500 text-white' : 'border-gray-300 text-gray-400'
                  }`}>
                    {step < currentStep ? <CheckCircle className="w-5 h-5" /> : step}
                  </div>
                  {step < 4 && (
                    <div className={`w-12 h-0.5 mx-4 ${
                      step < currentStep ? 'bg-purple-500' : 'bg-gray-300'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {renderStepContent()}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-gray-200">
            <button
              onClick={() => currentStep > 1 && setCurrentStep(currentStep - 1)}
              disabled={currentStep === 1}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>

              {currentStep < 4 ? (
                <button
                  onClick={() => setCurrentStep(currentStep + 1)}
                  className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Creating...' : 'Create Payment'}
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

// Step 1: Payment Type
const PaymentTypeStep = ({ data, updateData, paymentTypes }) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Select Payment Type</h3>
        <p className="text-gray-600 mb-6">Choose the type of payment you want to make.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {paymentTypes.map((type) => {
          const Icon = type.icon;
          return (
            <div
              key={type.value}
              onClick={() => updateData({ paymentType: type.value })}
              className={`p-6 border-2 rounded-lg cursor-pointer transition-all ${
                data.paymentType === type.value ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-lg ${
                  data.paymentType === type.value ? 'bg-purple-100' : 'bg-gray-100'
                }`}>
                  <Icon className={`w-6 h-6 ${
                    data.paymentType === type.value ? 'text-purple-600' : 'text-gray-600'
                  }`} />
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">{type.label}</h4>
                  <p className="text-sm text-gray-600">
                    {type.value === 'per_campaign' && 'Pay for specific campaign'}
                    {type.value === 'healcoins_pool' && 'Fund HealCoins pool'}
                    {type.value === 'subscription' && 'Monthly/annual subscription'}
                    {type.value === 'one_time' && 'One-time payment'}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Step 2: Payment Details
const PaymentDetailsStep = ({ data, updateData, budgetCategories }) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Payment Details</h3>
        <p className="text-gray-600 mb-6">Enter the payment amount and details.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Amount (₹)</label>
            <input
              type="number"
              value={data.amount}
              onChange={(e) => updateData({ amount: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Enter amount"
            />
          </div>

          {data.paymentType === 'healcoins_pool' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">HealCoins Amount</label>
              <input
                type="number"
                value={data.healCoinsAmount}
                onChange={(e) => updateData({ healCoinsAmount: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter HealCoins amount"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Budget Category</label>
            <select
              value={data.budgetCategory}
              onChange={(e) => updateData({ budgetCategory: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              {budgetCategories.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={data.description}
              onChange={(e) => updateData({ description: e.target.value })}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Enter payment description"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Payment Schedule</label>
            <select
              value={data.paymentSchedule}
              onChange={(e) => updateData({ paymentSchedule: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="immediate">Immediate</option>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>

          {data.paymentSchedule !== 'immediate' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Scheduled Date</label>
              <input
                type="date"
                value={data.scheduledDate}
                onChange={(e) => updateData({ scheduledDate: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Step 3: Payment Method
const PaymentMethodStep = ({ data, updateData, paymentMethods }) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Payment Method</h3>
        <p className="text-gray-600 mb-6">Select your preferred payment method.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {paymentMethods.map((method) => (
          <div
            key={method.value}
            onClick={() => updateData({ paymentMethod: method.value })}
            className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
              data.paymentMethod === method.value ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-3">
              <CreditCard className={`w-5 h-5 ${
                data.paymentMethod === method.value ? 'text-purple-600' : 'text-gray-600'
              }`} />
              <span className="font-medium text-gray-800">{method.label}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-blue-50 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-800 mb-1">Payment Processing</h4>
            <p className="text-sm text-blue-700">
              Payments are processed securely through our payment gateway. 
              You will receive a confirmation email once the payment is processed.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Step 4: Review and Submit
const PaymentReviewStep = ({ data, onSubmit, loading }) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Review Payment</h3>
        <p className="text-gray-600 mb-6">Please review your payment details before submitting.</p>
      </div>

      <div className="bg-gray-50 rounded-lg p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-600">Payment Type</label>
            <p className="text-gray-800 capitalize">{data.paymentType.replace('_', ' ')}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Amount</label>
            <p className="text-gray-800">₹{data.amount}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Budget Category</label>
            <p className="text-gray-800 capitalize">{data.budgetCategory.replace('_', ' ')}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Payment Method</label>
            <p className="text-gray-800 capitalize">{data.paymentMethod.replace('_', ' ')}</p>
          </div>
          {data.healCoinsAmount && (
            <div>
              <label className="text-sm font-medium text-gray-600">HealCoins Amount</label>
              <p className="text-gray-800">{data.healCoinsAmount}</p>
            </div>
          )}
          <div>
            <label className="text-sm font-medium text-gray-600">Schedule</label>
            <p className="text-gray-800 capitalize">{data.paymentSchedule}</p>
          </div>
        </div>

        {data.description && (
          <div>
            <label className="text-sm font-medium text-gray-600">Description</label>
            <p className="text-gray-800">{data.description}</p>
          </div>
        )}
      </div>

      <div className="bg-green-50 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-green-800 mb-1">Ready to Submit</h4>
            <p className="text-sm text-green-700">
              Your payment will be processed and you'll receive a confirmation email. 
              The payment will be reflected in your spend ledger.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
