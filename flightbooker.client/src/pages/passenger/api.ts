import { AirportServerData } from "../../models/DTOs/AirportServerData";
import axiosInstance from "../../utils/axios";

export const fetchAirports = async () => {
  try {
    const response = await axiosInstance.get<AirportServerData[]>("/airports");
    const data = response.data.map((airport) => ({
      id: airport.airportCode,
      label: `${airport.city}, ${airport.country} (${airport.airportCode})`,
    }));
    return data;
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
};
