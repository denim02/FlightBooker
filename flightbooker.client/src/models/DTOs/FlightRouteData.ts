export type FlightData = {
    departureAirportCode: string;
    arrivalAirportCode: string;
    departureTime: Date;
    arrivalTime: Date;
    airplaneModelId: number;
}

export type FlightRouteData = {
    isTransit: boolean;
    repeating: boolean;
    frequency: string;
    flights: FlightData[];
    prices: {
        economy: number;
        premiumEconomy: number;
        business: number;
        firstClass: number;
    };
}