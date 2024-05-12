import { IndexedObject } from "./IndexedObject";

export interface Airplane extends IndexedObject {
    brand: string;
    model: string;
    nrRows: number;
    nrColumns: number;
    totalSeats: number;
}