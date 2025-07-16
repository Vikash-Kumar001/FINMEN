// src/context/SocketContext.jsx

import React, {
    createContext,
    useContext,
    useEffect,
    useRef,
    useState
} from "react";
import { io } from "socket.io-client";
import { useAuth } from "../hooks/useAuth";

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
    const { user } = useAuth();
    const socketRef = useRef(null);
    const [socketReady, setSocketReady] = useState(false);

    useEffect(() => {
        // Only connect if user exists and socket not already connected
        if (user && !socketRef.current) {
            const token = localStorage.getItem("finmen_token");

            if (!token) {
                console.warn("⚠️ No token found in localStorage for socket auth.");
                return;
            }

            const socket = io(import.meta.env.VITE_API_URL, {
                transports: ["websocket"],
                withCredentials: true,
                auth: {
                    token
                }
            });

            socket.on("connect", () => {
                console.log("🟢 Socket connected:", socket.id);
                socket.emit("join", user._id); // optional but good for room-based updates
                setSocketReady(true);
            });

            socket.on("connect_error", (err) => {
                console.error("❌ Socket connection error:", err.message);
            });

            socketRef.current = socket;
        }

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
                console.log("🔴 Socket disconnected");
                socketRef.current = null;
                setSocketReady(false);
            }
        };
    }, [user]);

    return (
        <SocketContext.Provider value={socketRef.current}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => useContext(SocketContext);
