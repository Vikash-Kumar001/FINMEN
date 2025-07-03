import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem("user");
        return saved ? JSON.parse(saved) : null;
    });
    const [loading, setLoading] = useState(true);

    const fetchUser = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API}/auth/me`, {
                withCredentials: true,
            });
            setUser(res.data);
            localStorage.setItem("user", JSON.stringify(res.data)); // persist on success
            return res.data;
        } catch (err) {
            console.error("❌ Failed to fetch user:", err);
            setUser(null);
            localStorage.removeItem("user");
            return null;
        } finally {
            setLoading(false);
        }
    };

    const logoutUser = async () => {
        try {
            await axios.post(`${import.meta.env.VITE_API}/auth/logout`, {}, {
                withCredentials: true,
            });
        } catch (err) {
            console.error("❌ Logout failed:", err);
        } finally {
            setUser(null);
            localStorage.removeItem("user");
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser, fetchUser, logoutUser, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
