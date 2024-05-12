import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { Link, useLocation } from "react-router-dom";
import { Divider, ListItem, ListItemIcon } from "@mui/material";
import LogoutButton from "../core/LogoutButton";
import React from "react";
import { NavPath } from "./NavPath";

const drawerWidth = 240;

type DashboardLayoutProps = {
  basePath: string;
  navPaths: NavPath[];
  children: React.ReactNode;
};

const DashboardLayout = ({
  basePath,
  navPaths,
  children,
}: DashboardLayoutProps) => {
  const location = useLocation();

  return (
    <Box className="">
      <AppBar
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
        className="fixed bg-background text-white"
      >
        <Toolbar className="h-full">
          <Typography
            variant="h1"
            noWrap
            component="div"
            className="font-bold text-3xl"
          >
            <Link to="/" className="no-underline text-white">Flight Booker</Link>
          </Typography>
          <LogoutButton
            variant="contained"
            className=" bg-attention text-black ml-auto hover:bg-primary hover:text-white disabled:bg-slate-400"
          >
            Logout
          </LogoutButton>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
      >
        <Toolbar />
        <Box className="overflow-auto">
          <List className="w-full">
            {navPaths.map(({ label, path, icon, disabled }) => (
              <React.Fragment key={label}>
                <ListItem key={label} className="py-0 px-0 my-0 h-full">
                  <ListItemButton
                    component={Link}
                    to={`${basePath}/${path}`}
                    disabled={disabled}
                    selected={location.pathname === `${basePath}/${path}`}
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
      </Drawer>
      <Box
        component="main"
        className="relative left-60 w-[calc(100%-240px)] overflow-auto"
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};

export default DashboardLayout;
