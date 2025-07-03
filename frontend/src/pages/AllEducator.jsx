import React from "react";
import { useEffect, useState } from "react";
import { exportCSV } from "../utils/exportCSV";
import api from "../utils/api";

const AllEducators = () => {
    const [educators, setEducators] = useState([]);
    const [search, setSearch] = useState("");
    const [filtered, setFiltered] = useState([]);

    useEffect(() => {
        const fetchEducators = async () => {
            try {
                const res = await api.get("/admin/educators");
                setEducators(res.data);
                setFiltered(res.data);
            } catch (err) {
                console.error("Error fetching educators", err);
            }
        };
        fetchEducators();
    }, []);

    useEffect(() => {
        const lower = search.toLowerCase();
        const filtered = educators.filter(
            (e) =>
                e.name.toLowerCase().includes(lower) ||
                e.email.toLowerCase().includes(lower) ||
                e.position?.toLowerCase().includes(lower)
        );
        setFiltered(filtered);
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
