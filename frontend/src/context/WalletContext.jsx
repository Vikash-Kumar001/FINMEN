import React, {
    createContext,
    useContext,
    useEffect,
    useState,
    useCallback,
} from "react";
import { toast } from "react-hot-toast";
import api from "../utils/api";
import { useAuth } from "../hooks/useAuth";
import { useSocket } from "./SocketContext";

const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
    const { user } = useAuth();
    // Safely get socket context - useSocket() returns null if SocketProvider is not in the tree
    const socketContext = useSocket();
    const socket = socketContext?.socket || null;
    const [wallet, setWallet] = useState(null);
    const [loading, setLoading] = useState(true);
    const [triggerRefresh, setTriggerRefresh] = useState(false);

    const fetchWallet = useCallback(async () => {
        // Check if user is authenticated before fetching wallet
        const token = localStorage.getItem("finmen_token");
        if (!token || !user) {
            setWallet(null);
            setLoading(false);
            return;
        }

        setLoading(true);
        try {
            const res = await api.get("/api/wallet");
            setWallet(res.data);
        } catch (err) {
            console.error("❌ Failed to fetch wallet:", err?.response?.data || err.message);
            
            // Don't show error toast for authentication errors
            if (err.response?.status !== 401) {
                toast.error(err?.response?.data?.error || "Could not load wallet");
            }
            
            setWallet(null);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        // Fetch wallet when user is available or when triggerRefresh changes
        if (user) {
            fetchWallet();
        } else {
            setWallet(null);
            setLoading(false);
        }
    }, [fetchWallet, triggerRefresh, user]);

    const refreshWallet = () => setTriggerRefresh(prev => !prev);

    // Listen to socket events for real-time wallet updates
    useEffect(() => {
        if (!socket || !user) return;

        const handleWalletUpdate = (data) => {
            console.log('💰 Wallet updated via socket in WalletContext:', data);
            
            // Update wallet balance directly from socket data
            if (data?.balance !== undefined || data?.newBalance !== undefined) {
                const newBalance = data.balance || data.newBalance;
                setWallet(prev => {
                    if (prev) {
                        return {
                            ...prev,
                            balance: newBalance
                        };
                    } else {
                        return {
                            balance: newBalance,
                            userId: user._id || user.id
                        };
                    }
                });
            } else {
                // If balance not in data, refresh from API
                fetchWallet();
            }
        };

        const handleGameCompleted = (data) => {
            if (data?.newBalance !== undefined) {
                handleWalletUpdate({ balance: data.newBalance });
            }
        };

        // Listen for wallet update events
        socket.on('wallet:updated', handleWalletUpdate);
        
        // Also listen for game-completed events which include newBalance
        socket.on('game-completed', handleGameCompleted);

        return () => {
            if (socket) {
                socket.off('wallet:updated', handleWalletUpdate);
                socket.off('game-completed', handleGameCompleted);
            }
        };
    }, [socket, user, fetchWallet]);

    return (
        <WalletContext.Provider
            value={{
                wallet,
                setWallet,
                fetchWallet,
                refreshWallet,
                loading,
                balance: wallet?.balance || 0,
            }}
        >
            {children}
        </WalletContext.Provider>
    );
};

export const useWallet = () => useContext(WalletContext);

// 💰 Add coins to wallet
export const addCoins = async (amount, description = "HealCoins added") => {
    try {
        const res = await api.post("/api/wallet/add", { amount, description });
        toast.success("Coins added successfully!");
        return res.data;
    } catch (err) {
        console.error("❌ Add coins failed:", err?.response?.data || err.message);
        toast.error(err?.response?.data?.error || "Failed to add coins");
        throw err;
    }
};

// 💸 Spend coins from wallet
export const spendCoins = async (amount, description = "HealCoins spent") => {
    try {
        const res = await api.post("/api/wallet/spend", { amount, description });
        toast.success("Coins spent successfully!");
        return res.data;
    } catch (err) {
        console.error("❌ Spend coins failed:", err?.response?.data || err.message);
        toast.error(err?.response?.data?.error || "Failed to spend coins");
        throw err;
    }
};

// 🏦 Redeem coins
export const redeemCoins = async ({ amount, upiId }) => {
    try {
        const res = await api.post("/api/wallet/redeem", { amount, upiId });
        toast.success("Redemption request submitted!");
        return res.data;
    } catch (err) {
        console.error("❌ Redeem failed:", err?.response?.data || err.message);
        toast.error(err?.response?.data?.error || "Redemption failed");
        throw err;
    }
};

// 📜 Fetch transaction history
export const fetchTransactions = async () => {
    try {
        const res = await api.get("/api/wallet/transactions");
        return res.data;
    } catch (err) {
        console.error("❌ Fetch transactions failed:", err?.response?.data || err.message);
        toast.error("Failed to load transactions");
        throw err;
    }
};
