import { useEffect, useState } from "react";
import { useSocket } from "../../context/SocketContext";
import { useAuth } from "../../hooks/useAuth";
import { CSVLink } from "react-csv";

export default function AllRedemptions() {
    const [redemptions, setRedemptions] = useState([]);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const socket = useSocket();
    const { user } = useAuth();

    useEffect(() => {
        if (socket && socket.socket && user) {
            try {
                socket.socket.emit('admin:redemptions:subscribe', { adminId: user._id });
            } catch (err) {
                console.error("❌ Error subscribing to redemptions:", err.message);
            }
            
            socket.socket.on('admin:redemptions:data', setRedemptions);
            socket.socket.on('admin:redemptions:update', setRedemptions);
            
            return () => {
                try {
                    if (socket && socket.socket) {
                        socket.socket.off('admin:redemptions:data');
                        socket.socket.off('admin:redemptions:update');
                    }
                } catch (err) {
                    console.error("❌ Error cleaning up redemptions socket listeners:", err.message);
                }
            };
        }
    }, [socket, user]);

    const filtered = redemptions.filter((r) => {
        const matchesSearch =
            r.user?.email?.toLowerCase().includes(search.toLowerCase()) ||
            r.upiId?.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = statusFilter === "all" || r.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const csvData = filtered.map((r) => ({
        name: r.user?.name,
        email: r.user?.email,
        amount: r.amount,
        upiId: r.upiId,
        status: r.status,
        date: new Date(r.createdAt).toLocaleString(),
    }));

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">💸 All Redemption Requests</h2>
            <div className="flex gap-4 items-center mb-4">
                <input
                    type="text"
                    placeholder="Search by email or UPI"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="border px-2 py-1 rounded w-64"
                />
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="border px-2 py-1 rounded"
                >
                    <option value="all">All</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="declined">Declined</option>
                </select>
                <CSVLink
                    data={csvData}
                    filename="redemptions.csv"
                    className="ml-auto bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    📤 Export CSV
                </CSVLink>
            </div>

            <table className="w-full bg-white border rounded shadow text-sm">
                <thead>
                    <tr className="border-b text-left">
                        <th className="p-2">User</th>
                        <th className="p-2">Email</th>
                        <th className="p-2">Amount</th>
                        <th className="p-2">UPI</th>
                        <th className="p-2">Status</th>
                        <th className="p-2">Date</th>
                    </tr>
                </thead>
                <tbody>
                    {filtered.map((r) => (
                        <tr key={r._id} className="border-b">
                            <td className="p-2">{r.user?.name}</td>
                            <td className="p-2">{r.user?.email}</td>
                            <td className="p-2">₹{r.amount}</td>
                            <td className="p-2">{r.upiId}</td>
                            <td className="p-2 capitalize">{r.status}</td>
                            <td className="p-2">
                                {new Date(r.createdAt).toLocaleDateString()}
                            </td>
                        </tr>
                    ))}
                    {filtered.length === 0 && (
                        <tr>
                            <td colSpan="6" className="text-center p-4 text-gray-500">
                                No redemptions found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}