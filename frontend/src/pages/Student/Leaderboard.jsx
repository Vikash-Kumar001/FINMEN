import React, { useEffect, useState } from "react";
import { useSocket } from "../../context/SocketContext";

const Leaderboard = () => {
    const [leaders, setLeaders] = useState([]);
    const socket = useSocket();

    useEffect(() => {
        if (socket) {
            // Subscribe to leaderboard updates
            socket.emit('student:leaderboard:subscribe');
            socket.on('student:leaderboard:data', setLeaders);
            // Cleanup on unmount
            return () => {
                socket.off('student:leaderboard:data');
            };
        }
    }, [socket]);

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h2 className="text-2xl font-bold mb-4">🏆 Top Users Leaderboard</h2>

            <table className="w-full bg-white shadow border rounded">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="text-left p-2">Rank</th>
                        <th className="text-left p-2">Name</th>
                        <th className="text-left p-2">Email</th>
                        <th className="text-left p-2">HealCoins</th>
                    </tr>
                </thead>
                <tbody>
                    {leaders.map((user, index) => (
                        <tr key={index} className="border-b">
                            <td className="p-2 font-semibold">{index + 1}</td>
                            <td className="p-2">{user.name}</td>
                            <td className="p-2">{user.email}</td>
                            <td className="p-2 text-blue-600 font-semibold">₹{user.balance}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Leaderboard;


