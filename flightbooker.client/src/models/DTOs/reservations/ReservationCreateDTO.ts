export type ReservationCreateDTO = {
    clientId: string;
    routeId: number;
    flightSeats: {
        flightId: number;
        airplaneSeatIds: number[];
    }[]
};