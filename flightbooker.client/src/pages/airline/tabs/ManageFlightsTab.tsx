import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import axiosInstance from "../../../utils/axios";
import axios from "axios";
import DataTable from "../../../components/core/DataTable";
import {
  GridActionsCellItem,
  GridColDef,
  GridRowParams,
} from "@mui/x-data-grid";
import { Container, Grid } from "@mui/material";
import AirlineContext from "../../../stores/airline-context";
import dayjs from "dayjs";
import { Flight } from "../../../models/tables/Flight";
import AccessAlarmIcon from "@mui/icons-material/AccessAlarm";
import DelayFlightDialog from "../../../components/airlines/DelayFlightDialog";

const ManageFlightsTab = () => {
  const { airline } = useContext(AirlineContext);
  const [flightData, setFlightData] = useState<Flight[]>([]);
  const [isDelayFlightModalOpen, setIsDelayFlightModalOpen] = useState(false);
  const [delayFlightData, setDelayFlightData] = useState<number | null>(null);

  const fetchFlightData = useCallback(async () => {
    try {
      const response = await axiosInstance.get<Flight[]>(
        `/flights?airlineId=${airline?.id}`
      );
      setFlightData(response.data);
    } catch (error) {
      if (axios.isAxiosError(error))
        throw new Error(error.response?.data || "An error occurred");

      throw error;
    }
  }, [airline?.id]);

  useEffect(() => {
    if(isDelayFlightModalOpen === false)
      fetchFlightData();
  }, [fetchFlightData, isDelayFlightModalOpen]);

  const populateFlightsTable = useCallback(async () => {
    return flightData;
  }, [flightData]);

  const handleDelayFlightAction = useCallback(async (params: GridRowParams) => {
    const flightId = params.id as number;
    setDelayFlightData(flightId);
    setIsDelayFlightModalOpen(true);
  }, []);

  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: "id",
        headerName: "Flight Id",
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
        field: "duration",
        headerName: "Flight Duration",
        align: "left",
        headerAlign: "left",
        flex: 0.2,
      },
      {
        field: "delay",
        headerName: "Delay",
        align: "left",
        headerAlign: "left",
        flex: 0.2,
      },
      {
        field: "airplaneName",
        headerName: "Aircraft",
        align: "left",
        headerAlign: "left",
        flex: 0.2,
      },
      {
        field: "routeId",
        headerName: "Route Id",
        align: "left",
        headerAlign: "left",
        flex: 0.2,
      },
      {
        field: "actions",
        headerName: "Actions",
        type: "actions",
        getActions: (params: GridRowParams) => [
          <GridActionsCellItem
            icon={<AccessAlarmIcon />}
            onClick={() => {
              handleDelayFlightAction(params);
            }}
            label="Delay Flight"
          />,
        ],
      },
    ],
    [handleDelayFlightAction]
  );

  return (
    <Container className="mt-20 w-full px-0">
      <Grid container justifyContent="space-between" alignItems="center">
        <h1>Flights</h1>
      </Grid>
      <DataTable<Flight>
        apiUrl="/flights"
        columns={columns}
        onPopulateTable={populateFlightsTable}
      />

      {delayFlightData && (
        <DelayFlightDialog
          open={isDelayFlightModalOpen}
          onClose={() => setIsDelayFlightModalOpen(false)}
          selectedFlightId={delayFlightData}
        />
      )}
    </Container>
  );
};
export default ManageFlightsTab;
