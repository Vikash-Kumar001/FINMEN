import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from "react";
import { io } from "socket.io-client";
import { useAuth } from "../hooks/useAuth";

const SocketContext = createContext(null);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
    const { user } = useAuth();
    const socketRef = useRef(null);
    const [socketReady, setSocketReady] = useState(false);
    const [profileUpdate, setProfileUpdate] = useState(null);
    const profileListeners = useRef([]);

    // Subscribe/unsubscribe API for components
    const subscribeProfileUpdate = useCallback((cb) => {
        profileListeners.current.push(cb);
        return () => {
            profileListeners.current = profileListeners.current.filter(fn => fn !== cb);
        };
    }, []);

    useEffect(() => {
        if (user && !socketRef.current) {
            const token = localStorage.getItem("finmen_token");

            if (!token) {
                console.warn("⚠️ No token found in localStorage for socket auth.");
                return;
            }

            // Validate token format before using it
            try {
                // Simple check to see if token has three parts (header.payload.signature)
                if (!token.includes('.') || token.split('.').length !== 3) {
                    console.error("❌ Invalid token format");
                    return;
                }
            } catch (err) {
                console.error("❌ Token validation error:", err.message);
                return;
            }

            const socket = io(import.meta.env.VITE_API_URL, {
                transports: ["websocket"],
                withCredentials: true,
                auth: { token },
                reconnection: true,
                reconnectionAttempts: 5,
                reconnectionDelay: 1000,
            });

            socket.on("connect", () => {
                console.log("🟢 Socket connected:", socket.id);
                try {
                    socket.emit("join", user._id);
                } catch (err) {
                    console.error("❌ Error joining socket room:", err.message);
                }
                setSocketReady(true);
            });

            socket.on("connect_error", (err) => {
                console.error("❌ Socket connection error:", err.message);
                setSocketReady(false);
            });

            socket.on("error", (data) => {
                console.error("❌ Socket error:", data.message);
                setSocketReady(false);
            });

            socket.on("disconnect", (reason) => {
                console.log("🔴 Socket disconnected:", reason);
                setSocketReady(false);
                
                // Only attempt to reconnect for certain disconnect reasons
                if (reason === "io server disconnect" || reason === "io client disconnect") {
                    // These are intentional disconnects, don't reconnect automatically
                    console.log("Intentional disconnect, not attempting reconnection");
                } else {
                    // For transport close, ping timeout, etc.
                    console.log("Unintentional disconnect, socket will attempt reconnection automatically");
                }
            });

            // Listen for real-time profile updates
            socket.on("user:profile:updated", (payload) => {
                try {
                    setProfileUpdate(payload);
                    profileListeners.current.forEach(cb => cb(payload));
                } catch (error) {
                    console.error("Error handling profile update:", error);
                }
            });
            socket.on("student:profile:updated", (payload) => {
                try {
                    setProfileUpdate(payload);
                    profileListeners.current.forEach(cb => cb(payload));
                } catch (error) {
                    console.error("Error handling student profile update:", error);
                }
            });

            socketRef.current = socket;
        }

        return () => {
            if (socketRef.current) {
                try {
                    socketRef.current.disconnect();
                    console.log("🔴 Socket disconnected");
                } catch (err) {
                    console.error("❌ Error disconnecting socket:", err.message);
                } finally {
                    socketRef.current = null;
                    setSocketReady(false);
                }
            }
        };
    }, [user]);

    return (
        <SocketContext.Provider value={{ socket: socketRef.current, socketReady, profileUpdate, subscribeProfileUpdate }}>
            {children}
        </SocketContext.Provider>
    );
};