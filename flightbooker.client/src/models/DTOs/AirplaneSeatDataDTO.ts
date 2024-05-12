import { CabinClass } from "../CabinClass";
import { RowSeatClassMapping } from "./SeatConfigurationData";

export type AirplaneSeatDataDTO = {
  nrRows: number;
  nrColumns: number;
  seats: IndividualSeatDataDTO[];
  cabinClassMappings: RowSeatClassMapping[];
}

type IndividualSeatDataDTO = {
  id: number;
  row: number;
  column: string;
  cabinClass: CabinClass
};


