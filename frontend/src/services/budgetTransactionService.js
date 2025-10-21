import api from '../utils/api';

export const budgetTransactionService = {
  // Get budget summary
  getBudgetSummary: async (filters = {}) => {
    try {
      const params = new URLSearchParams(filters);
      const response = await api.get(`/api/budget/budget/summary?${params}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get transactions
  getTransactions: async (filters = {}) => {
    try {
      const params = new URLSearchParams(filters);
      const response = await api.get(`/api/budget/budget/transactions?${params}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Create transaction
  createTransaction: async (transactionData) => {
    try {
      const response = await api.post('/api/budget/budget/transactions', transactionData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update transaction status
  updateTransactionStatus: async (transactionId, status, notes = '') => {
    try {
      const response = await api.put(`/api/budget/budget/transactions/${transactionId}/status`, {
        status,
        notes
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Export transactions
  exportTransactions: async (format = 'csv', filters = {}) => {
    try {
      const params = new URLSearchParams({ format, ...filters });
      const response = await api.get(`/api/budget/budget/transactions/export?${params}`, {
        responseType: 'blob'
      });
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `budget-transactions-${new Date().toISOString().split('T')[0]}.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      return { success: true, message: 'Download started' };
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Fund HealCoins
  fundHealCoins: async (amount, campaignId = null, description = '', notes = '') => {
    try {
      const response = await api.post('/api/budget/budget/healcoins/fund', {
        amount,
        campaignId,
        description,
        notes
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Record HealCoins spend
  recordHealCoinsSpend: async (spendData) => {
    try {
      const response = await api.post('/api/budget/budget/healcoins/spend', spendData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get HealCoins balance
  getHealCoinsBalance: async (filters = {}) => {
    try {
      const params = new URLSearchParams(filters);
      const response = await api.get(`/api/budget/budget/healcoins/balance?${params}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

export default budgetTransactionService;
