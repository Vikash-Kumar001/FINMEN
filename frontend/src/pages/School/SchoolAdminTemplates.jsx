import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  FileText, Search, Filter, Grid, List, Plus, Download, Eye, Edit, Trash2,
  Upload, X, Check, Star, BookOpen, Target, Tag, Award, Globe, Lock, 
  CheckCircle, AlertCircle, Zap, Calendar, User, ChevronDown, ExternalLink
} from 'lucide-react';
import api from '../../utils/api';
import { toast } from 'react-hot-toast';
import analytics from '../../utils/analytics';

const SchoolAdminTemplates = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [templates, setTemplates] = useState([]);
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [filterVisibility, setFilterVisibility] = useState('all');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [uploadForm, setUploadForm] = useState({
    title: '',
    description: '',
    category: 'assignment',
    type: 'quiz',
    subject: '',
    gradeLevel: [],
    isPremium: false,
    price: 0,
    isPublic: false,
    tags: '',
    pillarAlignment: [],
    nepCompetencies: []
  });
  const [availableNEPCompetencies, setAvailableNEPCompetencies] = useState([]);
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    fetchTemplates();
    fetchNEPCompetencies();
  }, [filterCategory, filterType, filterVisibility]);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filterCategory !== 'all') params.append('category', filterCategory);
      if (filterType !== 'all') params.append('type', filterType);
      
      const response = await api.get(`/api/school/admin/templates?${params}`);
      setTemplates(response.data.templates || []);
    } catch (error) {
      console.error('Error fetching templates:', error);
      toast.error('Failed to load templates');
    } finally {
      setLoading(false);
    }
  };

  const fetchNEPCompetencies = async () => {
    try {
      const response = await api.get('/api/school/admin/nep/competencies');
      setAvailableNEPCompetencies(response.data.competencies || []);
    } catch (error) {
      console.error('Error fetching NEP competencies:', error);
    }
  };

  const handleUploadTemplate = async (e) => {
    e.preventDefault();
    
    if (!uploadForm.title || !uploadForm.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const templateData = {
        ...uploadForm,
        gradeLevel: Array.isArray(uploadForm.gradeLevel) ? uploadForm.gradeLevel : [uploadForm.gradeLevel],
        tags: uploadForm.tags.split(',').map(t => t.trim()).filter(Boolean),
        metadata: {
          pillarAlignment: uploadForm.pillarAlignment,
          nepLinks: uploadForm.nepCompetencies
        }
      };

      await api.post('/api/school/admin/templates', templateData);
      analytics.trackTemplateCreate(null, uploadForm.title);
      toast.success('Template uploaded successfully!');
      setShowUploadModal(false);
      resetUploadForm();
      fetchTemplates();
    } catch (error) {
      console.error('Error uploading template:', error);
      toast.error(error.response?.data?.message || 'Failed to upload template');
    }
  };

  const handleUpdateTemplate = async (e) => {
    e.preventDefault();
    
    try {
      const updateData = {
        ...uploadForm,
        gradeLevel: Array.isArray(uploadForm.gradeLevel) ? uploadForm.gradeLevel : [uploadForm.gradeLevel],
        tags: typeof uploadForm.tags === 'string' 
          ? uploadForm.tags.split(',').map(t => t.trim()).filter(Boolean)
          : uploadForm.tags,
        metadata: {
          pillarAlignment: uploadForm.pillarAlignment,
          nepLinks: uploadForm.nepCompetencies
        }
      };

      await api.put(`/api/school/admin/templates/${selectedTemplate._id}`, updateData);
      toast.success('Template updated successfully!');
      setShowEditModal(false);
      setSelectedTemplate(null);
      resetUploadForm();
      fetchTemplates();
    } catch (error) {
      console.error('Error updating template:', error);
      toast.error('Failed to update template');
    }
  };

  const handleDeleteTemplate = async (templateId) => {
    if (!window.confirm('Are you sure you want to delete this template?')) {
      return;
    }

    try {
      setProcessingId(templateId);
      await api.delete(`/api/school/admin/templates/${templateId}`);
      toast.success('Template deleted successfully');
      fetchTemplates();
    } catch (error) {
      console.error('Error deleting template:', error);
      toast.error('Failed to delete template');
    } finally {
      setProcessingId(null);
    }
  };

  const handleEditTemplate = (template) => {
    setSelectedTemplate(template);
    setUploadForm({
      title: template.title,
      description: template.description,
      category: template.category,
      type: template.type,
      subject: template.subject || '',
      gradeLevel: template.gradeLevel || [],
      isPremium: template.isPremium,
      price: template.price || 0,
      isPublic: template.isPublic,
      tags: Array.isArray(template.tags) ? template.tags.join(', ') : '',
      pillarAlignment: template.metadata?.pillarAlignment || [],
      nepCompetencies: template.metadata?.nepLinks || []
    });
    setShowEditModal(true);
  };

  const handleExportTemplates = async () => {
    try {
      toast.loading('Generating export...');
      const params = new URLSearchParams();
      if (filterCategory !== 'all') params.append('category', filterCategory);
      
      const response = await api.get(`/api/school/admin/templates/export?format=csv&${params}`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `templates-${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.dismiss();
      toast.success('Templates exported successfully!');
    } catch (error) {
      toast.dismiss();
      console.error('Error exporting templates:', error);
      toast.error('Failed to export templates');
    }
  };

  const resetUploadForm = () => {
    setUploadForm({
      title: '',
      description: '',
      category: 'assignment',
      type: 'quiz',
      subject: '',
      gradeLevel: [],
      isPremium: false,
      price: 0,
      isPublic: false,
      tags: '',
      pillarAlignment: [],
      nepCompetencies: []
    });
  };

  const togglePillar = (pillar) => {
    setUploadForm(prev => ({
      ...prev,
      pillarAlignment: prev.pillarAlignment.includes(pillar)
        ? prev.pillarAlignment.filter(p => p !== pillar)
        : [...prev.pillarAlignment, pillar]
    }));
  };

  const toggleNEPCompetency = (competencyId) => {
    setUploadForm(prev => ({
      ...prev,
      nepCompetencies: prev.nepCompetencies.includes(competencyId)
        ? prev.nepCompetencies.filter(id => id !== competencyId)
        : [...prev.nepCompetencies, competencyId]
    }));
  };

  const toggleGrade = (grade) => {
    setUploadForm(prev => ({
      ...prev,
      gradeLevel: prev.gradeLevel.includes(grade)
        ? prev.gradeLevel.filter(g => g !== grade)
        : [...prev.gradeLevel, grade]
    }));
  };

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesVisibility = filterVisibility === 'all' ||
                              (filterVisibility === 'public' && template.isPublic) ||
                              (filterVisibility === 'private' && !template.isPublic);
    return matchesSearch && matchesVisibility;
  });

  const pillars = [
    { id: 'uvls', name: 'UVLS', color: 'bg-blue-500' },
    { id: 'dcos', name: 'DCOS', color: 'bg-green-500' },
    { id: 'moral', name: 'Moral', color: 'bg-purple-500' },
    { id: 'ehe', name: 'EHE', color: 'bg-pink-500' },
    { id: 'crgc', name: 'CRGC', color: 'bg-orange-500' }
  ];

  // Upload Modal Component
  const UploadTemplateModal = () => (
    <AnimatePresence>
      {showUploadModal && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowUploadModal(false)}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
          >
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-black mb-1">Upload New Template</h2>
                    <p className="text-sm text-white/80">Fill in the template details</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowUploadModal(false)}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <form onSubmit={handleUploadTemplate} className="p-6 space-y-6">
                {/* Basic Info */}
                <div className="space-y-4">
                  <h3 className="font-bold text-gray-900 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-purple-600" />
                    Basic Information
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-bold text-gray-700 mb-2">Title *</label>
                      <input
                        type="text"
                        value={uploadForm.title}
                        onChange={(e) => setUploadForm({...uploadForm, title: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none font-semibold"
                        placeholder="Enter template title"
                        required
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-bold text-gray-700 mb-2">Description *</label>
                      <textarea
                        value={uploadForm.description}
                        onChange={(e) => setUploadForm({...uploadForm, description: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none font-semibold resize-none"
                        rows="3"
                        placeholder="Describe the template"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
                      <select
                        value={uploadForm.category}
                        onChange={(e) => setUploadForm({...uploadForm, category: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none font-semibold"
                      >
                        <option value="assignment">Assignment</option>
                        <option value="quiz">Quiz</option>
                        <option value="worksheet">Worksheet</option>
                        <option value="project">Project</option>
                        <option value="exam">Exam</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Type</label>
                      <select
                        value={uploadForm.type}
                        onChange={(e) => setUploadForm({...uploadForm, type: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none font-semibold"
                      >
                        <option value="quiz">Quiz</option>
                        <option value="exercise">Exercise</option>
                        <option value="assessment">Assessment</option>
                        <option value="practice">Practice</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Subject</label>
                      <input
                        type="text"
                        value={uploadForm.subject}
                        onChange={(e) => setUploadForm({...uploadForm, subject: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none font-semibold"
                        placeholder="e.g., Mathematics"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Tags (comma-separated)</label>
                      <input
                        type="text"
                        value={uploadForm.tags}
                        onChange={(e) => setUploadForm({...uploadForm, tags: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none font-semibold"
                        placeholder="algebra, equations, Grade 8"
                      />
                    </div>
                  </div>
                </div>

                {/* Grade Levels */}
                <div className="space-y-4">
                  <h3 className="font-bold text-gray-900 flex items-center gap-2">
                    <Award className="w-5 h-5 text-purple-600" />
                    Grade Levels
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {[6, 7, 8, 9, 10, 11, 12].map(grade => (
                      <button
                        key={grade}
                        type="button"
                        onClick={() => toggleGrade(grade)}
                        className={`px-4 py-2 rounded-lg font-bold transition-all ${
                          uploadForm.gradeLevel.includes(grade)
                            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        Grade {grade}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Pillar Alignment */}
                <div className="space-y-4">
                  <h3 className="font-bold text-gray-900 flex items-center gap-2">
                    <Target className="w-5 h-5 text-purple-600" />
                    Pillar Alignment
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {pillars.map(pillar => (
                      <button
                        key={pillar.id}
                        type="button"
                        onClick={() => togglePillar(pillar.id)}
                        className={`px-4 py-2 rounded-lg font-bold transition-all ${
                          uploadForm.pillarAlignment.includes(pillar.id)
                            ? `${pillar.color} text-white shadow-lg`
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        {pillar.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* NEP Competencies */}
                <div className="space-y-4">
                  <h3 className="font-bold text-gray-900 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-purple-600" />
                    NEP 2020 Competencies ({uploadForm.nepCompetencies.length} selected)
                  </h3>
                  <div className="max-h-48 overflow-y-auto border-2 border-gray-200 rounded-lg p-4 space-y-2">
                    {availableNEPCompetencies.slice(0, 20).map(comp => (
                      <label key={comp.competencyId} className="flex items-start gap-3 cursor-pointer p-2 hover:bg-purple-50 rounded-lg transition-colors">
                        <input
                          type="checkbox"
                          checked={uploadForm.nepCompetencies.includes(comp.competencyId)}
                          onChange={() => toggleNEPCompetency(comp.competencyId)}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900 text-sm">{comp.competencyId} - {comp.title}</p>
                          <p className="text-xs text-gray-600">{comp.description}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Visibility & Premium */}
                <div className="space-y-4">
                  <h3 className="font-bold text-gray-900 flex items-center gap-2">
                    <Globe className="w-5 h-5 text-purple-600" />
                    Visibility & Pricing
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-purple-500 transition-colors">
                      <input
                        type="checkbox"
                        checked={uploadForm.isPublic}
                        onChange={(e) => setUploadForm({...uploadForm, isPublic: e.target.checked})}
                        className="w-5 h-5"
                      />
                      <div>
                        <p className="font-bold text-gray-900">Public Template</p>
                        <p className="text-xs text-gray-600">Available to all schools</p>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-purple-500 transition-colors">
                      <input
                        type="checkbox"
                        checked={uploadForm.isPremium}
                        onChange={(e) => setUploadForm({...uploadForm, isPremium: e.target.checked})}
                        className="w-5 h-5"
                      />
                      <div>
                        <p className="font-bold text-gray-900">Premium Template</p>
                        <p className="text-xs text-gray-600">Requires paid subscription</p>
                      </div>
                    </label>
                  </div>

                  {uploadForm.isPremium && (
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Price (₹)</label>
                      <input
                        type="number"
                        value={uploadForm.price}
                        onChange={(e) => setUploadForm({...uploadForm, price: parseInt(e.target.value) || 0})}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none font-semibold"
                        min="0"
                      />
                    </div>
                  )}
                </div>

                {/* Submit Buttons */}
                <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowUploadModal(false)}
                    className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-lg font-bold hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <Upload className="w-5 h-5" />
                    Upload Template
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  // Edit Modal Component (Separate)
  const EditTemplateModal = () => (
    <AnimatePresence>
      {showEditModal && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              setShowEditModal(false);
              setSelectedTemplate(null);
              resetUploadForm();
            }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
          >
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-6 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-black mb-1">Edit Template</h2>
                    <p className="text-sm text-white/80">Update template details</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditModal(false);
                      setSelectedTemplate(null);
                      resetUploadForm();
                    }}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <form onSubmit={handleUpdateTemplate} className="p-6 space-y-6">
                {/* Basic Info */}
                <div className="space-y-4">
                  <h3 className="font-bold text-gray-900 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                    Basic Information
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-bold text-gray-700 mb-2">Title *</label>
                      <input
                        type="text"
                        value={uploadForm.title}
                        onChange={(e) => setUploadForm({...uploadForm, title: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none font-semibold"
                        placeholder="Enter template title"
                        required
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-bold text-gray-700 mb-2">Description *</label>
                      <textarea
                        value={uploadForm.description}
                        onChange={(e) => setUploadForm({...uploadForm, description: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none font-semibold resize-none"
                        rows="3"
                        placeholder="Describe the template"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
                      <select
                        value={uploadForm.category}
                        onChange={(e) => setUploadForm({...uploadForm, category: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none font-semibold"
                      >
                        <option value="assignment">Assignment</option>
                        <option value="quiz">Quiz</option>
                        <option value="worksheet">Worksheet</option>
                        <option value="project">Project</option>
                        <option value="exam">Exam</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Type</label>
                      <select
                        value={uploadForm.type}
                        onChange={(e) => setUploadForm({...uploadForm, type: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none font-semibold"
                      >
                        <option value="quiz">Quiz</option>
                        <option value="exercise">Exercise</option>
                        <option value="assessment">Assessment</option>
                        <option value="practice">Practice</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Subject</label>
                      <input
                        type="text"
                        value={uploadForm.subject}
                        onChange={(e) => setUploadForm({...uploadForm, subject: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none font-semibold"
                        placeholder="e.g., Mathematics"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Tags (comma-separated)</label>
                      <input
                        type="text"
                        value={uploadForm.tags}
                        onChange={(e) => setUploadForm({...uploadForm, tags: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none font-semibold"
                        placeholder="algebra, equations, Grade 8"
                      />
                    </div>
                  </div>
                </div>

                {/* Grade Levels */}
                <div className="space-y-4">
                  <h3 className="font-bold text-gray-900 flex items-center gap-2">
                    <Award className="w-5 h-5 text-blue-600" />
                    Grade Levels
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {[6, 7, 8, 9, 10, 11, 12].map(grade => (
                      <button
                        key={grade}
                        type="button"
                        onClick={() => toggleGrade(grade)}
                        className={`px-4 py-2 rounded-lg font-bold transition-all ${
                          uploadForm.gradeLevel.includes(grade)
                            ? 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-lg'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        Grade {grade}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Pillar Alignment */}
                <div className="space-y-4">
                  <h3 className="font-bold text-gray-900 flex items-center gap-2">
                    <Target className="w-5 h-5 text-blue-600" />
                    Pillar Alignment
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {pillars.map(pillar => (
                      <button
                        key={pillar.id}
                        type="button"
                        onClick={() => togglePillar(pillar.id)}
                        className={`px-4 py-2 rounded-lg font-bold transition-all ${
                          uploadForm.pillarAlignment.includes(pillar.id)
                            ? `${pillar.color} text-white shadow-lg`
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        {pillar.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* NEP Competencies */}
                <div className="space-y-4">
                  <h3 className="font-bold text-gray-900 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-blue-600" />
                    NEP 2020 Competencies ({uploadForm.nepCompetencies.length} selected)
                  </h3>
                  <div className="max-h-48 overflow-y-auto border-2 border-gray-200 rounded-lg p-4 space-y-2">
                    {availableNEPCompetencies.slice(0, 20).map(comp => (
                      <label key={comp.competencyId} className="flex items-start gap-3 cursor-pointer p-2 hover:bg-blue-50 rounded-lg transition-colors">
                        <input
                          type="checkbox"
                          checked={uploadForm.nepCompetencies.includes(comp.competencyId)}
                          onChange={() => toggleNEPCompetency(comp.competencyId)}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900 text-sm">{comp.competencyId} - {comp.title}</p>
                          <p className="text-xs text-gray-600">{comp.description}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Visibility & Premium */}
                <div className="space-y-4">
                  <h3 className="font-bold text-gray-900 flex items-center gap-2">
                    <Globe className="w-5 h-5 text-blue-600" />
                    Visibility & Pricing
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
                      <input
                        type="checkbox"
                        checked={uploadForm.isPublic}
                        onChange={(e) => setUploadForm({...uploadForm, isPublic: e.target.checked})}
                        className="w-5 h-5"
                      />
                      <div>
                        <p className="font-bold text-gray-900">Public Template</p>
                        <p className="text-xs text-gray-600">Available to all schools</p>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
                      <input
                        type="checkbox"
                        checked={uploadForm.isPremium}
                        onChange={(e) => setUploadForm({...uploadForm, isPremium: e.target.checked})}
                        className="w-5 h-5"
                      />
                      <div>
                        <p className="font-bold text-gray-900">Premium Template</p>
                        <p className="text-xs text-gray-600">Requires paid subscription</p>
                      </div>
                    </label>
                  </div>

                  {uploadForm.isPremium && (
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Price (₹)</label>
                      <input
                        type="number"
                        value={uploadForm.price}
                        onChange={(e) => setUploadForm({...uploadForm, price: parseInt(e.target.value) || 0})}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none font-semibold"
                        min="0"
                      />
                    </div>
                  )}
                </div>

                {/* Submit Buttons */}
                <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditModal(false);
                      setSelectedTemplate(null);
                      resetUploadForm();
                    }}
                    className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-lg font-bold hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-lg font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <Check className="w-5 h-5" />
                    Update Template
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
              <FileText className="w-10 h-10" />
              Template Library
            </h1>
            <p className="text-lg text-white/90">{filteredTemplates.length} templates available</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-8">
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
                placeholder="Search templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none font-semibold"
              />
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none bg-white font-semibold"
              >
                <option value="all">All Categories</option>
                <option value="assignment">Assignment</option>
                <option value="quiz">Quiz</option>
                <option value="worksheet">Worksheet</option>
                <option value="project">Project</option>
                <option value="exam">Exam</option>
              </select>

              <select
                value={filterVisibility}
                onChange={(e) => setFilterVisibility(e.target.value)}
                className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none bg-white font-semibold"
              >
                <option value="all">All Templates</option>
                <option value="public">Public Only</option>
                <option value="private">School Only</option>
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
                onClick={handleExportTemplates}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
              >
                <Download className="w-4 h-4" />
                Export
              </button>

              <button
                onClick={() => setShowUploadModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
              >
                <Plus className="w-4 h-4" />
                Upload Template
              </button>
            </div>
          </div>
        </motion.div>

        {/* Templates Grid */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template, idx) => (
              <motion.div
                key={template._id || idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6 hover:shadow-xl hover:border-purple-300 transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-bold text-gray-900 text-lg line-clamp-2 flex-1">{template.title}</h3>
                  <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                    {template.isPremium && <Star className="w-5 h-5 text-yellow-500" />}
                    {template.isPublic ? <Globe className="w-5 h-5 text-blue-500" /> : <Lock className="w-5 h-5 text-gray-500" />}
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{template.description}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-bold capitalize">
                    {template.category}
                  </span>
                  {template.isPremium && (
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-bold">
                      ₹{template.price}
                    </span>
                  )}
                </div>

                {/* Pillar Tags */}
                {template.metadata?.pillarAlignment && template.metadata.pillarAlignment.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {template.metadata.pillarAlignment.map(pillar => {
                      const pillarInfo = pillars.find(p => p.id === pillar);
                      return pillarInfo ? (
                        <span key={pillar} className={`px-2 py-1 ${pillarInfo.color} text-white rounded text-xs font-bold`}>
                          {pillarInfo.name}
                        </span>
                      ) : null;
                    })}
                  </div>
                )}

                {/* NEP Links */}
                {template.metadata?.nepLinks && template.metadata.nepLinks.length > 0 && (
                  <div className="mb-4 p-2 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-xs text-green-700 font-semibold flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      {template.metadata.nepLinks.length} NEP Competencies
                      {template.metadata.nepLinks.slice(0, 2).map((comp, i) => (
                        <span key={i} className="text-green-600">• {comp}</span>
                      ))}
                      {template.metadata.nepLinks.length > 2 && (
                        <span className="text-green-600">+{template.metadata.nepLinks.length - 2} more</span>
                      )}
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                  <span>Used {template.usageCount || 0} times</span>
                  <span>{template.createdBy?.name || 'Admin'}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEditTemplate(template)}
                    className="flex-1 py-2 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-lg font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>

                  <button
                    onClick={() => handleDeleteTemplate(template._id)}
                    disabled={processingId === template._id}
                    className="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-lg font-bold hover:shadow-lg transition-all disabled:opacity-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="text-left py-4 px-6 text-sm font-bold text-gray-700">Template</th>
                  <th className="text-left py-4 px-6 text-sm font-bold text-gray-700">Category</th>
                  <th className="text-left py-4 px-6 text-sm font-bold text-gray-700">NEP Links</th>
                  <th className="text-left py-4 px-6 text-sm font-bold text-gray-700">Visibility</th>
                  <th className="text-left py-4 px-6 text-sm font-bold text-gray-700">Usage</th>
                  <th className="text-left py-4 px-6 text-sm font-bold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTemplates.map((template, idx) => (
                  <motion.tr
                    key={template._id || idx}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.02 }}
                    className="border-b border-gray-100 hover:bg-purple-50 transition-colors"
                  >
                    <td className="py-4 px-6">
                      <div>
                        <p className="font-bold text-gray-900 flex items-center gap-2">
                          {template.title}
                          {template.isPremium && <Star className="w-4 h-4 text-yellow-500" />}
                        </p>
                        <p className="text-xs text-gray-500 line-clamp-1">{template.description}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-bold capitalize">
                        {template.category}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-sm font-bold text-gray-900">
                        {template.metadata?.nepLinks?.length || 0} competencies
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1">
                        {template.isPublic ? (
                          <>
                            <Globe className="w-4 h-4 text-blue-500" />
                            <span className="text-sm font-semibold text-blue-600">Public</span>
                          </>
                        ) : (
                          <>
                            <Lock className="w-4 h-4 text-gray-500" />
                            <span className="text-sm font-semibold text-gray-600">School Only</span>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-sm font-bold text-gray-900">{template.usageCount || 0} times</span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditTemplate(template)}
                          className="p-2 hover:bg-blue-100 rounded-lg transition-all"
                        >
                          <Edit className="w-4 h-4 text-blue-600" />
                        </button>
                        <button
                          onClick={() => handleDeleteTemplate(template._id)}
                          disabled={processingId === template._id}
                          className="p-2 hover:bg-red-100 rounded-lg transition-all disabled:opacity-50"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {filteredTemplates.length === 0 && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-12 text-center"
          >
            <FileText className="w-20 h-20 mx-auto mb-4 text-gray-400" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Templates Found</h3>
            <p className="text-gray-600 mb-6">Upload your first template to get started</p>
            <button
              onClick={() => setShowUploadModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all flex items-center gap-2 mx-auto"
            >
              <Plus className="w-5 h-5" />
              Upload Template
            </button>
          </motion.div>
        )}
      </div>

      {/* Modals */}
      <UploadTemplateModal />
      <EditTemplateModal />
    </div>
  );
};

export default SchoolAdminTemplates;
