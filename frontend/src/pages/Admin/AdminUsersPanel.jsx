import { useEffect, useState } from "react";
import { useSocket } from "../../context/SocketContext";
import { useAuth } from "../../hooks/useAuth";

const AdminUsersPanel = () => {
    const [students, setStudents] = useState([]);
    const socket = useSocket();
    const { user } = useAuth();

    useEffect(() => {
        if (socket && user) {
            socket.emit('admin:students:subscribe', { adminId: user._id });
            socket.on('admin:students:data', setStudents);
            socket.on('admin:students:update', setStudents);
            return () => {
                socket.off('admin:students:data');
                socket.off('admin:students:update');
            };
        }
    }, [socket, user]);

    const handleExport = () => {
        // Ask the server to send a CSV file back in a download event
        socket.emit('admin:students:exportCSV', { adminId: user._id });
        socket.on('admin:students:csv', (csvData) => {
            const blob = new Blob([csvData], { type: "text/csv" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = "students.csv";
            link.click();
            socket.off('admin:students:csv'); // Remove after download to avoid multiple downloads
        });
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