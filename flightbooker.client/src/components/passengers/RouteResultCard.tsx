import { Button, Box, Divider, Grid, Typography } from "@mui/material";
import { RouteResultDTO } from "../../models/DTOs/RouteResultDTO";
import dayjs from "dayjs";

type RouteResultCardProps = {
  route: RouteResultDTO;
  hasChosenCabinClass: boolean;
  onReserve: (routeId: number) => void;
};

const flightDurationString = (duration: string) => {
  const hours = Math.floor(+duration / 60);
  const minutes = +duration % 60;
  return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
};

const RouteResultCard = ({
  route,
  hasChosenCabinClass,
  onReserve,
}: RouteResultCardProps) => {
  return (
    <Box className="w-auto">
      <Grid
        container
        className="max-w-2xl shadow-md rounded-b-2xl rounded-lg md:rounded-b-lg text-center border border-gray-200 border-solid"
      >
        <Grid container item xs={12} md={8} className="p-4">
          {route.flights.map((flight, index) => (
            <Grid item container key={flight.id}>
              <Grid container className="my-2">
                <Grid item className="space-y-2 flex-shrink md:w-auto">
                  <Typography className="font-bold text-lg md:text-xl">
                    {flight.departureAirportCode}
                  </Typography>
                  <Typography className="text-gray-500 text-md">
                    {dayjs(flight.departureTime).format("DD/MM HH:mm")}
                  </Typography>
                </Grid>
                <Grid item className="flex-grow text-center mx-2 md:mx-5">
                  <Typography className="font-bold">
                    {flightDurationString(flight.duration)}
                  </Typography>
                  <div className="flex-grow border-t border-attention border-solid"></div>
                  {flight.delay > 0 && (
                    <Typography className="font-thin text-red-600">
                      {flight.delay} min. delay
                    </Typography>
                  )}
                </Grid>
                <Grid item className="space-y-2 flex-shrink md:w-auto">
                  <Typography className="font-bold sm:text-lg md:text-xl">
                    {flight.arrivalAirportCode}
                  </Typography>
                  <Typography className="text-gray-500 text-md">
                    {dayjs(flight.arrivalTime).format("DD/MM HH:mm")}
                  </Typography>
                </Grid>
                {route.flights.length > 1 &&
                  index < route.flights.length - 1 && (
                    <Divider className="w-full my-2" />
                  )}
              </Grid>
            </Grid>
          ))}
        </Grid>
        <Grid
          container
          item
          xs={12}
          md={4}
          direction="column"
          alignItems="center"
          justifyContent="center"
          className="border-solid border-t-2 border-x-0 border-b-0 border-background md:border-t-0 md:border-l-2 space-y-4 md:space-y-2 pt-4 md:py-4"
        >
          <Typography className="text-lg">
            {!hasChosenCabinClass && (
              <span className="font-medium">Starting at </span>
            )}
            <span className="underline underline-offset-4">
              ${route.pricePerSeat}
            </span>{" "}
            per seat
          </Typography>
          {route.availableSeats < 10 && (
            <Typography className="text-red-500 text-sm">
              Only {route.availableSeats} seats left!
            </Typography>
          )}
          <Button
            className="w-full md:w-auto bg-background hover:bg-primary py-2 px-4 text-white text-lg font-semibold capitalize rounded-b-2xl md:rounded-b-md"
            onClick={() => {
              onReserve(route.id);
            }}
          >
            Book
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default RouteResultCard;
