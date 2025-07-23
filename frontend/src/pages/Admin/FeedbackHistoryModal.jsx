import { useEffect, useState } from 'react';
import { useSocket } from "../../context/SocketContext";
import { useAuth } from "../../hooks/useAuth";
const FeedbackHistoryModal = ({ studentId, onClose }) => {
    const [feedbackList, setFeedbackList] = useState([]);
    const [loading, setLoading] = useState(true);
    const socket = useSocket();
    const { user } = useAuth();

    useEffect(() => {
        if (socket && socket.socket && studentId) {
            try {
                socket.socket.emit('admin:feedback:history:subscribe', { adminId: user?._id, studentId });
            } catch (err) {
                console.error("❌ Error subscribing to feedback history:", err.message);
            }
            
            socket.socket.on('admin:feedback:history:data', (data) => {
                setFeedbackList(data);
                setLoading(false);
            });
            // Update feedback in real time if backend supports
            socket.socket.on('admin:feedback:history:update', setFeedbackList);
            
            // Cleanup
            return () => {
                try {
                    if (socket && socket.socket) {
                        socket.socket.off('admin:feedback:history:data');
                        socket.socket.off('admin:feedback:history:update');
                    }
                } catch (err) {
                    console.error("❌ Error cleaning up feedback history socket listeners:", err.message);
                }
            };
        }
    }, [socket, user, studentId]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg w-[90%] max-w-2xl p-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Feedback History</h2>
                <button
                    className="absolute top-3 right-5 text-gray-500 hover:text-red-500 text-xl"
                    onClick={onClose}
                >
                    ×
                </button>
                {loading ? (
                    <p className="text-gray-500">Loading...</p>
                ) : feedbackList.length === 0 ? (
                    <p className="text-gray-500">No feedback available.</p>
                ) : (
                    <ul className="space-y-4 max-h-80 overflow-y-auto">
                        {feedbackList.map((item) => (
                            <li key={item._id} className="bg-gray-100 dark:bg-gray-800 p-3 rounded shadow-sm">
                                <p className="text-gray-700 dark:text-gray-300">{item.feedback}</p>
                                <p className="text-sm text-gray-500 mt-1">
                                    — {item.educatorId?.name || 'Educator'},{" "}
                                    {new Date(item.createdAt).toLocaleString()}
                                </p>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default FeedbackHistoryModal;