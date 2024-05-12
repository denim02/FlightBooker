import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/use-auth";
import axiosInstance from "../../utils/axios";

const LogoutPage = () => {
    const { clearUser } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await axiosInstance.post("/auth/logout");
        clearUser();
        navigate("/", { replace: true });
    };

    setTimeout(() => {
        handleLogout();
    }, 3 * 1000);

    return <>Logout Page</>;
};

export default LogoutPage;