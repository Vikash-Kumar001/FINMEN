import { useEffect, useState } from "react";
import { useSocket } from "../../context/SocketContext";
import { useAuth } from "../../hooks/useAuth";

const AdminUsersPanel = () => {
    const [students, setStudents] = useState([]);
    const socket = useSocket();
    const { user } = useAuth();

    useEffect(() => {
        if (socket && socket.socket && user) {
            try {
                try {
                    socket.socket.emit('admin:students:subscribe', { adminId: user._id });
                } catch (err) {
                    console.error("❌ Error subscribing to admin students:", err.message);
                }
                
                socket.socket.on('admin:students:data', setStudents);
                socket.socket.on('admin:students:update', setStudents);
            } catch (err) {
                console.error("❌ Error setting up admin users socket listeners:", err.message);
            }
            
            return () => {
                try {
                    if (socket && socket.socket) {
                        socket.socket.off('admin:students:data');
                        socket.socket.off('admin:students:update');
                    }
                } catch (err) {
                    console.error("❌ Error cleaning up admin users socket listeners:", err.message);
                }
            };
        }
    }, [socket, user]);

    const handleExport = () => {
        if (!socket || !socket.socket) {
            console.error("❌ Socket not available for export");
            return;
        }
        
        try {
            // Ask the server to send a CSV file back in a download event
            try {
                socket.socket.emit('admin:students:exportCSV', { adminId: user._id });
            } catch (err) {
                console.error("❌ Error requesting CSV export:", err.message);
                return;
            }
            
            // Set up one-time listener for the CSV data
            socket.socket.on('admin:students:csv', (csvData) => {
                try {
                    const blob = new Blob([csvData], { type: "text/csv" });
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement("a");
                    link.href = url;
                    link.download = "students.csv";
                    link.click();
                } catch (err) {
                    console.error("❌ Error processing CSV data:", err.message);
                } finally {
                    // Remove listener after download to avoid multiple downloads
                    if (socket && socket.socket) {
                        socket.socket.off('admin:students:csv'); 
                    }
                }
            });
        } catch (err) {
            console.error("❌ Error exporting students data:", err.message);
        }
    };

    return (
        <div className="bg-white shadow p-4 rounded">
            <h2 className="text-xl font-semibold mb-4">👨‍🎓 All Students</h2>
            <button
                onClick={handleExport}
                className="mb-4 px-4 py-2 bg-indigo-600 text-white rounded"
            >
                Export CSV
            </button>
            <table className="w-full text-left border">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="p-2">Name</th>
                        <th className="p-2">Email</th>
                        <th className="p-2">Role</th>
                    </tr>
                </thead>
                <tbody>
                    {students.map((s) => (
                        <tr key={s._id}>
                            <td className="p-2">{s.name}</td>
                            <td className="p-2">{s.email}</td>
                            <td className="p-2">{s.role}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminUsersPanel;