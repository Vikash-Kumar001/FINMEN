import React, { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Users, Search, Grid, List, Eye, BookOpen, Plus, X, 
  GraduationCap, CheckCircle, Trash2, UserPlus,
  School, Calendar
} from 'lucide-react';
import api from '../../utils/api';
import { toast } from 'react-hot-toast';

const SchoolAdminClasses = () => {
  const [loading, setLoading] = useState(true);
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGrade, setFilterGrade] = useState('all');
  const [filterStream, setFilterStream] = useState('all');
  const [stats, setStats] = useState({});
  
  // Modals
  const [showAddClassModal, setShowAddClassModal] = useState(false);
  const [showClassDetailModal, setShowClassDetailModal] = useState(false);
  const [showAddStudentsModal, setShowAddStudentsModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);

  // Form states
  const [newClass, setNewClass] = useState({
    classNumber: '',
    stream: '',
    sections: [{ name: 'A', capacity: 40, classTeacher: '' }],
    subjects: [],
    academicYear: new Date().getFullYear().toString()
  });

  const [subjectForm, setSubjectForm] = useState({
    name: '',
    code: '',
    isOptional: false,
    teachers: []
  });

  const [selectedStudentsToAdd, setSelectedStudentsToAdd] = useState([]);

  const streams = ['Science', 'Commerce', 'Arts'];
  const commonSubjects = [
    'Mathematics', 'Science', 'English', 'Hindi', 'Social Studies', 
    'Physics', 'Chemistry', 'Biology', 'Computer Science',
    'Economics', 'Accountancy', 'Business Studies', 'History', 
    'Geography', 'Political Science', 'Physical Education'
  ];

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filterGrade !== 'all') params.append('grade', filterGrade);
      if (filterStream !== 'all') params.append('stream', filterStream);

      const [classesRes, teachersRes, studentsRes, statsRes] = await Promise.all([
        api.get(`/api/school/admin/classes?${params}`),
        api.get('/api/school/admin/teachers'),
        api.get('/api/school/admin/students'),
        api.get('/api/school/admin/classes/stats')
      ]);

      setClasses(classesRes.data.classes || []);
      setTeachers(teachersRes.data.teachers || []);
      setStudents(studentsRes.data.students || []);
      setStats(statsRes.data || {});
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  }, [filterGrade, filterStream]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAddClass = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/school/admin/classes/create', newClass);
      toast.success('Class created successfully!');
      setShowAddClassModal(false);
      setNewClass({
        classNumber: '',
        stream: '',
        sections: [{ name: 'A', capacity: 40, classTeacher: '' }],
        subjects: [],
        academicYear: new Date().getFullYear().toString()
      });
      fetchData();
    } catch (error) {
      console.error('Error adding class:', error);
      toast.error(error.response?.data?.message || 'Failed to create class');
    }
  };

  const handleViewClass = async (classItem) => {
    try {
      const response = await api.get(`/api/school/admin/classes/${classItem._id}`);
      setSelectedClass(response.data.class);
      setShowClassDetailModal(true);
    } catch (error) {
      console.error('Error fetching class details:', error);
      toast.error('Failed to load class details');
    }
  };

  const handleAddSection = () => {
    const nextSection = String.fromCharCode(65 + newClass.sections.length); // A, B, C...
    setNewClass(prev => ({
      ...prev,
      sections: [...prev.sections, { name: nextSection, capacity: 40, classTeacher: '' }]
    }));
  };

  const handleRemoveSection = (index) => {
    setNewClass(prev => ({
      ...prev,
      sections: prev.sections.filter((_, i) => i !== index)
    }));
  };

  const handleAddSubject = () => {
    if (!subjectForm.name) {
      toast.error('Subject name is required');
      return;
    }
    setNewClass(prev => ({
      ...prev,
      subjects: [...prev.subjects, { ...subjectForm }]
    }));
    setSubjectForm({ name: '', code: '', isOptional: false, teachers: [] });
  };

  const handleRemoveSubject = (index) => {
    setNewClass(prev => ({
      ...prev,
      subjects: prev.subjects.filter((_, i) => i !== index)
    }));
  };


  const handleAddStudentsToClass = async () => {
    if (!selectedClass || selectedStudentsToAdd.length === 0) {
      toast.error('Please select students to add');
      return;
    }

    try {
      await api.post(`/api/school/admin/classes/${selectedClass._id}/students`, {
        studentIds: selectedStudentsToAdd
      });
      toast.success('Students added successfully!');
      setShowAddStudentsModal(false);
      setSelectedStudentsToAdd([]);
      fetchData();
    } catch (err) {
      console.error('Error adding students:', err);
      toast.error(err.response?.data?.message || 'Failed to add students');
    }
  };

  const handleDeleteClass = async (classId) => {
    if (!window.confirm('Are you sure you want to delete this class?')) return;
    
    try {
      await api.delete(`/api/school/admin/classes/${classId}`);
      toast.success('Class deleted successfully!');
      fetchData();
    } catch (err) {
      console.error('Error deleting class:', err);
      toast.error('Failed to delete class');
    }
  };

  const filteredClasses = classes.filter(cls => {
    const searchLower = searchTerm.toLowerCase();
    return (
      cls.classNumber?.toString().includes(searchLower) ||
      cls.stream?.toLowerCase().includes(searchLower) ||
      cls.academicYear?.includes(searchLower)
    );
  });

  // Add Class Modal
  const AddClassModal = () => (
    <AnimatePresence>
      {showAddClassModal && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowAddClassModal(false)}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto pointer-events-auto"
            >
              <div className="sticky top-0 bg-gradient-to-r from-indigo-500 to-purple-500 text-white p-6 rounded-t-2xl z-10">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-black mb-1">Create New Class</h2>
                    <p className="text-sm text-white/80">Set up class, sections, and subjects</p>
                  </div>
                  <button
                    onClick={() => setShowAddClassModal(false)}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <form onSubmit={handleAddClass} className="p-6 space-y-6">
                {/* Basic Info */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <School className="w-5 h-5 text-indigo-600" />
                    Basic Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Class/Grade *
                      </label>
                      <select
                        value={newClass.classNumber}
                        onChange={(e) => setNewClass(prev => ({ ...prev, classNumber: e.target.value }))}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none font-semibold"
                        required
                      >
                        <option value="">Select Class</option>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(num => (
                          <option key={num} value={num}>Class {num}</option>
                        ))}
                      </select>
                    </div>

                    {parseInt(newClass.classNumber) >= 11 && (
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                          Stream *
                        </label>
                        <select
                          value={newClass.stream}
                          onChange={(e) => setNewClass(prev => ({ ...prev, stream: e.target.value }))}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none font-semibold"
                          required={parseInt(newClass.classNumber) >= 11}
                        >
                          <option value="">Select Stream</option>
                          {streams.map(stream => (
                            <option key={stream} value={stream}>{stream}</option>
                          ))}
                        </select>
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Academic Year *
                      </label>
                      <input
                        type="text"
                        value={newClass.academicYear}
                        onChange={(e) => setNewClass(prev => ({ ...prev, academicYear: e.target.value }))}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none font-semibold"
                        placeholder="2024-2025"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Sections */}
                <div className="space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b-2 border-indigo-100">
                    <h3 className="text-xl font-black text-gray-900 flex items-center gap-3">
                      <div className="p-2 bg-indigo-100 rounded-lg">
                        <Users className="w-5 h-5 text-indigo-600" />
                      </div>
                      Sections
                    </h3>
                    <button
                      type="button"
                      onClick={handleAddSection}
                      className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold hover:shadow-lg transition-all flex items-center gap-2"
                    >
                      <Plus className="w-5 h-5" />
                      Add Section
                    </button>
                  </div>

                  <div className="space-y-4">
                    {newClass.sections.map((section, idx) => (
                      <div key={idx} className="relative bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">
                        <div className="absolute -top-3 -left-3 w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-full flex items-center justify-center font-black text-sm shadow-lg">
                          {idx + 1}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                          <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2.5">
                              Section Name *
                            </label>
                            <input
                              type="text"
                              value={section.name}
                              onChange={(e) => {
                                const newSections = [...newClass.sections];
                                newSections[idx].name = e.target.value;
                                setNewClass(prev => ({ ...prev, sections: newSections }));
                              }}
                              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none font-semibold bg-white shadow-sm"
                              placeholder="A, B, C..."
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2.5">
                              Maximum Capacity
                            </label>
                            <input
                              type="number"
                              value={section.capacity}
                              onChange={(e) => {
                                const newSections = [...newClass.sections];
                                newSections[idx].capacity = parseInt(e.target.value);
                                setNewClass(prev => ({ ...prev, sections: newSections }));
                              }}
                              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none font-semibold bg-white shadow-sm"
                              min="1"
                              placeholder="40"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2.5">
                              Class Teacher
                            </label>
                            <div className="flex gap-2">
                              <select
                                value={section.classTeacher}
                                onChange={(e) => {
                                  const newSections = [...newClass.sections];
                                  newSections[idx].classTeacher = e.target.value;
                                  setNewClass(prev => ({ ...prev, sections: newSections }));
                                }}
                                className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none font-semibold bg-white shadow-sm"
                              >
                                <option value="">Select Teacher</option>
                                {teachers.map(teacher => (
                                  <option key={teacher._id} value={teacher._id}>
                                    {teacher.name} ({teacher.subject})
                                  </option>
                                ))}
                              </select>
                              {newClass.sections.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => handleRemoveSection(idx)}
                                  className="p-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors shadow-sm"
                                  title="Remove Section"
                                >
                                  <Trash2 className="w-5 h-5" />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Subjects */}
                <div className="space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b-2 border-blue-100">
                    <h3 className="text-xl font-black text-gray-900 flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <BookOpen className="w-5 h-5 text-blue-600" />
                      </div>
                      Subjects
                    </h3>
                    <span className="text-sm text-gray-600 font-semibold">
                      {newClass.subjects.length} Subject{newClass.subjects.length !== 1 ? 's' : ''} Added
                    </span>
                  </div>

                  {/* Add Subject Form */}
                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border-2 border-blue-200 p-6 shadow-sm">
                    <h4 className="text-sm font-bold text-gray-700 mb-4 uppercase tracking-wide">Add New Subject</h4>
                    
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">
                            Subject Name *
                          </label>
                          <input
                            type="text"
                            value={subjectForm.name}
                            onChange={(e) => setSubjectForm(prev => ({ ...prev, name: e.target.value }))}
                            list="subject-suggestions"
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none font-semibold bg-white shadow-sm"
                            placeholder="e.g., Mathematics, Physics"
                          />
                          <datalist id="subject-suggestions">
                            {commonSubjects.map(sub => (
                              <option key={sub} value={sub} />
                            ))}
                          </datalist>
                        </div>

                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">
                            Subject Code <span className="text-gray-500 text-xs">(Optional)</span>
                          </label>
                          <input
                            type="text"
                            value={subjectForm.code}
                            onChange={(e) => setSubjectForm(prev => ({ ...prev, code: e.target.value }))}
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none font-semibold bg-white shadow-sm"
                            placeholder="e.g., MATH-101"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                          Assign Teachers <span className="text-gray-500 text-xs">(Hold Ctrl/Cmd to select multiple)</span>
                        </label>
                        <select
                          multiple
                          size="4"
                          value={subjectForm.teachers}
                          onChange={(e) => {
                            const selected = Array.from(e.target.selectedOptions, option => option.value);
                            setSubjectForm(prev => ({ ...prev, teachers: selected }));
                          }}
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none font-semibold bg-white shadow-sm"
                        >
                          {teachers.length === 0 ? (
                            <option disabled>No teachers available</option>
                          ) : (
                            teachers.map(teacher => (
                              <option key={teacher._id} value={teacher._id} className="py-2">
                                {teacher.name} - {teacher.subject}
                              </option>
                            ))
                          )}
                        </select>
                        {subjectForm.teachers.length > 0 && (
                          <div className="mt-2 text-sm text-blue-600 font-semibold">
                            ✓ {subjectForm.teachers.length} teacher{subjectForm.teachers.length !== 1 ? 's' : ''} selected
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <label className="flex items-center gap-3 px-4 py-2 bg-yellow-50 border-2 border-yellow-200 rounded-xl cursor-pointer hover:bg-yellow-100 transition-colors">
                          <input
                            type="checkbox"
                            checked={subjectForm.isOptional}
                            onChange={(e) => setSubjectForm(prev => ({ ...prev, isOptional: e.target.checked }))}
                            className="w-5 h-5 text-yellow-600 rounded focus:ring-2 focus:ring-yellow-300"
                          />
                          <span className="text-sm font-bold text-gray-700">Mark as Optional Subject</span>
                        </label>

                        <button
                          type="button"
                          onClick={handleAddSubject}
                          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-bold hover:shadow-lg transition-all flex items-center gap-2"
                        >
                          <Plus className="w-5 h-5" />
                          Add Subject
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Subject List */}
                  {newClass.subjects.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wide">Added Subjects</h4>
                      {newClass.subjects.map((subject, idx) => (
                        <div key={idx} className="flex items-start justify-between p-4 bg-white rounded-xl border-2 border-gray-200 shadow-sm hover:shadow-md transition-all">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-cyan-600 text-white rounded-full flex items-center justify-center font-black text-sm">
                                {idx + 1}
                              </div>
                              <div className="font-bold text-gray-900 text-lg">
                                {subject.name}
                                {subject.code && <span className="text-gray-500 ml-2 text-sm">({subject.code})</span>}
                                {subject.isOptional && (
                                  <span className="ml-3 px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-bold rounded-full border border-yellow-300">
                                    Optional
                                  </span>
                                )}
                              </div>
                            </div>
                            {subject.teachers.length > 0 && (
                              <div className="ml-11 flex flex-wrap gap-2">
                                <span className="text-sm text-gray-600 font-semibold">Teachers:</span>
                                {subject.teachers.map((tId, tIdx) => (
                                  <span key={tIdx} className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-semibold rounded-lg">
                                    {teachers.find(t => t._id === tId)?.name || 'Unknown'}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveSubject(idx)}
                            className="p-2.5 bg-red-50 text-red-600 hover:bg-red-500 hover:text-white rounded-xl transition-colors shadow-sm"
                            title="Remove Subject"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Submit Buttons */}
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowAddClassModal(false)}
                    className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-bold hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg font-bold hover:shadow-lg transition-all"
                  >
                    Create Class
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  // Class Detail Modal
  const ClassDetailModal = () => (
    <AnimatePresence>
      {showClassDetailModal && selectedClass && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowClassDetailModal(false)}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
          >
            <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-gradient-to-r from-indigo-500 to-purple-500 text-white p-6 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-black mb-1">
                      Class {selectedClass.classNumber}{selectedClass.stream && ` - ${selectedClass.stream}`}
                    </h2>
                    <p className="text-sm text-white/80">Academic Year: {selectedClass.academicYear}</p>
                  </div>
                  <button
                    onClick={() => setShowClassDetailModal(false)}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Sections */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                      <Users className="w-5 h-5 text-indigo-600" />
                      Sections ({selectedClass.sections?.length || 0})
                    </h3>
                    <button
                      onClick={() => {
                        setShowAddStudentsModal(true);
                      }}
                      className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all flex items-center gap-2"
                    >
                      <UserPlus className="w-4 h-4" />
                      Add Students
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedClass.sections?.map((section, idx) => (
                      <div key={idx} className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200">
                        <div className="flex items-center justify-between mb-3">
                          <div className="text-2xl font-black text-blue-600">Section {section.name}</div>
                          <div className="text-sm font-bold text-gray-600">
                            {section.currentStrength || 0}/{section.capacity}
                          </div>
                        </div>
                        {section.classTeacher && (
                          <div className="flex items-center gap-2 text-sm text-gray-700">
                            <GraduationCap className="w-4 h-4" />
                            <span className="font-semibold">
                              {typeof section.classTeacher === 'object' 
                                ? section.classTeacher.name 
                                : teachers.find(t => t._id === section.classTeacher)?.name || 'Not assigned'}
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Subjects */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-indigo-600" />
                    Subjects ({selectedClass.subjects?.length || 0})
                  </h3>
                  <div className="space-y-3">
                    {selectedClass.subjects?.map((subject, idx) => (
                      <div key={idx} className="p-4 bg-white rounded-xl border-2 border-gray-200">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="font-bold text-gray-900 text-lg">
                              {subject.name}
                              {subject.code && <span className="text-gray-500 ml-2">({subject.code})</span>}
                              {subject.isOptional && (
                                <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">Optional</span>
                              )}
                            </div>
                            {subject.teachers && subject.teachers.length > 0 && (
                              <div className="mt-2 flex flex-wrap gap-2">
                                {subject.teachers.map((teacher, tIdx) => (
                                  <div key={tIdx} className="flex items-center gap-2 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-lg text-sm font-semibold">
                                    <GraduationCap className="w-4 h-4" />
                                    {typeof teacher === 'object' ? teacher.name : teachers.find(t => t._id === teacher)?.name || 'Unknown'}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Students */}
                {selectedClass.students && selectedClass.students.length > 0 && (
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Users className="w-5 h-5 text-indigo-600" />
                      Students ({selectedClass.students.length})
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {selectedClass.students.map((student, idx) => (
                        <div key={idx} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                          <div className="font-semibold text-gray-900">
                            {typeof student === 'object' ? student.name : student}
                          </div>
                          {typeof student === 'object' && student.rollNumber && (
                            <div className="text-sm text-gray-600">{student.rollNumber}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  // Add Students Modal
  const AddStudentsModal = () => (
    <AnimatePresence>
      {showAddStudentsModal && selectedClass && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowAddStudentsModal(false)}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
          >
            <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-6 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-black mb-1">Add Students to Class</h2>
                    <p className="text-sm text-white/80">
                      Class {selectedClass.classNumber}{selectedClass.stream && ` - ${selectedClass.stream}`}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowAddStudentsModal(false)}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="mb-4">
                  <input
                    type="text"
                    placeholder="Search students..."
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none font-semibold"
                  />
                </div>

                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {students.filter(s => s.grade === selectedClass.classNumber).map((student) => (
                    <div
                      key={student._id}
                      onClick={() => {
                        setSelectedStudentsToAdd(prev =>
                          prev.includes(student._id)
                            ? prev.filter(id => id !== student._id)
                            : [...prev, student._id]
                        );
                      }}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        selectedStudentsToAdd.includes(student._id)
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-bold text-gray-900">{student.name}</div>
                          <div className="text-sm text-gray-600">
                            Roll: {student.rollNumber} • Grade: {student.grade}
                          </div>
                        </div>
                        {selectedStudentsToAdd.includes(student._id) && (
                          <CheckCircle className="w-6 h-6 text-blue-600" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
                  <div className="text-sm font-semibold text-gray-600">
                    {selectedStudentsToAdd.length} student(s) selected
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowAddStudentsModal(false)}
                      className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-bold hover:bg-gray-300 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddStudentsToClass}
                      className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg font-bold hover:shadow-lg transition-all"
                      disabled={selectedStudentsToAdd.length === 0}
                    >
                      Add Students
                    </button>
                  </div>
                </div>
              </div>
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
          className="w-20 h-20 border-4 border-indigo-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 pb-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white py-8 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl font-black mb-2 flex items-center gap-3">
              <School className="w-10 h-10" />
              Class Management
            </h1>
            <p className="text-lg text-white/90">
              {filteredClasses.length} classes • {stats.totalSections || 0} sections
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg border-2 border-gray-100 p-4"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 bg-indigo-100 rounded-lg">
                <School className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Classes</p>
                <p className="text-2xl font-black text-gray-900">{stats.total || 0}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="bg-white rounded-xl shadow-lg border-2 border-gray-100 p-4"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Sections</p>
                <p className="text-2xl font-black text-gray-900">{stats.totalSections || 0}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-lg border-2 border-gray-100 p-4"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <GraduationCap className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Students</p>
                <p className="text-2xl font-black text-gray-900">{stats.totalStudents || 0}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-white rounded-xl shadow-lg border-2 border-gray-100 p-4"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <BookOpen className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Subjects</p>
                <p className="text-2xl font-black text-gray-900">{stats.totalSubjects || 0}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Search & Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-4 mb-6"
        >
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-2 flex-1 min-w-[200px]">
              <Search className="w-5 h-5 text-gray-500" />
              <input
                type="text"
                placeholder="Search classes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none font-semibold"
              />
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <select
                value={filterGrade}
                onChange={(e) => setFilterGrade(e.target.value)}
                className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none bg-white font-semibold"
              >
                <option value="all">All Grades</option>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(grade => (
                  <option key={grade} value={grade}>Class {grade}</option>
                ))}
              </select>

              <select
                value={filterStream}
                onChange={(e) => setFilterStream(e.target.value)}
                className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none bg-white font-semibold"
              >
                <option value="all">All Streams</option>
                {streams.map(stream => (
                  <option key={stream} value={stream}>{stream}</option>
                ))}
              </select>

              <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white shadow' : ''}`}
                >
                  <Grid className="w-5 h-5 text-gray-700" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white shadow' : ''}`}
                >
                  <List className="w-5 h-5 text-gray-700" />
                </button>
              </div>

              <button
                onClick={() => setShowAddClassModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
              >
                <Plus className="w-4 h-4" />
                Create Class
              </button>
            </div>
          </div>
        </motion.div>

        {/* Classes Grid */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClasses.map((classItem, idx) => (
              <motion.div
                key={classItem._id || idx}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.02 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6 hover:shadow-xl hover:border-indigo-300 transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-black text-xl shadow-lg">
                      {classItem.classNumber}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">Class {classItem.classNumber}</h3>
                      {classItem.stream && (
                        <p className="text-xs text-gray-600">{classItem.stream}</p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteClass(classItem._id)}
                    className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="text-center p-2 rounded-lg bg-blue-50">
                    <p className="text-xs text-gray-600">Sections</p>
                    <p className="text-lg font-black text-blue-600">{classItem.sections?.length || 0}</p>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-green-50">
                    <p className="text-xs text-gray-600">Students</p>
                    <p className="text-lg font-black text-green-600">{classItem.totalStudents || 0}</p>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-purple-50">
                    <p className="text-xs text-gray-600">Subjects</p>
                    <p className="text-lg font-black text-purple-600">{classItem.subjects?.length || 0}</p>
                  </div>
                </div>

                <div className="text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>Academic Year: {classItem.academicYear}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleViewClass(classItem)}
                  className="w-full py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
                >
                  View Details
                </button>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="text-left py-4 px-6 text-sm font-bold text-gray-700">Class</th>
                  <th className="text-left py-4 px-6 text-sm font-bold text-gray-700">Stream</th>
                  <th className="text-left py-4 px-6 text-sm font-bold text-gray-700">Sections</th>
                  <th className="text-left py-4 px-6 text-sm font-bold text-gray-700">Students</th>
                  <th className="text-left py-4 px-6 text-sm font-bold text-gray-700">Subjects</th>
                  <th className="text-left py-4 px-6 text-sm font-bold text-gray-700">Academic Year</th>
                  <th className="text-left py-4 px-6 text-sm font-bold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredClasses.map((classItem, idx) => (
                  <motion.tr
                    key={classItem._id || idx}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.02 }}
                    className="border-b border-gray-100 hover:bg-indigo-50 transition-colors"
                  >
                    <td className="py-4 px-6 font-bold text-gray-900">Class {classItem.classNumber}</td>
                    <td className="py-4 px-6 text-sm font-semibold text-gray-900">{classItem.stream || '-'}</td>
                    <td className="py-4 px-6 text-sm font-bold text-gray-900">{classItem.sections?.length || 0}</td>
                    <td className="py-4 px-6 text-sm font-semibold text-gray-900">{classItem.totalStudents || 0}</td>
                    <td className="py-4 px-6 text-sm font-semibold text-gray-900">{classItem.subjects?.length || 0}</td>
                    <td className="py-4 px-6 text-sm text-gray-600">{classItem.academicYear}</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleViewClass(classItem)}
                          className="p-2 hover:bg-indigo-100 rounded-lg transition-all"
                        >
                          <Eye className="w-5 h-5 text-indigo-600" />
                        </button>
                        <button
                          onClick={() => handleDeleteClass(classItem._id)}
                          className="p-2 hover:bg-red-100 rounded-lg transition-all"
                        >
                          <Trash2 className="w-5 h-5 text-red-600" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {filteredClasses.length === 0 && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-12 text-center"
          >
            <School className="w-20 h-20 mx-auto mb-4 text-gray-400" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Classes Found</h3>
            <p className="text-gray-600 mb-6">Get started by creating your first class</p>
            <button
              onClick={() => setShowAddClassModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all flex items-center gap-2 mx-auto"
            >
              <Plus className="w-5 h-5" />
              Create Class
            </button>
          </motion.div>
        )}
      </div>

      {/* Modals */}
      <AddClassModal />
      <ClassDetailModal />
      <AddStudentsModal />
    </div>
  );
};

export default SchoolAdminClasses;

