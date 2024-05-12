import { useCallback, useEffect, useState } from "react";
import { Airport } from "../../../models/tables/Airport";
import axiosInstance from "../../../utils/axios";
import axios from "axios";
import DataTable from "../../../components/core/DataTable";
import { GridColDef } from "@mui/x-data-grid";
import { AirportServerData } from "../../../models/DTOs/AirportServerData";
import { Button, Container, Grid } from "@mui/material";
import AddAirportModal from "../../../components/admin/AddAirportModal";

const AirportsTab = () => {
  const [airportData, setAirportData] = useState<Airport[]>([]);
  const [isAddAirportModalOpen, setIsAddAirportModalOpen] = useState(false);

  const fetchAirportsData = useCallback(async () => {
    try {
      const response = await axiosInstance.get<AirportServerData[]>(
        "/airports"
      );

      setAirportData(
        response.data.map((e) => ({
          id: e.airportCode,
          airportName: e.airportName,
          country: e.country,
          city: e.city,
        })) as Airport[]
      );
    } catch (error) {
      if (axios.isAxiosError(error))
        throw new Error(error.response?.data || "An error occurred");

      throw error;
    }
  }, []);

  useEffect(() => {
    if (isAddAirportModalOpen === false) {
      fetchAirportsData();
    }
  }, [fetchAirportsData, isAddAirportModalOpen]);

  const populateAirportsTable = useCallback(async () => {
    return airportData;
  }, [airportData]);

  const handleAirportEdit = useCallback(async (airport: Partial<Airport>) => {
    try {
      const response = await axiosInstance.put<AirportServerData>(
        `/airports/${airport.id}`,
        {
          airportCode: airport.id,
          airportName: airport.airportName,
          country: airport.country,
          city: airport.city,
        }
      );

      return {
        id: response.data.airportCode,
        airportName: response.data.airportName,
        country: response.data.country,
        city: response.data.city,
      } as Airport;
    } catch (error) {
      if (axios.isAxiosError(error))
        throw new Error(error.response?.data || "An error occurred");

      throw error;
    }
  }, []);

  return (
    <Container className="mt-20 w-full px-0">
      <Grid container justifyContent="space-between" alignItems="center">
        <h1>Airports</h1>
        <Button
          variant="contained"
          className="h-12"
          onClick={() => setIsAddAirportModalOpen(true)}
        >
          Add Airport
        </Button>
      </Grid>
      <DataTable<Airport>
        apiUrl="/airports"
        columns={columns}
        hasDeleteRowOption={true}
        onPopulateTable={populateAirportsTable}
        onEditEntry={handleAirportEdit}
      />
      <AddAirportModal
        open={isAddAirportModalOpen}
        onClose={() => setIsAddAirportModalOpen(false)}
      />
    </Container>
  );
};

const columns: GridColDef[] = [
  {
    field: "id",
    headerName: "Airport Code",
    align: "left",
    headerAlign: "left",
    flex: 0.2,
  },
  {
    field: "airportName",
    headerName: "Airport Name",
    align: "left",
    headerAlign: "left",
    editable: true,
    flex: 0.4,
  },
  {
    field: "country",
    headerName: "Country",
    align: "left",
    headerAlign: "left",
    editable: true,
    flex: 0.3,
  },
  {
    field: "city",
    headerName: "City",
    align: "left",
    headerAlign: "left",
    editable: true,
    flex: 0.3,
  },
];

export default AirportsTab;
