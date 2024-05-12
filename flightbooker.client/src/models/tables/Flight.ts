import { IndexedObject } from "./IndexedObject";

export interface Flight extends IndexedObject {
    departureAirportCode: string;
    arrivalAirportCode: string;
    departureTime: Date;
    arrivalTime: Date;
    duration: number;
    delay: number;
    airplaneName: string;
    routeId: number;
}