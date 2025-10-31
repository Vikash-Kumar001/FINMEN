import api from '../utils/api';

export const csrFinancialService = {
  // Payment Management
  createPayment: async (paymentData) => {
    try {
      const response = await api.post('/api/csr-financial/payments', paymentData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getPayments: async (filters = {}) => {
    try {
      const params = new URLSearchParams(filters);
      const response = await api.get(`/api/csr-financial/payments?${params}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getPaymentById: async (paymentId) => {
    try {
      const response = await api.get(`/api/csr-financial/payments/${paymentId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  updatePaymentStatus: async (paymentId, status, notes) => {
    try {
      const response = await api.put(`/api/csr-financial/payments/${paymentId}/status`, {
        status,
        notes
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  approvePayment: async (paymentId, action, notes) => {
    try {
      const response = await api.post(`/api/csr-financial/payments/${paymentId}/approve`, {
        action,
        notes
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  processPayment: async (paymentId, gatewayResponse, processingNotes) => {
    try {
      const response = await api.post(`/api/csr-financial/payments/${paymentId}/process`, {
        gatewayResponse,
        processingNotes
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Financial Tracking
  getSpendLedger: async (filters = {}) => {
    try {
      const params = new URLSearchParams(filters);
      const response = await api.get(`/api/csr-financial/spend-ledger?${params}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getFinancialSummary: async (filters = {}) => {
    try {
      const params = new URLSearchParams(filters);
      const response = await api.get(`/api/csr-financial/financial-summary?${params}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Invoice Management
  getInvoices: async (filters = {}) => {
    try {
      const params = new URLSearchParams(filters);
      const response = await api.get(`/api/csr-financial/invoices?${params}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getInvoiceById: async (invoiceId) => {
    try {
      const response = await api.get(`/api/csr-financial/invoices/${invoiceId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  generateInvoice: async (paymentId, invoiceData = {}) => {
    try {
      const response = await api.post(`/api/csr-financial/invoices/generate/${paymentId}`, invoiceData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  sendInvoice: async (invoiceId, deliveryData = {}) => {
    try {
      const response = await api.post(`/api/csr-financial/invoices/${invoiceId}/send`, deliveryData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  recordPayment: async (invoiceId, paymentData) => {
    try {
      const response = await api.post(`/api/csr-financial/invoices/${invoiceId}/payment`, paymentData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getInvoiceAnalytics: async (filters = {}) => {
    try {
      const params = new URLSearchParams(filters);
      const response = await api.get(`/api/csr-financial/invoices/analytics?${params}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  downloadInvoicePDF: async (invoiceId) => {
    try {
      const response = await api.get(`/api/csr-financial/invoices/${invoiceId}/download`, {
        responseType: 'blob'
      });
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice-${invoiceId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      return { success: true, message: 'Download started' };
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // HealCoins Management
  fundHealCoins: async (amount, description) => {
    try {
      const response = await api.post('/api/csr-financial/healcoins/fund', {
        amount,
        description
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getHealCoinsBalance: async () => {
    try {
      const response = await api.get('/api/csr-financial/healcoins/balance');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getHealCoinsTransactions: async (filters = {}) => {
    try {
      const params = new URLSearchParams(filters);
      const response = await api.get(`/api/csr-financial/healcoins/transactions?${params}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Reporting
  exportFinancialReport: async (format = 'csv', filters = {}) => {
    try {
      const params = new URLSearchParams({ format, ...filters });
      const response = await api.get(`/api/csr-financial/export?${params}`, {
        responseType: 'blob'
      });
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `financial-report-${new Date().toISOString().split('T')[0]}.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      return { success: true, message: 'Download started' };
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Analytics
  getPaymentAnalytics: async (filters = {}) => {
    try {
      const params = new URLSearchParams(filters);
      const response = await api.get(`/api/csr-financial/analytics/payments?${params}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getSpendingAnalytics: async (filters = {}) => {
    try {
      const params = new URLSearchParams(filters);
      const response = await api.get(`/api/csr-financial/analytics/spending?${params}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

export default csrFinancialService;
