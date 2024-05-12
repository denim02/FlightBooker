import { useState, useEffect, useCallback, useContext } from "react";
import {
  Container,
  Typography,
  Grid,
  Paper,
  Card,
  Divider,
  CardHeader,
  CardContent,
  TableContainer,
  TableHead,
  Table,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import axiosInstance from "../../../utils/axios";
import axios from "axios";
import dayjs from "dayjs";
import { Flight } from "../../../models/tables/Flight";
import AirlineContext from "../../../stores/airline-context";

interface Metrics {
  monthlyReservations: number;
  monthlyRevenue: number;
  monthlyFlights: number;
  upcomingFlights: Flight[];
}

const AirlineDashboardTab = () => {
  const [metrics, setMetrics] = useState<Metrics>({
    monthlyReservations: 0,
    monthlyRevenue: 0,
    monthlyFlights: 0,
    upcomingFlights: [],
  });
  const { airline } = useContext(AirlineContext);

  // Fetch metrics data from backend
  const fetchMetrics = useCallback(async () => {
    try {
      const response = await axiosInstance.get<Metrics>(
        `/airlines/${airline?.id}/metrics`
      );

      setMetrics({
        monthlyReservations: response.data.monthlyReservations,
        monthlyRevenue: response.data.monthlyRevenue,
        monthlyFlights: response.data.monthlyFlights,
        upcomingFlights: response.data.upcomingFlights
          ? response.data.upcomingFlights
          : [],
      });
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data)
        console.error("Axios error:", error.response);
      else console.error("Error fetching metrics:", error);
    }
  }, [airline?.id]);

  useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  return (
    <Container className="py-10">
      <Typography
        variant="h3"
        gutterBottom
        className="text-background font-black mb-10"
      >
        {airline?.airlineName} Dashboard
      </Typography>
      {metrics && (
        <>
          <Grid container spacing={5}>
            <Grid item xs={12} sm={6} md={4}>
              <Card className="text-center h-full drop-shadow-lg">
                <CardHeader
                  titleTypographyProps={{
                    variant: "h6",
                    className: "font-light text-3xl text-background",
                  }}
                  title="Flights This Month"
                />
                <Divider />
                <CardContent>
                  <Typography variant="h4" className="py-4 text-6xl">
                    {metrics.monthlyFlights}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Card className="text-center h-full drop-shadow-lg">
                <CardHeader
                  titleTypographyProps={{
                    variant: "h6",
                    className: "font-light text-3xl text-background",
                  }}
                  title="Reservations This Month"
                />
                <Divider />
                <CardContent>
                  <Typography variant="h4" className="py-4 text-6xl">
                    {metrics.monthlyReservations}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Card className="text-center h-full drop-shadow-lg">
                <CardHeader
                  titleTypographyProps={{
                    variant: "h6",
                    className: "font-light text-3xl text-background",
                  }}
                  title="Revenue This Month"
                />
                <Divider />
                <CardContent>
                  <Typography variant="h4" className="py-4 text-4xl">
                    ${metrics.monthlyRevenue.toFixed(2)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Divider className="my-12 border-2" />

          <Typography variant="h5" gutterBottom>
            Upcoming Flights
          </Typography>

          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="Recent Complaints Table">
              <TableHead>
                <TableRow>
                  <TableCell>Id</TableCell>
                  <TableCell align="left">Departure Time</TableCell>
                  <TableCell align="left">Arrival Time</TableCell>
                  <TableCell align="left">Departure Airport</TableCell>
                  <TableCell align="left">Arrival Airport</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {metrics.upcomingFlights.map((flight) => (
                  <TableRow
                    key={flight.id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {flight.id}
                    </TableCell>
                    <TableCell align="left">
                      {dayjs(flight.departureTime).format("DD/MM/YY HH:mm")}
                    </TableCell>
                    <TableCell align="left">
                      {dayjs(flight.arrivalTime).format("DD/MM/YY HH:mm")}
                    </TableCell>
                    <TableCell align="left">
                      {flight.departureAirportCode}
                    </TableCell>
                    <TableCell align="left">
                      {flight.arrivalAirportCode}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </Container>
  );
};

export default AirlineDashboardTab;
