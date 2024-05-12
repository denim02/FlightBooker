import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import { useAuth } from "../hooks/use-auth";
import { ProtectedRoute } from "./ProtectedRoute";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/auth/LoginPage";
import ConfirmEmailPage from "../pages/auth/ConfirmEmailPage";
import NotFoundPage from "../pages/NotFoundPage";
import RegisterPage from "../pages/auth/RegisterPage";
import { UserRole } from "../models/auth/User";
import AdminPage from "../pages/admin/AdminPage";
import UsersTab from "../pages/admin/tabs/UsersTab";
import AirplanesTab from "../pages/admin/tabs/AirplanesTab";
import AdminDashboardTab from "../pages/admin/tabs/AdminDashboardTab";
import ComplaintsTab from "../pages/admin/tabs/ComplaintsTab";
import ReservationsTab from "../pages/admin/tabs/ReservationsTab";
import AirportsTab from "../pages/admin/tabs/AirportsTab";
import AirlinesTab from "../pages/admin/tabs/AirlinesTab";
import AirlinePage from "../pages/airline/AirlinePage";
import { AirlineProvider } from "../stores/airline-context";
import AirlineDashboardTab from "../pages/airline/tabs/AirlineDashboardTab";
import ManageRoutesTab from "../pages/airline/tabs/ManageRoutesTab";
import ManageFlightsTab from "../pages/airline/tabs/ManageFlightsTab";
import AddRouteTab from "../pages/airline/tabs/AddRouteTab";
import PassengerPage from "../pages/passenger/PassengerPage";
import { FilteringProvider } from "../stores/filtering-context";
import SearchPage from "../pages/passenger/SearchPage";
import BookingPage from "../pages/passenger/BookingPage";
import Page from "../pages/Page";
import BookingSuccessPage from "../pages/passenger/BookingSuccessPage";
import AccountPage from "../pages/passenger/AccountPage";
import AboutUsPage from "../pages/passenger/AboutUsPage";
import SupportPage from "../pages/passenger/SupportPage";
import SupportTab from "../pages/airline/tabs/SupportTab";

const Routes = () => {
  const { user, isAuthenticated } = useAuth();

  const generalRoutes = [
    {
      path: "*",
      element: <Navigate to="/404" replace />,
    },
    {
      path: "/404",
      element: <Page title="404"><NotFoundPage /></Page>,
    },
  ];

  const routesForRegularUsers = [
    {
      path: "/",
      element: (
        <FilteringProvider>
          <PassengerPage />
        </FilteringProvider>
      ),
      children: [
        {
          path: "",
          element: <Navigate to="home" replace />,
        },
        {
          path: "/home",
          element: <Page title="Home"><HomePage /></Page>,
        },
        {
          path: "/about-us",
          element: <Page title="About Us"><AboutUsPage/></Page>,
        },
        {
          path: "/search",
          element: <Page title="Search"><SearchPage/></Page>,
        },
        {
          path: "/",
          element: <ProtectedRoute />,
          children: [
            {
              path: "/support",
              element: <Page title="Support"><SupportPage/></Page>,
            },
            {
              path: "book/:routeId",
              element: <Page title="Booking"><BookingPage /></Page>,
            },
            {
              path: "book/:routeId/success",
              element: <Page title="Booking Success"><BookingSuccessPage/></Page>,
            },
            {
              path: "account",
              element: <Page title="Your Account"><AccountPage/></Page>,
            },
          ],
        },
      ],
    },
  ];

  const routesForAirlineOperators = [
    {
      path: "/",
      element: <Navigate to="/airline" replace />,
    },
    {
      path: "/airline",
      element: (
        <AirlineProvider>
          <AirlinePage />
        </AirlineProvider>
      ),
      children: [
        {
          path: "",
          element: <Navigate to="dashboard" replace />,
        },
        {
          path: "dashboard",
          element: <Page title="Dashboard"><AirlineDashboardTab /></Page>,
        },
        {
          path: "routes",
          element: <Page title="Manage Routes"><ManageRoutesTab /></Page>,
        },
        {
          path: "routes/create",
          element: <Page title="Add Route"><AddRouteTab /></Page>,
        },
        {
          path: "flights",
          element: <Page title="Manage Flights"><ManageFlightsTab /></Page>,
        },
        {
          path: "support",
          element: <Page title="Support"><SupportTab/></Page>,
        }
      ],
    },
  ];

  const routesForAdmins = [
    {
      path: "/",
      element: <Navigate to="/admin" replace />,
    },
    {
      path: "/admin",
      element: <AdminPage />,
      children: [
        {
          path: "",
          element: <Navigate to="dashboard" replace />,
        },
        {
          path: "dashboard",
          element: <Page title="Dashboard"><AdminDashboardTab /></Page>,
        },
        {
          path: "users",
          element: <Page title="Manage Users"><UsersTab /></Page>,
        },
        {
          path: "complaints",
          element: <Page title="Complaints"><ComplaintsTab /></Page>,
        },
        {
          path: "reservations",
          element: <Page title="Manage Reservations"><ReservationsTab /></Page>,
        },
        {
          path: "airplanes",
          element: <Page title="Manage Airplanes"><AirplanesTab /></Page>,
        },
        {
          path: "airports",
          element: <Page title="Manage Airports"><AirportsTab /></Page>,
        },
        {
          path: "airlines",
          element: <Page title="Manage Airlines"><AirlinesTab /></Page>,
        },
      ],
    },
  ];

  const routesForUnauthorized = [
    {
      path: "/login",
      element: <Page title="Login"><LoginPage /></Page>,
    },
    {
      path: "/register",
      element: <Page title="Register"><RegisterPage /></Page>,
    },
    {
      path: "/confirm-email",
      element: <Page title="Confirm Email"><ConfirmEmailPage /></Page>,
    },
    {
      path: "/airline",
      element: <ProtectedRoute />,
    },
    {
      path: "/admin",
      element: <ProtectedRoute />,
    },
  ];

  const router = createBrowserRouter([
    ...generalRoutes,
    ...(isAuthenticated() ? [] : routesForUnauthorized),
    ...(!isAuthenticated() || user?.role === UserRole.User
      ? routesForRegularUsers
      : []),
    ...(isAuthenticated() && user?.role === UserRole.AirlineOperator
      ? routesForAirlineOperators
      : []),
    ...(isAuthenticated() && user?.role === UserRole.Admin
      ? routesForAdmins
      : []),
  ]);

  return <RouterProvider router={router} />;
};

export default Routes;
