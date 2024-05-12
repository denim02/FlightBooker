import { IndexedObject } from "./IndexedObject";

export interface FlightRoute extends IndexedObject {
    airlineId: number;
    isTransit: boolean;
    repeating: boolean;
    frequency: string | null;
    departureAirportCode: string;
    arrivalAirportCode: string;
    departureTime: Date;
    arrivalTime: Date;
    hasReservations: boolean;
    flightCount: number;
    prices: {
        economy: number;
        premiumEconomy: number;
        business: number;
        firstClass: number;
    }
    routeGroupId: number;
}