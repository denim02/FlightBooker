import { Button } from "@mui/material";
import { useLogout } from "../../hooks/use-logout";

const LogoutButton = (props: { [key: string]: unknown }) => {
  const { isLoggingOut, handleLogout } = useLogout();

  return (
    <Button {...props} disabled={isLoggingOut} onClick={handleLogout}>
      Logout
    </Button>
  );
};

export default LogoutButton;
