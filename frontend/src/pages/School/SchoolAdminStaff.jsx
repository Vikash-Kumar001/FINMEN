import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  GraduationCap, Search, Filter, UserPlus, Mail, Phone, Award, BookOpen, Clock,
  CheckCircle, AlertCircle, MoreVertical, Edit, Trash2, Eye, Activity, TrendingUp,
  Users, Target, Shield, Settings, Download, Star
} from 'lucide-react';
import api from '../../utils/api';
import { toast } from 'react-hot-toast';

const SchoolAdminStaff = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [staff, setStaff] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [stats, setStats] = useState({});

  useEffect(() => {
    fetchStaffData();
  }, [filterRole]);

  const fetchStaffData = async () => {
    try {
      setLoading(true);
      const params = filterRole !== 'all' ? `?role=${filterRole}` : '';
      const [staffRes, statsRes] = await Promise.all([
        api.get(`/api/school/admin/staff${params}`),
        api.get('/api/school/admin/staff/stats'),
      ]);
      setStaff(staffRes.data.staff || []);
      setStats(statsRes.data || {});
    } catch (error) {
      console.error('Error fetching staff:', error);
      toast.error('Failed to load staff data');
    } finally {
      setLoading(false);
    }
  };

  const filteredStaff = staff.filter(member =>
    member.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email?.toLowerCase().includes(searchTerm.toLowerCase())
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
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white py-8 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl font-black mb-2 flex items-center gap-3">
              <GraduationCap className="w-10 h-10" />
              Staff & Teachers
            </h1>
            <p className="text-lg text-white/90">
              {filteredStaff.length} staff members • {stats.activeToday || 0} active today
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-4 mb-6 flex items-center gap-4 flex-wrap"
        >
          <div className="flex items-center gap-2 flex-1 min-w-[200px]">
            <Search className="w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Search staff..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none font-semibold"
            />
          </div>
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none bg-white font-semibold"
          >
            <option value="all">All Roles</option>
            <option value="school_teacher">Teachers</option>
            <option value="school_admin">Admins</option>
            <option value="counselor">Counselors</option>
          </select>
          <button className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all flex items-center gap-2">
            <UserPlus className="w-4 h-4" />
            Add Staff
          </button>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStaff.map((member, idx) => (
            <motion.div
              key={member._id || idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6 hover:shadow-xl hover:border-blue-300 transition-all"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center text-white font-black text-xl shadow-lg">
                  {member.name?.charAt(0) || 'T'}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900">{member.name || 'Teacher'}</h3>
                  <p className="text-xs text-gray-600 capitalize">{member.role?.replace('school_', '') || 'Teacher'}</p>
                </div>
              </div>

              <div className="space-y-2 mb-4 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span className="truncate">{member.email || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <BookOpen className="w-4 h-4" />
                  <span>{member.classesAssigned || 0} classes assigned</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="text-center p-3 rounded-lg bg-green-50">
                  <p className="text-xs text-gray-600">Students</p>
                  <p className="text-xl font-black text-green-600">{member.studentsCount || 0}</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-purple-50">
                  <p className="text-xs text-gray-600">Training</p>
                  <p className="text-xl font-black text-purple-600">{member.trainingProgress || 0}%</p>
                </div>
              </div>

              <button className="w-full py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all">
                View Profile
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SchoolAdminStaff;
