import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import { CSVLink } from "react-csv";

export default function AllStudents() {
    const [students, setStudents] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    const fetchStudents = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API}/admin/students`, {
                withCredentials: true,
            });
            setStudents(res.data);
        } catch (err) {
            console.error("Failed to fetch students", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    const filtered = students.filter((s) =>
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.email.toLowerCase().includes(search.toLowerCase())
    );

    const csvHeaders = [
        { label: "Name", key: "name" },
        { label: "Email", key: "email" },
        { label: "Class", key: "class" },
        { label: "XP", key: "progress.xp" },
    ];

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">👨‍🎓 All Registered Students</h2>
                {students.length > 0 && (
                    <CSVLink
                        data={students}
                        headers={csvHeaders}
                        filename="students.csv"
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        📤 Export CSV
                    </CSVLink>
                )}
            </div>

            <input
                type="text"
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="mb-4 border px-3 py-2 rounded w-full md:w-1/2"
            />

            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white rounded shadow border">
                        <thead>
                            <tr className="bg-gray-100 border-b text-left">
                                <th className="p-3">Name</th>
                                <th className="p-3">Email</th>
                                <th className="p-3">Class</th>
                                <th className="p-3">XP</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="text-center p-4">
                                        No matching students found.
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((student) => (
                                    <tr key={student._id} className="border-b hover:bg-gray-50">
                                        <td className="p-3">{student.name}</td>
                                        <td className="p-3">{student.email}</td>
                                        <td className="p-3">{student.class || "N/A"}</td>
                                        <td className="p-3">{student.progress?.xp || 0}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
