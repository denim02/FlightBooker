import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import axiosInstance from "../../../utils/axios";
import axios from "axios";
import DataTable from "../../../components/core/DataTable";
import { GridColDef } from "@mui/x-data-grid";
import { Button, Container, Grid } from "@mui/material";
import { FlightRoute } from "../../../models/tables/FlightRoute";
import AirlineContext from "../../../stores/airline-context";
import dayjs from "dayjs";
import { Link } from "react-router-dom";
import DeleteRowDialog from "../../../components/airlines/DeleteRowDialog";

const ManageRoutesTab = () => {
  const { airline } = useContext(AirlineContext);
  const [routeData, setRouteData] = useState<FlightRoute[]>([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState<FlightRoute | null>(null);

  const fetchRouteData = useCallback(async () => {
    try {
      const response = await axiosInstance.get<FlightRoute[]>(
        `/routes?airlineId=${airline?.id}`
      );
      setRouteData(response.data);
    } catch (error) {
      if (axios.isAxiosError(error))
        throw new Error(error.response?.data || "An error occurred");

      throw error;
    }
  }, [airline?.id]);

  useEffect(() => {
    if (isDeleteDialogOpen === false) fetchRouteData();
  }, [fetchRouteData, isDeleteDialogOpen]);

  const populateRoutesTable = useCallback(async () => {
    return routeData;
  }, [routeData]);

  const deleteRowCallback = useCallback((row: FlightRoute) => {
    setSelectedRoute(row);
    setIsDeleteDialogOpen(true);
  }, []);

  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: "id",
        headerName: "Route Id",
        align: "left",
        headerAlign: "left",
        flex: 0.1,
      },
      {
        field: "departureTime",
        headerName: "Departure Time",
        align: "left",
        headerAlign: "left",
        type: "dateTime",
        flex: 0.3,
        valueGetter: (value) => value && new Date(value),
        valueFormatter: (value) =>
          value && dayjs(new Date(value)).format("DD/MM/YYYY HH:mm"),
      },
      {
        field: "arrivalTime",
        headerName: "Arrival Time",
        align: "left",
        type: "dateTime",
        headerAlign: "left",
        flex: 0.3,
        valueGetter: (value) => value && new Date(value),
        valueFormatter: (value) =>
          value && dayjs(new Date(value)).format("DD/MM/YYYY HH:mm"),
      },
      {
        field: "departureAirportCode",
        headerName: "Departure Airport",
        align: "left",
        headerAlign: "left",
        flex: 0.2,
      },
      {
        field: "arrivalAirportCode",
        headerName: "Arrival Airport",
        align: "left",
        headerAlign: "left",
        flex: 0.2,
      },
      {
        field: "hasReservations",
        headerName: "Has Reservations",
        align: "center",
        headerAlign: "center",
        type: "boolean",
        flex: 0.2,
      },
      {
        field: "routeGroupId",
        headerName: "Group Id",
        align: "center",
        headerAlign: "center",
        flex: 0.2,
      }
    ],
    []
  );

  return (
    <Container className="mt-20 w-full px-0">
      <Grid container justifyContent="space-between" alignItems="center">
        <h1>Routes</h1>
        <Button
          variant="contained"
          className="h-12"
          component={Link}
          to="/airline/routes/create"
        >
          Add Route
        </Button>
      </Grid>
      <DataTable<FlightRoute>
        apiUrl="/routes"
        columns={columns}
        hasDeleteRowOption={true}
        onDeleteRow={deleteRowCallback}
        onPopulateTable={populateRoutesTable}
      />
      {isDeleteDialogOpen && selectedRoute && (
        <DeleteRowDialog
          open={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          route={selectedRoute}
        />
      )}
    </Container>
  );
};
export default ManageRoutesTab;
