import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
    const [wallet, setWallet] = useState(null);
    const [loading, setLoading] = useState(true);
    const [triggerRefresh, setTriggerRefresh] = useState(false);

    const fetchWallet = useCallback(async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${import.meta.env.VITE_API}/wallet`, {
                withCredentials: true,
            });
            setWallet(res.data);
        } catch (err) {
            console.error("❌ Failed to fetch wallet:", err?.response?.data || err.message);
            toast.error("Could not load wallet");
            setWallet(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchWallet();
    }, [fetchWallet, triggerRefresh]);

    const refreshWallet = () => setTriggerRefresh((prev) => !prev);

    return (
        <WalletContext.Provider
            value={{
                wallet,
                setWallet,
                fetchWallet,
                refreshWallet,
                loading,
                addCoins,
                spendCoins,
                redeemCoins,
                fetchTransactions,
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
        const res = await axios.post(
            `${import.meta.env.VITE_API}/wallet/add`,
            { amount, description },
            { withCredentials: true }
        );
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
        const res = await axios.post(
            `${import.meta.env.VITE_API}/wallet/spend`,
            { amount, description },
            { withCredentials: true }
        );
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
        const res = await axios.post(
            `${import.meta.env.VITE_API}/wallet/redeem`,
            { amount, upiId },
            { withCredentials: true }
        );
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
        const res = await axios.get(`${import.meta.env.VITE_API}/wallet/transactions`, {
            withCredentials: true,
        });
        return res.data;
    } catch (err) {
        console.error("❌ Fetch transactions failed:", err?.response?.data || err.message);
        toast.error("Failed to load transactions");
        throw err;
    }
};
