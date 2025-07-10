import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { useNavigate } from "react-router-dom";
import React, { useEffect } from "react";

const ProtectedRouteForValidator: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user, loading } = useSelector((state: RootState) => state.auth);
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && !user || user?.hasValidated) {
            navigate("/", { replace: true });
        }
    }, [loading, user, navigate]);

    
    if (loading) {
        return null
    }

    return user ? <>{children}</> : null;
};

export default ProtectedRouteForValidator;
