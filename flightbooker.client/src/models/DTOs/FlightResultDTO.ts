export type FlightResultDTO = {
    id: number;
    departureAirportCode: string;
    arrivalAirportCode: string;
    departureTime: Date;
    arrivalTime: Date;
    duration: string;
    delay: number;
};