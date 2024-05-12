import { ReservationSeatDataDTO } from "./ReservationDataDTO";

export type ReservationClientDataDTO = {
    id: number;
    reservationDate: Date;
    departureTime: Date;
    arrivalTime: Date;
    routeName: string;
    reservationSeatsData: ReservationSeatDataDTO[];
};