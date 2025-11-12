import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Briefcase, Calendar, Check, CheckCircle2, Edit3, Globe2, Loader2, MapPin, Plus, Save, Trash2, X, XCircle, Mail, Phone, Link2, ExternalLink, MessageSquare, Clock as ClockIcon, UserPlus
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../../utils/api';
import { useSocket } from '../../context/SocketContext';

const defaultFormState = {
  title: '',
  department: '',
  location: '',
  employmentType: 'Full-time',
  workMode: 'Work From Home',
  description: '',
  requirementsText: '',
  responsibilitiesText: '',
  applyUrl: '',
  status: 'open',
  statusMessage: '',
  published: true,
};

const employmentOptions = ['Full-time', 'Part-time', 'Contract', 'Internship'];
const workModeOptions = ['Work From Home', 'Hybrid', 'Onsite'];

const getDisplayWorkMode = (mode) => (mode === 'Remote' ? 'Work From Home' : mode || 'Work From Home');

const applicationStatusOptions = [
  { value: 'new', label: 'New', badge: 'bg-blue-100 text-blue-700' },
  { value: 'in_review', label: 'In Review', badge: 'bg-indigo-100 text-indigo-700' },
  { value: 'shortlisted', label: 'Shortlisted', badge: 'bg-emerald-100 text-emerald-700' },
  { value: 'rejected', label: 'Rejected', badge: 'bg-red-100 text-red-700' },
  { value: 'hired', label: 'Hired', badge: 'bg-purple-100 text-purple-700' },
];

const AdminJobPositions = () => {
  const { socket } = useSocket() || {};
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState(defaultFormState);
  const [editingId, setEditingId] = useState(null);
  const [filter, setFilter] = useState('all');
  const [applicationsByJob, setApplicationsByJob] = useState({});
  const [applicationsLoading, setApplicationsLoading] = useState(false);
  const [expandedJobId, setExpandedJobId] = useState(null);

  const fetchPositions = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/admin/job-openings');
      setPositions(res.data?.data || []);
    } catch (error) {
      console.error('Error fetching job openings:', error);
      toast.error('Failed to load job openings');
    } finally {
      setLoading(false);
    }
  }, []);

  const getJobIdFromApplication = useCallback((application) => {
    if (!application) return null;
    if (typeof application.jobOpening === 'string') return application.jobOpening;
    return application.jobOpening?.id || application.jobOpening?._id || null;
  }, []);

  const groupApplications = useCallback((applications) => {
    const grouped = {};
    (applications || []).forEach((application) => {
      const jobId = getJobIdFromApplication(application);
      if (!jobId) return;
      if (!grouped[jobId]) {
        grouped[jobId] = [];
      }
      grouped[jobId].push(application);
    });

    Object.keys(grouped).forEach((jobId) => {
      grouped[jobId].sort(
        (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
      );
    });

    return grouped;
  }, [getJobIdFromApplication]);

  const fetchApplications = useCallback(async () => {
    try {
      setApplicationsLoading(true);
      const res = await api.get('/api/admin/job-openings/applications');
      const grouped = groupApplications(res.data?.data || []);
      setApplicationsByJob(grouped);
    } catch (error) {
      console.error('Error fetching job applications:', error);
      toast.error('Failed to load job applications');
    } finally {
      setApplicationsLoading(false);
    }
  }, [groupApplications]);

  useEffect(() => {
    fetchPositions();
    fetchApplications();
  }, [fetchPositions, fetchApplications]);

  const resetForm = () => {
    setFormData(defaultFormState);
    setEditingId(null);
  };

  const upsertApplication = useCallback((application) => {
    const jobId = getJobIdFromApplication(application);
    if (!jobId) return;

    setApplicationsByJob((prev) => {
      const existing = prev[jobId] ? [...prev[jobId]] : [];
      const index = existing.findIndex((item) => item.id === application.id);

      if (index >= 0) {
        existing[index] = { ...existing[index], ...application };
      } else {
        existing.unshift(application);
      }

      existing.sort(
        (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
      );

      return {
        ...prev,
        [jobId]: existing,
      };
    });
  }, [getJobIdFromApplication]);

  const removeApplicationsForJob = useCallback((jobId) => {
    setApplicationsByJob((prev) => {
      if (!prev[jobId]) return prev;
      const updated = { ...prev };
      delete updated[jobId];
      return updated;
    });
  }, []);

  const handleEdit = (position) => {
    setEditingId(position.id);
    setFormData({
      title: position.title || '',
      department: position.department || '',
      location: position.location || '',
      employmentType: position.employmentType || 'Full-time',
      workMode: position.workMode === 'Remote' ? 'Work From Home' : position.workMode || 'Work From Home',
      description: position.description || '',
      requirementsText: (position.requirements || []).join('\n'),
      responsibilitiesText: (position.responsibilities || []).join('\n'),
      applyUrl: position.applyUrl || '',
      status: position.status || 'open',
      statusMessage: position.statusMessage || '',
      published: position.published ?? true,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (positionId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this job opening?');
    if (!confirmDelete) return;

    try {
      setSaving(true);
      await api.delete(`/api/admin/job-openings/${positionId}`);
      toast.success('Job opening deleted');
      await fetchPositions();
      removeApplicationsForJob(positionId);
      if (editingId === positionId) {
    resetForm();
      }
    } catch (error) {
      console.error('Error deleting job opening:', error);
      toast.error('Failed to delete job opening');
    } finally {
      setSaving(false);
    }
  };

  const handleStatusToggle = async (position) => {
    try {
      setSaving(true);
      const newStatus = position.status === 'open' ? 'closed' : 'open';
      await api.put(`/api/admin/job-openings/${position.id}`, {
        status: newStatus,
        statusMessage: position.statusMessage,
      });
      toast.success(`Job marked as ${newStatus === 'open' ? 'Open' : 'Closed'}`);
      await fetchPositions();
    } catch (error) {
      console.error('Error updating job status:', error);
      toast.error('Failed to update job status');
    } finally {
      setSaving(false);
    }
  };

  const handleApplicationStatusChange = async (applicationId, status) => {
    try {
      setSaving(true);
      const res = await api.put(`/api/admin/job-openings/applications/${applicationId}`, {
        status,
      });
      if (res.data?.data) {
        upsertApplication(res.data.data);
      }
      toast.success('Application status updated');
    } catch (error) {
      console.error('Error updating job application:', error);
      toast.error('Failed to update application status');
    } finally {
      setSaving(false);
    }
  };

  const handlePublishToggle = async (position) => {
    try {
      setSaving(true);
      await api.put(`/api/admin/job-openings/${position.id}`, {
        published: !position.published,
      });
      toast.success(`Job ${position.published ? 'hidden from' : 'visible on'} careers page`);
      await fetchPositions();
    } catch (error) {
      console.error('Error updating job visibility:', error);
      toast.error('Failed to update job visibility');
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.title || !formData.department || !formData.location || !formData.description) {
      toast.error('Please fill in the required fields');
      return;
    }

  const payload = {
    ...formData,
    requirements: formData.requirementsText
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean),
    responsibilities: formData.responsibilitiesText
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean),
  };

    try {
      setSaving(true);
      if (editingId) {
        await api.put(`/api/admin/job-openings/${editingId}`, payload);
        toast.success('Job opening updated successfully');
      } else {
        await api.post('/api/admin/job-openings', payload);
        toast.success('Job opening created successfully');
      }
      await fetchPositions();
      await fetchApplications();
      resetForm();
    } catch (error) {
      console.error('Error saving job opening:', error);
      toast.error('Failed to save job opening');
    } finally {
      setSaving(false);
    }
  };

  const filteredPositions = useMemo(() => {
    if (filter === 'all') return positions;
    return positions.filter((position) => position.status === filter);
  }, [filter, positions]);

  const handleToggleApplications = (jobId) => {
    setExpandedJobId((prev) => (prev === jobId ? null : jobId));
  };

  useEffect(() => {
    if (!socket) return;

    const handleNewApplication = (application) => {
      upsertApplication(application);
      if (application?.jobOpening?.title) {
        toast.success(`New application for ${application.jobOpening.title}`);
      } else {
        toast.success('New job application received');
      }
    };

    const handleUpdatedApplication = (application) => {
      upsertApplication(application);
    };

    socket.on('admin:job-application:new', handleNewApplication);
    socket.on('admin:job-application:update', handleUpdatedApplication);

    return () => {
      socket.off('admin:job-application:new', handleNewApplication);
      socket.off('admin:job-application:update', handleUpdatedApplication);
    };
  }, [socket, upsertApplication]);

  return (
    <div className="space-y-8">
      <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {editingId ? 'Update Job Opening' : 'Create New Job Opening'}
            </h2>
            <p className="text-sm text-gray-600">
              Draft new roles and publish them instantly to the public careers page.
            </p>
          </div>
        </div>

        <form className="grid grid-cols-1 lg:grid-cols-2 gap-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Job Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Senior Frontend Engineer"
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Department <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) => setFormData((prev) => ({ ...prev, department: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Engineering"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Location <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Remote / Bengaluru, India"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Employment Type
                </label>
                <select
                  value={formData.employmentType}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, employmentType: e.target.value }))
                  }
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {employmentOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Work Mode
                </label>
                <select
                  value={formData.workMode}
                  onChange={(e) => setFormData((prev) => ({ ...prev, workMode: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {workModeOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="open">Open for applications</option>
                  <option value="closed">Closed / hiring complete</option>
                </select>
              </div>
              <div className="flex items-center">
                <label className="flex items-center gap-3 text-sm font-semibold text-gray-700">
                  <input
                    type="checkbox"
                    checked={formData.published}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, published: e.target.checked }))
                    }
                    className="w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  Visible on careers page
                </label>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Role Overview <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                rows={5}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Share what makes this role exciting and impactful."
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Requirements (one per line)
              </label>
              <textarea
                value={formData.requirementsText}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, requirementsText: e.target.value }))
                }
                rows={6}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="• 5+ years of experience with React&#10;• Strong understanding of state management"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Responsibilities (one per line)
              </label>
              <textarea
                value={formData.responsibilitiesText}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, responsibilitiesText: e.target.value }))
                }
                rows={6}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="• Lead feature development end-to-end&#10;• Collaborate with design and product partners"
              />
            </div>
            {formData.status === 'closed' && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Message for applicants
                </label>
                <textarea
                  value={formData.statusMessage}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, statusMessage: e.target.value }))
                  }
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Thanks for your interest! We are no longer accepting applications for this role."
                />
              </div>
            )}
            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-60"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {editingId ? 'Update Job' : 'Publish Job'}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="inline-flex items-center gap-2 px-5 py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all"
                >
                  <X className="w-4 h-4" />
                  Cancel Edit
                </button>
              )}
            </div>
          </div>
        </form>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 px-6 py-4 border-b border-gray-200">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Positions Dashboard</h3>
            <p className="text-sm text-gray-600">
              Monitor live openings and keep messaging consistent with the careers page.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            {['all', 'open', 'closed'].map((key) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`px-4 py-2 rounded-xl font-semibold transition-all ${
                  filter === key
                    ? 'bg-indigo-600 text-white shadow'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {key === 'all' ? 'All roles' : key === 'open' ? 'Open roles' : 'Closed roles'}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center text-gray-500 gap-3">
            <Loader2 className="w-8 h-8 animate-spin" />
            Loading job openings...
          </div>
        ) : filteredPositions.length === 0 ? (
          <div className="p-12 text-center text-gray-600">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-500">
              <Plus className="w-8 h-8" />
            </div>
            <p className="text-lg font-semibold">No positions found</p>
            <p className="text-sm text-gray-500">
              Start by creating a new job opening using the form above.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredPositions.map((position) => {
              const jobApplications = applicationsByJob[position.id] || [];
              const applicationCount = jobApplications.length;
              const isExpanded = expandedJobId === position.id;

              return (
                <div
                  key={position.id}
                  className="p-6 hover:bg-gray-50 transition-colors flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between"
                >
                  <div className="space-y-3 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <span
                        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${
                          position.status === 'open'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {position.status === 'open' ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : (
                          <XCircle className="w-4 h-4" />
                        )}
                        {position.status === 'open' ? 'Open' : 'Closed'}
                      </span>
                      <span
                        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${
                          position.published ? 'bg-blue-100 text-blue-700' : 'bg-gray-200 text-gray-600'
                        }`}
                      >
                        <Globe2 className="w-4 h-4" />
                        {position.published ? 'Visible' : 'Hidden'}
                      </span>
                      <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-sm font-semibold">
                        <Calendar className="w-4 h-4" />
                        {new Date(position.createdAt).toLocaleDateString()}
                      </span>
                      <span
                        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${
                          applicationCount > 0
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        <UserPlus className="w-4 h-4" />
                        {applicationCount} {applicationCount === 1 ? 'Applicant' : 'Applicants'}
                      </span>
                    </div>
                    <h4 className="text-2xl font-bold text-gray-900">{position.title}</h4>
                    <div className="flex flex-wrap gap-3 text-sm text-gray-600 font-semibold">
                      <span className="inline-flex items-center gap-2">
                        <Briefcase className="w-4 h-4" />
                        {position.department}
                      </span>
                      <span className="inline-flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        {position.location}
                      </span>
                      <span className="inline-flex items-center gap-2">
                        <Globe2 className="w-4 h-4" />
                        {getDisplayWorkMode(position.workMode)}
                      </span>
                      <span className="inline-flex items-center gap-2">
                        <Check className="w-4 h-4" />
                        {position.employmentType}
                      </span>
                    </div>
                    <p className="text-gray-600 max-w-3xl">{position.description}</p>
                    {position.status === 'closed' && position.statusMessage && (
                      <div className="px-4 py-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-700 max-w-3xl">
                        {position.statusMessage}
                      </div>
                    )}
                    {(position.responsibilities || []).length > 0 && (
                      <div className="max-w-3xl">
                        <h5 className="font-semibold text-gray-900 mb-1">Responsibilities</h5>
                        <ul className="space-y-1">
                          {position.responsibilities.map((item, idx) => (
                            <li key={idx} className="flex items-start text-sm text-gray-600">
                              <span className="text-purple-500 mr-2">•</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {(position.requirements || []).length > 0 && (
                      <div className="max-w-3xl">
                        <h5 className="font-semibold text-gray-900 mb-1">Requirements</h5>
                        <ul className="space-y-1">
                          {position.requirements.map((item, idx) => (
                            <li key={idx} className="flex items-start text-sm text-gray-600">
                              <span className="text-blue-500 mr-2">•</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-3 pt-2">
                      <button
                        onClick={() => handleToggleApplications(position.id)}
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all ${
                          isExpanded
                            ? 'bg-indigo-600 text-white shadow'
                            : 'bg-white border border-indigo-200 text-indigo-700 hover:bg-indigo-50'
                        }`}
                      >
                        <MessageSquare className="w-4 h-4" />
                        {isExpanded ? 'Hide Applications' : `View Applications (${applicationCount})`}
                      </button>
                      {position.applyUrl && (
                        <a
                          href={position.applyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl font-semibold bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 transition-all"
                        >
                          <ExternalLink className="w-4 h-4" />
                          External Apply Link
                        </a>
                      )}
                    </div>

                    {isExpanded && (
                      <div className="mt-4 space-y-4">
                        {applicationsLoading && applicationCount === 0 ? (
                          <div className="p-6 bg-white border border-indigo-100 rounded-xl flex items-center justify-center gap-3 text-indigo-600">
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Loading applications...
                          </div>
                        ) : applicationCount === 0 ? (
                          <div className="p-6 bg-white border border-dashed border-indigo-200 rounded-xl text-sm text-gray-500">
                            No applications yet. Candidates will appear here as soon as they apply.
                          </div>
                        ) : (
                          jobApplications.map((application) => {
                            const statusMeta =
                              applicationStatusOptions.find((option) => option.value === application.status) ||
                              applicationStatusOptions[0];
                            const resumeLabel = application.resumeFileName || "Resume / CV";

                            return (
                              <div
                                key={application.id}
                                className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm"
                              >
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                  <div>
                                    <div className="text-lg font-semibold text-gray-900">
                                      {application.applicantName || 'Unnamed Candidate'}
                                    </div>
                                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mt-2">
                                      <span className="inline-flex items-center gap-2">
                                        <Mail className="w-4 h-4" />
                                        {application.applicantEmail}
                                      </span>
                                      {application.applicantPhone && (
                                        <span className="inline-flex items-center gap-2">
                                          <Phone className="w-4 h-4" />
                                          {application.applicantPhone}
                                        </span>
                                      )}
                                      {application.experienceYears ? (
                                        <span className="inline-flex items-center gap-2">
                                          <ClockIcon className="w-4 h-4" />
                                          {application.experienceYears} yrs experience
                                        </span>
                                      ) : null}
                                    </div>
                                  </div>
                                  <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
                                    <span
                                      className={`px-3 py-1 rounded-full text-xs font-semibold text-center ${statusMeta.badge}`}
                                    >
                                      {statusMeta.label}
                                    </span>
                                    <select
                                      value={application.status}
                                      onChange={(event) =>
                                        handleApplicationStatusChange(application.id, event.target.value)
                                      }
                                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                      disabled={saving}
                                    >
                                      {applicationStatusOptions.map((option) => (
                                        <option key={option.value} value={option.value}>
                                          {option.label}
                                        </option>
                                      ))}
                                    </select>
                                  </div>
                                </div>

                                <div className="mt-3 flex flex-wrap gap-3 text-sm text-indigo-600">
                                  {application.resumeUrl && (
                                    <a
                                      href={application.resumeUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-1 hover:underline"
                                    >
                                      <ExternalLink className="w-4 h-4" />
                                      {resumeLabel}
                                    </a>
                                  )}
                                  {application.linkedinUrl && (
                                    <a
                                      href={application.linkedinUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-1 hover:underline"
                                    >
                                      <Link2 className="w-4 h-4" />
                                      LinkedIn
                                    </a>
                                  )}
                                  {application.portfolioUrl && (
                                    <a
                                      href={application.portfolioUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-1 hover:underline"
                                    >
                                      <Link2 className="w-4 h-4" />
                                      Portfolio
                                    </a>
                                  )}
                                </div>

                                {application.coverLetter && (
                                  <div className="mt-3 bg-gray-50 border border-gray-100 rounded-lg p-3 text-sm text-gray-700">
                                    <div className="flex items-center gap-2 font-semibold text-gray-800 mb-1">
                                      <MessageSquare className="w-4 h-4 text-indigo-500" />
                                      Cover Letter
                                    </div>
                                    <p className="whitespace-pre-wrap leading-relaxed">
                                      {application.coverLetter}
                                    </p>
                                  </div>
                                )}

                                <div className="mt-3 text-xs text-gray-500 flex items-center gap-2">
                                  <ClockIcon className="w-4 h-4" />
                                  Applied {new Date(application.createdAt).toLocaleString()}
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-3">
                    <button
                      onClick={() => handleStatusToggle(position)}
                      disabled={saving}
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all ${
                        position.status === 'open'
                          ? 'bg-red-100 text-red-700 hover:bg-red-200'
                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                      }`}
                    >
                      {position.status === 'open' ? (
                        <>
                          <X className="w-4 h-4" />
                          Mark as Filled
                        </>
                      ) : (
                        <>
                          <Check className="w-4 h-4" />
                          Reopen Role
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => handlePublishToggle(position)}
                      disabled={saving}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl font-semibold bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 transition-all"
                    >
                      <Globe2 className="w-4 h-4" />
                      {position.published ? 'Hide from Careers' : 'Show on Careers'}
                    </button>
                    <button
                      onClick={() => handleEdit(position)}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition-all"
                    >
                      <Edit3 className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(position.id)}
                      disabled={saving}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl font-semibold bg-white border border-red-200 text-red-600 hover:bg-red-50 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminJobPositions;

