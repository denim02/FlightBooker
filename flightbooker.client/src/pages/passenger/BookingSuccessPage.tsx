import { Grid, Typography } from "@mui/material";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const BookingSuccessPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!state.reservationId) {
      navigate("/404", { replace: true });
    }
  }, [state, navigate]);

  return (
    <Grid
      container
      alignItems="center"
      justifyContent="center"
      className="h-screen"
    >
      <Grid item className="space-y-10 w-72 md:w-[500px]">
        <Typography
          variant="h4"
          className="text-background text-center font-light"
        >
          Your booking was successful!
        </Typography>
        <Typography>
          The reservation ID/reference for your booking is{" "}
          <span className="underline underline-offset-4">
            {state?.reservationId}
          </span>
          .
        </Typography>
        <Typography>
          Additionally, an confirmation message has been sent to your email
          address.
        </Typography>
        You may review your booking details in the "My Reservations" section of
        the User Account page. Thank you for your using FlightBooker and we wish
        you a pleasant journey!
      </Grid>
    </Grid>
  );
};

export default BookingSuccessPage;
