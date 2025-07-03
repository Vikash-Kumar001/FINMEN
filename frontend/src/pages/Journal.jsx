import React, { useEffect, useState } from "react";
import {
    getMyJournals,
    createJournalEntry,
    updateJournalEntry,
    deleteJournalEntry,
} from "../services/journalService";
import { saveAs } from "file-saver";
import { format } from "date-fns";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import ReactMarkdown from "react-markdown";

export default function Journal() {
    const [entries, setEntries] = useState([]);
    const [search, setSearch] = useState("");
    const [filterDate, setFilterDate] = useState(null);
    const [selectedTags, setSelectedTags] = useState([]);
    const [draft, setDraft] = useState(localStorage.getItem("journalDraft") || "");
    const [title, setTitle] = useState("");
    const [tags, setTags] = useState("");
    const [editingEntry, setEditingEntry] = useState(null);

    useEffect(() => {
        fetchEntries();
    }, []);

    useEffect(() => {
        localStorage.setItem("journalDraft", draft);
    }, [draft]);

    const fetchEntries = async () => {
        try {
            const res = await getMyJournals();
            setEntries(res.data);
        } catch (err) {
            console.error("Failed to fetch journal entries", err);
        }
    };

    const handleSaveEntry = async () => {
        const payload = {
            title: title || "Untitled",
            content: draft,
            tags: tags.split(",").map(tag => tag.trim()).filter(Boolean),
        };

        try {
            if (editingEntry) {
                await updateJournalEntry(editingEntry._id, payload);
            } else {
                await createJournalEntry(payload);
            }
            setDraft("");
            setTitle("");
            setTags("");
            setEditingEntry(null);
            localStorage.removeItem("journalDraft");
            fetchEntries();
        } catch (err) {
            console.error("Failed to save entry", err);
        }
    };

    const handleEdit = (entry) => {
        setEditingEntry(entry);
        setTitle(entry.title);
        setDraft(entry.content);
        setTags((entry.tags || []).join(", "));
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this entry?")) {
            try {
                await deleteJournalEntry(id);
                fetchEntries();
            } catch (err) {
                console.error("Failed to delete entry", err);
            }
        }
    };

    const filteredEntries = entries.filter((entry) => {
        const matchesSearch = entry.title?.toLowerCase().includes(search.toLowerCase());
        const matchesDate = filterDate
            ? format(new Date(entry.createdAt), "yyyy-MM-dd") === format(filterDate, "yyyy-MM-dd")
            : true;
        const matchesTags =
            selectedTags.length > 0
                ? selectedTags.every((tag) => entry.tags?.includes(tag))
                : true;
        return matchesSearch && matchesDate && matchesTags;
    });

    const downloadCSV = () => {
        const csv = [
            ["Date", "Title", "Tags", "Content"],
            ...filteredEntries.map((e) => [
                format(new Date(e.createdAt), "yyyy-MM-dd"),
                e.title,
                (e.tags || []).join("; "),
                e.content.replace(/\n/g, " "),
            ]),
        ]
            .map((row) => row.map((value) => `"${value}"`).join(","))
            .join("\n");

        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        saveAs(blob, "journal_entries.csv");
    };

    const uniqueTags = [...new Set(entries.flatMap((entry) => entry.tags || []))];

    const calendarTileClassName = ({ date }) => {
        const entryDates = entries.map((e) =>
            format(new Date(e.createdAt), "yyyy-MM-dd")
        );
        return entryDates.includes(format(date, "yyyy-MM-dd")) ? "bg-blue-100" : null;
    };

    return (
        <div className="max-w-4xl mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">📔 My Journals</h2>

            <div className="flex flex-wrap gap-4 mb-4">
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by title..."
                    className="border p-2 rounded w-full sm:w-1/2"
                />

                <input
                    type="date"
                    onChange={(e) => setFilterDate(e.target.value ? new Date(e.target.value) : null)}
                    className="border p-2 rounded"
                />

                <select
                    multiple
                    value={selectedTags}
                    onChange={(e) => setSelectedTags([...e.target.selectedOptions].map((o) => o.value))}
                    className="border p-2 rounded w-full sm:w-1/3"
                >
                    {uniqueTags.map((tag) => (
                        <option key={tag} value={tag}>
                            {tag}
                        </option>
                    ))}
                </select>

                <button
                    onClick={downloadCSV}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                    Export CSV
                </button>
            </div>

            <Calendar
                className="mb-4"
                tileClassName={calendarTileClassName}
                onClickDay={setFilterDate}
                value={filterDate}
            />

            <h3 className="text-xl font-semibold mb-2">📃 Entries</h3>
            <div className="space-y-4">
                {filteredEntries.map((entry) => (
                    <div key={entry._id} className="border p-4 rounded shadow bg-white">
                        <div className="flex justify-between">
                            <h4 className="font-bold text-lg">{entry.title}</h4>
                            <div className="space-x-2">
                                <button onClick={() => handleEdit(entry)} className="text-blue-600 hover:underline">Edit</button>
                                <button onClick={() => handleDelete(entry._id)} className="text-red-600 hover:underline">Delete</button>
                            </div>
                        </div>
                        <p className="text-sm text-gray-500">
                            {format(new Date(entry.createdAt), "yyyy-MM-dd HH:mm")}
                        </p>
                        <ReactMarkdown className="mt-2 prose max-w-none">{entry.content}</ReactMarkdown>
                        {entry.tags?.length > 0 && (
                            <p className="mt-2 text-sm text-blue-600">
                                Tags: {entry.tags.join(", ")}
                            </p>
                        )}
                    </div>
                ))}
            </div>

            <div className="mt-8">
                <h3 className="text-xl font-semibold mb-2">✍️ {editingEntry ? "Edit Entry" : "Draft New Entry"}</h3>
                <input
                    type="text"
                    className="w-full border rounded p-2 mb-2"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Title"
                />
                <textarea
                    className="w-full border rounded p-2 h-40 mb-2"
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    placeholder="Write your entry using markdown..."
                />
                <input
                    type="text"
                    className="w-full border rounded p-2 mb-2"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="Comma-separated tags (e.g. gratitude, goals)"
                />
                <button
                    onClick={handleSaveEntry}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    {editingEntry ? "Update Entry" : "Create Entry"}
                </button>
                <p className="text-sm text-gray-400 mt-2">Draft auto-saved locally</p>
            </div>
        </div>
    );
}
