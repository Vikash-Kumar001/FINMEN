import React from "react";
import { useState } from "react";
import { useWallet } from "../context/WalletContext";
import { redeemCoins } from "../services/walletService";

const RedeemPage = () => {
    const { wallet } = useWallet();
    const [amount, setAmount] = useState("");
    const [upiId, setUpiId] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleRedeem = async () => {
        if (!amount || !upiId) {
            setMessage("Please enter amount and UPI ID");
            return;
        }

        if (amount > wallet.balance) {
            setMessage("You cannot redeem more than your wallet balance.");
            return;
        }

        try {
            setLoading(true);
            await redeemCoins({ amount, upiId });
            setMessage("🎉 Redemption request submitted successfully!");
        } catch (err) {
            setMessage("❌ Failed to submit request");
        } finally {
            setLoading(false);
        }
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
