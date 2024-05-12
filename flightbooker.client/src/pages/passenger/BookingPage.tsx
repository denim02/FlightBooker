import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../utils/axios";
import axios from "axios";
import {
  FlightBookingDataDTO,
  RouteBookingDataDTO,
} from "../../models/DTOs/RouteBookingDataDTO";
import { AirplaneSeatDataDTO } from "../../models/DTOs/AirplaneSeatDataDTO";
import ReserveSeatsForm, {
  ReserveSeatsFormHandle,
  SeatReservationData,
  SeatReservationState,
} from "../../components/passengers/ReserveSeatsForm";
import {
  Alert,
  AlertProps,
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListSubheader,
  Snackbar,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import React from "react";
import {
  CabinClass,
  getCabinClassColor,
  getCabinClassLabel,
  getCabinClassPriceLabel,
} from "../../models/CabinClass";
import { useAuth } from "../../hooks/use-auth";

type FlightSeatReservationState = {
  flightId: number;
  nrRows: number;
  nrColumns: number;
  seatReservationState: SeatReservationState;
};

const BookingPage = () => {
  const { user } = useAuth();
  const { routeId } = useParams();
  const navigate = useNavigate();
  const [routeData, setRouteData] = useState<RouteBookingDataDTO | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [flightReservationStates, setFlightReservationStates] = useState<
    FlightSeatReservationState[] | null
  >(null);
  const [seatReservationData, setSeatReservationData] = useState<
    SeatReservationData[]
  >([]); // [1
  const itemsRef = useRef<ReserveSeatsFormHandle[]>([]);
  const [snackbar, setSnackbar] = useState<Pick<
    AlertProps,
    "children" | "severity"
  > | null>(null);
  const handleCloseSnackbar = () => setSnackbar(null);

  useEffect(() => {
    if (!routeData) return;
    itemsRef.current = itemsRef.current.slice(0, routeData.flights.length);
  }, [routeData]);

  const fetchRouteData = useCallback(
    async (routeId: number) => {
      try {
        const response = await axiosInstance.get<RouteBookingDataDTO>(
          `/routes/${routeId}/booking`
        );
        setRouteData(response.data);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 404) {
            navigate("/404", { replace: true });
          }
          console.error(error.response?.data || "An error occurred");
        }
        console.error(error);
      }
    },
    [navigate]
  );

  const fetchAirplaneSeatData = useCallback(
    async (flights: FlightBookingDataDTO[]) => {
      try {
        const requests = flights.map((flight) =>
          axiosInstance.get<AirplaneSeatDataDTO>(
            `/airplanes/${flight.airplaneId}/seats`
          )
        );

        const response = await Promise.all(requests);
        const data = response
          .map((res) => res.data)
          .map((data, index) => ({
            flightId: flights[index].flightId,
            nrRows: data.nrRows,
            nrColumns: data.nrColumns,
            seatReservationState: {
              allSeats: data.seats.map((seat) => ({
                id: seat.id,
                row: seat.row,
                column: seat.column,
                isReserved:
                  flights[index].seats.find((s) => s.airplaneSeatId === seat.id)
                    ?.isReserved || false,
              })),
              selectedSeats: [],
              cabinClassMappings: data.cabinClassMappings,
            },
          }));
        setFlightReservationStates(data);
      } catch (error) {
        if (axios.isAxiosError(error))
          console.error(error.response?.data || "An error occurred");
        console.error(error);
      }
    },
    []
  );

  useEffect(() => {
    if (routeId) fetchRouteData(+routeId);
  }, [fetchRouteData, routeId]);

  useEffect(() => {
    if (routeData) {
      fetchAirplaneSeatData(routeData.flights);
    }
  }, [fetchAirplaneSeatData, routeData]);

  const getSeatReservations = useCallback(() => {
    const data = itemsRef.current.map((item) => item.getSeatReservations());

    // Check that the same number of seats is reserved for each flight
    if (data.some((d) => d.selectedSeats.length === 0)) {
      setSnackbar({
        children: "Please reserve seats for all flights.",
        severity: "error",
      });
      return;
    }
    if (
      data.some((d) => d.selectedSeats.length !== data[0].selectedSeats.length)
    ) {
      setSnackbar({
        children: "Please reserve the same number of seats for each flight.",
        severity: "error",
      });
      return;
    }

    // Check that the same cabin class is reserved for each flight
    if (
      data.some((d) =>
        d.selectedSeats.some(
          (s) => s.cabinClass !== d.selectedSeats[0].cabinClass
        )
      )
    ) {
      setSnackbar({
        children: "Please reserve the same cabin class for each flight.",
        severity: "error",
      });
      return;
    }

    return data;
  }, []);

  const handleFinalizeSeatReservations = useCallback(async () => {
    setSeatReservationData(getSeatReservations() || []);
  }, [getSeatReservations]);

  const handleBook = useCallback(async () => {
    setIsSubmitting(true);
    const data = getSeatReservations();
    if (!data || !routeId) {
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await axiosInstance.post<number>("/reservations", {
        routeId: +routeId,
        clientId: user!.userId,
        flightSeats: data.map(d => ({
          flightId: d.flightId,
          airplaneSeatIds: d.selectedSeats.map(s => s.id)
        }))
      });

      navigate("/book/" + routeId + "/success", { state: { reservationId: response.data } });
    } 
    catch (error) {
      if (axios.isAxiosError(error))
        console.error(error.response?.data || "An error occurred");
      console.error(error);
      setSnackbar({
        children: "An error occurred while booking the flights.",
        severity: "error",
      });
    }
    finally {
      setIsSubmitting(false);
    }
  }, [getSeatReservations, navigate, routeId, user]);

  return (
    <Container className="py-8">
      <Typography variant="h3" className="font-thin text-background">
        Booking
      </Typography>
      <Divider className="w-full py-2" />
      {routeData && (
        <Typography variant="h5" className="pt-5">
          Airline: {routeData.airlineName}
        </Typography>
      )}
      <Grid container className="py-5">
        <Grid container item xs={12} md={7}>
          {routeData &&
            routeData.flights.map((flight, index) => (
              <React.Fragment key={flight.flightId}>
                <Grid container className="gap-y-4">
                  <Grid item xs={12}>
                    <Typography variant="h6" className="text-2xl font-light">
                      Flight #{index + 1}
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    container
                    xs={12}
                    alignItems="center"
                    className="gap-x-4 justify-center md:justify-start"
                  >
                    <Grid item>
                      <Typography className="text-base">
                        <span className="hidden sm:inline">
                          Departure Airport:{" "}
                        </span>
                        <span className="underline underline-offset-4">
                          {flight.departureAirportCode}
                        </span>
                      </Typography>
                      <Typography className="text-base font-light">
                        {dayjs(flight.departureTime).format("DD/MM/YY HH:mm")}
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Typography className="text-3xl">-</Typography>
                    </Grid>
                    <Grid item>
                      <Typography className="text-base">
                        <span className="hidden sm:inline">
                          Arrival Airport:{" "}
                        </span>
                        <span className="underline underline-offset-4">
                          {flight.arrivalAirportCode}
                        </span>
                      </Typography>
                      <Typography className="text-base font-light">
                        {dayjs(flight.arrivalTime).format("DD/MM/YY HH:mm")}
                      </Typography>
                    </Grid>
                  </Grid>
                  <Grid item container>
                    {Object.keys(CabinClass)
                      .filter((e) => /\d/.test(e))
                      .map((cabinClassId) => (
                        <Grid
                          item
                          container
                          xs={5}
                          alignContent="center"
                          key={cabinClassId}
                        >
                          <Box
                            style={{
                              backgroundColor: getCabinClassColor(
                                +cabinClassId
                              ),
                              width: "1rem",
                              height: "1rem",
                              borderRadius: "50%",
                              display: "inline-block",
                              marginRight: "0.5rem",
                            }}
                          ></Box>
                          <Typography className="text-base">
                            {getCabinClassLabel(+cabinClassId)}
                          </Typography>
                        </Grid>
                      ))}
                  </Grid>
                  <Grid item className="overflow-y-auto max-h-96 mx-auto md:mx-0">
                    {flightReservationStates &&
                      flightReservationStates.find(
                        (f) => f.flightId === flight.flightId
                      ) !== undefined && (
                        <ReserveSeatsForm
                          data={
                            flightReservationStates.find(
                              (f) => f.flightId === flight.flightId
                            )!.seatReservationState
                          }
                          nrRows={
                            flightReservationStates.find(
                              (f) => f.flightId === flight.flightId
                            )!.nrRows
                          }
                          nrColumns={
                            flightReservationStates.find(
                              (f) => f.flightId === flight.flightId
                            )!.nrColumns
                          }
                          flightId={flight.flightId}
                          ref={(el) => (itemsRef.current[index] = el!)}
                        />
                      )}
                  </Grid>
                </Grid>
                {index < routeData.flights.length - 1 && (
                  <Divider className="w-full my-4" />
                )}
              </React.Fragment>
            ))}
        </Grid>
        <Grid container item xs={12} md={5} alignContent="start">
          <Grid item xs={12}>
            <Button onClick={handleFinalizeSeatReservations}>
              Calculate Ticket Prices
            </Button>
          </Grid>
          <Grid item xs={12}>
            {routeData && seatReservationData.length > 0 ? (
              <List>
                <ListSubheader>Ticket Prices</ListSubheader>
                <Divider />
                {seatReservationData.map((d, index) => (
                  <ListItem key={index}>
                    <ListItemText
                      primary={`Flight #${index + 1}`}
                      secondary={`$${
                        routeData.prices[
                          getCabinClassPriceLabel(
                            d.selectedSeats[0].cabinClass as CabinClass
                          )
                        ]! * d.selectedSeats.length
                      }  =  $${routeData.prices[
                        getCabinClassPriceLabel(
                          d.selectedSeats[0].cabinClass as CabinClass
                        )
                      ]!} per seat (${getCabinClassLabel(
                        d.selectedSeats[0].cabinClass!
                      )}) x ${d.selectedSeats.length} seats`}
                    />
                  </ListItem>
                ))}
                <Divider />
                <ListSubheader className="text-lg font-medium my-4">
                  Total: $
                  {seatReservationData.reduce(
                    (acc, d) =>
                      acc +
                      routeData.prices[
                        getCabinClassPriceLabel(
                          d.selectedSeats[0].cabinClass as CabinClass
                        )
                      ]! *
                        d.selectedSeats.length,
                    0
                  )}
                </ListSubheader>
              </List>
            ) : (
              <Box></Box>
            )}
          </Grid>
          <Grid item xs={12}>
          <Button
              variant="contained"
              disabled={isSubmitting}
              type="submit"
              className="bg-background hover:bg-primary text-white w-full disabled:bg-gray-500"
              onClick={handleBook}
            >
              <Typography>Book</Typography>
              {isSubmitting ? (
                <CircularProgress className="text-white ml-5" size={15} />
              ) : null}
            </Button>
          </Grid>
        </Grid>
      </Grid>
      {!!snackbar && (
        <Snackbar
          open
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          onClose={handleCloseSnackbar}
          autoHideDuration={6000}
        >
          <Alert {...snackbar} onClose={handleCloseSnackbar} />
        </Snackbar>
      )}
    </Container>
  );
};

export default BookingPage;
