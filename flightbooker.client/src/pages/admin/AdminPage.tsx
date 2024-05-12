import HomeIcon from "@mui/icons-material/Home";
import BugReportIcon from "@mui/icons-material/BugReport";
import PersonIcon from "@mui/icons-material/Person";
import AirplaneTicketIcon from "@mui/icons-material/AirplaneTicket";
import FlightLandIcon from "@mui/icons-material/FlightLand";
import AirlinesIcon from "@mui/icons-material/Airlines";
import GpsFixedIcon from "@mui/icons-material/GpsFixed";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { Outlet } from "react-router-dom";


const AdminPage = () => {
  const navPaths = [
    { label: "Dashboard", path: "dashboard", icon: <HomeIcon /> },
    { label: "Complaints", path: "complaints", icon: <BugReportIcon /> },
    { label: "Users", path: "users", icon: <PersonIcon /> },
    {
      label: "Reservations",
      path: "reservations",
      icon: <AirplaneTicketIcon />,
    },
    { label: "Airplanes", path: "airplanes", icon: <FlightLandIcon /> },
    { label: "Airports", path: "airports", icon: <GpsFixedIcon /> },
    { label: "Airlines", path: "airlines", icon: <AirlinesIcon /> },
  ];


  return (
    <DashboardLayout basePath="/admin" navPaths={navPaths}>
      <Outlet />
    </DashboardLayout>
  );
};

export default AdminPage;
