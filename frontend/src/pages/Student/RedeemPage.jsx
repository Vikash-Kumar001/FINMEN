import React, { useState, useEffect } from "react";
import { useSocket } from "../../context/SocketContext";
import { useAuth } from "../../hooks/useAuth";

const RedeemPage = () => {
    const [wallet, setWallet] = useState(null);
    const [amount, setAmount] = useState("");
    const [upiId, setUpiId] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const socket = useSocket();
    const { user } = useAuth();

    useEffect(() => {
        if (socket && user) {
            socket.emit('student:wallet:subscribe', { studentId: user._id });
            socket.on('student:wallet:data', data => setWallet(data.wallet));
            return () => {
                socket.off('student:wallet:data');
            };
        }
    }, [socket, user]);

    const handleRedeem = () => {
        if (!amount || !upiId) {
            setMessage("Please enter amount and UPI ID");
            return;
        }
        if (amount > (wallet?.balance || 0)) {
            setMessage("You cannot redeem more than your wallet balance.");
            return;
        }
        setLoading(true);
        socket.emit('student:wallet:redeem', { studentId: user._id, amount, upiId });
        setMessage("🎉 Redemption request submitted!");
        setAmount("");
        setUpiId("");
        setLoading(false);
    };

    return (
        <div className="max-w-lg mx-auto p-6">
            <h2 className="text-2xl font-bold mb-4">💸 Redeem Coins</h2>
            <div className="bg-white p-4 rounded shadow">
                <p className="mb-2">
                    Your current balance: <strong>₹{wallet?.balance || 0}</strong>
                </p>

                <input
                    type="number"
                    placeholder="Enter amount to redeem"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full mb-3 border px-3 py-2 rounded"
                />

                <input
                    type="text"
                    placeholder="Enter your UPI ID"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className="w-full mb-3 border px-3 py-2 rounded"
                />

                <button
                    onClick={handleRedeem}
                    disabled={loading}
                    className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
                >
                    {loading ? "Processing..." : "Redeem Now"}
                </button>

                {message && (
                    <p className="mt-3 text-sm text-blue-600 font-medium">{message}</p>
                )}
            </div>
        </div>
    );
};

export default RedeemPage;
