import React from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const HomeRedirect = () => {
    const { user, loading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (loading) return;

        if (!user) navigate("/login");
        else if (user.role === "admin") navigate("/admin/dashboard");
        else navigate("/student/dashboard");
    }, [user, loading, navigate]);

    return null;
};

export default HomeRedirect;
