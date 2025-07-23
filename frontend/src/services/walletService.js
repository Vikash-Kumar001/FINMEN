import api from "../utils/api";

// 🔄 Fetch wallet data (balance + transactions)
export const fetchWalletData = async () => {
  const [walletRes, txnRes] = await Promise.all([
    api.get("/api/wallet"),
    api.get("/api/wallet/transactions"),
  ]);
  return {
    wallet: walletRes.data,
    transactions: txnRes.data,
  };
};

// 💸 Redeem coins to UPI
export const redeemCoins = async ({ amount, upiId }) => {
  const res = await api.post("/api/wallet/redeem", { amount, upiId });
  return res.data;
};
