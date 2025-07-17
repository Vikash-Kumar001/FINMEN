import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    FileText,
    Send,
    BarChart,
    Bell,
    Plus,
    Calendar,
    Users,
    Clock,
    AlertTriangle,
    CheckCircle,
    X,
    ChevronRight,
    Download,
    RefreshCw
} from 'lucide-react';

const QuickActions = () => {
    // State management
    const [activeModal, setActiveModal] = useState(null);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        dueDate: '',
        recipients: [],
        type: ''
    });

    // Sample data
    const alerts = [
        {
            id: 1,
            type: 'warning',
            message: 'Low student engagement in Module 3',
            timestamp: '2 hours ago'
        },
        {
            id: 2,
            type: 'critical',
            message: 'Assignment deadline approaching',
            timestamp: '1 hour ago'
        },
        {
            id: 3,
            type: 'info',
            message: 'New resource available',
            timestamp: '30 minutes ago'
        }
    ];

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { duration: 0.5 }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            setActiveModal(null);
            setFormData({
                title: '',
                description: '',
                dueDate: '',
                recipients: [],
                type: ''
            });
            alert('Action completed successfully!');
        }, 1000);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Modal component
    const ActionModal = ({ title, children }) => (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-lg"
            >
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
                    <button
                        onClick={() => setActiveModal(null)}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
                {children}
            </motion.div>
        </div>
    );

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-6"
        >
            <div className="max-w-6xl mx-auto">
                <h1 className="text-4xl font-bold text-gray-800 mb-8">Quick Actions</h1>

                {/* Action Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {/* Create Assignment */}
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setActiveModal('assignment')}
                        className="bg-white rounded-xl p-6 shadow-lg cursor-pointer hover:shadow-xl transition-shadow"
                    >
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-blue-100 rounded-lg">
                                <FileText className="w-6 h-6 text-blue-600" />
                            </div>
                            <h2 className="text-xl font-semibold">Create Assignment</h2>
                        </div>
                        <p className="text-gray-600">Create and assign new tasks to students</p>
                    </motion.div>

                    {/* Send Announcement */}
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setActiveModal('announcement')}
                        className="bg-white rounded-xl p-6 shadow-lg cursor-pointer hover:shadow-xl transition-shadow"
                    >
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-purple-100 rounded-lg">
                                <Send className="w-6 h-6 text-purple-600" />
                            </div>
                            <h2 className="text-xl font-semibold">Send Announcement</h2>
                        </div>
                        <p className="text-gray-600">Broadcast messages to your class</p>
                    </motion.div>

                    {/* Generate Report */}
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setActiveModal('report')}
                        className="bg-white rounded-xl p-6 shadow-lg cursor-pointer hover:shadow-xl transition-shadow"
                    >
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-green-100 rounded-lg">
                                <BarChart className="w-6 h-6 text-green-600" />
                            </div>
                            <h2 className="text-xl font-semibold">Generate Report</h2>
                        </div>
                        <p className="text-gray-600">Create detailed performance reports</p>
                    </motion.div>

                    {/* Review Alerts */}
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setActiveModal('alerts')}
                        className="bg-white rounded-xl p-6 shadow-lg cursor-pointer hover:shadow-xl transition-shadow"
                    >
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-red-100 rounded-lg">
                                <Bell className="w-6 h-6 text-red-600" />
                            </div>
                            <h2 className="text-xl font-semibold">Review Alerts</h2>
                        </div>
                        <p className="text-gray-600">Check important notifications</p>
                    </motion.div>
                </div>

                {/* Modals */}
                {activeModal === 'assignment' && (
                    <ActionModal title="Create Assignment">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Title
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Description
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Due Date
                                </label>
                                <input
                                    type="datetime-local"
                                    name="dueDate"
                                    value={formData.dueDate}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <RefreshCw className="w-5 h-5 animate-spin" />
                                ) : (
                                    <Plus className="w-5 h-5" />
                                )}
                                Create Assignment
                            </button>
                        </form>
                    </ActionModal>
                )}

                {activeModal === 'announcement' && (
                    <ActionModal title="Send Announcement">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Title
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Message
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-500 h-32"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <RefreshCw className="w-5 h-5 animate-spin" />
                                ) : (
                                    <Send className="w-5 h-5" />
                                )}
                                Send Announcement
                            </button>
                        </form>
                    </ActionModal>
                )}

                {activeModal === 'report' && (
                    <ActionModal title="Generate Report">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Report Type
                                </label>
                                <select
                                    name="type"
                                    value={formData.type}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-green-500"
                                    required
                                >
                                    <option value="">Select a report type</option>
                                    <option value="performance">Performance Report</option>
                                    <option value="attendance">Attendance Report</option>
                                    <option value="progress">Progress Report</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Date Range
                                </label>
                                <div className="flex gap-4">
                                    <input
                                        type="date"
                                        name="startDate"
                                        className="flex-1 px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-green-500"
                                        required
                                    />
                                    <input
                                        type="date"
                                        name="endDate"
                                        className="flex-1 px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-green-500"
                                        required
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <RefreshCw className="w-5 h-5 animate-spin" />
                                ) : (
                                    <Download className="w-5 h-5" />
                                )}
                                Generate Report
                            </button>
                        </form>
                    </ActionModal>
                )}

                {activeModal === 'alerts' && (
                    <ActionModal title="Review Alerts">
                        <div className="space-y-4">
                            {alerts.map(alert => (
                                <div
                                    key={alert.id}
                                    className="p-4 bg-gray-50 rounded-lg flex items-start gap-4"
                                >
                                    <div className={`p-2 rounded-full ${alert.type === 'warning' ? 'bg-yellow-100' :
                                            alert.type === 'critical' ? 'bg-red-100' : 'bg-blue-100'
                                        }`}>
                                        <AlertTriangle className={`w-5 h-5 ${alert.type === 'warning' ? 'text-yellow-600' :
                                                alert.type === 'critical' ? 'text-red-600' : 'text-blue-600'
                                            }`} />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium text-gray-800">{alert.message}</p>
                                        <p className="text-sm text-gray-500">{alert.timestamp}</p>
                                    </div>
                                    <button className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                                        <CheckCircle className="w-5 h-5 text-green-600" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </ActionModal>
                )}
            </div>
        </motion.div>
    );
};

export default QuickActions;