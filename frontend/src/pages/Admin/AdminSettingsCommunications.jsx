import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  MessageSquare,
  RefreshCw,
  ArrowRight,
  Clock,
  ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../../utils/api';

const AdminSettingsCommunications = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchMessages = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api
        .get('/api/admin/tracking/communication-flow')
        .catch(() => ({ data: { data: [] } }));
      const data =
        res.data.data?.recentChatMessages ||
        res.data.data?.communications ||
        res.data.data ||
        [];
      setMessages(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching communications:', err);
      setError('Failed to load communications');
      toast.error('Failed to load communications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="bg-white shadow-lg border-b-2 border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-black bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent">
              All Chat Messages
            </h1>
            <p className="text-sm text-gray-600">
              View recent communications across the platform
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => navigate('/admin/settings')}
              className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Settings
            </button>
            <button
              onClick={fetchMessages}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 overflow-hidden"
        >
          {loading ? (
            <div className="p-12 flex flex-col items-center justify-center gap-3 text-gray-500">
              <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
              <p>Loading communications...</p>
            </div>
          ) : error ? (
            <div className="p-12 text-center text-red-500 font-semibold">
              {error}
            </div>
          ) : messages.length === 0 ? (
            <div className="p-12 text-center text-gray-600 flex flex-col items-center gap-3">
              <MessageSquare className="w-12 h-12 text-gray-400" />
              <p>No messages found</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {messages.map((msg, idx) => (
                <div key={idx} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-black flex-shrink-0">
                      {msg.from?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        <span className="font-bold text-gray-900">{msg.from || 'Unknown'}</span>
                        {msg.fromRole && (
                          <span className="text-xs px-2 py-1 bg-blue-100 text-blue-600 rounded-full font-semibold capitalize">
                            {msg.fromRole}
                          </span>
                        )}
                        <ArrowRight className="w-4 h-4 text-gray-400" />
                        <span className="font-semibold text-gray-700">{msg.to || 'Unknown'}</span>
                        {msg.toRole && (
                          <span className="text-xs px-2 py-1 bg-purple-100 text-purple-600 rounded-full font-semibold capitalize">
                            {msg.toRole}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-800 bg-gray-50 p-3 rounded-lg mb-2 whitespace-pre-wrap break-words">
                        {msg.message || msg.content || '—'}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        {msg.timestamp ? new Date(msg.timestamp).toLocaleString() : 'Timestamp unavailable'}
                        {msg._id && (
                          <span className="ml-2 px-2 py-0.5 bg-indigo-100 text-indigo-600 rounded">
                            ID: {msg._id.toString().substring(0, 8)}
                          </span>
                        )}
                      </div>
                      {msg.fromEmail && (
                        <div className="text-xs text-gray-500 mt-1">
                          📧 {msg.fromEmail}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default AdminSettingsCommunications;

