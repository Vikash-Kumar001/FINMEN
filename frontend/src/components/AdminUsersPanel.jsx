import React from "react";
import { useEffect, useState } from "react";
import { getAllStudents, exportUsersToCSV } from "../services/adminService";

const AdminUsersPanel = () => {
    const [students, setStudents] = useState([]);

    useEffect(() => {
        getAllStudents().then((res) => setStudents(res.data));
    }, []);

    const handleExport = async () => {
        const res = await exportUsersToCSV();
        const blob = new Blob([res.data], { type: "text/csv" });
        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = "students.csv";
        link.click();
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
