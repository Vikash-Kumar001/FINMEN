import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Check, X } from 'lucide-react';
import api from '../../utils/api';
import { toast } from 'react-hot-toast';

const SchoolAdminBilling = () => {
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState(null);

  useEffect(() => {
    fetchBillingData();
  }, []);

  const fetchBillingData = async () => {
    try {
      setLoading(true);
      const subRes = await api.get('/api/school/admin/subscription/enhanced');
      setSubscription(subRes.data);
    } catch (error) {
      console.error('Error fetching billing:', error);
      toast.error('Failed to load billing data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <motion.div animate={{ rotate: 360, scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }} className="w-20 h-20 border-4 border-purple-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  const { enhancedDetails } = subscription || {};

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 pb-12">
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white py-8 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl font-black mb-2 flex items-center gap-3">
              <CreditCard className="w-10 h-10" />
              Billing & Subscription
            </h1>
            <p className="text-lg text-white/90">{enhancedDetails?.planName} • {enhancedDetails?.daysRemaining} days remaining</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6">
            <p className="text-sm text-gray-600 mb-1">Plan Status</p>
            <p className="text-3xl font-black text-indigo-600 capitalize">{enhancedDetails?.status}</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6">
            <p className="text-sm text-gray-600 mb-1">Active Students</p>
            <p className="text-3xl font-black text-green-600">{enhancedDetails?.activeStudentCount || 0}</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6">
            <p className="text-sm text-gray-600 mb-1">Next Billing</p>
            <p className="text-lg font-black text-gray-900">{enhancedDetails?.nextBillingDate ? new Date(enhancedDetails.nextBillingDate).toLocaleDateString() : 'N/A'}</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6">
            <p className="text-sm text-gray-600 mb-1">Premium Templates</p>
            <p className="text-3xl font-black text-purple-600">{enhancedDetails?.availablePremiumTemplates || 0}</p>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl shadow-xl p-8 text-white mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-black mb-2">{enhancedDetails?.planName}</h2>
              <p className="text-2xl font-bold">{enhancedDetails?.price > 0 ? `₹${enhancedDetails.price.toLocaleString()}` : 'Free'} {enhancedDetails?.billingCycle && `/ ${enhancedDetails.billingCycle}`}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(enhancedDetails?.features || {}).slice(0, 4).map(([feature, enabled]) => (
              <div key={feature} className="flex items-center gap-2">
                {enabled ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                <span className="text-sm font-semibold">{feature.replace(/([A-Z])/g, ' $1').trim()}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {enhancedDetails?.invoices?.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">Invoice History</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <tr>
                    <th className="text-left py-4 px-6 text-sm font-bold text-gray-700">Invoice ID</th>
                    <th className="text-left py-4 px-6 text-sm font-bold text-gray-700">Amount</th>
                    <th className="text-left py-4 px-6 text-sm font-bold text-gray-700">Date</th>
                    <th className="text-left py-4 px-6 text-sm font-bold text-gray-700">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {enhancedDetails.invoices.slice().reverse().map((invoice, idx) => (
                    <tr key={idx} className="border-b border-gray-100 hover:bg-purple-50 transition-colors">
                      <td className="py-4 px-6 text-sm font-mono font-bold">{invoice.invoiceId}</td>
                      <td className="py-4 px-6 text-sm font-black text-gray-900">₹{invoice.amount.toLocaleString()}</td>
                      <td className="py-4 px-6 text-sm text-gray-600">{invoice.paidAt ? new Date(invoice.paidAt).toLocaleDateString() : 'Pending'}</td>
                      <td className="py-4 px-6">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${invoice.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{invoice.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SchoolAdminBilling;
