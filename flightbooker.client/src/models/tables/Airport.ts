import { IndexedObject } from "./IndexedObject";

export interface Airport extends IndexedObject {
    id: string;
    airportName: string;
    country: string;
    city: string;
}