import { IndexedObject } from "./IndexedObject";

export interface Airline extends IndexedObject {
    airlineName: string;
    phoneNumber: string;
    emailAddress: string;
    country: string;
}