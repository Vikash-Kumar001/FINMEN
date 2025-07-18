import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Settings,
    Shield,
    Users,
    Link,
    Save,
    Lock,
    Key,
    UserPlus,
    UserMinus,
    RefreshCw,
    Bell,
    Mail,
    Smartphone,
    Globe,
    Database,
    Cloud,
    Server,
    AlertTriangle,
    BarChart,
    FileText,
    Sliders,
    Zap,
    Clock
} from 'lucide-react';
import { useSocket } from '../../context/SocketContext';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'react-toastify';

const AdminSettings = () => {
    const { user } = useAuth();
    const socket = useSocket();
    
    // State management
    const [activeTab, setActiveTab] = useState('system');
    const [loading, setLoading] = useState(false);
    
    const [systemSettings, setSystemSettings] = useState({
        maintenanceMode: false,
        debugMode: false,
        analyticsEnabled: true,
        autoBackup: true,
        backupFrequency: 'daily',
        maxUploadSize: '10',
        sessionTimeout: '60'
    });

    const [notificationSettings, setNotificationSettings] = useState({
        adminAlerts: true,
        systemNotifications: true,
        userRegistrations: true,
        educatorApprovals: true,
        errorReports: true,
        securityAlerts: true
    });

    const [securitySettings, setSecuritySettings] = useState({
        twoFactorAuth: true,
        passwordPolicy: 'strong',
        loginAttempts: '5',
        sessionLength: '24',
        ipRestriction: false
    });

    const [integrations, setIntegrations] = useState([
        { id: 1, name: 'Google Analytics', connected: true, type: 'analytics' },
        { id: 2, name: 'Slack Notifications', connected: false, type: 'communication' },
        { id: 3, name: 'AWS S3 Storage', connected: true, type: 'storage' },
        { id: 4, name: 'SendGrid Email', connected: true, type: 'email' },
        { id: 5, name: 'Stripe Payments', connected: false, type: 'payment' }
    ]);

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { duration: 0.5 }
        }
    };

    const handleSystemSettingChange = (key, value) => {
        setSystemSettings(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const handleNotificationSettingChange = (key, value) => {
        setNotificationSettings(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const handleSecuritySettingChange = (key, value) => {
        setSecuritySettings(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const handleIntegrationToggle = (integrationId) => {
        setIntegrations(integrations.map(integration =>
            integration.id === integrationId
                ? { ...integration, connected: !integration.connected }
                : integration
        ));
    };

    const handleSaveSettings = () => {
        setLoading(true);
        
        // Emit socket event to save admin settings
        if (socket && socket.socket && user) {
            socket.socket.emit('admin:settings:save', { 
                adminId: user._id,
                systemSettings,
                notificationSettings,
                securitySettings,
                integrations
            });
            
            // Simulate response
            setTimeout(() => {
                setLoading(false);
                toast.success('Settings saved successfully!');
            }, 1000);
        } else {
            setLoading(false);
            toast.error('Error saving settings. Please try again.');
        }
    };

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6"
        >
            <div className="max-w-6xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-4xl font-bold text-gray-800 dark:text-white flex items-center gap-3">
                        <Settings className="w-8 h-8 text-indigo-600" />
                        Admin System Settings
                    </h1>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleSaveSettings}
                        className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors shadow-md"
                        disabled={loading}
                    >
                        {loading ? (
                            <RefreshCw className="w-5 h-5 animate-spin" />
                        ) : (
                            <Save className="w-5 h-5" />
                        )}
                        Save Changes
                    </motion.button>
                </div>

                {/* Settings Navigation */}
                <div className="flex flex-wrap gap-4 mb-8">
                    {[
                        { id: 'system', label: 'System', icon: Server },
                        { id: 'security', label: 'Security', icon: Shield },
                        { id: 'notifications', label: 'Notifications', icon: Bell },
                        { id: 'integrations', label: 'Integrations', icon: Link }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 ${activeTab === tab.id
                                ? 'bg-indigo-600 text-white shadow-md'
                                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                                }`}
                        >
                            <tab.icon className="w-5 h-5" />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Settings Content */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                    {/* System Settings */}
                    {activeTab === 'system' && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2 text-gray-800 dark:text-white">
                                <Server className="w-6 h-6 text-indigo-600" />
                                System Configuration
                            </h2>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200">General Settings</h3>
                                    
                                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                        <div>
                                            <h4 className="font-medium text-gray-800 dark:text-white flex items-center gap-2">
                                                <AlertTriangle className="w-4 h-4 text-amber-500" />
                                                Maintenance Mode
                                            </h4>
                                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                                Put the entire platform in maintenance mode
                                            </p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={systemSettings.maintenanceMode}
                                                onChange={() => handleSystemSettingChange('maintenanceMode', !systemSettings.maintenanceMode)}
                                                className="sr-only peer"
                                            />
                                            <div className="w-11 h-6 bg-gray-200 dark:bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                                        </label>
                                    </div>
                                    
                                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                        <div>
                                            <h4 className="font-medium text-gray-800 dark:text-white flex items-center gap-2">
                                                <Database className="w-4 h-4 text-indigo-500" />
                                                Debug Mode
                                            </h4>
                                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                                Enable detailed error logging and debugging
                                            </p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={systemSettings.debugMode}
                                                onChange={() => handleSystemSettingChange('debugMode', !systemSettings.debugMode)}
                                                className="sr-only peer"
                                            />
                                            <div className="w-11 h-6 bg-gray-200 dark:bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                                        </label>
                                    </div>
                                    
                                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                        <div>
                                            <h4 className="font-medium text-gray-800 dark:text-white flex items-center gap-2">
                                                <BarChart className="w-4 h-4 text-green-500" />
                                                Analytics Tracking
                                            </h4>
                                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                                Enable platform usage analytics
                                            </p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={systemSettings.analyticsEnabled}
                                                onChange={() => handleSystemSettingChange('analyticsEnabled', !systemSettings.analyticsEnabled)}
                                                className="sr-only peer"
                                            />
                                            <div className="w-11 h-6 bg-gray-200 dark:bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                                        </label>
                                    </div>
                                </div>
                                
                                <div className="space-y-4">
                                    <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200">Performance & Storage</h3>
                                    
                                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                        <div>
                                            <h4 className="font-medium text-gray-800 dark:text-white flex items-center gap-2">
                                                <Cloud className="w-4 h-4 text-blue-500" />
                                                Automatic Backups
                                            </h4>
                                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                                Schedule automatic system backups
                                            </p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={systemSettings.autoBackup}
                                                onChange={() => handleSystemSettingChange('autoBackup', !systemSettings.autoBackup)}
                                                className="sr-only peer"
                                            />
                                            <div className="w-11 h-6 bg-gray-200 dark:bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                                        </label>
                                    </div>
                                    
                                    {systemSettings.autoBackup && (
                                        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                                                Backup Frequency
                                            </label>
                                            <select
                                                value={systemSettings.backupFrequency}
                                                onChange={(e) => handleSystemSettingChange('backupFrequency', e.target.value)}
                                                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            >
                                                <option value="hourly">Hourly</option>
                                                <option value="daily">Daily</option>
                                                <option value="weekly">Weekly</option>
                                                <option value="monthly">Monthly</option>
                                            </select>
                                        </div>
                                    )}
                                    
                                    <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                                            Max Upload Size (MB)
                                        </label>
                                        <input
                                            type="number"
                                            value={systemSettings.maxUploadSize}
                                            onChange={(e) => handleSystemSettingChange('maxUploadSize', e.target.value)}
                                            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            min="1"
                                            max="100"
                                        />
                                    </div>
                                    
                                    <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                                            Session Timeout (minutes)
                                        </label>
                                        <input
                                            type="number"
                                            value={systemSettings.sessionTimeout}
                                            onChange={(e) => handleSystemSettingChange('sessionTimeout', e.target.value)}
                                            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            min="5"
                                            max="240"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Security Settings */}
                    {activeTab === 'security' && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2 text-gray-800 dark:text-white">
                                <Shield className="w-6 h-6 text-indigo-600" />
                                Security Configuration
                            </h2>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                        <div>
                                            <h4 className="font-medium text-gray-800 dark:text-white flex items-center gap-2">
                                                <Key className="w-4 h-4 text-amber-500" />
                                                Two-Factor Authentication
                                            </h4>
                                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                                Require 2FA for all admin accounts
                                            </p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={securitySettings.twoFactorAuth}
                                                onChange={() => handleSecuritySettingChange('twoFactorAuth', !securitySettings.twoFactorAuth)}
                                                className="sr-only peer"
                                            />
                                            <div className="w-11 h-6 bg-gray-200 dark:bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                                        </label>
                                    </div>
                                    
                                    <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                                            Password Policy
                                        </label>
                                        <select
                                            value={securitySettings.passwordPolicy}
                                            onChange={(e) => handleSecuritySettingChange('passwordPolicy', e.target.value)}
                                            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        >
                                            <option value="basic">Basic (8+ characters)</option>
                                            <option value="medium">Medium (8+ chars, mixed case)</option>
                                            <option value="strong">Strong (8+ chars, mixed case, numbers, symbols)</option>
                                            <option value="very-strong">Very Strong (12+ chars, mixed case, numbers, symbols)</option>
                                        </select>
                                    </div>
                                </div>
                                
                                <div className="space-y-4">
                                    <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                                            Max Login Attempts
                                        </label>
                                        <input
                                            type="number"
                                            value={securitySettings.loginAttempts}
                                            onChange={(e) => handleSecuritySettingChange('loginAttempts', e.target.value)}
                                            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            min="1"
                                            max="10"
                                        />
                                    </div>
                                    
                                    <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                                            Session Length (hours)
                                        </label>
                                        <input
                                            type="number"
                                            value={securitySettings.sessionLength}
                                            onChange={(e) => handleSecuritySettingChange('sessionLength', e.target.value)}
                                            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            min="1"
                                            max="72"
                                        />
                                    </div>
                                    
                                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                        <div>
                                            <h4 className="font-medium text-gray-800 dark:text-white flex items-center gap-2">
                                                <Globe className="w-4 h-4 text-blue-500" />
                                                IP Restriction
                                            </h4>
                                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                                Limit admin access to specific IP addresses
                                            </p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={securitySettings.ipRestriction}
                                                onChange={() => handleSecuritySettingChange('ipRestriction', !securitySettings.ipRestriction)}
                                                className="sr-only peer"
                                            />
                                            <div className="w-11 h-6 bg-gray-200 dark:bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Notification Settings */}
                    {activeTab === 'notifications' && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2 text-gray-800 dark:text-white">
                                <Bell className="w-6 h-6 text-indigo-600" />
                                Notification Configuration
                            </h2>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200">System Notifications</h3>
                                    
                                    {Object.entries({
                                        adminAlerts: 'Admin Alerts',
                                        systemNotifications: 'System Status Updates',
                                        errorReports: 'Error Reports',
                                        securityAlerts: 'Security Alerts'
                                    }).map(([key, label]) => (
                                        <div key={key} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                            <div>
                                                <h4 className="font-medium text-gray-800 dark:text-white">{label}</h4>
                                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                                    Receive notifications about {label.toLowerCase()}
                                                </p>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={notificationSettings[key]}
                                                    onChange={() => handleNotificationSettingChange(key, !notificationSettings[key])}
                                                    className="sr-only peer"
                                                />
                                                <div className="w-11 h-6 bg-gray-200 dark:bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                                            </label>
                                        </div>
                                    ))}
                                </div>
                                
                                <div className="space-y-4">
                                    <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200">User Activity Notifications</h3>
                                    
                                    {Object.entries({
                                        userRegistrations: 'New User Registrations',
                                        educatorApprovals: 'Educator Approval Requests'
                                    }).map(([key, label]) => (
                                        <div key={key} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                            <div>
                                                <h4 className="font-medium text-gray-800 dark:text-white">{label}</h4>
                                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                                    Receive notifications about {label.toLowerCase()}
                                                </p>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={notificationSettings[key]}
                                                    onChange={() => handleNotificationSettingChange(key, !notificationSettings[key])}
                                                    className="sr-only peer"
                                                />
                                                <div className="w-11 h-6 bg-gray-200 dark:bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                                            </label>
                                        </div>
                                    ))}
                                    
                                    <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                        <h4 className="font-medium text-gray-800 dark:text-white mb-4">Notification Delivery Methods</h4>
                                        
                                        <div className="space-y-3">
                                            <label className="flex items-center space-x-3">
                                                <input type="checkbox" checked className="form-checkbox h-5 w-5 text-indigo-600 rounded focus:ring-indigo-500" />
                                                <span className="text-gray-700 dark:text-gray-200 flex items-center gap-2">
                                                    <Mail className="w-4 h-4 text-indigo-500" /> Email
                                                </span>
                                            </label>
                                            
                                            <label className="flex items-center space-x-3">
                                                <input type="checkbox" checked className="form-checkbox h-5 w-5 text-indigo-600 rounded focus:ring-indigo-500" />
                                                <span className="text-gray-700 dark:text-gray-200 flex items-center gap-2">
                                                    <Bell className="w-4 h-4 text-indigo-500" /> In-App
                                                </span>
                                            </label>
                                            
                                            <label className="flex items-center space-x-3">
                                                <input type="checkbox" className="form-checkbox h-5 w-5 text-indigo-600 rounded focus:ring-indigo-500" />
                                                <span className="text-gray-700 dark:text-gray-200 flex items-center gap-2">
                                                    <Smartphone className="w-4 h-4 text-indigo-500" /> SMS
                                                </span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Integrations */}
                    {activeTab === 'integrations' && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2 text-gray-800 dark:text-white">
                                <Link className="w-6 h-6 text-indigo-600" />
                                External Integrations
                            </h2>
                            
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 gap-4">
                                    {integrations.map(integration => (
                                        <div key={integration.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border-l-4 border-indigo-500">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-indigo-100 dark:bg-indigo-900 rounded-lg">
                                                    {integration.type === 'analytics' && <BarChart className="w-5 h-5 text-indigo-600" />}
                                                    {integration.type === 'communication' && <Mail className="w-5 h-5 text-indigo-600" />}
                                                    {integration.type === 'storage' && <Database className="w-5 h-5 text-indigo-600" />}
                                                    {integration.type === 'email' && <Mail className="w-5 h-5 text-indigo-600" />}
                                                    {integration.type === 'payment' && <FileText className="w-5 h-5 text-indigo-600" />}
                                                </div>
                                                <div>
                                                    <h4 className="font-medium text-gray-800 dark:text-white">
                                                        {integration.name}
                                                    </h4>
                                                    <p className="text-sm text-gray-600 dark:text-gray-300">
                                                        {integration.type.charAt(0).toUpperCase() + integration.type.slice(1)} integration
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${integration.connected ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'}`}>
                                                    {integration.connected ? 'Connected' : 'Disconnected'}
                                                </span>
                                                <button
                                                    onClick={() => handleIntegrationToggle(integration.id)}
                                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${integration.connected
                                                        ? 'bg-red-50 text-red-700 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50'
                                                        : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-400 dark:hover:bg-indigo-900/50'
                                                        }`}
                                                >
                                                    {integration.connected ? 'Disconnect' : 'Connect'}
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                
                                <div className="flex justify-center">
                                    <button className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-400 dark:hover:bg-indigo-900/50 rounded-lg transition-colors">
                                        <Zap className="w-4 h-4" />
                                        Add New Integration
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                
                <div className="mt-8 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-100 dark:border-indigo-800">
                    <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-400">
                        <Clock className="w-5 h-5" />
                        <span className="text-sm font-medium">Last updated: Today at 10:45 AM</span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default AdminSettings;