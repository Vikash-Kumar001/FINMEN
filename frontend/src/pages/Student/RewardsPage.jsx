import { useEffect, useState } from "react";
import api from "../../utils/api";

const RewardsPage = () => {
    const [rewards, setRewards] = useState([]);
    const [redeemed, setRedeemed] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const rewardRes = await api.get("/rewards");
                const redeemRes = await api.get("/rewards/redeemed");
                setRewards(rewardRes.data);
                setRedeemed(redeemRes.data);
            } catch (err) {
                console.error("Failed to load rewards:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleRedeem = async (rewardId) => {
        try {
            await api.post(`/rewards/redeem/${rewardId}`);
            alert("Reward redeemed!");
        } catch (err) {
            console.error("Redeem failed:", err);
            alert("Redemption failed");
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">🎁 Available Rewards</h2>
            {loading ? (
                <p>Loading rewards...</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {rewards.map((reward) => (
                        <div key={reward._id} className="bg-white shadow p-4 rounded">
                            <h3 className="font-semibold text-lg">{reward.name}</h3>
                            <p>{reward.description}</p>
                            <p>HealCoins: {reward.cost}</p>
                            <button
                                onClick={() => handleRedeem(reward._id)}
                                className="mt-2 bg-blue-500 text-white px-3 py-1 rounded"
                            >
                                Redeem
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default RewardsPage;