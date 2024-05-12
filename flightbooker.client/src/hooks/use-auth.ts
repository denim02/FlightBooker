import { useContext } from "react"
import AuthContext from "../stores/auth-context"

export const useAuth = () => {
    return useContext(AuthContext);
}