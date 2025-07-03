import { useState } from "react";
import { useWallet, redeemCoins } from "../context/WalletContext";

const WalletPage = () => {
    const { wallet, transactions, loading, error } = useWallet();
    const [search, setSearch] = useState("");
    const [typeFilter, setTypeFilter] = useState("all");
    const [sortBy, setSortBy] = useState("newest");
    const [amount, setAmount] = useState("");
    const [upiId, setUpiId] = useState("");
    const [statusMsg, setStatusMsg] = useState("");

    const filteredTxns = transactions
        .filter((txn) => {
            const matchesSearch = txn.description
                ?.toLowerCase()
                .includes(search.toLowerCase());
            const matchesType = typeFilter === "all" || txn.type === typeFilter;
            return matchesSearch && matchesType;
        })
        .sort((a, b) => {
            return sortBy === "newest"
                ? new Date(b.createdAt) - new Date(a.createdAt)
                : new Date(a.createdAt) - new Date(b.createdAt);
        });

    const handleRedeem = async () => {
        try {
            if (!amount || !upiId) {
                return alert("Please enter both amount and UPI ID");
            }

            const res = await redeemCoins({ amount, upiId });
            setStatusMsg(res.message);
            setAmount("");
            setUpiId("");
        } catch (err) {
            alert(err.response?.data?.error || "Redemption failed");
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h2 className="text-2xl font-bold mb-4">🪙 My Wallet</h2>

            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p className="text-red-500">{error}</p>
            ) : (
                <>
                    <div className="bg-white p-4 rounded shadow mb-6">
                        <p className="text-lg font-semibold">
                            Balance: ₹{wallet?.balance || 0}
                        </p>
                        <p className="text-sm text-gray-600">
                            Total Earned: ₹{wallet?.totalEarned || 0}
                        </p>
                    </div>

                    <div className="bg-white p-4 rounded shadow mb-6">
                        <h3 className="font-semibold mb-2">💸 Redeem HealCoins</h3>
                        <input
                            type="number"
                            placeholder="Amount"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="border px-3 py-1 rounded mb-2 w-full"
                        />
                        <input
                            type="text"
                            placeholder="Your UPI ID"
                            value={upiId}
                            onChange={(e) => setUpiId(e.target.value)}
                            className="border px-3 py-1 rounded mb-2 w-full"
                        />
                        <button
                            onClick={handleRedeem}
                            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                        >
                            Redeem Now
                        </button>
                        {statusMsg && <p className="mt-2 text-green-600">{statusMsg}</p>}
                    </div>

                    <div className="flex items-center gap-4 mb-4">
                        <input
                            type="text"
                            placeholder="Search by description..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="border px-2 py-1 rounded"
                        />
                        <select
                            value={typeFilter}
                            onChange={(e) => setTypeFilter(e.target.value)}
                            className="border px-2 py-1 rounded"
                        >
                            <option value="all">All</option>
                            <option value="credit">Credit</option>
                            <option value="debit">Debit</option>
                            <option value="redeem">Redeem</option>
                        </select>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="border px-2 py-1 rounded"
                        >
                            <option value="newest">Newest</option>
                            <option value="oldest">Oldest</option>
                        </select>
                    </div>

                    <table className="w-full bg-white border rounded shadow">
                        <thead>
                            <tr className="border-b">
                                <th className="text-left p-2">Date</th>
                                <th className="text-left p-2">Description</th>
                                <th className="text-left p-2">Amount</th>
                                <th className="text-left p-2">Type</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTxns.map((txn) => (
                                <tr key={txn._id} className="border-b">
                                    <td className="p-2">
                                        {new Date(txn.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="p-2">{txn.description}</td>
                                    <td className="p-2">₹{txn.amount}</td>
                                    <td className="p-2 capitalize">{txn.type}</td>
                                </tr>
                            ))}
                            {filteredTxns.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="text-center p-4">
                                        No transactions found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </>
            )}
        </div>
    );
};

export default WalletPage;
