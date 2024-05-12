import { FlightResultDTO } from "./FlightResultDTO";

export type RouteResultDTO = {
    id: number;
    departureAirportCode: string;
    arrivalAirportCode: string;
    departureTime: Date;
    arrivalTime: Date;
    duration: string;
    pricePerSeat: number;
    airlineName: string;
    stops: number;
    availableSeats: number;
    flights: FlightResultDTO[];
};

