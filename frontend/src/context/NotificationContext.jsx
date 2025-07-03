import React, { createContext, useContext, useEffect, useState } from "react";
import { useSocket } from "./SocketContext";
import { fetchMyNotifications } from "../services/notificationService"; // ✅ Correct import

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const socket = useSocket();
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        if (!socket) return;

        socket.on("newNotification", (notification) => {
            setNotifications((prev) => [notification, ...prev]);
        });

        return () => socket.off("newNotification");
    }, [socket]);

    useEffect(() => {
        fetchMyNotifications()
            .then((data) => setNotifications(data))
            .catch((err) => console.error(err));
    }, []);

    const unreadCount = notifications.filter((n) => !n.read).length;

    return (
        <NotificationContext.Provider value={{ notifications, unreadCount, setNotifications }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotification = () => useContext(NotificationContext);
