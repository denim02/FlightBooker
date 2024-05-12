export type ReservationDataDTO = {
    id: number;
    clientId: string;
    routeId: number;
    reservationDate: Date;
    reservationSeatsData: ReservationSeatDataDTO[];
};

export type ReservationSeatDataDTO = {
    flightId: number;
    airplaneId: number;
    reservedSeats: string[];
}