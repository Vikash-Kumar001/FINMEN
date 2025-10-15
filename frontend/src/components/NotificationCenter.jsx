import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, X, Check, AlertTriangle, Info, CheckCircle, 
  Clock, FileText, Shield, UserCheck, Trash2 
} from 'lucide-react';
import api from '../utils/api';
import { toast } from 'react-hot-toast';

const NotificationCenter = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState([]);
  const [approvalQueue, setApprovalQueue] = useState([]);
  const [policyNotifications, setPolicyNotifications] = useState([]);
  const [activeTab, setActiveTab] = useState('all'); // all, approvals, policies
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const [allRes, approvalRes, policyRes] = await Promise.all([
        api.get('/api/notifications'),
        api.get('/api/notifications/approval-queue').catch(() => ({ data: { notifications: [] } })),
        api.get('/api/notifications/policy-changes').catch(() => ({ data: { notifications: [] } })),
      ]);

      setNotifications(allRes.data || []);
      setApprovalQueue(approvalRes.data?.notifications || []);
      setPolicyNotifications(policyRes.data?.notifications || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await api.patch(`/api/notifications/${notificationId}/read`);
      setNotifications(prev => 
        prev.map(n => n._id === notificationId ? { ...n, isRead: true } : n)
      );
      toast.success('Marked as read');
    } catch (error) {
      toast.error('Failed to mark as read');
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.patch('/api/notifications/read-all');
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      toast.success('All notifications marked as read');
    } catch (error) {
      toast.error('Failed to mark all as read');
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      await api.delete(`/api/notifications/${notificationId}`);
      setNotifications(prev => prev.filter(n => n._id !== notificationId));
      toast.success('Notification deleted');
    } catch (error) {
      toast.error('Failed to delete notification');
    }
  };

  const acknowledgePolicyChange = async (notificationId) => {
    try {
      await api.patch(`/api/notifications/policy-change/${notificationId}/acknowledge`);
      setPolicyNotifications(prev =>
        prev.map(n => n._id === notificationId ? { ...n, isRead: true, metadata: { ...n.metadata, acknowledged: true } } : n)
      );
      toast.success('Policy change acknowledged');
    } catch (error) {
      toast.error('Failed to acknowledge');
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'assignment_approval_pending':
        return <Clock className="w-5 h-5 text-orange-500" />;
      case 'policy_change':
      case 'policy_change_parent':
        return <Shield className="w-5 h-5 text-blue-500" />;
      case 'trial_extension_approved':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'assignment_approved':
        return <UserCheck className="w-5 h-5 text-green-500" />;
      default:
        return <Info className="w-5 h-5 text-gray-500" />;
    }
  };

  const renderNotificationContent = (notification, type = 'regular') => {
    const isUnread = !notification.isRead;
    
    return (
      <motion.div
        key={notification._id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, x: -100 }}
        className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
          isUnread ? 'bg-blue-50' : 'bg-white'
        }`}
      >
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 mt-1">
            {getNotificationIcon(notification.type)}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900">
                  {notification.title || 'Notification'}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {notification.message}
                </p>
                
                {/* Special rendering for approval queue */}
                {type === 'approval' && notification.metadata && (
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <span className="font-medium">{notification.metadata.teacherName}</span>
                      {notification.metadata.className && (
                        <>
                          <span>•</span>
                          <span>{notification.metadata.className}</span>
                        </>
                      )}
                      {notification.metadata.subject && (
                        <>
                          <span>•</span>
                          <span className="capitalize">{notification.metadata.subject}</span>
                        </>
                      )}
                    </div>
                    {notification.metadata.dueDate && (
                      <p className="text-xs text-gray-500">
                        Due: {new Date(notification.metadata.dueDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                )}
                
                {/* Special rendering for policy changes */}
                {type === 'policy' && notification.metadata && (
                  <div className="mt-2 space-y-1">
                    <p className="text-xs text-gray-600">
                      <span className="font-medium">{notification.metadata.policyName}</span>
                      {notification.metadata.retentionPeriod && (
                        <span> - {notification.metadata.retentionPeriod}</span>
                      )}
                    </p>
                    {notification.metadata.actionRequired && !notification.metadata.acknowledged && (
                      <button
                        onClick={() => acknowledgePolicyChange(notification._id)}
                        className="mt-2 px-3 py-1 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Acknowledge
                      </button>
                    )}
                    {notification.metadata.acknowledged && (
                      <span className="inline-flex items-center space-x-1 text-xs text-green-600">
                        <Check className="w-3 h-3" />
                        <span>Acknowledged</span>
                      </span>
                    )}
                  </div>
                )}
                
                <p className="text-xs text-gray-400 mt-2">
                  {new Date(notification.createdAt).toLocaleString()}
                </p>
              </div>
              
              <div className="flex items-center space-x-2 ml-2">
                {isUnread && (
                  <button
                    onClick={() => markAsRead(notification._id)}
                    className="p-1 hover:bg-gray-200 rounded transition-colors"
                    title="Mark as read"
                  >
                    <Check className="w-4 h-4 text-gray-600" />
                  </button>
                )}
                <button
                  onClick={() => deleteNotification(notification._id)}
                  className="p-1 hover:bg-red-100 rounded transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  const filteredNotifications = () => {
    switch (activeTab) {
      case 'approvals':
        return approvalQueue;
      case 'policies':
        return policyNotifications;
      default:
        return notifications;
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

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
            className="fixed inset-0 bg-black bg-opacity-25 z-40"
          />
          
          {/* Notification Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
              <div className="flex items-center space-x-3">
                <Bell className="w-6 h-6" />
                <div>
                  <h2 className="text-lg font-bold">Notifications</h2>
                  <p className="text-xs text-indigo-100">{unreadCount} unread</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200 bg-gray-50">
              <button
                onClick={() => setActiveTab('all')}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === 'all'
                    ? 'text-indigo-600 border-b-2 border-indigo-600 bg-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                All ({notifications.length})
              </button>
              <button
                onClick={() => setActiveTab('approvals')}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === 'approvals'
                    ? 'text-indigo-600 border-b-2 border-indigo-600 bg-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Approvals ({approvalQueue.length})
              </button>
              <button
                onClick={() => setActiveTab('policies')}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === 'policies'
                    ? 'text-indigo-600 border-b-2 border-indigo-600 bg-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Policies ({policyNotifications.length})
              </button>
            </div>

            {/* Actions */}
            {unreadCount > 0 && activeTab === 'all' && (
              <div className="p-3 border-b border-gray-200 bg-gray-50">
                <button
                  onClick={markAllAsRead}
                  className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  Mark all as read
                </button>
              </div>
            )}

            {/* Notifications List */}
            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
                </div>
              ) : filteredNotifications().length > 0 ? (
                <AnimatePresence>
                  {filteredNotifications().map(notification =>
                    renderNotificationContent(
                      notification,
                      activeTab === 'approvals' ? 'approval' : activeTab === 'policies' ? 'policy' : 'regular'
                    )
                  )}
                </AnimatePresence>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                  <Bell className="w-16 h-16 mb-4" />
                  <p className="text-sm">No notifications</p>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default NotificationCenter;

