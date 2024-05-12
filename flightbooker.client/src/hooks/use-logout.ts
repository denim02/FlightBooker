import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axios";
import { useAuth } from "./use-auth";
import { useState } from "react";

const useLogout = () => {
    const { clearUser } = useAuth();
    const navigate = useNavigate();
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const handleLogout = () => {
        setIsLoggingOut(true);
        setTimeout(async () => {
            await axiosInstance.post("/auth/logout");
            clearUser();
            setIsLoggingOut(false);
            navigate("/", { replace: true });
        }, 1.5 * 1000);
    };

    return {
        isLoggingOut,
        handleLogout
    };
};

export { useLogout };