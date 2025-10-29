import React, { useState, useEffect } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Search,
  Filter,
  Grid,
  List,
  Flag,
  ChevronDown,
  Download,
  Eye,
  BookOpen,
  TrendingUp,
  Zap,
  Coins,
  Star,
  Activity,
  ZoomIn,
  ZoomOut,
  MessageSquare,
  FileText,
  Heart,
  Clock,
  Plus,
  UserPlus,
  MoreVertical,
  UserMinus,
  ChevronRight,
} from "lucide-react";
import api from "../../utils/api";
import { toast } from "react-hot-toast";
import StudentSlideoverPanel from "../../components/StudentSlideoverPanel";
import NewAssignmentModal from "../../components/NewAssignmentModal";
import InviteStudentsModal from "../../components/InviteStudentsModal";
import StudentActionsMenu from "../../components/StudentActionsMenu";
import AssignToGroupModal from "../../components/AssignToGroupModal";

const TeacherStudents = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [classStudents, setClassStudents] = useState([]);
  const [viewMode, setViewMode] = useState("list");
  const [searchTerm, setSearchTerm] = useState("");
  const [_filterGrade, _setFilterGrade] = useState("all");
  const [_filterSection, _setFilterSection] = useState("all");
  const [filterFlagged, setFilterFlagged] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showSlideoverPanel, setShowSlideoverPanel] = useState(false);
  const [zoomLevel, setZoomLevel] = useState("class"); // "class" or "all"
  const [showNewAssignment, setShowNewAssignment] = useState(false);
  const [showInviteStudents, setShowInviteStudents] = useState(false);
  const [showAssignToGroup, setShowAssignToGroup] = useState(false);

  useEffect(() => {
    fetchClasses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (selectedClass) {
      fetchClassStudents(selectedClass._id || selectedClass.name);
    }
  }, [selectedClass]);

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/school/teacher/classes");
      const classesData = response.data?.classes || [];
      setClasses(classesData);
      if (classesData.length > 0 && !selectedClass) {
        setSelectedClass(classesData[0]);
      }
    } catch (error) {
      console.error("Error fetching classes:", error);
      toast.error("Failed to load classes");
    } finally {
      setLoading(false);
    }
  };

  const fetchClassStudents = async (classId) => {
    try {
      const response = await api.get(`/api/school/teacher/class/${classId}/students`);
      setClassStudents(response.data.students || []);
    } catch (error) {
      console.error("Error fetching class students:", error);
      toast.error("Failed to load students");
    }
  };

  const fetchAllStudents = async () => {
    try {
      const response = await api.get('/api/school/teacher/all-students');
      setClassStudents(response.data.students || []);
    } catch (error) {
      console.error("Error fetching all students:", error);
      toast.error("Failed to load all students");
    }
  };

  const handleRemoveStudentFromClass = async (student) => {
    if (!selectedClass) {
      toast.error("No class selected");
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to remove ${student.name} from ${selectedClass.name}? This will only remove them from this class, not delete their account.`
    );

    if (!confirmed) return;

    try {
      await api.delete(`/api/school/teacher/class/${selectedClass._id || selectedClass.name}/student/${student._id}`);
      toast.success(`${student.name} has been removed from ${selectedClass.name}`);
      
      // Refresh the student list
      if (zoomLevel === "class" && selectedClass) {
        fetchClassStudents(selectedClass._id || selectedClass.name);
      } else {
        fetchAllStudents();
      }
    } catch (error) {
      console.error("Error removing student from class:", error);
      toast.error("Failed to remove student from class");
    }
  };

  const handleStudentClick = (student) => {
    setSelectedStudent(student);
    setShowSlideoverPanel(true);
  };

  const handleZoomToggle = () => {
    if (zoomLevel === "class") {
      setZoomLevel("all");
      fetchAllStudents();
    } else {
      setZoomLevel("class");
      if (selectedClass) {
        fetchClassStudents(selectedClass._id || selectedClass.name);
      }
    }
  };

  const filteredStudents = classStudents.filter((student) => {
    const matchesSearch =
      student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFlagged = !filterFlagged || student.flagged;
    return matchesSearch && matchesFlagged;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <Motion.div
          animate={{ rotate: 360, scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-20 h-20 border-4 border-purple-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 pb-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white py-8 px-6">
        <div className="max-w-7xl mx-auto">
          <Motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl font-black mb-2 flex items-center gap-3">
              <Users className="w-10 h-10" />
              Student Management
            </h1>
            <p className="text-lg text-white/90">
              View and manage all your students across classes
            </p>
          </Motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-4">
        {/* Search and Filters Bar */}
        <Motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6 mb-6"
        >
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              {zoomLevel === "all" ? (
                <>
                  <Users className="w-6 h-6 text-purple-600" />
                  All Students - Aggregated View
                </>
              ) : (
                <>
                  <BookOpen className="w-6 h-6 text-blue-600" />
                  {selectedClass?.name || 'Class View'}
                </>
              )}
            </h2>
            
            {/* Zoom Controls & Actions */}
            <div className="flex gap-2">
              <Motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowInviteStudents(true)}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all flex items-center gap-2"
              >
                <UserPlus className="w-4 h-4" />
                Invite Students
              </Motion.button>
              
              <Motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleZoomToggle}
                className={`px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                  zoomLevel === "all"
                    ? "bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 border-2 border-gray-200 hover:border-purple-300"
                }`}
              >
                {zoomLevel === "all" ? (
                  <>
                    <ZoomIn className="w-4 h-4" />
                    Zoom to Class
                  </>
                ) : (
                  <>
                    <ZoomOut className="w-4 h-4" />
                    View All Classes
                  </>
                )}
              </Motion.button>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-4">
            {/* Search */}
            <div className="flex-1 min-w-[250px] relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search students by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all outline-none bg-white"
              />
            </div>

            {/* Filters */}
            <div className="flex items-center gap-2">

              <Motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setFilterFlagged(!filterFlagged)}
                className={`px-4 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 ${
                  filterFlagged
                    ? "bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-lg"
                    : "bg-white border-2 border-gray-200 text-gray-700"
                }`}
              >
                <Flag className="w-4 h-4" />
                At Risk Only
              </Motion.button>

              {/* View Mode Toggle */}
              <div className="flex gap-2 bg-gray-100 rounded-xl p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    viewMode === "grid"
                      ? "bg-white text-purple-600 shadow"
                      : "text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    viewMode === "list"
                      ? "bg-white text-purple-600 shadow"
                      : "text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </Motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Class Selection Sidebar */}
          <div className="lg:col-span-1">
            <Motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6 sticky top-6"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-purple-600" />
                My Classes
              </h3>
              <div className="space-y-2">
                {classes.map((cls, idx) => (
                  <Motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    whileHover={{ scale: 1.02, x: 3 }}
                    onClick={() => setSelectedClass(cls)}
                    className={`p-4 rounded-xl cursor-pointer transition-all ${
                      selectedClass?.name === cls.name
                        ? "bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg"
                        : "bg-gray-50 text-gray-900 hover:bg-purple-50 border border-gray-200"
                    }`}
                  >
                    <h4 className="font-bold text-base mb-2">{cls.name}</h4>
                    <div className="flex items-center justify-between text-sm">
                      <span className={selectedClass?.name === cls.name ? "text-white/90" : "text-gray-600"}>
                        {cls.students || 0} Students
                      </span>
                      <span className={`font-bold ${selectedClass?.name === cls.name ? "text-white" : "text-purple-600"}`}>
                        {cls.avg || 85}%
                      </span>
                    </div>
                  </Motion.div>
                ))}
              </div>
            </Motion.div>
          </div>

          {/* Students Display Area */}
          <div className="lg:col-span-3">
            {selectedClass ? (
              <>
                {/* Class Header */}
                <Motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl p-6 text-white mb-6 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32" />
                  <div className="relative z-10">
                    <h2 className="text-3xl font-black mb-2">{selectedClass.name}</h2>
                    <div className="flex items-center gap-6 text-white/90">
                      <span className="flex items-center gap-2">
                        <Users className="w-5 h-5" />
                        {filteredStudents.length} Students
                      </span>
                      <span className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5" />
                        {selectedClass.avg || 85}% Avg
                      </span>
                    </div>
                  </div>
                </Motion.div>

                {/* Student Grid/List */}
                {viewMode === "grid" ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {filteredStudents.map((student, idx) => (
                      <Motion.div
                        key={student._id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.03 }}
                        whileHover={{ y: -5, scale: 1.02 }}
                        onClick={() => navigate(`/school-teacher/student/${student._id}/progress`)}
                        className="bg-white rounded-xl p-5 shadow-lg border-2 border-gray-100 hover:border-purple-300 hover:shadow-xl transition-all cursor-pointer"
                      >
                        <div className="flex items-center gap-3 mb-4">
                          <div className="relative">
                            <img
                              src={student.avatar || `/avatars/avatar${(idx % 6) + 1}.png`}
                              alt={student.name}
                              className="w-14 h-14 rounded-full border-3 border-purple-300 shadow-md object-cover"
                              onError={(e) => {
                                e.target.src = `/avatars/avatar${(idx % 6) + 1}.png`;
                              }}
                            />
                            {student.flagged && (
                              <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white"></div>
                            )}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold text-gray-900 text-base">
                              {student.name}
                            </h4>
                            <p className="text-xs text-gray-500">{student.email}</p>
                            <p className="text-xs text-purple-600 font-semibold">
                              {student.rollNumber || `ROLL${String(idx + 1).padStart(6, '0')}`}
                            </p>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          <div className="bg-blue-50 rounded-lg p-2 text-center">
                            <p className="text-base font-bold text-blue-700">
                              {student.level || 1}
                            </p>
                            <p className="text-xs text-blue-600">Level</p>
                          </div>
                          <div className="bg-purple-50 rounded-lg p-2 text-center">
                            <p className="text-base font-bold text-purple-700">
                              {student.pillarMastery || 0}%
                            </p>
                            <p className="text-xs text-purple-600">Mastery</p>
                          </div>
                          <div className="bg-green-50 rounded-lg p-2 text-center">
                            <p className="text-base font-bold text-green-700">
                              {student.streak || 0}
                            </p>
                            <p className="text-xs text-green-600">Streak</p>
                          </div>
                        </div>
                        <div className="mt-3 flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <span className="text-lg">{student.moodEmoji || '😊'}</span>
                            <span className="text-xs text-gray-600">{student.moodScore || 3}/5</span>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Clock className="w-3 h-3" />
                            <span>{student.lastActive || 'Never'}</span>
                          </div>
                        </div>
                      </Motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-xl shadow-lg border-2 border-gray-100 overflow-visible relative">
                    <table className="w-full">
                      <thead className="bg-gradient-to-r from-purple-500 to-pink-600 text-white">
                        <tr>
                          <th className="px-4 py-3 text-left font-semibold">Roll</th>
                          <th className="px-4 py-3 text-left font-semibold">Student</th>
                          <th className="px-4 py-3 text-center font-semibold">Level</th>
                          <th className="px-4 py-3 text-center font-semibold">Pillar Mastery %</th>
                          <th className="px-4 py-3 text-center font-semibold">Profile</th>
                          <th className="px-4 py-3 text-center font-semibold">Last Active</th>
                          <th className="px-4 py-3 text-center font-semibold">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredStudents.map((student, idx) => (
                          <Motion.tr
                            key={student._id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.03 }}
                            onClick={() => handleStudentClick(student)}
                            className="border-b border-gray-100 hover:bg-purple-50 transition-colors cursor-pointer"
                          >
                            <td className="px-4 py-3">
                              <span className="font-bold text-gray-700">
                                {student.rollNumber || `ROLL${String(idx + 1).padStart(6, '0')}`}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                <div className="relative">
                                  <img
                                    src={student.avatar || `/avatars/avatar${(idx % 6) + 1}.png`}
                                    alt={student.name}
                                    className="w-10 h-10 rounded-full border-2 border-purple-300 object-cover"
                                    onError={(e) => {
                                      e.target.src = `/avatars/avatar${(idx % 6) + 1}.png`;
                                    }}
                                  />
                                  {student.flagged && (
                                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border border-white"></div>
                                  )}
                                </div>
                                <div>
                                  <p className="font-semibold text-gray-900">{student.name}</p>
                                  <p className="text-xs text-gray-500">{student.email}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-center">
                              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-bold">
                                {student.level || 1}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <div className="flex-1 bg-gray-200 rounded-full h-2">
                                  <div
                                    className={`h-2 rounded-full ${
                                      (student.pillarMastery || 0) >= 75
                                        ? "bg-gradient-to-r from-green-500 to-emerald-600"
                                        : (student.pillarMastery || 0) >= 50
                                        ? "bg-gradient-to-r from-blue-500 to-cyan-600"
                                        : (student.pillarMastery || 0) >= 25
                                        ? "bg-gradient-to-r from-amber-500 to-orange-600"
                                        : "bg-gradient-to-r from-red-500 to-pink-600"
                                    }`}
                                    style={{ width: `${student.pillarMastery || 0}%` }}
                                  />
                                </div>
                                <span className="text-sm font-bold text-gray-700 w-10 text-right">
                                  {student.pillarMastery || 0}%
                                </span>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-center">
                              <Motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(`/school-teacher/student/${student._id}/progress`);
                                }}
                                className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-2 mx-auto"
                              >
                                <ChevronRight className="w-4 h-4" />
                                <span className="text-sm font-semibold">View</span>
                              </Motion.button>
                            </td>
                            <td className="px-4 py-3 text-center">
                              <p className="text-xs text-gray-600 flex items-center justify-center gap-1">
                                <Clock className="w-3 h-3" />
                                {student.lastActive || 'Never'}
                              </p>
                            </td>
                            <td className="px-4 py-3 relative overflow-visible">
                              <div 
                                className="flex items-center justify-center" 
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                }}
                                onMouseDown={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                }}
                              >
                                <StudentActionsMenu
                                  student={student}
                                  onMessage={(s) => {
                                    setSelectedStudent(s);
                                    setShowSlideoverPanel(true);
                                  }}
                                  onAddNote={(s) => {
                                    setSelectedStudent(s);
                                    setShowSlideoverPanel(true);
                                  }}
                                  onViewDetails={(s) => {
                                    setSelectedStudent(s);
                                    setShowSlideoverPanel(true);
                                  }}
                                  onAssignToGroup={(s) => {
                                    setSelectedStudent(s);
                                    setShowAssignToGroup(true);
                                  }}
                                  onViewFullProfile={(s) => {
                                    navigate(`/school-teacher/student/${s._id}/progress`);
                                  }}
                                  onRemoveFromClass={handleRemoveStudentFromClass}
                                />
                              </div>
                            </td>
                          </Motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {filteredStudents.length === 0 && (
                  <div className="bg-white rounded-xl shadow-lg border-2 border-gray-100 p-12 text-center">
                    <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-xl font-bold text-gray-600">No students found</p>
                    <p className="text-gray-500 mt-2">Try adjusting your search or filters</p>
                  </div>
                )}
              </>
            ) : (
              <div className="bg-white rounded-xl shadow-lg border-2 border-gray-100 p-12 text-center">
                <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-xl font-bold text-gray-600">Select a class</p>
                <p className="text-gray-500 mt-2">Choose a class from the sidebar to view students</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Student Slideover Panel */}
      <StudentSlideoverPanel
        student={selectedStudent}
        isOpen={showSlideoverPanel}
        onClose={() => setShowSlideoverPanel(false)}
        onUpdate={() => {
          if (zoomLevel === "class" && selectedClass) {
            fetchClassStudents(selectedClass._id || selectedClass.name);
          } else {
            fetchAllStudents();
          }
        }}
      />

      {/* New Assignment Modal */}
      <NewAssignmentModal
        isOpen={showNewAssignment}
        onClose={() => setShowNewAssignment(false)}
        onSuccess={() => {
          if (zoomLevel === "class" && selectedClass) {
            fetchClassStudents(selectedClass._id || selectedClass.name);
          }
        }}
        defaultClassId={selectedClass?._id || selectedClass?.name}
        defaultClassName={selectedClass?.name}
      />

      {/* Invite Students Modal */}
      <InviteStudentsModal
        isOpen={showInviteStudents}
        onClose={() => setShowInviteStudents(false)}
        classId={selectedClass?._id || selectedClass?.name}
        className={selectedClass?.name}
        onSuccess={() => {
          if (zoomLevel === "class" && selectedClass) {
            fetchClassStudents(selectedClass._id || selectedClass.name);
          } else {
            fetchAllStudents();
          }
        }}
      />

      {/* Assign to Group Modal */}
      <AssignToGroupModal
        isOpen={showAssignToGroup}
        onClose={() => setShowAssignToGroup(false)}
        student={selectedStudent}
        onSuccess={() => {
          if (zoomLevel === "class" && selectedClass) {
            fetchClassStudents(selectedClass._id || selectedClass.name);
          } else {
            fetchAllStudents();
          }
        }}
      />

      
    </div>
  );
};

export default TeacherStudents;
