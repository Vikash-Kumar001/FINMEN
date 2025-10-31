import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion as Motion } from 'framer-motion';
import {
  Users,
  MessageSquare,
  Search,
  ArrowLeft,
  Circle
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../../utils/api';

const TeacherChatContacts = () => {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all'); // 'all', 'students', 'parents'

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/school/teacher/all-students');
      const studentsData = response.data?.students || [];
      
      // Format contacts with students
      const formattedContacts = studentsData.map((student) => ({
        id: student._id,
        name: student.name || 'Unknown Student',
        role: 'student',
        avatar: undefined, // Will be handled by default avatar in UI
        grade: student.class || 'N/A',
        age: `Level ${student.level || 1}`,
        email: student.email,
        xp: student.xp || 0,
        healCoins: student.healCoins || 0,
        level: student.level || 1,
        streak: student.streak || 0
      }));
      
      setContacts(formattedContacts);
    } catch (error) {
      console.error('Error fetching contacts:', error);
      toast.error('Failed to load contacts');
    } finally {
      setLoading(false);
    }
  };

  const handleContactClick = (contact, type = 'student') => {
    if (type === 'student') {
      // Navigate to teacher-student chat
      navigate(`/school-teacher/student-chat/${contact.id}`);
    } else {
      // For parent, navigate to parent chat
      navigate(`/school-teacher/student/${contact.id}/parent-chat`);
    }
  };

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === 'all' || contact.role === filter;
    return matchesSearch && matchesFilter;
  });

  const studentsCount = contacts.filter(c => c.role === 'student').length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <Motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white py-6 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Motion.button
                onClick={() => navigate('/school-teacher/overview')}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-6 h-6" />
              </Motion.button>
              <div>
                <h1 className="text-3xl font-black">Chat Contacts</h1>
                <p className="text-white/90 mt-1">Connect with students and parents</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="text-sm text-white/80">Total Contacts</p>
                <p className="text-2xl font-bold">{contacts.length}</p>
              </div>
              <MessageSquare className="w-12 h-12 text-white/90" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search students and parents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
              <button
                onClick={() => setFilter('students')}
                className={`px-4 py-2 rounded-xl font-semibold transition-all ${
                  filter === 'students'
                    ? 'bg-indigo-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Students ({studentsCount})
              </button>
          </div>
        </div>

        {/* Contacts List - Single Column */}
        {filteredContacts.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <Users className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No contacts found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredContacts.map((contact) => (
              <Motion.div
                key={contact.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                whileHover={{ x: 5 }}
                onClick={() => handleContactClick(contact)}
                className="bg-white rounded-xl shadow-md p-4 cursor-pointer hover:shadow-lg transition-all border-2 border-gray-100 hover:border-indigo-300"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    {/* Avatar */}
                    <div className="relative flex-shrink-0">
                      <div className={`w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-xl ${
                        contact.role === 'student'
                          ? 'bg-gradient-to-br from-blue-500 to-cyan-600'
                          : 'bg-gradient-to-br from-purple-500 to-pink-600'
                      }`}>
                        {contact.name?.charAt(0).toUpperCase()}
                      </div>
                      <Circle className={`absolute -bottom-1 -right-1 w-5 h-5 ${
                        contact.role === 'student' ? 'fill-green-500 text-green-500' : 'fill-blue-500 text-blue-500'
                      }`} />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-lg font-bold text-gray-900 truncate">{contact.name}</h3>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                          contact.role === 'student' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                        }`}>
                          {contact.role === 'student' ? 'Student' : 'Parent'}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <span> {contact.grade}</span>
                        <span>•</span>
                        <span>{contact.age}</span>
                        {contact.xp > 0 && (
                          <>
                            <span>•</span>
                            <span className="text-indigo-600 font-semibold">{contact.xp} XP</span>
                          </>
                        )}
                        {contact.streak > 0 && (
                          <>
                            <span>•</span>
                            <span className="text-orange-600 font-semibold">{contact.streak} day streak</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 ml-4">
                    <Motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors flex items-center gap-2 shadow-md"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleContactClick(contact, 'student');
                      }}
                    >
                      <MessageSquare className="w-4 h-4" />
                      Chat to Student
                    </Motion.button>
                    <Motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-colors flex items-center gap-2 shadow-md"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleContactClick(contact, 'parent');
                      }}
                    >
                      <MessageSquare className="w-4 h-4" />
                      Chat to Parent
                    </Motion.button>
                  </div>
                </div>
              </Motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherChatContacts;
