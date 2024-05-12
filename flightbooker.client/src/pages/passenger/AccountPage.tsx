import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../../hooks/use-auth";
import axiosInstance from "../../utils/axios";
import axios from "axios";
import dayjs from "dayjs";
import { ReservationClientDataDTO } from "../../models/DTOs/reservations/ReservationsClientDataDTO";
import {
  Card,
  CircularProgress,
  Container,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import { UserData } from "../../models/tables/UserData";
import React from "react";
import accountBackground from "../../assets/images/account-bg.jpg";

const getUserRoleLabel = (role: number) => {
  switch (role) {
    case 3:
      return "Admin";
    case 2:
      return "Airline Staff";
    case 1:
      return "Passenger";
    default:
      return "Unknown";
  }
};

const AccountPage = () => {
  const { user } = useAuth();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [reservationsData, setReservationsData] = useState<
    ReservationClientDataDTO[]
  >([]);
  const [isFetchingReservations, setIsFetchingReservations] = useState(false);

  const fetchUserData = useCallback(async () => {
    try {
      const response = await axiosInstance.get<UserData>(
        `/users/${user!.userId}`
      );

      setUserData(response.data);
    } catch (error) {
      if (axios.isAxiosError(error))
        console.error(error.response?.data || "An error occurred");

      console.error(error);
    }
  }, [user]);

  const fetchReservationsData = useCallback(async () => {
    try {
      setIsFetchingReservations(true);
      const response = await axiosInstance.get<ReservationClientDataDTO[]>(
        `/reservations/client/${user!.userId}`
      );

      setReservationsData(response.data);
    } catch (error) {
      if (axios.isAxiosError(error))
        throw new Error(error.response?.data || "An error occurred");

      throw error;
    } finally {
      setIsFetchingReservations(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchReservationsData();
    }
  }, [fetchReservationsData, user]);

  useEffect(() => {
    if (user) fetchUserData();
  }, [fetchUserData, user]);

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      className="py-10"
      sx={{
        backgroundImage: {
          xs: `url(${accountBackground})`,
        },
        backgroundSize: "cover",
      }}
    >
      <Card className="w-full md:w-4/5 p-10">
        <Typography variant="h4" className="font-light">
          Account Details
        </Typography>
        {userData && (
          <Grid
            container
            justifyContent="center"
            alignItems="center"
            className="text-background my-10"
          >
            <Grid item container xs={12} md={6} className="gap-x-4">
              <Grid item>
                <Typography className="font-semibold">Name:</Typography>
                <Typography className="font-semibold">Email:</Typography>
              </Grid>
              <Grid item>
                <Typography>
                  {userData.firstName + " " + userData.lastName}
                </Typography>
                <Typography>{userData.email}</Typography>
              </Grid>
            </Grid>
            <Grid item container xs={12} md={6} className="gap-x-4">
              <Grid>
                <Typography className="font-semibold">Phone Number:</Typography>
                <Typography className="font-semibold">Role:</Typography>
              </Grid>
              <Grid>
                <Typography>{userData.phoneNumber}</Typography>
                <Typography>{getUserRoleLabel(userData.role)}</Typography>
              </Grid>
            </Grid>
          </Grid>
        )}
        <Divider className="my-6 border-2 border-background" />
        <Typography variant="h4" className="font-light mb-6">
          Reservations
        </Typography>
        {isFetchingReservations ? (
          <Container className="w-full h-full">
            <CircularProgress />
          </Container>
        ) : reservationsData.length === 0 ? (
          <Typography>No reservations found.</Typography>
        ) : (
          <List>
            {reservationsData.map((reservation, index) => (
              <React.Fragment key={reservation.id}>
                <ListItem className="flex justify-between items-center flex-wrap md:flex-nowrap my-4">
                  <ListItemText
                    className="md:w-2/12 !text-xl !text-background !font-medium"
                    primary={`Reservation #${reservation.id}`}
                  />
                  <ListItemText
                    className="md:w-3/12"
                    primary={reservation.routeName}
                    secondary={
                      dayjs(reservation.departureTime).format(
                        "DD/MM/YYYY HH:mm"
                      ) +
                      " - " +
                      dayjs(reservation.arrivalTime).format("DD/MM/YYYY HH:mm")
                    }
                  />
                  <ListItemText
                    className="md:w-3/12"
                    primary="Reserved Seats"
                    secondary={reservation.reservationSeatsData
                      .map(
                        (seatData) =>
                          `Flight ${seatData.flightId} / ` +
                          seatData.reservedSeats.join(", ")
                      )
                      .join(" | ")}
                  />
                  <ListItemText
                    className="md:w-3/12"
                    primary="Reservation Date"
                    secondary={dayjs(reservation.reservationDate).format(
                      "DD/MM/YYYY HH:mm"
                    )}
                  />
                </ListItem>
                {index < reservationsData.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        )}
      </Card>
    </Grid>
  );
};

export default AccountPage;
