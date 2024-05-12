import {
    createContext,
    useState,
    useMemo,
    PropsWithChildren,
    useEffect,
    useCallback
} from "react";
import { User } from "../models/auth/User";

interface AuthContextType {
    user: User | null;
    setUser: (user: User) => void;
    clearUser: () => void;
    isAuthenticated: () => boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

const AuthProvider: React.FC<PropsWithChildren> = ({ children }) => {
    const [user, setUser] = useState<User | null>(() => {
        const localStorageData = localStorage.getItem("u_data");
        return (localStorageData) ? JSON.parse(localStorageData) : null;
    });

    useEffect(() => {
        if (user) {
            localStorage.setItem("u_data", JSON.stringify(user));
        }
        else {
            localStorage.removeItem("u_data");
        }
    }, [user]);

    const clearUser = () => {
        setUser(null);
    }

    const isAuthenticated = useCallback(() => {
        return user !== null;
    }, [user]);

    const contextValue = useMemo(() => ({
        user,
        setUser,
        clearUser,
        isAuthenticated
    }), [user, isAuthenticated]);

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
export { AuthProvider };
