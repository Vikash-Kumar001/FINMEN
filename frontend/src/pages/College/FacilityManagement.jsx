import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  Bus,
  Users,
  MapPin,
  Phone,
  Mail,
  Plus,
  Edit,
  Trash2,
  Eye,
  Search,
  Filter,
  Calendar,
  Clock,
  DollarSign,
  Bed,
  Wifi,
  Car,
  Shield,
  CheckCircle,
  AlertCircle,
  X,
  Building,
  Route,
  UserCheck,
  Settings,
  BarChart3,
  TrendingUp,
  Activity,
} from "lucide-react";
import { toast } from "react-hot-toast";
import api from "../../utils/api";

const FacilityManagement = () => {
  const [activeTab, setActiveTab] = useState("hostels");
  const [hostels, setHostels] = useState([]);
  const [transportRoutes, setTransportRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [stats, setStats] = useState({});

  useEffect(() => {
    fetchHostels();
    fetchTransportRoutes();
    fetchStats();
  }, []);

  const fetchHostels = async () => {
    try {
      const response = await api.get("/api/facilities/hostels");
      setHostels(response.data.hostels);
    } catch (error) {
      console.error("Error fetching hostels:", error);
      toast.error("Failed to load hostels");
    } finally {
      setLoading(false);
    }
  };

  const fetchTransportRoutes = async () => {
    try {
      const response = await api.get("/api/facilities/transport/routes");
      setTransportRoutes(response.data.routes);
    } catch (error) {
      console.error("Error fetching transport routes:", error);
      toast.error("Failed to load transport routes");
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.get("/api/facilities/stats");
      setStats(response.data.stats);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const StatCard = ({ title, value, icon, color, trend, subtitle }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {subtitle && (
            <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
          )}
          {trend && (
            <div className="flex items-center mt-2">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600">{trend}% occupancy</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          {icon}
        </div>
      </div>
    </motion.div>
  );

  const HostelCard = ({ hostel, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-300"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <Home className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {hostel.hostelName}
            </h3>
            <p className="text-sm text-gray-600 capitalize">{hostel.hostelType}</p>
            <div className="flex items-center mt-2 space-x-4 text-sm text-gray-500">
              <div className="flex items-center">
                <Building className="w-4 h-4 mr-1" />
                <span>{hostel.blocks?.length || 0} Blocks</span>
              </div>
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-1" />
                <span>{hostel.currentOccupancy || 0}/{hostel.totalCapacity || 0}</span>
              </div>
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                <span>{hostel.address?.city || "N/A"}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => {
              setSelectedFacility(hostel);
              setShowDetailsModal(true);
            }}
            className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button className="p-2 text-gray-400 hover:text-green-600 transition-colors">
            <Edit className="w-4 h-4" />
          </button>
          <button className="p-2 text-gray-400 hover:text-red-600 transition-colors">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="text-sm">
              <span className="text-gray-600">Monthly Fee: </span>
              <span className="font-medium text-gray-900">
                ₹{hostel.feeStructure?.monthlyFee || 0}
              </span>
            </div>
            <div className={`px-2 py-1 rounded-full text-xs font-medium ${
              hostel.isActive 
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}>
              {hostel.isActive ? 'Active' : 'Inactive'}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {hostel.facilities?.wifi && (
              <div className="p-1 bg-blue-100 rounded text-blue-600">
                <Wifi className="w-3 h-3" />
              </div>
            )}
            {hostel.facilities?.security && (
              <div className="p-1 bg-green-100 rounded text-green-600">
                <Shield className="w-3 h-3" />
              </div>
            )}
            {hostel.facilities?.parking && (
              <div className="p-1 bg-purple-100 rounded text-purple-600">
                <Car className="w-3 h-3" />
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );

  const TransportCard = ({ route, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-300"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <Bus className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {route.routeName}
            </h3>
            <p className="text-sm text-gray-600">Route #{route.routeNumber}</p>
            <div className="flex items-center mt-2 space-x-4 text-sm text-gray-500">
              <div className="flex items-center">
                <Route className="w-4 h-4 mr-1" />
                <span>{route.routeStops?.length || 0} Stops</span>
              </div>
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-1" />
                <span>{route.vehicleDetails?.currentOccupancy || 0}/{route.vehicleDetails?.capacity || 0}</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                <span>{route.schedule?.startTime || "N/A"}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => {
              setSelectedFacility(route);
              setShowDetailsModal(true);
            }}
            className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button className="p-2 text-gray-400 hover:text-green-600 transition-colors">
            <Edit className="w-4 h-4" />
          </button>
          <button className="p-2 text-gray-400 hover:text-red-600 transition-colors">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="text-sm">
              <span className="text-gray-600">Vehicle: </span>
              <span className="font-medium text-gray-900">
                {route.vehicleDetails?.vehicleNumber || "N/A"}
              </span>
            </div>
            <div className="text-sm">
              <span className="text-gray-600">Driver: </span>
              <span className="font-medium text-gray-900">
                {route.driverDetails?.name || "N/A"}
              </span>
            </div>
          </div>
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${
            route.status === 'Active' 
              ? 'bg-green-100 text-green-800'
              : route.status === 'Maintenance'
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-red-100 text-red-800'
          }`}>
            {route.status || 'Active'}
          </div>
        </div>
      </div>
    </motion.div>
  );

  const FacilityDetailsModal = ({ facility, onClose, type }) => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {type === 'hostel' ? facility.hostelName : facility.routeName}
              </h2>
              <p className="text-gray-600">
                {type === 'hostel' 
                  ? `${facility.hostelType} Hostel` 
                  : `Route #${facility.routeNumber}`
                }
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {type === 'hostel' ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Basic Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <Building className="w-4 h-4 text-gray-400 mr-3" />
                      <span className="text-sm text-gray-600">Type:</span>
                      <span className="text-sm font-medium text-gray-900 ml-2 capitalize">
                        {facility.hostelType}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Users className="w-4 h-4 text-gray-400 mr-3" />
                      <span className="text-sm text-gray-600">Capacity:</span>
                      <span className="text-sm font-medium text-gray-900 ml-2">
                        {facility.totalCapacity} students
                      </span>
                    </div>
                    <div className="flex items-center">
                      <UserCheck className="w-4 h-4 text-gray-400 mr-3" />
                      <span className="text-sm text-gray-600">Current Occupancy:</span>
                      <span className="text-sm font-medium text-gray-900 ml-2">
                        {facility.currentOccupancy} students
                      </span>
                    </div>
                    <div className="flex items-center">
                      <DollarSign className="w-4 h-4 text-gray-400 mr-3" />
                      <span className="text-sm text-gray-600">Monthly Fee:</span>
                      <span className="text-sm font-medium text-gray-900 ml-2">
                        ₹{facility.feeStructure?.monthlyFee || 0}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Contact Information
                  </h3>
                  <div className="space-y-3">
                    {facility.contactDetails?.phone && (
                      <div className="flex items-center">
                        <Phone className="w-4 h-4 text-gray-400 mr-3" />
                        <span className="text-sm text-gray-900">
                          {facility.contactDetails.phone}
                        </span>
                      </div>
                    )}
                    {facility.contactDetails?.email && (
                      <div className="flex items-center">
                        <Mail className="w-4 h-4 text-gray-400 mr-3" />
                        <span className="text-sm text-gray-900">
                          {facility.contactDetails.email}
                        </span>
                      </div>
                    )}
                    {facility.address && (
                      <div className="flex items-start">
                        <MapPin className="w-4 h-4 text-gray-400 mr-3 mt-0.5" />
                        <div className="text-sm text-gray-900">
                          <div>{facility.address.street}</div>
                          <div>{facility.address.city}, {facility.address.state}</div>
                          <div>{facility.address.pincode}</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Facilities
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(facility.facilities || {}).map(([key, value]) => (
                      <div key={key} className="flex items-center">
                        <div className={`w-2 h-2 rounded-full mr-2 ${
                          value ? 'bg-green-500' : 'bg-red-500'
                        }`}></div>
                        <span className="text-sm text-gray-900 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Blocks & Rooms
                  </h3>
                  <div className="space-y-3">
                    {facility.blocks?.map((block, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-3">
                        <div className="font-medium text-gray-900 mb-2">
                          {block.blockName}
                        </div>
                        <div className="text-sm text-gray-600">
                          {block.floors?.length || 0} floors, {
                            block.floors?.reduce((total, floor) => 
                              total + (floor.rooms?.length || 0), 0
                            ) || 0
                          } rooms
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Route Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <Route className="w-4 h-4 text-gray-400 mr-3" />
                      <span className="text-sm text-gray-600">Route Number:</span>
                      <span className="text-sm font-medium text-gray-900 ml-2">
                        {facility.routeNumber}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 text-gray-400 mr-3" />
                      <span className="text-sm text-gray-600">Start Time:</span>
                      <span className="text-sm font-medium text-gray-900 ml-2">
                        {facility.schedule?.startTime || "N/A"}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 text-gray-400 mr-3" />
                      <span className="text-sm text-gray-600">End Time:</span>
                      <span className="text-sm font-medium text-gray-900 ml-2">
                        {facility.schedule?.endTime || "N/A"}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <DollarSign className="w-4 h-4 text-gray-400 mr-3" />
                      <span className="text-sm text-gray-600">Monthly Fee:</span>
                      <span className="text-sm font-medium text-gray-900 ml-2">
                        ₹{facility.feeStructure?.monthlyFee || 0}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Vehicle Details
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <Bus className="w-4 h-4 text-gray-400 mr-3" />
                      <span className="text-sm text-gray-600">Vehicle Number:</span>
                      <span className="text-sm font-medium text-gray-900 ml-2">
                        {facility.vehicleDetails?.vehicleNumber || "N/A"}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Users className="w-4 h-4 text-gray-400 mr-3" />
                      <span className="text-sm text-gray-600">Capacity:</span>
                      <span className="text-sm font-medium text-gray-900 ml-2">
                        {facility.vehicleDetails?.capacity || 0} passengers
                      </span>
                    </div>
                    <div className="flex items-center">
                      <UserCheck className="w-4 h-4 text-gray-400 mr-3" />
                      <span className="text-sm text-gray-600">Current Occupancy:</span>
                      <span className="text-sm font-medium text-gray-900 ml-2">
                        {facility.vehicleDetails?.currentOccupancy || 0} passengers
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Driver Details
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <Users className="w-4 h-4 text-gray-400 mr-3" />
                      <span className="text-sm text-gray-600">Name:</span>
                      <span className="text-sm font-medium text-gray-900 ml-2">
                        {facility.driverDetails?.name || "N/A"}
                      </span>
                    </div>
                    {facility.driverDetails?.phone && (
                      <div className="flex items-center">
                        <Phone className="w-4 h-4 text-gray-400 mr-3" />
                        <span className="text-sm text-gray-900">
                          {facility.driverDetails.phone}
                        </span>
                      </div>
                    )}
                    {facility.driverDetails?.licenseNumber && (
                      <div className="flex items-center">
                        <Activity className="w-4 h-4 text-gray-400 mr-3" />
                        <span className="text-sm text-gray-600">License:</span>
                        <span className="text-sm font-medium text-gray-900 ml-2">
                          {facility.driverDetails.licenseNumber}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Route Stops
                  </h3>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {facility.routeStops?.map((stop, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                        <div>
                          <div className="font-medium text-gray-900">
                            {stop.stopName}
                          </div>
                          <div className="text-sm text-gray-600">
                            {stop.arrivalTime} • {stop.students?.filter(s => s.isActive).length || 0} students
                          </div>
                        </div>
                        <div className="text-sm text-gray-500">
                          Stop #{index + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="mt-8 flex justify-end space-x-4">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Close
            </button>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Edit {type === 'hostel' ? 'Hostel' : 'Route'}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "hostels":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Hostels</h2>
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Hostel
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {hostels.map((hostel, index) => (
                <HostelCard key={hostel._id} hostel={hostel} index={index} />
              ))}
            </div>
          </div>
        );

      case "transport":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Transport Routes</h2>
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Route
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {transportRoutes.map((route, index) => (
                <TransportCard key={route._id} route={route} index={index} />
              ))}
            </div>
          </div>
        );

      case "analytics":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Analytics</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Total Hostels"
                value={stats.hostels?.total || 0}
                icon={<Home className="w-6 h-6 text-white" />}
                color="bg-gradient-to-r from-blue-500 to-cyan-500"
                trend={85}
                subtitle="Average occupancy"
              />
              <StatCard
                title="Transport Routes"
                value={stats.transport?.total || 0}
                icon={<Bus className="w-6 h-6 text-white" />}
                color="bg-gradient-to-r from-green-500 to-emerald-500"
                trend={78}
                subtitle="Average occupancy"
              />
              <StatCard
                title="Hostel Students"
                value={stats.hostels?.totalStudents || 0}
                icon={<Users className="w-6 h-6 text-white" />}
                color="bg-gradient-to-r from-purple-500 to-violet-500"
              />
              <StatCard
                title="Transport Users"
                value={stats.transport?.totalStudents || 0}
                icon={<UserCheck className="w-6 h-6 text-white" />}
                color="bg-gradient-to-r from-orange-500 to-red-500"
              />
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Facility Usage Overview
              </h3>
              <div className="text-center py-12 text-gray-500">
                <BarChart3 className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p>Analytics charts will be displayed here</p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Facility Management
              </h1>
              <p className="text-gray-600 mt-1">
                Manage hostels and transport facilities
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <Settings className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            {[
              { id: "hostels", label: "Hostels", icon: <Home className="w-4 h-4" /> },
              { id: "transport", label: "Transport", icon: <Bus className="w-4 h-4" /> },
              { id: "analytics", label: "Analytics", icon: <BarChart3 className="w-4 h-4" /> },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === tab.id
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {renderTabContent()}
      </div>

      {/* Facility Details Modal */}
      <AnimatePresence>
        {showDetailsModal && selectedFacility && (
          <FacilityDetailsModal
            facility={selectedFacility}
            type={activeTab === 'hostels' ? 'hostel' : 'transport'}
            onClose={() => {
              setShowDetailsModal(false);
              setSelectedFacility(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default FacilityManagement;