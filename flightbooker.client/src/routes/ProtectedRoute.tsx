import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/use-auth";

export const ProtectedRoute = () => {
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated()) {
        return <Navigate to="/login" />;
    }

    return <Outlet />;
};