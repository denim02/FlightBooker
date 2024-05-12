import { UserData } from "../tables/UserData";

export interface AirlineOperatorData extends UserData {
    airlineId: number;
}