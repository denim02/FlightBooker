import { useCallback, useEffect, useState } from "react";
import axiosInstance from "../../../utils/axios";
import axios from "axios";
import DataTable from "../../../components/core/DataTable";
import { GridColDef } from "@mui/x-data-grid";
import { Container, Grid } from "@mui/material";
import {
  ReservationDataDTO,
  ReservationSeatDataDTO,
} from "../../../models/DTOs/reservations/ReservationDataDTO";
import dayjs from "dayjs";

const ReservationsTab = () => {
  const [reservationsData, setReservationsData] = useState<
    ReservationDataDTO[]
  >([]);

  const fetchReservationsData = useCallback(async () => {
    try {
      const response = await axiosInstance.get<ReservationDataDTO[]>(
        "/reservations"
      );

      setReservationsData(response.data);
    } catch (error) {
      if (axios.isAxiosError(error))
        throw new Error(error.response?.data || "An error occurred");

      throw error;
    }
  }, []);

  useEffect(() => {
    fetchReservationsData();
  }, [fetchReservationsData]);

  const populateReservationsTable = useCallback(async () => {
    return reservationsData;
  }, [reservationsData]);

  return (
    <Container className="mt-20 w-full px-0">
      <Grid container justifyContent="space-between" alignItems="center">
        <h1>Reservations</h1>
      </Grid>
      <DataTable<ReservationDataDTO>
        apiUrl="/reservations"
        columns={columns}
        onPopulateTable={populateReservationsTable}
      />
    </Container>
  );
};

const columns: GridColDef[] = [
  {
    field: "id",
    headerName: "Id",
    align: "left",
    headerAlign: "left",
    flex: 0.1,
  },
  {
    field: "clientId",
    headerName: "Client Id",
    align: "left",
    headerAlign: "left",
    flex: 0.3,
  },
  {
    field: "routeId",
    headerName: "Route Id",
    align: "left",
    headerAlign: "left",
    flex: 0.3,
  },
  {
    field: "reservationDate",
    headerName: "Reservation Date",
    align: "left",
    headerAlign: "left",
    flex: 0.3,
    valueFormatter: (params: Date) =>
      params && dayjs(params).format("DD/MM/YYYY HH:mm"),
  },
  {
    field: "reservationSeatsData",
    headerName: "Reserved Seats",
    align: "left",
    headerAlign: "left",
    flex: 0.5,
    valueFormatter: (params: ReservationSeatDataDTO[]) =>
      params &&
      params
        .map(
          (seatData: ReservationSeatDataDTO) =>
            seatData.flightId + "/" + seatData.reservedSeats.join(", ")
        )
        .join("; "),
  },
];

export default ReservationsTab;
