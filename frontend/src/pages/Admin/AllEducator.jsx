import React, { useEffect, useState } from "react";
import { useSocket } from "../../context/SocketContext";
import { useAuth } from "../../hooks/useAuth";
import { exportCSV } from "../../utils/exportCSV"

const AllEducators = () => {
    const [educators, setEducators] = useState([]);
    const [search, setSearch] = useState("");
    const [filtered, setFiltered] = useState([]);
    const socket = useSocket();
    const { user } = useAuth();

    useEffect(() => {
        if (socket && user) {
            socket.emit('admin:educators:subscribe', { adminId: user._id });
            socket.on('admin:educators:data', (data) => {
                setEducators(data);
                setFiltered(data);
            });
            socket.on('admin:educators:update', (data) => {
                setEducators(data);
                setFiltered(data);
            });
            return () => {
                socket.off('admin:educators:data');
                socket.off('admin:educators:update');
            };
        }
    }, [socket, user]);

    useEffect(() => {
        const lower = search.toLowerCase();
        const filteredList = educators.filter(
            (e) =>
                e.name.toLowerCase().includes(lower) ||
                e.email.toLowerCase().includes(lower) ||
                e.position?.toLowerCase().includes(lower)
        );
        setFiltered(filteredList);
    }, [search, educators]);

    const handleExport = () => {
        exportCSV(filtered, "educators.csv");
    };

    return (
        <div className="p-6">
            <div className="flex justify-between mb-4">
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search educators..."
                    className="border px-3 py-2 rounded w-full max-w-sm"
                />
                <button
                    onClick={handleExport}
                    className="ml-4 px-4 py-2 bg-blue-600 text-white rounded"
                >
                    Export CSV
                </button>
            </div>

            <table className="w-full bg-white border shadow">
                <thead>
                    <tr className="border-b">
                        <th className="p-2 text-left">Name</th>
                        <th className="p-2 text-left">Email</th>
                        <th className="p-2 text-left">Position</th>
                        <th className="p-2 text-left">Approved</th>
                    </tr>
                </thead>
                <tbody>
                    {filtered.map((e) => (
                        <tr key={e._id} className="border-b">
                            <td className="p-2">{e.name}</td>
                            <td className="p-2">{e.email}</td>
                            <td className="p-2">{e.position}</td>
                            <td className="p-2">{e.isApproved ? "✅" : "❌"}</td>
                        </tr>
                    ))}
                    {filtered.length === 0 && (
                        <tr>
                            <td colSpan="4" className="text-center p-4">
                                No educators found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default AllEducators;