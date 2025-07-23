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
    Server
} from 'lucide-react';

const SystemSettings = () => {
    // State management
    const [activeTab, setActiveTab] = useState('privacy');
    const [loading, setLoading] = useState(false);
    const [notifications, setNotifications] = useState({
        email: true,
        push: true,
        sms: false
    });
    const [privacySettings, setPrivacySettings] = useState({
        dataSharing: false,
        analytics: true,
        publicProfile: true
    });
    const [roles, setRoles] = useState([
        { id: 1, name: 'Administrator', permissions: ['all'] },
        { id: 2, name: 'Teacher', permissions: ['view', 'edit', 'create'] },
        { id: 3, name: 'Assistant', permissions: ['view', 'create'] }
    ]);
    const [integrations, setIntegrations] = useState([
        { id: 1, name: 'Google Classroom', connected: true },
        { id: 2, name: 'Microsoft Teams', connected: false },
        { id: 3, name: 'Canvas LMS', connected: true }
    ]);

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { duration: 0.5 }
        }
    };

    const handleSaveSettings = () => {
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            alert('Settings saved successfully!');
        }, 1000);
    };

    const handleRoleUpdate = (roleId, newPermissions) => {
        setRoles(roles.map(role =>
            role.id === roleId ? { ...role, permissions: newPermissions } : role
        ));
    };

    const handleIntegrationToggle = (integrationId) => {
        setIntegrations(integrations.map(integration =>
            integration.id === integrationId
                ? { ...integration, connected: !integration.connected }
                : integration
        ));
    };

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 p-6"
        >
            <div className="max-w-6xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-4xl font-bold text-gray-800">
                        System Settings
                    </h1>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleSaveSettings}
                        className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
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
                <div className="flex gap-4 mb-8">
                    {['privacy', 'roles', 'integrations'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-3 rounded-lg font-medium transition-colors ${activeTab === tab
                                ? 'bg-blue-600 text-white'
                                : 'bg-white text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </div>

                {/* Settings Content */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                    {/* Privacy Settings */}
                    {activeTab === 'privacy' && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                                <Shield className="w-6 h-6 text-blue-600" />
                                Privacy Settings
                            </h2>
                            <div className="space-y-4">
                                {Object.entries(privacySettings).map(([key, value]) => (
                                    <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                        <div>
                                            <h3 className="font-medium text-gray-800">
                                                {key.split(/(?=[A-Z])/).join(' ')}
                                            </h3>
                                            <p className="text-sm text-gray-600">
                                                Manage your {key.toLowerCase()} preferences
                                            </p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={value}
                                                onChange={() =>
                                                    setPrivacySettings(prev => ({
                                                        ...prev,
                                                        [key]: !prev[key]
                                                    }))
                                                }
                                                className="sr-only peer"
                                            />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Role Management */}
                    {activeTab === 'roles' && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                                <Users className="w-6 h-6 text-blue-600" />
                                Role Management
                            </h2>
                            <div className="space-y-4">
                                {roles.map(role => (
                                    <div key={role.id} className="p-4 bg-gray-50 rounded-lg">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="font-medium text-gray-800">{role.name}</h3>
                                            <div className="flex gap-2">
                                                <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                                                    <UserPlus className="w-5 h-5" />
                                                </button>
                                                <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                                                    <UserMinus className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            {role.permissions.map(permission => (
                                                <span
                                                    key={permission}
                                                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                                                >
                                                    {permission}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Integrations */}
                    {activeTab === 'integrations' && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                                <Link className="w-6 h-6 text-blue-600" />
                                Integrations
                            </h2>
                            <div className="space-y-4">
                                {integrations.map(integration => (
                                    <div key={integration.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                        <div>
                                            <h3 className="font-medium text-gray-800">
                                                {integration.name}
                                            </h3>
                                            <p className="text-sm text-gray-600">
                                                {integration.connected ? 'Connected' : 'Not connected'}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => handleIntegrationToggle(integration.id)}
                                            className={`px-4 py-2 rounded-lg font-medium ${integration.connected
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                }`}
                                        >
                                            {integration.connected ? 'Connected' : 'Connect'}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default SystemSettings;