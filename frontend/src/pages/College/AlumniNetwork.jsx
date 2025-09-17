import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Search,
  Filter,
  MapPin,
  Briefcase,
  Calendar,
  Mail,
  Phone,
  Linkedin,
  Twitter,
  Globe,
  Award,
  Building,
  GraduationCap,
  Heart,
  MessageCircle,
  Share2,
  Plus,
  Edit,
  Eye,
  Star,
  TrendingUp,
  UserPlus,
  Network,
  BookOpen,
  Target,
  Clock,
  CheckCircle,
  X,
} from "lucide-react";
import { toast } from "react-hot-toast";
import api from "../../utils/api";

const AlumniNetwork = () => {
  const [alumni, setAlumni] = useState([]);
  const [filteredAlumni, setFilteredAlumni] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilters, setSelectedFilters] = useState({
    batch: "",
    department: "",
    company: "",
    location: "",
    industry: "",
  });
  const [activeView, setActiveView] = useState("grid");
  const [selectedAlumni, setSelectedAlumni] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [, setShowAddAlumni] = useState(false);
  const [stats, setStats] = useState({});

  useEffect(() => {
    fetchAlumni();
    fetchStats();
  }, []);

  useEffect(() => {
    filterAlumni();
  }, [searchTerm, selectedFilters, alumni, filterAlumni]);

  const fetchAlumni = async () => {
    try {
      const response = await api.get("/api/college/alumni");
      setAlumni(response.data.alumni);
      setFilteredAlumni(response.data.alumni);
    } catch (error) {
      console.error("Error fetching alumni:", error);
      toast.error("Failed to load alumni data");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.get("/api/college/alumni/stats");
      setStats(response.data.stats);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const filterAlumni = useCallback(() => {
    let filtered = alumni;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (alumnus) =>
          alumnus.userId.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          alumnus.currentCompany
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          alumnus.currentPosition
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    }

    // Other filters
    Object.keys(selectedFilters).forEach((key) => {
      if (selectedFilters[key]) {
        filtered = filtered.filter((alumnus) => {
          switch (key) {
            case "batch":
              return alumnus.graduationYear.toString() === selectedFilters[key];
            case "department":
              return alumnus.departmentId.name === selectedFilters[key];
            case "company":
              return alumnus.currentCompany
                .toLowerCase()
                .includes(selectedFilters[key].toLowerCase());
            case "location":
              return alumnus.currentLocation
                .toLowerCase()
                .includes(selectedFilters[key].toLowerCase());
            case "industry":
              return alumnus.industry
                .toLowerCase()
                .includes(selectedFilters[key].toLowerCase());
            default:
              return true;
          }
        });
      }
    });

    setFilteredAlumni(filtered);
  }, [alumni, searchTerm, selectedFilters]);

  const handleFilterChange = (filterType, value) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  const clearFilters = () => {
    setSelectedFilters({
      batch: "",
      department: "",
      company: "",
      location: "",
      industry: "",
    });
    setSearchTerm("");
  };

  const handleConnect = async (alumniId) => {
    try {
      await api.post(`/api/college/alumni/${alumniId}/connect`);
      toast.success("Connection request sent!");
      fetchAlumni();
    } catch (error) {
      console.error("Error connecting:", error);
      toast.error("Failed to send connection request");
    }
  };

  const StatCard = ({ title, value, icon, color, trend }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {trend && (
            <div className="flex items-center mt-2">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600">{trend}% increase</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>{icon}</div>
      </div>
    </motion.div>
  );

  const AlumniCard = ({ alumnus, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-300"
    >
      <div className="flex items-start space-x-4">
        <div className="relative">
          <img
            src={alumnus.userId.profilePicture || "/default-avatar.png"}
            alt={alumnus.userId.name}
            className="w-16 h-16 rounded-full object-cover"
          />
          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div>
        </div>

        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {alumnus.userId.name}
              </h3>
              <p className="text-sm text-gray-600">{alumnus.currentPosition}</p>
              <p className="text-sm text-blue-600 font-medium">
                {alumnus.currentCompany}
              </p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => {
                  setSelectedAlumni(alumnus);
                  setShowProfile(true);
                }}
                className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
              >
                <Eye className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleConnect(alumnus._id)}
                className="p-2 text-gray-400 hover:text-green-600 transition-colors"
              >
                <UserPlus className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="mt-3 flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center">
              <GraduationCap className="w-4 h-4 mr-1" />
              <span>{alumnus.graduationYear}</span>
            </div>
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-1" />
              <span>{alumnus.currentLocation}</span>
            </div>
            <div className="flex items-center">
              <Building className="w-4 h-4 mr-1" />
              <span>{alumnus.departmentId.name}</span>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div className="flex space-x-2">
              {alumnus.socialLinks?.linkedin && (
                <a
                  href={alumnus.socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
              {alumnus.socialLinks?.twitter && (
                <a
                  href={alumnus.socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-blue-400 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Twitter className="w-4 h-4" />
                </a>
              )}
              {alumnus.contactInfo?.email && (
                <a
                  href={`mailto:${alumnus.contactInfo.email}`}
                  className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <Mail className="w-4 h-4" />
                </a>
              )}
            </div>

            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-sm text-gray-600">
                {alumnus.mentorshipRating || "4.5"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const AlumniProfile = ({ alumnus, onClose }) => (
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
        className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-start space-x-4">
              <img
                src={alumnus.userId.profilePicture || "/default-avatar.png"}
                alt={alumnus.userId.name}
                className="w-20 h-20 rounded-full object-cover"
              />
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {alumnus.userId.name}
                </h2>
                <p className="text-lg text-gray-600">
                  {alumnus.currentPosition}
                </p>
                <p className="text-blue-600 font-medium">
                  {alumnus.currentCompany}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Professional Info
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Briefcase className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">
                      {alumnus.industry}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">
                      {alumnus.currentLocation}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">
                      Experience: {alumnus.experience} years
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Academic Info
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <GraduationCap className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">
                      {alumnus.departmentId.name} - {alumnus.graduationYear}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Award className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">
                      CGPA: {alumnus.academicInfo?.cgpa || "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Contact Info
                </h3>
                <div className="space-y-2">
                  {alumnus.contactInfo?.email && (
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 text-gray-400 mr-2" />
                      <a
                        href={`mailto:${alumnus.contactInfo.email}`}
                        className="text-sm text-blue-600 hover:underline"
                      >
                        {alumnus.contactInfo.email}
                      </a>
                    </div>
                  )}
                  {alumnus.contactInfo?.phone && (
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-600">
                        {alumnus.contactInfo.phone}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Social Links
                </h3>
                <div className="flex space-x-3">
                  {alumnus.socialLinks?.linkedin && (
                    <a
                      href={alumnus.socialLinks.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Linkedin className="w-5 h-5" />
                    </a>
                  )}
                  {alumnus.socialLinks?.twitter && (
                    <a
                      href={alumnus.socialLinks.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-blue-400 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Twitter className="w-5 h-5" />
                    </a>
                  )}
                  {alumnus.socialLinks?.website && (
                    <a
                      href={alumnus.socialLinks.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <Globe className="w-5 h-5" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          {alumnus.bio && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Bio</h3>
              <p className="text-gray-600">{alumnus.bio}</p>
            </div>
          )}

          {alumnus.achievements && alumnus.achievements.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Achievements
              </h3>
              <div className="space-y-2">
                {alumnus.achievements.map((achievement, index) => (
                  <div key={index} className="flex items-start">
                    <Award className="w-4 h-4 text-yellow-500 mr-2 mt-0.5" />
                    <span className="text-sm text-gray-600">{achievement}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8 flex space-x-4">
            <button
              onClick={() => handleConnect(alumnus._id)}
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Connect
            </button>
            <button className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center">
              <MessageCircle className="w-4 h-4 mr-2" />
              Message
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );

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
                Alumni Network
              </h1>
              <p className="text-gray-600 mt-1">
                Connect with {filteredAlumni.length} alumni from your college
              </p>
            </div>
            <button
              onClick={() => setShowAddAlumni(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Alumni
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Alumni"
            value={stats.totalAlumni || 0}
            icon={<Users className="w-6 h-6 text-white" />}
            color="bg-gradient-to-r from-blue-500 to-cyan-500"
            trend={12}
          />
          <StatCard
            title="Companies"
            value={stats.totalCompanies || 0}
            icon={<Building className="w-6 h-6 text-white" />}
            color="bg-gradient-to-r from-green-500 to-emerald-500"
            trend={8}
          />
          <StatCard
            title="Mentors Available"
            value={stats.mentorsAvailable || 0}
            icon={<Award className="w-6 h-6 text-white" />}
            color="bg-gradient-to-r from-purple-500 to-violet-500"
            trend={15}
          />
          <StatCard
            title="Success Stories"
            value={stats.successStories || 0}
            icon={<Star className="w-6 h-6 text-white" />}
            color="bg-gradient-to-r from-orange-500 to-red-500"
            trend={20}
          />
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search alumni by name, company, or position..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <select
                value={selectedFilters.batch}
                onChange={(e) => handleFilterChange("batch", e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Batches</option>
                <option value="2024">2024</option>
                <option value="2023">2023</option>
                <option value="2022">2022</option>
                <option value="2021">2021</option>
                <option value="2020">2020</option>
              </select>

              <select
                value={selectedFilters.department}
                onChange={(e) =>
                  handleFilterChange("department", e.target.value)
                }
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Departments</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Electronics">Electronics</option>
                <option value="Mechanical">Mechanical</option>
                <option value="Civil">Civil</option>
              </select>

              <button
                onClick={clearFilters}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Clear Filters
              </button>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setActiveView("grid")}
                  className={`p-2 rounded-lg transition-colors ${
                    activeView === "grid"
                      ? "bg-blue-100 text-blue-600"
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  <div className="w-4 h-4 grid grid-cols-2 gap-0.5">
                    <div className="bg-current rounded-sm"></div>
                    <div className="bg-current rounded-sm"></div>
                    <div className="bg-current rounded-sm"></div>
                    <div className="bg-current rounded-sm"></div>
                  </div>
                </button>
                <button
                  onClick={() => setActiveView("list")}
                  className={`p-2 rounded-lg transition-colors ${
                    activeView === "list"
                      ? "bg-blue-100 text-blue-600"
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  <div className="w-4 h-4 flex flex-col space-y-1">
                    <div className="h-0.5 bg-current rounded"></div>
                    <div className="h-0.5 bg-current rounded"></div>
                    <div className="h-0.5 bg-current rounded"></div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Alumni Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAlumni.map((alumnus, index) => (
            <AlumniCard key={alumnus._id} alumnus={alumnus} index={index} />
          ))}
        </div>

        {filteredAlumni.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No alumni found
            </h3>
            <p className="text-gray-600">
              Try adjusting your search criteria or filters
            </p>
          </div>
        )}
      </div>

      {/* Alumni Profile Modal */}
      <AnimatePresence>
        {showProfile && selectedAlumni && (
          <AlumniProfile
            alumnus={selectedAlumni}
            onClose={() => {
              setShowProfile(false);
              setSelectedAlumni(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default AlumniNetwork;
