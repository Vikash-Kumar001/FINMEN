import React from "react";
import { useEffect, useState } from "react";
import { useSocket } from "../context/SocketContext";
import { useNotification } from "../context/NotificationContext";
import {
    fetchMyNotifications,
    markAllAsRead,
    markNotificationRead,
    deleteNotification,
} from "../services/notificationService";

const Notifications = () => {
    const [loading, setLoading] = useState(true);
    const { socket } = useSocket();
    const { notifications, setNotifications } = useNotification();

    useEffect(() => {
        loadNotifications();

        if (socket) {
            socket.on("notification", (data) => {
                setNotifications((prev) => [data, ...prev]);
            });
        }

        return () => {
            if (socket) socket.off("notification");
        };
    }, [socket]);

    const loadNotifications = async () => {
        try {
            const res = await fetchMyNotifications();
            setNotifications(res.data);
        } catch (err) {
            console.error("Error loading notifications", err);
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAllRead = async () => {
        await markAllAsRead();
        loadNotifications();
    };

    const handleMarkRead = async (id) => {
        await markNotificationRead(id);
        setNotifications((prev) =>
            prev.map((n) => (n._id === id ? { ...n, read: true } : n))
        );
    };

    const handleDelete = async (id) => {
        await deleteNotification(id);
        setNotifications((prev) => prev.filter((n) => n._id !== id));
    };

    return (
        <div className="max-w-3xl mx-auto p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">🔔 Notifications</h2>
                {notifications.length > 0 && (
                    <button
                        onClick={handleMarkAllRead}
                        className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition"
                    >
                        Mark All as Read
                    </button>
                )}
            </div>

            {loading ? (
                <p className="text-gray-500">Loading notifications...</p>
            ) : notifications.length === 0 ? (
                <p className="text-gray-500">No notifications yet.</p>
            ) : (
                <ul className="space-y-3">
                    {notifications.map((n) => (
                        <li
                            key={n._id}
                            className={`p-4 border rounded shadow-sm flex justify-between items-center ${n.read ? "bg-gray-100" : "bg-yellow-50"
                                }`}
                        >
                            <div>
                                <p className="font-semibold">{n.title || "New Update"}</p>
                                {n.body || n.message ? (
                                    <p className="text-sm text-gray-600">{n.body || n.message}</p>
                                ) : null}
                                <p className="text-xs text-gray-400 mt-1">
                                    {new Date(n.createdAt).toLocaleString()}
                                </p>
                            </div>
                            <div className="flex gap-3 items-center">
                                {!n.read && (
                                    <button
                                        onClick={() => handleMarkRead(n._id)}
                                        className="text-sm text-blue-600 hover:underline"
                                    >
                                        Mark as read
                                    </button>
                                )}
                                <button
                                    onClick={() => handleDelete(n._id)}
                                    className="text-sm text-red-500 hover:underline"
                                >
                                    Delete
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Notifications;
