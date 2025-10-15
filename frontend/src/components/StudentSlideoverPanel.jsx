import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, User, Mail, MessageSquare, Flag, Eye, 
  Activity, Heart, Trophy, Zap, Coins, Calendar,
  Clock, AlertTriangle, FileText, Send, Save,
  TrendingUp, Brain, Target, Award, Flame
} from 'lucide-react';
import api from '../utils/api';
import { toast } from 'react-hot-toast';

const StudentSlideoverPanel = ({ student, isOpen, onClose, onUpdate }) => {
  const [activeTab, setActiveTab] = useState('timeline');
  const [loading, setLoading] = useState(false);
  const [studentDetails, setStudentDetails] = useState(null);
  const [notes, setNotes] = useState('');
  const [newNote, setNewNote] = useState('');
  const [isFlagged, setIsFlagged] = useState(false);
  const [messageText, setMessageText] = useState('');

  useEffect(() => {
    if (isOpen && student) {
      fetchStudentDetails();
    }
  }, [isOpen, student]);

  const fetchStudentDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/school/teacher/student/${student._id}/details`);
      setStudentDetails(response.data);
      setNotes(response.data.notes || '');
      setIsFlagged(response.data.flagged || false);
    } catch (error) {
      console.error('Error fetching student details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveNote = async () => {
    if (!newNote.trim()) {
      toast.error('Please enter a note');
      return;
    }

    try {
      await api.post(`/api/school/teacher/student/${student._id}/notes`, {
        note: newNote.trim()
      });
      toast.success('Note saved successfully');
      setNewNote('');
      fetchStudentDetails();
    } catch (error) {
      console.error('Error saving note:', error);
      toast.error('Failed to save note');
    }
  };

  const handleToggleFlag = async () => {
    try {
      await api.put(`/api/school/teacher/student/${student._id}/flag`, {
        flagged: !isFlagged,
        reason: !isFlagged ? 'Needs attention' : null
      });
      setIsFlagged(!isFlagged);
      toast.success(isFlagged ? 'Student unflagged' : 'Student flagged for counselor');
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Error toggling flag:', error);
      toast.error('Failed to update flag');
    }
  };

  const handleSendMessage = async () => {
    if (!messageText.trim()) {
      toast.error('Please enter a message');
      return;
    }

    try {
      await api.post(`/api/school/teacher/student/${student._id}/message`, {
        message: messageText.trim()
      });
      toast.success('Message sent successfully');
      setMessageText('');
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    }
  };

  if (!student) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />

          {/* Slide-over Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full sm:w-[480px] md:w-[600px] bg-white shadow-2xl z-50 overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white p-6 z-10">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <img
                    src={student.avatar || '/avatars/avatar1.png'}
                    alt={student.name}
                    className="w-16 h-16 rounded-full border-4 border-white shadow-lg"
                  />
                  <div>
                    <h2 className="text-2xl font-black">{student.name}</h2>
                    <p className="text-white/90 text-sm">{student.email}</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/20 rounded-lg transition-all"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-4 gap-3">
                <div className="bg-white/20 backdrop-blur-md rounded-lg p-3 text-center">
                  <Zap className="w-5 h-5 mx-auto mb-1" />
                  <p className="text-lg font-black">{student.level || 1}</p>
                  <p className="text-xs opacity-90">Level</p>
                </div>
                <div className="bg-white/20 backdrop-blur-md rounded-lg p-3 text-center">
                  <Trophy className="w-5 h-5 mx-auto mb-1" />
                  <p className="text-lg font-black">{student.xp || 0}</p>
                  <p className="text-xs opacity-90">XP</p>
                </div>
                <div className="bg-white/20 backdrop-blur-md rounded-lg p-3 text-center">
                  <Coins className="w-5 h-5 mx-auto mb-1" />
                  <p className="text-lg font-black">{student.coins || 0}</p>
                  <p className="text-xs opacity-90">Coins</p>
                </div>
                <div className="bg-white/20 backdrop-blur-md rounded-lg p-3 text-center">
                  <Flame className="w-5 h-5 mx-auto mb-1" />
                  <p className="text-lg font-black">{student.streak || 0}</p>
                  <p className="text-xs opacity-90">Streak</p>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200 bg-white sticky top-[180px] z-10">
              <button
                onClick={() => setActiveTab('timeline')}
                className={`flex-1 px-4 py-3 font-semibold transition-all ${
                  activeTab === 'timeline'
                    ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Activity className="w-4 h-4 inline mr-2" />
                Timeline
              </button>
              <button
                onClick={() => setActiveTab('notes')}
                className={`flex-1 px-4 py-3 font-semibold transition-all ${
                  activeTab === 'notes'
                    ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <FileText className="w-4 h-4 inline mr-2" />
                Notes
              </button>
              <button
                onClick={() => setActiveTab('actions')}
                className={`flex-1 px-4 py-3 font-semibold transition-all ${
                  activeTab === 'actions'
                    ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Send className="w-4 h-4 inline mr-2" />
                Actions
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full"
                  />
                </div>
              ) : (
                <>
                  {activeTab === 'timeline' && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Activity className="w-5 h-5 text-purple-600" />
                        Recent Activity Timeline
                      </h3>
                      {studentDetails?.timeline && studentDetails.timeline.length > 0 ? (
                        studentDetails.timeline.map((item, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-200"
                          >
                            <div className="flex items-start gap-3">
                              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center text-white flex-shrink-0">
                                {item.type === 'mission' ? <Target className="w-4 h-4" /> :
                                 item.type === 'mood' ? <Heart className="w-4 h-4" /> :
                                 <Activity className="w-4 h-4" />}
                              </div>
                              <div className="flex-1">
                                <p className="font-semibold text-gray-900">{item.action}</p>
                                <p className="text-sm text-gray-600">{item.details}</p>
                                <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {item.time}
                                </p>
                              </div>
                            </div>
                          </motion.div>
                        ))
                      ) : (
                        <div className="text-center py-8 text-gray-400">
                          <Activity className="w-12 h-12 mx-auto mb-2" />
                          <p>No recent activity</p>
                        </div>
                      )}

                      {/* Mood Summary */}
                      {studentDetails?.recentMood && (
                        <div className="mt-6 p-4 bg-gradient-to-r from-pink-50 to-rose-50 rounded-xl border border-pink-200">
                          <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                            <Heart className="w-5 h-5 text-pink-600" />
                            Recent Mood
                          </h4>
                          <div className="flex items-center gap-2">
                            <span className="text-3xl">{studentDetails.recentMood.emoji || '😊'}</span>
                            <div className="flex-1">
                              <p className="font-semibold text-gray-900">{studentDetails.recentMood.mood || 'Happy'}</p>
                              <p className="text-sm text-gray-600">Score: {studentDetails.recentMood.score || 3}/5</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'notes' && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-purple-600" />
                        Teacher Notes
                      </h3>

                      {/* Add New Note */}
                      <div className="bg-purple-50 rounded-xl p-4 border-2 border-purple-200">
                        <textarea
                          placeholder="Add a new note about this student..."
                          value={newNote}
                          onChange={(e) => setNewNote(e.target.value)}
                          rows={3}
                          className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-purple-500 outline-none resize-none"
                        />
                        <button
                          onClick={handleSaveNote}
                          className="mt-3 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all flex items-center gap-2"
                        >
                          <Save className="w-4 h-4" />
                          Save Note
                        </button>
                      </div>

                      {/* Existing Notes */}
                      <div className="space-y-3">
                        {studentDetails?.notes && studentDetails.notes.length > 0 ? (
                          studentDetails.notes.map((note, idx) => (
                            <div
                              key={idx}
                              className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm"
                            >
                              <p className="text-gray-800 mb-2">{note.text}</p>
                              <div className="flex items-center justify-between text-xs text-gray-500">
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  {new Date(note.date).toLocaleDateString()}
                                </span>
                                <span>By: {note.teacher || 'You'}</span>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-8 text-gray-400">
                            <FileText className="w-12 h-12 mx-auto mb-2" />
                            <p>No notes yet</p>
                          </div>
                        )}
                      </div>

                      {/* Consent Flags */}
                      {studentDetails?.consentFlags && (
                        <div className="mt-6 p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                          <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 text-yellow-600" />
                            Consent & Permissions
                          </h4>
                          <div className="space-y-2">
                            {Object.entries(studentDetails.consentFlags).map(([key, value]) => (
                              <div key={key} className="flex items-center justify-between">
                                <span className="text-sm text-gray-700 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                                <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                  value ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                }`}>
                                  {value ? 'Granted' : 'Not Granted'}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'actions' && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Send className="w-5 h-5 text-purple-600" />
                        Quick Actions
                      </h3>

                      {/* Send Message */}
                      <div className="bg-blue-50 rounded-xl p-4 border-2 border-blue-200">
                        <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                          <MessageSquare className="w-5 h-5 text-blue-600" />
                          Send Message
                        </h4>
                        <textarea
                          placeholder="Type your message to the student..."
                          value={messageText}
                          onChange={(e) => setMessageText(e.target.value)}
                          rows={4}
                          className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-500 outline-none resize-none"
                        />
                        <button
                          onClick={handleSendMessage}
                          className="mt-3 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all flex items-center gap-2"
                        >
                          <Send className="w-4 h-4" />
                          Send Message
                        </button>
                      </div>

                      {/* Flag for Counselor */}
                      <div className={`rounded-xl p-4 border-2 ${
                        isFlagged 
                          ? 'bg-red-50 border-red-200' 
                          : 'bg-gray-50 border-gray-200'
                      }`}>
                        <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                          <Flag className="w-5 h-5 text-red-600" />
                          Flag for Counselor
                        </h4>
                        <p className="text-sm text-gray-600 mb-3">
                          {isFlagged 
                            ? 'This student is currently flagged and will be reviewed by counselor'
                            : 'Flag this student if they need counselor attention'}
                        </p>
                        <button
                          onClick={handleToggleFlag}
                          className={`px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                            isFlagged
                              ? 'bg-gray-600 text-white hover:bg-gray-700'
                              : 'bg-gradient-to-r from-red-600 to-pink-600 text-white hover:shadow-lg'
                          }`}
                        >
                          <Flag className="w-4 h-4" />
                          {isFlagged ? 'Remove Flag' : 'Flag Student'}
                        </button>
                      </div>

                      {/* View Full Profile */}
                      <div className="bg-purple-50 rounded-xl p-4 border-2 border-purple-200">
                        <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                          <Eye className="w-5 h-5 text-purple-600" />
                          Full Profile
                        </h4>
                        <p className="text-sm text-gray-600 mb-3">
                          View complete analytics and progress reports
                        </p>
                        <button
                          onClick={() => {
                            onClose();
                            window.location.href = `/school-teacher/student/${student._id}/progress`;
                          }}
                          className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all flex items-center gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          View Full Profile
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default StudentSlideoverPanel;

