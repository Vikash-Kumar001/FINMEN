import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Settings, Building2, Users, Shield, Bell, Globe, Save, X, Plus, Edit,
  Trash2, Check, AlertCircle, MapPin, Mail, Phone, User, Lock, Key,
  CheckCircle, Info, Calendar, Zap, Target, Award, FileText
} from 'lucide-react';
import api from '../../utils/api';
import { toast } from 'react-hot-toast';

const SchoolAdminSettings = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('general');
  const [saving, setSaving] = useState(false);
  
  // General Settings
  const [organizationInfo, setOrganizationInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    website: '',
    principalName: ''
  });

  // Campus Management
  const [campuses, setCampuses] = useState([]);
  const [showAddCampusModal, setShowAddCampusModal] = useState(false);
  const [showEditCampusModal, setShowEditCampusModal] = useState(false);
  const [selectedCampus, setSelectedCampus] = useState(null);
  const [campusForm, setCampusForm] = useState({
    name: '',
    code: '',
    location: '',
    contactInfo: { email: '', phone: '' },
    principalId: ''
  });

  // Role Management
  const [roles, setRoles] = useState([]);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [roleForm, setRoleForm] = useState({
    roleName: '',
    displayName: '',
    description: '',
    permissions: {}
  });

  // Preferences
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    smsNotifications: false,
    autoApproval: false,
    requireApprovalForLargeScope: true,
    defaultGradingSystem: 'percentage',
    academicYearStart: '04-01',
    timezone: 'Asia/Kolkata'
  });

  useEffect(() => {
    fetchAllSettings();
  }, []);

  const fetchAllSettings = async () => {
    try {
      setLoading(true);
      const [orgRes, campusesRes, rolesRes] = await Promise.all([
        api.get('/api/school/admin/organization-info'),
        api.get('/api/school/admin/campuses'),
        api.get('/api/school/admin/roles')
      ]);

      setOrganizationInfo(orgRes.data.organization || {});
      setCampuses(campusesRes.data.campuses || []);
      setRoles(rolesRes.data.roles || []);
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  // Save Organization Info
  const handleSaveOrganization = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await api.put('/api/school/admin/organization-info', organizationInfo);
      toast.success('Organization settings saved successfully!');
    } catch (error) {
      console.error('Error saving organization:', error);
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  // Add Campus
  const handleAddCampus = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/school/admin/campuses', campusForm);
      toast.success('Campus added successfully!');
      setShowAddCampusModal(false);
      resetCampusForm();
      fetchAllSettings();
    } catch (error) {
      console.error('Error adding campus:', error);
      toast.error(error.response?.data?.message || 'Failed to add campus');
    }
  };

  // Edit Campus
  const handleEditCampus = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/api/school/admin/campuses/${selectedCampus.campusId}`, campusForm);
      toast.success('Campus updated successfully!');
      setShowEditCampusModal(false);
      setSelectedCampus(null);
      resetCampusForm();
      fetchAllSettings();
    } catch (error) {
      console.error('Error updating campus:', error);
      toast.error('Failed to update campus');
    }
  };

  // Delete Campus
  const handleDeleteCampus = async (campusId) => {
    if (!window.confirm('Are you sure you want to delete this campus?')) {
      return;
    }

    try {
      await api.delete(`/api/school/admin/campuses/${campusId}`);
      toast.success('Campus deleted successfully');
      fetchAllSettings();
    } catch (error) {
      console.error('Error deleting campus:', error);
      toast.error('Failed to delete campus');
    }
  };

  const openEditCampus = (campus) => {
    setSelectedCampus(campus);
    setCampusForm({
      name: campus.name,
      code: campus.code || '',
      location: campus.location || '',
      contactInfo: campus.contactInfo || { email: '', phone: '' },
      principalId: campus.principal?._id || ''
    });
    setShowEditCampusModal(true);
  };

  const resetCampusForm = () => {
    setCampusForm({
      name: '',
      code: '',
      location: '',
      contactInfo: { email: '', phone: '' },
      principalId: ''
    });
  };

  // Save Preferences
  const handleSavePreferences = async () => {
    try {
      setSaving(true);
      await api.put('/api/school/admin/preferences', preferences);
      toast.success('Preferences saved successfully!');
    } catch (error) {
      console.error('Error saving preferences:', error);
      toast.error('Failed to save preferences');
    } finally {
      setSaving(false);
    }
  };

  // Create/Update Role
  const handleSaveRole = async (e) => {
    e.preventDefault();
    try {
      if (selectedRole) {
        await api.put(`/api/school/admin/roles/${selectedRole._id}`, roleForm);
        toast.success('Role updated successfully!');
      } else {
        await api.post('/api/school/admin/roles', roleForm);
        toast.success('Role created successfully!');
      }
      setShowRoleModal(false);
      setSelectedRole(null);
      setRoleForm({ roleName: '', displayName: '', description: '', permissions: {} });
      fetchAllSettings();
    } catch (error) {
      console.error('Error saving role:', error);
      toast.error('Failed to save role');
    }
  };

  const openEditRole = (role) => {
    setSelectedRole(role);
    setRoleForm({
      roleName: role.roleName,
      displayName: role.displayName,
      description: role.description,
      permissions: role.permissions || {}
    });
    setShowRoleModal(true);
  };

  // Campus Modal Component
  const CampusModal = ({ isEdit = false }) => (
    <AnimatePresence>
      {(showAddCampusModal || showEditCampusModal) && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => isEdit ? setShowEditCampusModal(false) : setShowAddCampusModal(false)}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
          >
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-6 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-black mb-1">{isEdit ? 'Edit Campus' : 'Add New Campus'}</h2>
                    <p className="text-sm text-white/80">Configure campus details</p>
                  </div>
                  <button
                    onClick={() => isEdit ? setShowEditCampusModal(false) : setShowAddCampusModal(false)}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <form onSubmit={isEdit ? handleEditCampus : handleAddCampus} className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Campus Name *</label>
                    <input
                      type="text"
                      value={campusForm.name}
                      onChange={(e) => setCampusForm({...campusForm, name: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none font-semibold"
                      placeholder="Main Campus"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Campus Code</label>
                    <input
                      type="text"
                      value={campusForm.code}
                      onChange={(e) => setCampusForm({...campusForm, code: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none font-semibold"
                      placeholder="CAMP-001"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-gray-700 mb-2">Location *</label>
                    <input
                      type="text"
                      value={campusForm.location}
                      onChange={(e) => setCampusForm({...campusForm, location: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none font-semibold"
                      placeholder="123 Education Street, City"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Contact Email</label>
                    <input
                      type="email"
                      value={campusForm.contactInfo.email}
                      onChange={(e) => setCampusForm({
                        ...campusForm,
                        contactInfo: {...campusForm.contactInfo, email: e.target.value}
                      })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none font-semibold"
                      placeholder="campus@school.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Contact Phone</label>
                    <input
                      type="tel"
                      value={campusForm.contactInfo.phone}
                      onChange={(e) => setCampusForm({
                        ...campusForm,
                        contactInfo: {...campusForm.contactInfo, phone: e.target.value}
                      })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none font-semibold"
                      placeholder="+91 98765 43210"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => isEdit ? setShowEditCampusModal(false) : setShowAddCampusModal(false)}
                    className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-lg font-bold hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-lg font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <Save className="w-5 h-5" />
                    {isEdit ? 'Update Campus' : 'Add Campus'}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <motion.div
          animate={{ rotate: 360, scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="w-20 h-20 border-4 border-purple-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 pb-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl font-black mb-2 flex items-center gap-3">
              <Settings className="w-10 h-10" />
              School Settings
            </h1>
            <p className="text-lg text-white/90">Manage your school configuration and preferences</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-8">
        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-2 mb-6 flex gap-2 flex-wrap"
        >
          <button
            onClick={() => setActiveTab('general')}
            className={`flex-1 min-w-[120px] py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'general'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Building2 className="w-4 h-4" />
            General
          </button>
          <button
            onClick={() => setActiveTab('campuses')}
            className={`flex-1 min-w-[120px] py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'campuses'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <MapPin className="w-4 h-4" />
            Campuses
          </button>
          <button
            onClick={() => setActiveTab('roles')}
            className={`flex-1 min-w-[120px] py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'roles'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Shield className="w-4 h-4" />
            Roles
          </button>
          <button
            onClick={() => setActiveTab('preferences')}
            className={`flex-1 min-w-[120px] py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'preferences'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Zap className="w-4 h-4" />
            Preferences
          </button>
        </motion.div>

        {/* General Tab */}
        {activeTab === 'general' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Building2 className="w-6 h-6 text-purple-600" />
              Organization Information
            </h2>

            <form onSubmit={handleSaveOrganization} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">School Name *</label>
                  <input
                    type="text"
                    value={organizationInfo.name || ''}
                    onChange={(e) => setOrganizationInfo({...organizationInfo, name: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none font-semibold"
                    placeholder="Enter school name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Email *</label>
                  <input
                    type="email"
                    value={organizationInfo.email || ''}
                    onChange={(e) => setOrganizationInfo({...organizationInfo, email: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none font-semibold"
                    placeholder="school@example.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    value={organizationInfo.phone || ''}
                    onChange={(e) => setOrganizationInfo({...organizationInfo, phone: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none font-semibold"
                    placeholder="+91 98765 43210"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Website</label>
                  <input
                    type="url"
                    value={organizationInfo.website || ''}
                    onChange={(e) => setOrganizationInfo({...organizationInfo, website: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none font-semibold"
                    placeholder="https://www.school.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Principal Name</label>
                  <input
                    type="text"
                    value={organizationInfo.principalName || ''}
                    onChange={(e) => setOrganizationInfo({...organizationInfo, principalName: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none font-semibold"
                    placeholder="Dr. John Smith"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Address</label>
                  <textarea
                    value={organizationInfo.address || ''}
                    onChange={(e) => setOrganizationInfo({...organizationInfo, address: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none font-semibold resize-none"
                    rows="3"
                    placeholder="Enter full address"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-bold hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  <Save className="w-5 h-5" />
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Campuses Tab */}
        {activeTab === 'campuses' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <MapPin className="w-6 h-6 text-purple-600" />
                Campus Management
              </h2>
              <button
                onClick={() => setShowAddCampusModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
              >
                <Plus className="w-4 h-4" />
                Add Campus
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {campuses.map((campus, idx) => (
                <motion.div
                  key={campus.campusId || idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6 hover:shadow-xl hover:border-purple-300 transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">{campus.name}</h3>
                      {campus.isMain && (
                        <span className="inline-block px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-bold mt-1">
                          Main Campus
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span className="line-clamp-1">{campus.location || 'No location'}</span>
                    </div>
                    {campus.contactInfo?.email && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail className="w-4 h-4" />
                        <span className="line-clamp-1">{campus.contactInfo.email}</span>
                      </div>
                    )}
                    {campus.contactInfo?.phone && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone className="w-4 h-4" />
                        <span>{campus.contactInfo.phone}</span>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <div className="text-center p-2 rounded-lg bg-blue-50">
                      <p className="text-xs text-gray-600">Students</p>
                      <p className="text-lg font-black text-blue-600">{campus.studentCount || 0}</p>
                    </div>
                    <div className="text-center p-2 rounded-lg bg-green-50">
                      <p className="text-xs text-gray-600">Teachers</p>
                      <p className="text-lg font-black text-green-600">{campus.teacherCount || 0}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditCampus(campus)}
                      className="flex-1 py-2 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-lg font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>
                    {!campus.isMain && (
                      <button
                        onClick={() => handleDeleteCampus(campus.campusId)}
                        className="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-lg font-bold hover:shadow-lg transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}

              {campuses.length === 0 && (
                <div className="md:col-span-2 lg:col-span-3 bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-12 text-center">
                  <MapPin className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">No Campuses Yet</h3>
                  <p className="text-gray-600 mb-6">Add your first campus to get started</p>
                  <button
                    onClick={() => setShowAddCampusModal(true)}
                    className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all flex items-center gap-2 mx-auto"
                  >
                    <Plus className="w-5 h-5" />
                    Add Campus
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Roles Tab */}
        {activeTab === 'roles' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Shield className="w-6 h-6 text-purple-600" />
                Role Permissions
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {roles.map((role, idx) => (
                <motion.div
                  key={role._id || idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border-2 border-gray-200 hover:border-purple-300 transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">{role.displayName || role.roleName}</h3>
                      <p className="text-sm text-gray-600 capitalize">{role.roleType || 'custom'}</p>
                    </div>
                    <Shield className="w-6 h-6 text-purple-600" />
                  </div>

                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{role.description || 'No description'}</p>

                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-gray-700 uppercase">Key Permissions:</h4>
                    <div className="flex flex-wrap gap-1">
                      {Object.entries(role.permissions || {}).slice(0, 4).map(([key, value]) => (
                        value && (
                          <span key={key} className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-semibold">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </span>
                        )
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}

              {roles.length === 0 && (
                <div className="md:col-span-2 lg:col-span-3 text-center py-12">
                  <Shield className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600">No custom roles defined</p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Preferences Tab */}
        {activeTab === 'preferences' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Zap className="w-6 h-6 text-purple-600" />
              System Preferences
            </h2>

            <div className="space-y-6">
              {/* Notifications */}
              <div>
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Bell className="w-5 h-5 text-purple-600" />
                  Notifications
                </h3>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-purple-500 transition-colors">
                    <input
                      type="checkbox"
                      checked={preferences.emailNotifications}
                      onChange={(e) => setPreferences({...preferences, emailNotifications: e.target.checked})}
                      className="w-5 h-5"
                    />
                    <div>
                      <p className="font-bold text-gray-900">Email Notifications</p>
                      <p className="text-xs text-gray-600">Receive updates via email</p>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-purple-500 transition-colors">
                    <input
                      type="checkbox"
                      checked={preferences.smsNotifications}
                      onChange={(e) => setPreferences({...preferences, smsNotifications: e.target.checked})}
                      className="w-5 h-5"
                    />
                    <div>
                      <p className="font-bold text-gray-900">SMS Notifications</p>
                      <p className="text-xs text-gray-600">Receive alerts via SMS</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Approval Settings */}
              <div>
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-purple-600" />
                  Approval Settings
                </h3>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-purple-500 transition-colors">
                    <input
                      type="checkbox"
                      checked={preferences.requireApprovalForLargeScope}
                      onChange={(e) => setPreferences({...preferences, requireApprovalForLargeScope: e.target.checked})}
                      className="w-5 h-5"
                    />
                    <div>
                      <p className="font-bold text-gray-900">Require Approval for Large Scope</p>
                      <p className="text-xs text-gray-600">School-wide or multi-campus assignments need approval</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Academic Settings */}
              <div>
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-purple-600" />
                  Academic Settings
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Default Grading System</label>
                    <select
                      value={preferences.defaultGradingSystem}
                      onChange={(e) => setPreferences({...preferences, defaultGradingSystem: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none bg-white font-semibold"
                    >
                      <option value="percentage">Percentage (0-100)</option>
                      <option value="grade">Letter Grade (A-F)</option>
                      <option value="gpa">GPA (0.0-4.0)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Timezone</label>
                    <select
                      value={preferences.timezone}
                      onChange={(e) => setPreferences({...preferences, timezone: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none bg-white font-semibold"
                    >
                      <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                      <option value="America/New_York">America/New_York (EST)</option>
                      <option value="Europe/London">Europe/London (GMT)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-gray-200">
                <button
                  onClick={handleSavePreferences}
                  disabled={saving}
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-bold hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  <Save className="w-5 h-5" />
                  {saving ? 'Saving...' : 'Save Preferences'}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Modals */}
      <CampusModal isEdit={false} />
      <CampusModal isEdit={true} />
    </div>
  );
};

export default SchoolAdminSettings;
