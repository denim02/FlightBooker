export type RouteBookingDataDTO = {
    id: number;
    airlineName: string;
    departureAirportCode: string;
    arrivalAirportCode: string;
    departureTime: Date;
    arrivalTime: Date;
    flights: FlightBookingDataDTO[];
    prices: {
        economy: number;
        premiumEconomy: number;
        business: number;
        firstClass: number;
    };
};

export type FlightBookingDataDTO = {
    flightId: number;
    airplaneId: number;
    departureAirportCode: string;
    arrivalAirportCode: string;
    departureTime: Date;
    arrivalTime: Date;
    duration: number;
    delay: number;
    seats: FlightSeatDataDTO[];
};

type FlightSeatDataDTO = {
    flightSeatId: number;
    airplaneSeatId: number;
    isReserved: boolean;
}