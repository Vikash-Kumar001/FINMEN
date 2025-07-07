// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, roles, requireApproved = false, otpOnly = false }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen text-lg bg-gray-900 text-white">
                Loading...
            </div>
        );
    }

    // 🔐 OTP-only routes (e.g., Reset password page)
    if (otpOnly) {
        const verifiedEmail = localStorage.getItem("verified_reset_email");
        if (!verifiedEmail) {
            return <Navigate to="/login" state={{ from: location }} replace />;
        }
    }

    // 🔒 Not logged in
    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // 🔐 Role-based access
    if (roles && !roles.includes(user.role)) {
        return <Navigate to="/" replace />;
    }

    // ⛔ Educator not approved
    if (requireApproved && user.role === "educator" && !user.isApproved) {
        return <Navigate to="/pending-approval" replace />;
    }

    return children;
};

export default ProtectedRoute;
