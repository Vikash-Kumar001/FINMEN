import React from "react";
import { createContext, useReducer, useContext, useEffect } from "react";
import { fetchWalletData } from "../services/walletService";

const WalletContext = createContext();

const initialState = {
    wallet: null,
    transactions: [],
    loading: true,
    error: null,
};

function walletReducer(state, action) {
    switch (action.type) {
        case "FETCH_SUCCESS":
            return {
                ...state,
                wallet: action.payload.wallet,
                transactions: action.payload.transactions,
                loading: false,
                error: null,
            };
        case "FETCH_ERROR":
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
        default:
            return state;
    }
}

export const WalletProvider = ({ children }) => {
    const [state, dispatch] = useReducer(walletReducer, initialState);

    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await fetchWalletData();
                dispatch({ type: "FETCH_SUCCESS", payload: data });
            } catch (err) {
                dispatch({ type: "FETCH_ERROR", payload: err.message });
            }
        };

        loadData();
    }, []);

    return (
        <WalletContext.Provider value={{ ...state }}>
            {children}
        </WalletContext.Provider>
    );
};

export const useWallet = () => useContext(WalletContext);
