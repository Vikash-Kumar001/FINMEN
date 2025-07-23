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

    // 🔐 OTP-only routes (e.g., reset password)
    if (otpOnly) {
        const verifiedEmail = localStorage.getItem("verified_reset_email");
        if (!verifiedEmail) {
            console.warn("⚠️ OTP route access denied. Missing verified email.");
            return <Navigate to="/login" state={{ from: location }} replace />;
        }
    }

    // 🔒 Not logged in
    if (!user) {
        console.warn("⚠️ Route access denied. User not logged in.");
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // 🔐 Role-based access control
    if (roles && !roles.includes(user.role)) {
        console.warn(`⚠️ Access denied. Role '${user.role}' not permitted for this route.`);
        return <Navigate to="/" replace />;
    }

    // ⛔ Educator not approved
    if (requireApproved && user.role === "educator" && !user.isApproved) {
        console.warn("🔒 Educator not approved. Redirecting to pending approval.");
        return <Navigate to="/pending-approval" replace />;
    }

    return children;
};

export default ProtectedRoute;
