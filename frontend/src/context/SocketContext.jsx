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
        if (user && !socketRef.current) {
            const socket = io(import.meta.env.VITE_API_URL, {
                withCredentials: true,
                transports: ["websocket"], // force websocket, avoid polling
            });

            socket.on("connect", () => {
                socket.emit("join", user._id);
                setSocketReady(true);
                console.log("🟢 Socket connected:", socket.id);
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
