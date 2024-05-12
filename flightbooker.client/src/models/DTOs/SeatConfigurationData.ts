import { CabinClass } from "../CabinClass";

export interface RowSeatClassMapping {
    rows: number[];
    seatClass: CabinClass;
}

export interface SeatConfigurationData {
    airplaneId: number | undefined;
    nrRows: number;
    nrColumns: number;
    rowSeatClassMappings: RowSeatClassMapping[]
}