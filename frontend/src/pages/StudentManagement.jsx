import { useEffect, useState } from "react";
import axios from "axios";
import { Download, Eye, MessageCircle } from "lucide-react";
import { CSVLink } from "react-csv";
import StudentProgressModal from "../components/StudentProgressModal"

export default function StudentManagement() {
    const [students, setStudents] = useState([]);
    const [search, setSearch] = useState("");
    const [filtered, setFiltered] = useState([]);

    useEffect(() => {
        const fetchStudents = async () => {
            const res = await axios.get("/api/educators/students", { withCredentials: true });
            setStudents(res.data);
            setFiltered(res.data);
        };
        fetchStudents();
    }, []);

    useEffect(() => {
        const lower = search.toLowerCase();
        setFiltered(
            students.filter(
                (s) =>
                    s.name.toLowerCase().includes(lower) ||
                    s.email.toLowerCase().includes(lower)
            )
        );
    }, [search, students]);

    const handleViewProgress = (id) => setSelectedStudentId(id); {
        // You could redirect to /educator/student/:id or open a modal
        alert("Redirect to view progress for ID: " + studentId);
    };

    const handleFeedback = (studentId) => {
        // Open feedback modal or custom component
        alert("Open feedback for student ID: " + studentId);
    };

    const headers = [
        { label: "Name", key: "name" },
        { label: "Email", key: "email" },
        { label: "XP", key: "xp" },
        { label: "HealCoins", key: "healCoins" },
    ];
    const [selectedStudentId, setSelectedStudentId] = useState(null);
    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-indigo-700">Student Management</h2>
                <CSVLink
                    data={filtered.map(s => ({
                        name: s.name,
                        email: s.email,
                        xp: s.xp || 0,
                        healCoins: s.healCoins || 0,
                    }))}
                    headers={headers}
                    filename="students.csv"
                    className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 flex items-center gap-2"
                >
                    <Download size={16} /> Export CSV
                </CSVLink>
            </div>

            <input
                type="text"
                placeholder="Search students..."
                className="mb-4 px-4 py-2 w-full border rounded shadow"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map((student) => (
                    <div key={student._id} className="bg-white rounded shadow p-4 border">
                        <h3 className="font-bold text-lg">{student.name}</h3>
                        <p className="text-sm text-gray-600">{student.email}</p>
                        <div className="mt-2 text-sm">
                            <span className="mr-4">XP: {student.xp || 0}</span>
                            <span>HealCoins: {student.healCoins || 0}</span>
                        </div>
                        <div className="flex mt-4 gap-2">
                            <button
                                onClick={() => handleViewProgress(student._id)}
                                className="flex items-center bg-indigo-500 text-white px-3 py-1 rounded hover:bg-indigo-600 text-sm"
                            >
                                <Eye size={16} className="mr-1" /> View Progress
                            </button>
                            <button
                                onClick={() => handleFeedback(student._id)}
                                className="flex items-center bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 text-sm"
                            >
                                <MessageCircle size={16} className="mr-1" /> Feedback
                            </button>
                        </div>
                    </div>
                ))}
                {selectedStudentId && (
                    <StudentProgressModal
                        studentId={selectedStudentId}
                        onClose={() => setSelectedStudentId(null)}
                    />
                )}
            </div>
        </div>
    );
}
