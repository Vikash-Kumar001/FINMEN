import api from '../utils/api';

export const sellerService = {
  // Product Management
  getProducts: async (filters = {}) => {
    try {
      const params = new URLSearchParams(filters);
      const response = await api.get(`/api/seller/products?${params}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  createProduct: async (productData) => {
    try {
      const response = await api.post('/api/seller/products', productData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  updateProduct: async (productId, productData) => {
    try {
      const response = await api.put(`/api/seller/products/${productId}`, productData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  deleteProduct: async (productId) => {
    try {
      const response = await api.delete(`/api/seller/products/${productId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Voucher Management
  getVouchers: async (filters = {}) => {
    try {
      const params = new URLSearchParams(filters);
      const response = await api.get(`/api/seller/vouchers?${params}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  updateVoucherStatus: async (voucherId, status, additionalData = {}) => {
    try {
      const response = await api.put(`/api/seller/vouchers/${voucherId}`, {
        status,
        ...additionalData
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  approveVoucher: async (voucherId, voucherCode) => {
    return sellerService.updateVoucherStatus(voucherId, 'approved', { voucherCode });
  },

  rejectVoucher: async (voucherId, rejectionReason) => {
    return sellerService.updateVoucherStatus(voucherId, 'rejected', { rejectionReason });
  },

  // Analytics
  getAnalytics: async (period = 'month') => {
    try {
      const response = await api.get(`/api/seller/analytics?period=${period}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Commission Tracking
  getCommissionData: async () => {
    try {
      const response = await api.get('/api/seller/commission');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Export data
  exportData: async (format = 'csv', dataType = 'products') => {
    try {
      const response = await api.get(`/api/seller/export?format=${format}&type=${dataType}`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

export default sellerService;