import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { Link, useLocation } from "react-router-dom";
import React, { useMemo, useState } from "react";
import { useAuth } from "../../hooks/use-auth";
import { useLogout } from "../../hooks/use-logout";
import { NavPath } from "./NavPath";
import {
  Button,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import HomeIcon from "@mui/icons-material/Home";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

type DefaultPageLayoutProps = {
  children: React.ReactNode;
};

const drawerWidth = 250;
const basePath = "";

const unAuthenticatedNavPaths = [
  { label: "Login", path: "login", icon: <LoginIcon /> },
  { label: "Register", path: "register", icon: <PersonAddIcon /> },
];

const DefaultPageLayout = ({ children }: DefaultPageLayoutProps) => {
  const { isAuthenticated } = useAuth();
  const { handleLogout } = useLogout();
  const location = useLocation();
  const [isMobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const authenticatedNavPaths = useMemo(
    () => [
      { label: "Logout", onClick: () => handleLogout(), icon: <LogoutIcon /> },
      {
        label: "Your Account",
        path: "account",
        icon: <AccountCircleIcon />,
        showOnlyIcon: true,
      },
    ],
    [handleLogout]
  );

  const navPaths = useMemo<NavPath[]>(
    () => [
      { label: "Home", path: "home", icon: <HomeIcon /> },
      { label: "About Us", path: "about-us", icon: <FlightTakeoffIcon /> },
      {
        label: "Help",
        path: "support",
        icon: <SupportAgentIcon />,
      },
      ...(isAuthenticated() ? authenticatedNavPaths : unAuthenticatedNavPaths),
    ],
    [authenticatedNavPaths, isAuthenticated]
  );

  const handleDrawerToggle = () => {
    setMobileDrawerOpen((prevState) => !prevState);
  };

  const mobileDrawer = (
    <Box onClick={handleDrawerToggle}>
      <List className="w-full">
        {navPaths.map(({ label, path, icon, onClick }, index) => (
          <React.Fragment key={index}>
            <ListItem key={index} className="py-0 px-0 my-0 h-full">
              <ListItemButton
                component={path ? Link : "button"}
                to={path ? `${basePath}/${path}` : undefined}
                onClick={onClick}
                selected={
                  path ? location.pathname === `${basePath}/${path}` : false
                }
                className="py-4 my-0"
              >
                <ListItemIcon>{icon}</ListItemIcon>
                <ListItemText primary={label} className="" />
              </ListItemButton>
            </ListItem>

            <Divider />
          </React.Fragment>
        ))}
      </List>
    </Box>
  );

  return (
    <Box className="flex">
      <AppBar component="nav" className="bg-background text-white">
        <Toolbar className="px-10">
          <IconButton
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            className="-ml-10 sm:hidden text-white"
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h1"
            component="div"
            className="flex-grow text-center sm:text-left font-bold text-3xl"
          >
            <Link to="/home" className="no-underline text-white">Flight Booker</Link>
          </Typography>
          <Box className="hidden sm:block">
            {navPaths.map(({ label, path, icon, onClick, showOnlyIcon }) =>
              !showOnlyIcon ? (
                <Button
                  key={label}
                  component={path ? Link : "button"}
                  to={path ? `${basePath}/${path}` : undefined}
                  onClick={onClick}
                  className="text-white hover-underline after:bg-white"
                >
                  {label}
                </Button>
              ) : (
                <IconButton
                  key={label}
                  component={path ? Link : "button"}
                  to={path ? `${basePath}/${path}` : undefined}
                  onClick={onClick}
                  className="text-white hover:bg-slate-700 transition-colors duration-500"
                >
                  {icon}
                </IconButton>
              )
            )}
          </Box>
        </Toolbar>
      </AppBar>
      <nav>
        <Drawer
          variant="temporary"
          open={isMobileDrawerOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          className="block sm:hidden"
          sx={{
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {mobileDrawer}
        </Drawer>
      </nav>
      <Box component="main" className="w-full overflow-auto">
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};

export default DefaultPageLayout;
