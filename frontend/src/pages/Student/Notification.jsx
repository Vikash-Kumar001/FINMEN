import React, { useEffect, useState } from "react";
import axios from "axios";

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API}/notifications`, {
                    withCredentials: true
                });
                setNotifications(res.data || []);
            } catch (err) {
                console.error("Failed to fetch notifications", err);
            }
        };

        fetchNotifications();
    }, []);

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Your Notifications</h2>
            {notifications.length === 0 ? (
                <p>No notifications yet.</p>
            ) : (
                <ul className="space-y-3">
                    {notifications.map((note) => (
                        <li key={note._id} className="p-3 bg-white shadow rounded">
                            <p>{note.message}</p>
                            <small className="text-gray-500">{new Date(note.createdAt).toLocaleString()}</small>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Notifications;
