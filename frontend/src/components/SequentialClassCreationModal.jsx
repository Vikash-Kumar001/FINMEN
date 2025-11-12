import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Users, GraduationCap, School, Plus, Trash2, ArrowRight, ArrowLeft, CheckCircle
} from 'lucide-react';
import api from '../utils/api';
import { toast } from 'react-hot-toast';

const SequentialClassCreationModal = ({
  showModal,
  setShowModal,
  onSuccess
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  // Step 1: Class Information
  const [classInfo, setClassInfo] = useState({
    classNumber: '',
    stream: '',
    academicYear: new Date().getFullYear().toString(),
    sections: [{ name: 'A', capacity: 40 }]
  });

  // Step 2: Teachers
  const [teachers, setTeachers] = useState([]);
  const [selectedTeachers, setSelectedTeachers] = useState([]);
  const [newTeacher, setNewTeacher] = useState({
    name: '',
    email: '',
    phone: '',
    qualification: '',
    experience: '',
    joiningDate: ''
  });

  // Step 3: Students
  const [students, setStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [newStudent, setNewStudent] = useState({
    name: '',
    email: '',
    rollNumber: '',
    admissionNumber: '',
    phone: '',
    grade: '',
    section: '',
    gender: '',
    password: ''
  });

  const streams = ['Science', 'Commerce', 'Arts'];
  const grades = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
  const genders = ['Male', 'Female', 'Other'];

  // Fetch existing teachers and students
  useEffect(() => {
    if (showModal) {
      fetchExistingData();
    }
  }, [showModal]);

  const fetchExistingData = async () => {
    try {
      const [teachersRes, studentsRes] = await Promise.all([
        api.get('/api/school/admin/teachers'),
        api.get('/api/school/admin/students')
      ]);
      setTeachers(teachersRes.data.teachers || []);
      setStudents(studentsRes.data.students || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleAddSection = () => {
    const nextSection = String.fromCharCode(65 + classInfo.sections.length);
    setClassInfo(prev => ({
      ...prev,
      sections: [...prev.sections, { name: nextSection, capacity: 40 }]
    }));
  };

  const handleRemoveSection = (index) => {
    setClassInfo(prev => ({
      ...prev,
      sections: prev.sections.filter((_, i) => i !== index)
    }));
  };

  const handleAddTeacher = () => {
    if (!newTeacher.name || !newTeacher.email) {
      toast.error('Please fill in the required teacher fields');
      return;
    }
    setSelectedTeachers(prev => [...prev, { ...newTeacher, id: Date.now() }]);
    setNewTeacher({
      name: '',
      email: '',
      phone: '',
      qualification: '',
      experience: '',
      joiningDate: ''
    });
    toast.success('Teacher added to class');
  };

  const handleRemoveTeacher = (index) => {
    setSelectedTeachers(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddStudent = () => {
    if (!newStudent.name || !newStudent.email || !newStudent.rollNumber || !newStudent.admissionNumber || !newStudent.grade || !newStudent.section || !newStudent.gender || !newStudent.password) {
      toast.error('Please fill in all required student fields');
      return;
    }
    setSelectedStudents(prev => [...prev, { ...newStudent, id: Date.now() }]);
    setNewStudent({
      name: '',
      email: '',
      rollNumber: '',
      admissionNumber: '',
      phone: '',
      grade: '',
      section: '',
      gender: '',
      password: ''
    });
    toast.success('Student added to class');
  };

  const handleRemoveStudent = (index) => {
    setSelectedStudents(prev => prev.filter((_, i) => i !== index));
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (!classInfo.classNumber || !classInfo.academicYear) {
        toast.error('Please fill in all required class fields');
        return;
      }
      if (parseInt(classInfo.classNumber) >= 11 && !classInfo.stream) {
        toast.error('Please select a stream for class 11 and 12');
        return;
      }
    } else if (currentStep === 2) {
      if (selectedTeachers.length === 0) {
        toast.error('Please add at least one teacher');
        return;
      }
    } else if (currentStep === 3) {
      if (selectedStudents.length === 0) {
        toast.error('Please add at least one student');
        return;
      }
    }
    setCurrentStep(prev => prev + 1);
  };

  const handlePrevious = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const classData = {
        classInfo,
        teachers: selectedTeachers,
        students: selectedStudents
      };

      await api.post('/api/school/admin/classes/create-sequential', classData);
      toast.success('Class created successfully with teachers and students!');
      setShowModal(false);
      onSuccess?.();
      resetForm();
    } catch (error) {
      console.error('Error creating class:', error);
      toast.error(error.response?.data?.message || 'Failed to create class');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setCurrentStep(1);
    setClassInfo({
      classNumber: '',
      stream: '',
      academicYear: new Date().getFullYear().toString(),
      sections: [{ name: 'A', capacity: 40 }]
    });
    setSelectedTeachers([]);
    setSelectedStudents([]);
    setNewTeacher({
      name: '',
      email: '',
      phone: '',
      qualification: '',
      experience: '',
      joiningDate: ''
    });
    setNewStudent({
      name: '',
      email: '',
      rollNumber: '',
      admissionNumber: '',
      phone: '',
      grade: '',
      section: '',
      gender: '',
      password: ''
    });
  };

  const steps = [
    { number: 1, title: 'Class Information', icon: School },
    { number: 2, title: 'Add Teachers', icon: GraduationCap },
    { number: 3, title: 'Add Students', icon: Users }
  ];

  return (
    <AnimatePresence>
      {showModal && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowModal(false)}
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
              className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[95vh] overflow-y-auto pointer-events-auto"
            >
              {/* Header */}
              <div className="sticky top-0 bg-gradient-to-r from-indigo-500 to-purple-500 text-white p-6 rounded-t-2xl z-10">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-black mb-1">Create New Class</h2>
                    <p className="text-sm text-white/80">Step {currentStep} of 3: {steps[currentStep - 1].title}</p>
                  </div>
                  <button
                    onClick={() => setShowModal(false)}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Progress Steps */}
                <div className="flex items-center justify-center mt-6 space-x-4">
                  {steps.map((step, index) => {
                    const Icon = step.icon;
                    const isActive = currentStep === step.number;
                    const isCompleted = currentStep > step.number;
                    
                    return (
                      <div key={step.number} className="flex items-center">
                        <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all ${
                          isCompleted 
                            ? 'bg-green-500 border-green-500 text-white' 
                            : isActive 
                            ? 'bg-white text-indigo-500 border-white' 
                            : 'bg-transparent border-white/50 text-white/50'
                        }`}>
                          {isCompleted ? (
                            <CheckCircle className="w-6 h-6" />
                          ) : (
                            <Icon className="w-5 h-5" />
                          )}
                        </div>
                        <div className="ml-3 text-left">
                          <div className={`text-sm font-bold ${isActive ? 'text-white' : 'text-white/70'}`}>
                            {step.title}
                          </div>
                        </div>
                        {index < steps.length - 1 && (
                          <div className={`w-8 h-0.5 mx-4 ${isCompleted ? 'bg-green-500' : 'bg-white/30'}`} />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Step 1: Class Information */}
                {currentStep === 1 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                  >
                    <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                      <School className="w-6 h-6 text-indigo-600" />
                      Class Basic Information
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                          Class/Grade *
                        </label>
                        <select
                          value={classInfo.classNumber}
                          onChange={(e) => setClassInfo(prev => ({ ...prev, classNumber: e.target.value }))}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none font-semibold"
                          required
                        >
                          <option value="">Select Class</option>
                          {grades.map(grade => (
                            <option key={grade} value={grade}>Class {grade}</option>
                          ))}
                        </select>
                      </div>

                      {parseInt(classInfo.classNumber) >= 11 && (
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">
                            Stream *
                          </label>
                          <select
                            value={classInfo.stream}
                            onChange={(e) => setClassInfo(prev => ({ ...prev, stream: e.target.value }))}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none font-semibold"
                            required={parseInt(classInfo.classNumber) >= 11}
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
                          value={classInfo.academicYear}
                          onChange={(e) => setClassInfo(prev => ({ ...prev, academicYear: e.target.value }))}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none font-semibold"
                          placeholder="2024-2025"
                          required
                        />
                      </div>
                    </div>

                    {/* Sections */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-lg font-bold text-gray-900">Sections</h4>
                        <button
                          type="button"
                          onClick={handleAddSection}
                          className="px-4 py-2 bg-indigo-500 text-white rounded-lg font-semibold hover:bg-indigo-600 transition-colors flex items-center gap-2"
                        >
                          <Plus className="w-4 h-4" />
                          Add Section
                        </button>
                      </div>

                      <div className="space-y-3">
                        {classInfo.sections.map((section, idx) => (
                          <div key={idx} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border-2 border-gray-200">
                            <div className="flex-1 grid grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">
                                  Section Name *
                                </label>
                                <input
                                  type="text"
                                  value={section.name}
                                  onChange={(e) => {
                                    const newSections = [...classInfo.sections];
                                    newSections[idx].name = e.target.value;
                                    setClassInfo(prev => ({ ...prev, sections: newSections }));
                                  }}
                                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none font-semibold"
                                  placeholder="A, B, C..."
                                  required
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">
                                  Capacity
                                </label>
                                <input
                                  type="number"
                                  value={section.capacity}
                                  onChange={(e) => {
                                    const newSections = [...classInfo.sections];
                                    newSections[idx].capacity = parseInt(e.target.value);
                                    setClassInfo(prev => ({ ...prev, sections: newSections }));
                                  }}
                                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none font-semibold"
                                  min="1"
                                  placeholder="40"
                                />
                              </div>
                            </div>
                            {classInfo.sections.length > 1 && (
                              <button
                                type="button"
                                onClick={() => handleRemoveSection(idx)}
                                className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                                title="Remove Section"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Add Teachers */}
                {currentStep === 2 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                  >
                    <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                      <GraduationCap className="w-6 h-6 text-indigo-600" />
                      Add Teachers (Minimum 1 Required)
                    </h3>

                    {/* Add New Teacher Form */}
                    <div className="bg-gray-50 rounded-lg p-6 border-2 border-gray-200">
                      <h4 className="text-lg font-bold text-gray-900 mb-4">Add New Teacher</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">
                            Full Name *
                          </label>
                          <input
                            type="text"
                            value={newTeacher.name}
                            onChange={(e) => setNewTeacher(prev => ({ ...prev, name: e.target.value }))}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none font-semibold"
                            placeholder="Enter teacher name"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">
                            Email *
                          </label>
                          <input
                            type="email"
                            value={newTeacher.email}
                            onChange={(e) => setNewTeacher(prev => ({ ...prev, email: e.target.value }))}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none font-semibold"
                            placeholder="teacher@example.com"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">
                            Phone
                          </label>
                          <input
                            type="tel"
                            value={newTeacher.phone}
                            onChange={(e) => setNewTeacher(prev => ({ ...prev, phone: e.target.value }))}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none font-semibold"
                            placeholder="+91 98765 43210"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">
                            Qualification
                          </label>
                          <input
                            type="text"
                            value={newTeacher.qualification}
                            onChange={(e) => setNewTeacher(prev => ({ ...prev, qualification: e.target.value }))}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none font-semibold"
                            placeholder="B.Ed, M.A., etc."
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">
                            Experience (Years)
                          </label>
                          <input
                            type="number"
                            value={newTeacher.experience}
                            onChange={(e) => setNewTeacher(prev => ({ ...prev, experience: e.target.value }))}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none font-semibold"
                            placeholder="5"
                            min="0"
                          />
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleAddTeacher}
                        className="mt-4 px-6 py-3 bg-indigo-500 text-white rounded-lg font-semibold hover:bg-indigo-600 transition-colors flex items-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Add Teacher
                      </button>
                    </div>

                    {/* Selected Teachers List */}
                    {selectedTeachers.length > 0 && (
                      <div>
                        <h4 className="text-lg font-bold text-gray-900 mb-4">
                          Selected Teachers ({selectedTeachers.length})
                        </h4>
                        <div className="space-y-3">
                          {selectedTeachers.map((teacher, idx) => (
                            <div key={idx} className="flex items-center justify-between p-4 bg-white rounded-lg border-2 border-gray-200">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center text-white font-bold">
                                  {teacher.name.charAt(0)}
                                </div>
                                <div>
                                  <div className="font-bold text-gray-900">{teacher.name}</div>
                                  <div className="text-sm text-gray-600">{teacher.email}</div>
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleRemoveTeacher(idx)}
                                className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Step 3: Add Students */}
                {currentStep === 3 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                  >
                    <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                      <Users className="w-6 h-6 text-indigo-600" />
                      Add Students (Minimum 1 Required)
                    </h3>

                    {/* Add New Student Form */}
                    <div className="bg-gray-50 rounded-lg p-6 border-2 border-gray-200">
                      <h4 className="text-lg font-bold text-gray-900 mb-4">Add New Student</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">
                            Full Name *
                          </label>
                          <input
                            type="text"
                            value={newStudent.name}
                            onChange={(e) => setNewStudent(prev => ({ ...prev, name: e.target.value }))}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none font-semibold"
                            placeholder="Enter student name"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">
                            Email *
                          </label>
                          <input
                            type="email"
                            value={newStudent.email}
                            onChange={(e) => setNewStudent(prev => ({ ...prev, email: e.target.value }))}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none font-semibold"
                            placeholder="student@example.com"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">
                            Roll Number *
                          </label>
                          <input
                            type="text"
                            value={newStudent.rollNumber}
                            onChange={(e) => setNewStudent(prev => ({ ...prev, rollNumber: e.target.value }))}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none font-semibold"
                            placeholder="ROLL-001"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">
                            Admission Number *
                          </label>
                          <input
                            type="text"
                            value={newStudent.admissionNumber}
                            onChange={(e) => setNewStudent(prev => ({ ...prev, admissionNumber: e.target.value }))}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none font-semibold"
                            placeholder="ADM2401001"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">
                            Phone
                          </label>
                          <input
                            type="tel"
                            value={newStudent.phone}
                            onChange={(e) => setNewStudent(prev => ({ ...prev, phone: e.target.value }))}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none font-semibold"
                            placeholder="+91 98765 43210"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">
                            Grade *
                          </label>
                          <select
                            value={newStudent.grade}
                            onChange={(e) => setNewStudent(prev => ({ ...prev, grade: e.target.value }))}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none font-semibold"
                          >
                            <option value="">Select Grade</option>
                            {grades.map(grade => (
                              <option key={grade} value={grade}>Class {grade}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">
                            Section *
                          </label>
                          <select
                            value={newStudent.section}
                            onChange={(e) => setNewStudent(prev => ({ ...prev, section: e.target.value }))}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none font-semibold"
                          >
                            <option value="">Select Section</option>
                            {classInfo.sections.map(section => (
                              <option key={section.name} value={section.name}>Section {section.name}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">
                            Gender *
                          </label>
                          <select
                            value={newStudent.gender}
                            onChange={(e) => setNewStudent(prev => ({ ...prev, gender: e.target.value }))}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none font-semibold"
                          >
                            <option value="">Select Gender</option>
                            {genders.map(gender => (
                              <option key={gender} value={gender}>{gender}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">
                            Password *
                          </label>
                          <input
                            type="password"
                            value={newStudent.password}
                            onChange={(e) => setNewStudent(prev => ({ ...prev, password: e.target.value }))}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none font-semibold"
                            placeholder="Enter login password"
                            minLength="6"
                          />
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleAddStudent}
                        className="mt-4 px-6 py-3 bg-indigo-500 text-white rounded-lg font-semibold hover:bg-indigo-600 transition-colors flex items-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Add Student
                      </button>
                    </div>

                    {/* Selected Students List */}
                    {selectedStudents.length > 0 && (
                      <div>
                        <h4 className="text-lg font-bold text-gray-900 mb-4">
                          Selected Students ({selectedStudents.length})
                        </h4>
                        <div className="space-y-3">
                          {selectedStudents.map((student, idx) => (
                            <div key={idx} className="flex items-center justify-between p-4 bg-white rounded-lg border-2 border-gray-200">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
                                  {student.name.charAt(0)}
                                </div>
                                <div>
                                  <div className="font-bold text-gray-900">{student.name}</div>
                                  <div className="text-sm text-gray-600">
                                    Roll: {student.rollNumber} • Adm: {student.admissionNumber} • Class {student.grade}-{student.section} • {student.email}
                                  </div>
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleRemoveStudent(idx)}
                                className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between items-center pt-6 border-t border-gray-200">
                  <div>
                    {currentStep > 1 && (
                      <button
                        type="button"
                        onClick={handlePrevious}
                        className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-bold hover:bg-gray-300 transition-colors flex items-center gap-2"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        Previous
                      </button>
                    )}
                  </div>
                  
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-bold hover:bg-gray-300 transition-colors"
                    >
                      Cancel
                    </button>
                    
                    {currentStep < 3 ? (
                      <button
                        type="button"
                        onClick={handleNext}
                        className="px-6 py-3 bg-indigo-500 text-white rounded-lg font-bold hover:bg-indigo-600 transition-colors flex items-center gap-2"
                      >
                        Next
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={loading || selectedTeachers.length === 0 || selectedStudents.length === 0}
                        className="px-6 py-3 bg-green-500 text-white rounded-lg font-bold hover:bg-green-600 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? 'Creating...' : 'Create Class'}
                        <CheckCircle className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default React.memo(SequentialClassCreationModal);
