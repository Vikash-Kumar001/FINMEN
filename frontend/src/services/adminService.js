import api from '../utils/api';

/**
 * Admin Service - API calls for admin dashboard
 */

export const fetchAdminDashboard = async () => {
  try {
    const response = await api.get('/api/admin/dashboard');
    return response.data;
  } catch (error) {
    console.error('Error fetching admin dashboard:', error);
    throw error;
  }
};

export const fetchSchoolsByRegion = async () => {
  try {
    const response = await api.get('/api/admin/schools-by-region');
    return response.data;
  } catch (error) {
    console.error('Error fetching schools by region:', error);
    throw error;
  }
};

export const fetchStudentActiveRate = async () => {
  try {
    const response = await api.get('/api/admin/student-active-rate');
    return response.data;
  } catch (error) {
    console.error('Error fetching student active rate:', error);
    throw error;
  }
};

export const fetchPillarPerformance = async (region = null) => {
  try {
    const params = region ? { region } : {};
    const response = await api.get('/api/admin/pillar-performance', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching pillar performance:', error);
    throw error;
  }
};

export const fetchPlatformHealth = async () => {
  try {
    const response = await api.get('/api/admin/platform-health');
    return response.data;
  } catch (error) {
    console.error('Error fetching platform health:', error);
    throw error;
  }
};

export const fetchPrivacyCompliance = async () => {
  try {
    const response = await api.get('/api/admin/privacy-compliance');
    return response.data;
  } catch (error) {
    console.error('Error fetching privacy compliance:', error);
    throw error;
  }
};

export const fetchNetworkMap = async () => {
  try {
    const response = await api.get('/api/admin/network-map');
    return response.data;
  } catch (error) {
    console.error('Error fetching network map:', error);
    throw error;
  }
};

export const fetchBenchmarksPanel = async () => {
  try {
    const response = await api.get('/api/admin/benchmarks-panel');
    return response.data;
  } catch (error) {
    console.error('Error fetching benchmarks panel:', error);
    throw error;
  }
};

export const fetchPlatformTelemetry = async () => {
  try {
    const response = await api.get('/api/admin/platform-telemetry');
    return response.data;
  } catch (error) {
    console.error('Error fetching platform telemetry:', error);
    throw error;
  }
};

export const fetchMarketplaceManagement = async () => {
  try {
    const response = await api.get('/api/admin/marketplace');
    return response.data;
  } catch (error) {
    console.error('Error fetching marketplace:', error);
    throw error;
  }
};

export const fetchDataExportSandbox = async () => {
  try {
    const response = await api.get('/api/admin/data-export');
    return response.data;
  } catch (error) {
    console.error('Error fetching data export sandbox:', error);
    throw error;
  }
};

export const fetchPolicyLegal = async () => {
  try {
    const response = await api.get('/api/admin/policy-legal');
    return response.data;
  } catch (error) {
    console.error('Error fetching policy legal:', error);
    throw error;
  }
};

export const fetchSchoolOnboarding = async () => {
  try {
    const response = await api.get('/api/admin/school-onboarding');
    return response.data;
  } catch (error) {
    console.error('Error fetching school onboarding:', error);
    throw error;
  }
};

export const createTenant = async (tenantData) => {
  try {
    const response = await api.post('/api/admin/create-tenant', tenantData);
    return response.data;
  } catch (error) {
    console.error('Error creating tenant:', error);
    throw error;
  }
};

export const fetchMarketplaceGovernance = async () => {
  try {
    const response = await api.get('/api/admin/marketplace-governance');
    return response.data;
  } catch (error) {
    console.error('Error fetching marketplace governance:', error);
    throw error;
  }
};

export const approveModule = async (moduleData) => {
  try {
    const response = await api.post('/api/admin/approve-module', moduleData);
    return response.data;
  } catch (error) {
    console.error('Error approving module:', error);
    throw error;
  }
};

export const fetchResearchSandbox = async () => {
  try {
    const response = await api.get('/api/admin/research-sandbox');
    return response.data;
  } catch (error) {
    console.error('Error fetching research sandbox:', error);
    throw error;
  }
};

export const createResearchAgreement = async (agreementData) => {
  try {
    const response = await api.post('/api/admin/create-research-agreement', agreementData);
    return response.data;
  } catch (error) {
    console.error('Error creating research agreement:', error);
    throw error;
  }
};

export const fetchComplianceDashboard = async () => {
  try {
    const response = await api.get('/api/admin/compliance-dashboard');
    return response.data;
  } catch (error) {
    console.error('Error fetching compliance dashboard:', error);
    throw error;
  }
};

export const processDeletionRequest = async (requestData) => {
  try {
    const response = await api.post('/api/admin/process-deletion', requestData);
    return response.data;
  } catch (error) {
    console.error('Error processing deletion request:', error);
    throw error;
  }
};

export default {
  fetchAdminDashboard,
  fetchSchoolsByRegion,
  fetchStudentActiveRate,
  fetchPillarPerformance,
  fetchPlatformHealth,
  fetchPrivacyCompliance,
  fetchNetworkMap,
  fetchBenchmarksPanel,
  fetchPlatformTelemetry,
  fetchMarketplaceManagement,
  fetchDataExportSandbox,
  fetchPolicyLegal,
  fetchSchoolOnboarding,
  createTenant,
  fetchMarketplaceGovernance,
  approveModule,
  fetchResearchSandbox,
  createResearchAgreement,
  fetchComplianceDashboard,
  processDeletionRequest
};

