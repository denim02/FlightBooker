import {
  GridColDef,
  GridRowParams,
  GridActionsCellItem,
} from "@mui/x-data-grid";
import DataTable from "../../../components/core/DataTable";
import { useCallback, useEffect, useMemo, useState } from "react";
import axiosInstance from "../../../utils/axios";
import axios from "axios";
import { Airplane } from "../../../models/tables/Airplane";
import FlightClassIcon from "@mui/icons-material/FlightClass";
import {
  RowSeatClassMapping,
  SeatConfigurationData,
} from "../../../models/DTOs/SeatConfigurationData";
import SeatModificationModal from "../../../components/admin/SeatModificationModal";
import { Button, Container, Grid } from "@mui/material";
import AddPlaneModal from "../../../components/admin/AddPlaneModal";

const AirplanesTab = () => {
  const [isSeatModalOpen, setIsSeatModalOpen] = useState(false);
  const [isAddPlaneModalOpen, setIsAddPlaneModalOpen] = useState(false);
  const [seatModalData, setSeatModalData] =
    useState<SeatConfigurationData | null>(null);
  const [airplaneData, setAirplaneData] = useState<Airplane[]>([]);

  const fetchAirplaneData = useCallback(async () => {
    try {
      const response = await axiosInstance.get<Airplane[]>("/airplanes");
      setAirplaneData(response.data);
    } catch (error) {
      if (axios.isAxiosError(error))
        console.error(error.response?.data || "An error occurred");
      console.error(error);
    }
  }, []);

  useEffect(() => {
    if (isAddPlaneModalOpen === false) {
      fetchAirplaneData();
    }
  }, [fetchAirplaneData, isAddPlaneModalOpen]);

  const populateAirplaneTable = useCallback(async () => {
    return airplaneData;
  }, [airplaneData]);

  const handleAirplaneEdit = useCallback(
    async (airplane: Partial<Airplane>) => {
      try {
        
        const response = await axiosInstance.put(
          `/airplanes/${airplane.id}`,
          {
            airplaneId: airplane.id,
            airplaneBrand: airplane.brand,
            airplaneModel: airplane.model,
            nrRows: airplane.nrRows,
            nrColumns: airplane.nrColumns,
          }
        );

        return response.data;
      } catch (error) {
        if (axios.isAxiosError(error))
          throw new Error(error.response?.data || "An error occurred");

        throw error;
      }
    },
    []
  );

  const handleModifySeatsAction = useCallback(
    async (params: GridRowParams) => {
      try {
        const response = await axiosInstance.get<RowSeatClassMapping[]>(
          `/airplanes/${params.id}/seat-configuration`
        );

        setSeatModalData({
          airplaneId: params.id as number,
          nrRows: params.row.nrRows,
          nrColumns: params.row.nrColumns,
          rowSeatClassMappings: response.data,
        });

        setIsSeatModalOpen(true);
      } catch (error) {
        if (axios.isAxiosError(error))
          throw new Error(error.response?.data || "An error occurred");
        throw error;
      }
    },
    [setIsSeatModalOpen]
  );

  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: "id",
        headerName: "Plane Id",
        align: "left",
        headerAlign: "left",
        flex: 0.1,
      },
      {
        field: "brand",
        headerName: "Brand",
        align: "left",
        headerAlign: "left",
        editable: true,
        flex: 0.3,
      },
      {
        field: "model",
        headerName: "Model",
        align: "left",
        headerAlign: "left",
        editable: true,
        flex: 0.4,
      },
      {
        field: "totalSeats",
        headerName: "Total Capacity",
        align: "left",
        headerAlign: "left",
        flex: 0.2,
      },
      {
        field: "actions",
        headerName: "Actions",
        type: "actions",
        getActions: (params: GridRowParams) => [
          <GridActionsCellItem
            icon={<FlightClassIcon />}
            onClick={() => {
              handleModifySeatsAction(params);
            }}
            label="Modify seats"
          />,
        ],
      },
    ],
    [handleModifySeatsAction]
  );

  return (
    <Container className="mt-20 w-full px-0">
      <Grid container justifyContent="space-between" alignItems="center">
        <h1>Planes</h1>
        <Button
          variant="contained"
          className="h-12"
          onClick={() => setIsAddPlaneModalOpen(true)}
        >
          Add Airplane
        </Button>
      </Grid>
      <DataTable<Airplane>
        apiUrl="/airplanes"
        columns={columns}
        hasDeleteRowOption={true}
        onPopulateTable={populateAirplaneTable}
        onEditEntry={handleAirplaneEdit}
      />
      <AddPlaneModal
        open={isAddPlaneModalOpen}
        onClose={() => setIsAddPlaneModalOpen(false)}
      />
      {seatModalData && (
        <SeatModificationModal
          open={isSeatModalOpen}
          onClose={() => setIsSeatModalOpen(false)}
          data={seatModalData!}
        />
      )}
    </Container>
  );
};

export default AirplanesTab;
