import { useContext } from "react";
import { SocketContext } from "../context/SocketContext";

/**
 * Custom hook to access the socket instance.
 * Ensures it's used within a SocketProvider.
 */
export const useSocket = () => {
  const socket = useContext(SocketContext);

  if (!socket) {
    throw new Error("useSocket must be used within a SocketProvider");
  }

  return socket;
};
