import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSocket } from "../../context/SocketContext";
import { useAuth } from "../../hooks/useAuth";
import { UserCheck, Search, AlertCircle, ChevronDown, ChevronUp } from "lucide-react";

const AdminEducatorPanel = () => {
    const [educators, setEducators] = useState([]);
    const [filteredEducators, setFilteredEducators] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [expandedId, setExpandedId] = useState(null);
    const socket = useSocket();
    const { user } = useAuth();

    useEffect(() => {
        if (socket && user) {
            setLoading(true);
            socket.emit('admin:educator:pending:subscribe', { adminId: user._id });

            socket.on('admin:educator:pending:data', (data) => {
                setEducators(data);
                setFilteredEducators(data);
                setLoading(false);
                setError(null);
            });

            socket.on('admin:educator:pending:update', (data) => {
                setEducators(data);
                setFilteredEducators(data);
                setError(null);
            });

            socket.on('admin:educator:pending:error', (err) => {
                setError(err.message || 'Failed to fetch educator data');
                setLoading(false);
            });

            return () => {
                socket.off('admin:educator:pending:data');
                socket.off('admin:educator:pending:update');
                socket.off('admin:educator:pending:error');
            };
        }
    }, [socket, user]);

    useEffect(() => {
        const filtered = educators.filter(edu =>
            edu.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            edu.email?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredEducators(filtered);
    }, [searchTerm, educators]);

    const handleApprove = (id, name) => {
        if (window.confirm(`Are you sure you want to approve ${name}?`)) {
            socket.emit('admin:educator:approve', { adminId: user._id, educatorId: id });
        }
    };

    const handleBlock = (id, name) => {
        if (window.confirm(`Are you sure you want to block ${name}?`)) {
            socket.emit('admin:educator:block', { adminId: user._id, educatorId: id });
        }
    };

    const toggleDetails = (id) => {
        setExpandedId(expandedId === id ? null : id);
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2,
            },
        },
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 15,
            },
        },
    };

    if (error) {
        return (
            <motion.div
                className="max-w-6xl mx-auto p-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
            >
                <div className="bg-red-50 border border-red-200 rounded-2xl p-6 flex items-center gap-3">
                    <AlertCircle className="w-6 h-6 text-red-500" />
                    <p className="text-red-700">{error}</p>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-6xl mx-auto p-6"
        >
            <motion.div
                variants={itemVariants}
                className="flex items-center gap-3 mb-6"
            >
                <motion.div
                    className="w-12 h-12 bg-gradient-to-r from-purple-500 to-violet-500 rounded-xl flex items-center justify-center text-white"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                >
                    <UserCheck className="w-6 h-6" />
                </motion.div>
                <h2 className="text-3xl font-bold text-slate-800">Pending Educators</h2>
            </motion.div>

            <motion.div
                variants={itemVariants}
                className="mb-6 relative"
            >
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <input
                    type="text"
                    placeholder="Search educators by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-xl border border Slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white/95"
                />
            </motion.div>

            {loading ? (
                <motion.div
                    variants={itemVariants}
                    className="animate-pulse"
                >
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-24 bg-slate-200 rounded-2xl"></div>
                        ))}
                    </div>
                </motion.div>
            ) : filteredEducators.length === 0 ? (
                <motion.div
                    variants={itemVariants}
                    className="bg-white/95 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-white/50 text-center"
                >
                    <p className="text-slate-500 text-lg">No pending educators found</p>
                </motion.div>
            ) : (
                <motion.div
                    variants={itemVariants}
                    className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-lg border border-white/50 divide-y divide-slate-100"
                >
                    {filteredEducators.map((edu) => (
                        <motion.div
                            key={edu._id}
                            variants={itemVariants}
                            className="p-4"
                        >
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-violet-500 rounded-xl flex items-center justify-center text-white">
                                        <UserCheck className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-lg font-semibold text-slate-800">{edu.name}</p>
                                        <p className="text-sm text-slate-500">{edu.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => handleApprove(edu._id, edu.name)}
                                        className="px-4 py-2 bg-green-500 text-white rounded-xl font-medium hover:bg-green-600 transition-colors"
                                    >
                                        Approve
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => handleBlock(edu._id, edu.name)}
                                        className="px-4 py-2 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-colors"
                                    >
                                        Block
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        onClick={() => toggleDetails(edu._id)}
                                        className="p-2 text-slate-500 hover:text-indigo-500"
                                    >
                                        {expandedId === edu._id ? (
                                            <ChevronUp className="w-5 h-5" />
                                        ) : (
                                            <ChevronDown className="w-5 h-5" />
                                        )}
                                    </motion.button>
                                </div>
                            </div>
                            <AnimatePresence>
                                {expandedId === edu._id && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="mt-4 p-4 bg-slate-50 rounded-lg"
                                    >
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-sm font-medium text-slate-600">Institution</p>
                                                <p className="text-slate-800">{edu.institution || 'Not provided'}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-slate-600">Registration Date</p>
                                                <p className="text-slate-800">
                                                    {edu.createdAt ? new Date(edu.createdAt).toLocaleDateString() : 'N/A'}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-slate-600">Status</p>
                                                <p className="text-slate-800">{edu.status || 'Pending'}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-slate-600">Department</p>
                                                <p className="text-slate-800">{edu.department || 'Not provided'}</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </motion.div>
            )}
        </motion.div>
    );
};

export default AdminEducatorPanel;