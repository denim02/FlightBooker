import HomeIcon from "@mui/icons-material/Home";
import RouteIcon from "@mui/icons-material/Route";
import FlightIcon from "@mui/icons-material/Flight";
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/use-auth";
import axiosInstance from "../../utils/axios";
import { Airline } from "../../models/tables/Airline";
import AirlineContext from "../../stores/airline-context";
import axios from "axios";
import { useCallback, useContext, useEffect } from "react";

const AirlinePage = () => {
  const { airline, setAirline } = useContext(AirlineContext);
  const { user } = useAuth();

  const fetchAirlineData = useCallback(async () => {
    try {
      const response = await axiosInstance.get<Airline | null>(
        `/airlines/operators/${user!.userId}`
      );
      setAirline(response.data);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data)
        console.error("Axios error:", error.response);
      else console.error("Error fetching metrics:", error);
    }
  }, [setAirline, user]);

  useEffect(() => {
    fetchAirlineData();
  }, [fetchAirlineData]);

  const navPaths = [
    {
      label: "Dashboard",
      path: "dashboard",
      icon: <HomeIcon />,
      disabled: !airline,
    },
    {
      label: "Manage Flights",
      path: "flights",
      icon: <FlightIcon />,
      disabled: !airline,
    },
    {
      label: "Manage Routes",
      path: "routes",
      icon: <RouteIcon />,
      disabled: !airline,
    },
    {
      label: "Technical Support",
      path: "support",
      icon: <SupportAgentIcon />,
      disabled: !airline,
    }
  ];

  return (
    <DashboardLayout basePath="/airline" navPaths={navPaths}>
      {airline && <Outlet />}
    </DashboardLayout>
  );
};

export default AirlinePage;
