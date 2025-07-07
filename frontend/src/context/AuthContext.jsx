// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // 🔄 Fetch authenticated user
    const fetchUser = async () => {
        try {
            const res = await axiosInstance.get("/auth/me");
            setUser(res.data);
            return res.data;
        } catch (err) {
            console.error("❌ Failed to fetch user:", err?.response?.data || err.message);
            setUser(null);
            return null;
        } finally {
            setLoading(false);
        }
    };

    // 🔐 Login
    const loginUser = async (credentials) => {
        try {
            const res = await axiosInstance.post("/auth/login", credentials);

            const userData = res.data?.user;
            if (!userData) throw new Error("Invalid login response");

            setUser(userData);

            if (userData.role === "admin") navigate("/admin/dashboard");
            else if (userData.role === "educator") navigate("/educator/dashboard");
            else navigate("/student/dashboard");
        } catch (err) {
            console.error("Login error:", err?.response?.data || err.message);
            throw err;
        }
    };

    // 🚪 Logout
    const logoutUser = async () => {
        try {
            await axiosInstance.post("/auth/logout");
        } catch (err) {
            console.error("❌ Logout failed:", err?.response?.data || err.message);
        } finally {
            setUser(null);
            setTimeout(() => navigate("/login", { replace: true }), 50);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                setUser,
                fetchUser,
                loginUser,
                logoutUser,
                loading,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
