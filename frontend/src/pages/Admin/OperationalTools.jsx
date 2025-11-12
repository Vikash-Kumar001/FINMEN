import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Wrench, Calendar, Truck, Package, FileText, Plus, Search, Filter,
  RefreshCw, Eye, Edit, MapPin, Clock, Users, Building, CheckCircle,
  AlertCircle, XCircle, Download, Upload, Settings, Activity, BarChart3,
  TrendingUp, Target, Shield, Globe, Mail, Phone, DollarSign, Award,
  CalendarDays, BookOpen, Laptop, Smartphone, Monitor, Server
} from 'lucide-react';
import api from '../../utils/api';
import { toast } from 'react-hot-toast';
import { useSocket } from '../../context/SocketContext';

const OperationalTools = () => {
  const navigate = useNavigate();
  const socket = useSocket();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('calendar');
  const [stats, setStats] = useState(null);
  const [events, setEvents] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [assets, setAssets] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showVehicleModal, setShowVehicleModal] = useState(false);
  const [showAssetModal, setShowAssetModal] = useState(false);
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    page: 1,
    limit: 20
  });

  const fetchStats = useCallback(async () => {
    try {
      const res = await api.get('/api/admin/operational/stats');
      if (res.data.success) {
        setStats(res.data.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  }, []);

  const fetchEvents = useCallback(async () => {
    try {
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 1);
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 3);
      
      const res = await api.get('/api/admin/operational/calendar', {
        params: {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          ...filters
        }
      });
      if (res.data.success) {
        setEvents(res.data.data.events || []);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      if (error.response?.status !== 404) {
        toast.error('Failed to load calendar events');
      }
    }
  }, [filters]);

  const fetchVehicles = useCallback(async () => {
    try {
      const res = await api.get('/api/admin/operational/transport', { params: filters });
      if (res.data.success) {
        setVehicles(res.data.data.vehicles || []);
      }
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      if (error.response?.status !== 404) {
        toast.error('Failed to load transport vehicles');
      }
    }
  }, [filters]);

  const fetchAssets = useCallback(async () => {
    try {
      const res = await api.get('/api/admin/operational/assets', { params: filters });
      if (res.data.success) {
        setAssets(res.data.data.assets || []);
      }
    } catch (error) {
      console.error('Error fetching assets:', error);
      if (error.response?.status !== 404) {
        toast.error('Failed to load assets');
      }
    }
  }, [filters]);

  const fetchDocuments = useCallback(async () => {
    try {
      const res = await api.get('/api/admin/operational/documents', { params: filters });
      if (res.data.success) {
        setDocuments(res.data.data.documents || []);
      }
    } catch (error) {
      console.error('Error fetching documents:', error);
      if (error.response?.status !== 404) {
        toast.error('Failed to load documents');
      }
    }
  }, [filters]);

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchStats(), fetchEvents(), fetchVehicles(), fetchAssets(), fetchDocuments()])
      .finally(() => setLoading(false));
    
    // Socket.IO listeners
    if (socket?.socket) {
      const handlers = {
        'operational:event:created': () => {
          toast.success('Calendar event created');
          fetchEvents();
          fetchStats();
        },
        'operational:transport:created': () => {
          toast.success('Transport vehicle added');
          fetchVehicles();
          fetchStats();
        },
        'operational:asset:created': () => {
          toast.success('Asset created');
          fetchAssets();
          fetchStats();
        },
        'operational:document:created': () => {
          toast.success('Document uploaded');
          fetchDocuments();
          fetchStats();
        }
      };
      
      Object.entries(handlers).forEach(([event, handler]) => {
        socket.socket.on(event, handler);
      });
      
      return () => {
        Object.keys(handlers).forEach(event => {
          socket.socket.off(event);
        });
      };
    }
  }, [fetchStats, fetchEvents, fetchVehicles, fetchAssets, fetchDocuments, socket]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (activeTab === 'calendar') fetchEvents();
      else if (activeTab === 'transport') fetchVehicles();
      else if (activeTab === 'assets') fetchAssets();
      else if (activeTab === 'documents') fetchDocuments();
      fetchStats();
    }, 30000);
    
    return () => clearInterval(interval);
  }, [activeTab]);

  const handleCreateEvent = async (formData) => {
    try {
      await api.post('/api/admin/operational/calendar', formData);
      toast.success('Calendar event created successfully');
      setShowEventModal(false);
      fetchEvents();
      fetchStats();
    } catch (error) {
      console.error('Error creating event:', error);
      toast.error(error.response?.data?.message || 'Failed to create event');
    }
  };

  const handleCreateVehicle = async (formData) => {
    try {
      await api.post('/api/admin/operational/transport', formData);
      toast.success('Transport vehicle added successfully');
      setShowVehicleModal(false);
      fetchVehicles();
      fetchStats();
    } catch (error) {
      console.error('Error creating vehicle:', error);
      toast.error(error.response?.data?.message || 'Failed to add vehicle');
    }
  };

  const handleCreateAsset = async (formData) => {
    try {
      await api.post('/api/admin/operational/assets', formData);
      toast.success('Asset created successfully');
      setShowAssetModal(false);
      fetchAssets();
      fetchStats();
    } catch (error) {
      console.error('Error creating asset:', error);
      toast.error(error.response?.data?.message || 'Failed to create asset');
    }
  };

  const handleCreateDocument = async (formData) => {
    try {
      await api.post('/api/admin/operational/documents', formData);
      toast.success('Document uploaded successfully');
      setShowDocumentModal(false);
      fetchDocuments();
      fetchStats();
    } catch (error) {
      console.error('Error uploading document:', error);
      toast.error(error.response?.data?.message || 'Failed to upload document');
    }
  };

  const StatCard = ({ title, value, icon: Icon, color = 'from-blue-500 to-cyan-600', subtitle }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg border-2 border-gray-100 p-5"
    >
      <div className="flex items-center justify-between mb-3">
        <div className={`p-3 rounded-lg bg-gradient-to-br ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
      <h3 className="text-2xl font-black text-gray-900 mb-1">{value}</h3>
      <p className="text-sm font-semibold text-gray-700">{title}</p>
      {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
    </motion.div>
  );

  if (loading && !stats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-slate-50 to-zinc-50 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360, scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="w-20 h-20 border-4 border-gray-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-slate-50 to-zinc-50 pb-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-700 via-slate-700 to-zinc-700 text-white py-12 px-6 mb-8">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-white/20 backdrop-blur-lg rounded-2xl">
                  <Wrench className="w-10 h-10" />
                </div>
                <div>
                  <h1 className="text-4xl font-black mb-2">Operational Tools</h1>
                  <p className="text-lg text-white/90">Calendar, Transport, Assets & Document Management</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    if (activeTab === 'calendar') setShowEventModal(true);
                    else if (activeTab === 'transport') setShowVehicleModal(true);
                    else if (activeTab === 'assets') setShowAssetModal(true);
                    else if (activeTab === 'documents') setShowDocumentModal(true);
                  }}
                  className="px-6 py-3 bg-white/20 backdrop-blur-lg hover:bg-white/30 text-white rounded-xl font-bold transition-all flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Add New
                </button>
                <button
                  onClick={() => navigate('/admin/dashboard')}
                  className="px-6 py-3 bg-white/20 backdrop-blur-lg hover:bg-white/30 text-white rounded-xl font-bold transition-all"
                >
                  Back to Dashboard
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Upcoming Events"
              value={stats.calendar?.upcoming || 0}
              icon={Calendar}
              color="from-blue-500 to-cyan-600"
              subtitle={`${stats.calendar?.total || 0} total events`}
            />
            <StatCard
              title="Active Vehicles"
              value={stats.transport?.active || 0}
              icon={Truck}
              color="from-green-500 to-emerald-600"
            />
            <StatCard
              title="Available Assets"
              value={stats.assets?.available || 0}
              icon={Package}
              color="from-purple-500 to-pink-600"
              subtitle={`${stats.assets?.total || 0} total assets`}
            />
            <StatCard
              title="Documents"
              value={stats.documents?.total || 0}
              icon={FileText}
              color="from-orange-500 to-amber-600"
              subtitle={`${stats.documents?.expiringSoon || 0} expiring soon`}
            />
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 mb-6">
          <div className="flex border-b-2 border-gray-200 overflow-x-auto">
            {[
              { id: 'calendar', label: 'Calendar', icon: Calendar },
              { id: 'transport', label: 'Transport', icon: Truck },
              { id: 'assets', label: 'Assets', icon: Package },
              { id: 'documents', label: 'Documents', icon: FileText }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-shrink-0 px-6 py-4 font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'text-gray-900 border-b-4 border-gray-900'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'calendar' && (
          <CalendarTab events={events} filters={filters} setFilters={setFilters} />
        )}

        {activeTab === 'transport' && (
          <TransportTab vehicles={vehicles} filters={filters} setFilters={setFilters} />
        )}

        {activeTab === 'assets' && (
          <AssetsTab assets={assets} filters={filters} setFilters={setFilters} />
        )}

        {activeTab === 'documents' && (
          <DocumentsTab documents={documents} filters={filters} setFilters={setFilters} />
        )}

        {/* Modals */}
        {showEventModal && (
          <EventModal onClose={() => setShowEventModal(false)} onCreate={handleCreateEvent} />
        )}

        {showVehicleModal && (
          <VehicleModal onClose={() => setShowVehicleModal(false)} onCreate={handleCreateVehicle} />
        )}

        {showAssetModal && (
          <AssetModal onClose={() => setShowAssetModal(false)} onCreate={handleCreateAsset} />
        )}

        {showDocumentModal && (
          <DocumentModal onClose={() => setShowDocumentModal(false)} onCreate={handleCreateDocument} />
        )}
      </div>
    </div>
  );
};

// Calendar Tab Component
const CalendarTab = ({ events, filters, setFilters }) => (
  <div className="space-y-4">
    <div className="bg-white rounded-xl shadow-lg border-2 border-gray-100 p-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search events..."
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
          className="w-full pl-10 pr-4 py-2 rounded-lg border-2 border-gray-200 focus:border-gray-500 focus:outline-none"
        />
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {events.length === 0 ? (
        <div className="col-span-full bg-white rounded-xl shadow-lg border-2 border-gray-100 p-12 text-center">
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 font-semibold">No events found</p>
        </div>
      ) : (
        events.map((event) => (
          <motion.div
            key={event._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg border-2 border-gray-100 p-6"
          >
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-lg font-black text-gray-900">{event.title}</h3>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-lg text-xs font-bold">
                {event.eventType}
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-3">{event.description || 'No description'}</p>
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
              <Clock className="w-4 h-4" />
              {new Date(event.startDate).toLocaleString()} - {new Date(event.endDate).toLocaleString()}
            </div>
            {event.location && (
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <MapPin className="w-4 h-4" />
                {event.location}
              </div>
            )}
          </motion.div>
        ))
      )}
    </div>
  </div>
);

// Transport Tab Component
const TransportTab = ({ vehicles, filters, setFilters }) => (
  <div className="space-y-4">
    <div className="bg-white rounded-xl shadow-lg border-2 border-gray-100 p-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search vehicles..."
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
          className="w-full pl-10 pr-4 py-2 rounded-lg border-2 border-gray-200 focus:border-gray-500 focus:outline-none"
        />
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {vehicles.length === 0 ? (
        <div className="col-span-full bg-white rounded-xl shadow-lg border-2 border-gray-100 p-12 text-center">
          <Truck className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 font-semibold">No vehicles found</p>
        </div>
      ) : (
        vehicles.map((vehicle) => (
          <motion.div
            key={vehicle._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg border-2 border-gray-100 p-6"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-lg font-black text-gray-900">{vehicle.vehicleNumber}</h3>
                <p className="text-sm text-gray-600">{vehicle.vehicleType}</p>
              </div>
              <span className={`px-2 py-1 rounded-lg text-xs font-bold ${
                vehicle.status === 'active' ? 'bg-green-100 text-green-800' :
                vehicle.status === 'maintenance' ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {vehicle.status}
              </span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="w-4 h-4" />
                Route: {vehicle.routeName}
              </div>
              {vehicle.driverName && (
                <div className="flex items-center gap-2 text-gray-600">
                  <Users className="w-4 h-4" />
                  Driver: {vehicle.driverName}
                </div>
              )}
              <div className="flex items-center gap-2 text-gray-600">
                <Users className="w-4 h-4" />
                Capacity: {vehicle.capacity} students
              </div>
            </div>
          </motion.div>
        ))
      )}
    </div>
  </div>
);

// Assets Tab Component
const AssetsTab = ({ assets, filters, setFilters }) => (
  <div className="space-y-4">
    <div className="bg-white rounded-xl shadow-lg border-2 border-gray-100 p-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search assets..."
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
          className="w-full pl-10 pr-4 py-2 rounded-lg border-2 border-gray-200 focus:border-gray-500 focus:outline-none"
        />
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {assets.length === 0 ? (
        <div className="col-span-full bg-white rounded-xl shadow-lg border-2 border-gray-100 p-12 text-center">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 font-semibold">No assets found</p>
        </div>
      ) : (
        assets.map((asset) => (
          <motion.div
            key={asset._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg border-2 border-gray-100 p-6"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-lg font-black text-gray-900">{asset.name}</h3>
                <p className="text-sm text-gray-600">{asset.assetId}</p>
              </div>
              <span className={`px-2 py-1 rounded-lg text-xs font-bold ${
                asset.status === 'available' ? 'bg-green-100 text-green-800' :
                asset.status === 'in_use' ? 'bg-blue-100 text-blue-800' :
                asset.status === 'maintenance' ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {asset.status}
              </span>
            </div>
            <div className="space-y-1 text-sm text-gray-600">
              <p>Type: {asset.assetType}</p>
              {asset.brand && <p>Brand: {asset.brand}</p>}
              {asset.location && <p>Location: {asset.location.room || asset.location.building}</p>}
            </div>
          </motion.div>
        ))
      )}
    </div>
  </div>
);

// Documents Tab Component
const DocumentsTab = ({ documents, filters, setFilters }) => (
  <div className="space-y-4">
    <div className="bg-white rounded-xl shadow-lg border-2 border-gray-100 p-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search documents..."
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
          className="w-full pl-10 pr-4 py-2 rounded-lg border-2 border-gray-200 focus:border-gray-500 focus:outline-none"
        />
      </div>
    </div>
    <div className="space-y-3">
      {documents.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg border-2 border-gray-100 p-12 text-center">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 font-semibold">No documents found</p>
        </div>
      ) : (
        documents.map((doc) => (
          <motion.div
            key={doc._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg border-2 border-gray-100 p-6"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="text-lg font-black text-gray-900 mb-1">{doc.title}</h3>
                <p className="text-sm text-gray-600 mb-3">{doc.description || 'No description'}</p>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-lg font-bold">
                    {doc.documentType}
                  </span>
                  {doc.validUntil && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      Expires: {new Date(doc.validUntil).toLocaleDateString()}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Download className="w-4 h-4" />
                    {doc.downloadCount || 0} downloads
                  </span>
                </div>
              </div>
              {doc.isExpired && (
                <span className="px-3 py-1 bg-red-100 text-red-800 rounded-lg text-xs font-bold">
                  Expired
                </span>
              )}
            </div>
          </motion.div>
        ))
      )}
    </div>
  </div>
);

// Event Modal
const EventModal = ({ onClose, onCreate }) => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    eventType: 'event',
    startDate: '',
    endDate: '',
    location: '',
    allDay: false
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreate(form);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-black text-gray-900">Create Calendar Event</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <XCircle className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Event Type *</label>
            <select
              required
              value={form.eventType}
              onChange={(e) => setForm({ ...form, eventType: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-gray-500 focus:outline-none"
            >
              <option value="assessment">Assessment</option>
              <option value="exam">Exam</option>
              <option value="event">Event</option>
              <option value="fee_cycle">Fee Cycle</option>
              <option value="holiday">Holiday</option>
              <option value="deadline">Deadline</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Title *</label>
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-gray-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows="3"
              className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-gray-500 focus:outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Start Date *</label>
              <input
                type="datetime-local"
                required
                value={form.startDate}
                onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-gray-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">End Date *</label>
              <input
                type="datetime-local"
                required
                value={form.endDate}
                onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-gray-500 focus:outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
            <input
              type="text"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-gray-500 focus:outline-none"
            />
          </div>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-bold hover:bg-gray-300 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-gray-600 text-white rounded-lg font-bold hover:bg-gray-700 transition-all"
            >
              Create Event
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

// Vehicle Modal
const VehicleModal = ({ onClose, onCreate }) => {
  const [form, setForm] = useState({
    vehicleNumber: '',
    vehicleType: 'bus',
    routeName: '',
    capacity: '',
    driverName: '',
    status: 'active'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreate(form);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-black text-gray-900">Add Transport Vehicle</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <XCircle className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Vehicle Number *</label>
            <input
              type="text"
              required
              value={form.vehicleNumber}
              onChange={(e) => setForm({ ...form, vehicleNumber: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-gray-500 focus:outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Vehicle Type</label>
              <select
                value={form.vehicleType}
                onChange={(e) => setForm({ ...form, vehicleType: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-gray-500 focus:outline-none"
              >
                <option value="bus">Bus</option>
                <option value="van">Van</option>
                <option value="car">Car</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Capacity *</label>
              <input
                type="number"
                required
                min="1"
                value={form.capacity}
                onChange={(e) => setForm({ ...form, capacity: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-gray-500 focus:outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Route Name *</label>
            <input
              type="text"
              required
              value={form.routeName}
              onChange={(e) => setForm({ ...form, routeName: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-gray-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Driver Name</label>
            <input
              type="text"
              value={form.driverName}
              onChange={(e) => setForm({ ...form, driverName: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-gray-500 focus:outline-none"
            />
          </div>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-bold hover:bg-gray-300 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-gray-600 text-white rounded-lg font-bold hover:bg-gray-700 transition-all"
            >
              Add Vehicle
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

// Asset Modal
const AssetModal = ({ onClose, onCreate }) => {
  const [form, setForm] = useState({
    assetId: '',
    name: '',
    assetType: 'device',
    category: 'other',
    brand: '',
    model: '',
    serialNumber: '',
    status: 'available'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreate(form);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-black text-gray-900">Create Asset</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <XCircle className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Asset ID *</label>
            <input
              type="text"
              required
              value={form.assetId}
              onChange={(e) => setForm({ ...form, assetId: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-gray-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Name *</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-gray-500 focus:outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Asset Type</label>
              <select
                value={form.assetType}
                onChange={(e) => setForm({ ...form, assetType: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-gray-500 focus:outline-none"
              >
                <option value="device">Device</option>
                <option value="license">License</option>
                <option value="lab_equipment">Lab Equipment</option>
                <option value="furniture">Furniture</option>
                <option value="infrastructure">Infrastructure</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-gray-500 focus:outline-none"
              >
                <option value="computer">Computer</option>
                <option value="tablet">Tablet</option>
                <option value="mobile">Mobile</option>
                <option value="printer">Printer</option>
                <option value="projector">Projector</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Brand</label>
              <input
                type="text"
                value={form.brand}
                onChange={(e) => setForm({ ...form, brand: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-gray-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Model</label>
              <input
                type="text"
                value={form.model}
                onChange={(e) => setForm({ ...form, model: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-gray-500 focus:outline-none"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-bold hover:bg-gray-300 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-gray-600 text-white rounded-lg font-bold hover:bg-gray-700 transition-all"
            >
              Create Asset
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

// Document Modal
const DocumentModal = ({ onClose, onCreate }) => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    documentType: 'compliance',
    category: 'other',
    validUntil: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreate(form);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-black text-gray-900">Upload Document</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <XCircle className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Title *</label>
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-gray-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows="3"
              className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-gray-500 focus:outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Document Type</label>
              <select
                value={form.documentType}
                onChange={(e) => setForm({ ...form, documentType: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-gray-500 focus:outline-none"
              >
                <option value="compliance">Compliance</option>
                <option value="policy">Policy</option>
                <option value="report">Report</option>
                <option value="certificate">Certificate</option>
                <option value="license">License</option>
                <option value="audit">Audit</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-gray-500 focus:outline-none"
              >
                <option value="gdpr">GDPR</option>
                <option value="hipaa">HIPAA</option>
                <option value="ferpa">FERPA</option>
                <option value="iso">ISO</option>
                <option value="accreditation">Accreditation</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Valid Until</label>
            <input
              type="date"
              value={form.validUntil}
              onChange={(e) => setForm({ ...form, validUntil: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-gray-500 focus:outline-none"
            />
          </div>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-bold hover:bg-gray-300 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-gray-600 text-white rounded-lg font-bold hover:bg-gray-700 transition-all"
            >
              Upload Document
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default OperationalTools;

