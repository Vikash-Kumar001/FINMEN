// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // 🔄 Fetch authenticated user from backend
    const fetchUser = async () => {
        try {
            const res = await axiosInstance.get("/auth/me");
            const fetchedUser = res.data;

            const enhancedUser = {
                ...fetchedUser,
                isApproved: fetchedUser.approvalStatus === "approved",
            };

            setUser(enhancedUser);
            return enhancedUser;
        } catch (err) {
            console.error("❌ Failed to fetch user:", err?.response?.data || err.message);
            setUser(null);
            return null;
        } finally {
            setLoading(false);
        }
    };

    // 🔐 Login function
    const loginUser = async (credentials) => {
        try {
            const res = await axiosInstance.post("/auth/login", credentials);
            const token = res.data?.token;
            const userData = res.data?.user;

            if (!token || !userData) throw new Error("Invalid login response");

            localStorage.setItem("finmen_token", token);

            const enhancedUser = {
                ...userData,
                isApproved: userData.approvalStatus === "approved",
            };

            setUser(enhancedUser);

            // Redirect after login based on role
            if (enhancedUser.role === "admin") {
                navigate("/admin/dashboard");
            } else if (enhancedUser.role === "educator") {
                if (!enhancedUser.isApproved) {
                    navigate("/pending-approval");
                } else {
                    navigate("/educator/dashboard");
                }
            } else {
                navigate("/student/dashboard");
            }
        } catch (err) {
            console.error("Login error:", err?.response?.data || err.message);
            throw err;
        }
    };

    // 🚪 Logout and clean state
    const logoutUser = async () => {
        try {
            await axiosInstance.post("/auth/logout");
        } catch (err) {
            console.error("❌ Logout failed:", err?.response?.data || err.message);
        } finally {
            localStorage.removeItem("finmen_token");
            setUser(null);
            setTimeout(() => navigate("/login", { replace: true }), 50);
        }
    };

    // On mount, fetch user if token is present
    useEffect(() => {
        const token = localStorage.getItem("finmen_token");
        if (token) {
            fetchUser();
        } else {
            setLoading(false);
        }
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
