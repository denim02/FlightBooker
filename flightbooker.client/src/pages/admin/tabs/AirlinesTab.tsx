import { useCallback, useEffect, useMemo, useState } from "react";
import { Airline } from "../../../models/tables/Airline";
import axiosInstance from "../../../utils/axios";
import axios from "axios";
import DataTable from "../../../components/core/DataTable";
import {
  GridColDef,
  GridRowParams,
  GridActionsCellItem,
} from "@mui/x-data-grid";
import { Button, Container, Grid } from "@mui/material";
import AddAirlineModal from "../../../components/admin/AddAirlineModal";
import PersonIcon from "@mui/icons-material/Person";
import { AirlineOperatorData } from "../../../models/DTOs/AirlineOperatorData";
import EditAirlineOperatorsModal from "../../../components/admin/EditAirlineOperatorsModal";

const AirlinesTab = () => {
  const [airlineData, setAirlineData] = useState<Airline[]>([]);
  const [operators, setOperators] = useState<AirlineOperatorData[]>([]);
  const [isAddAirlineModalOpen, setIsAddAirlineModalOpen] = useState(false);
  const [isEditAirlineOpsModalOpen, setIsEditAirlineOpsModalOpen] =
    useState(false);
  const [selectedAirlineId, setSelectedAirlineId] = useState<number | null>(
    null
  );

  const fetchAirlinesData = useCallback(async () => {
    try {
      const response = await axiosInstance.get<Airline[]>("/airlines");

      setAirlineData(response.data);
    } catch (error) {
      if (axios.isAxiosError(error))
        throw new Error(error.response?.data || "An error occurred");

      throw error;
    }
  }, []);

  const fetchOperators = useCallback(async () => {
    try {
      const response = await axiosInstance.get<AirlineOperatorData[]>(
        "/airlines/operators"
      );
      setOperators(response.data);
    } catch (error) {
      console.error("Error fetching operators:", error);
    }
  }, []);

  useEffect(() => {
    if (isAddAirlineModalOpen === false) {
      fetchAirlinesData();
      fetchOperators();
    }
  }, [fetchAirlinesData, isAddAirlineModalOpen, fetchOperators]);

  useEffect(() => {
    if (isEditAirlineOpsModalOpen === false) {
      fetchOperators();
    }
  }, [fetchOperators, isEditAirlineOpsModalOpen]);

  const populateAirlinesTable = useCallback(async () => {
    return airlineData;
  }, [airlineData]);

  const handleAirlineEdit = useCallback(async (airline: Partial<Airline>) => {
    try {
      const response = await axiosInstance.put<Airline>(
        `/airlines/${airline.id}`,
        airline
      );

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error))
        throw new Error(error.response?.data || "An error occurred");

      throw error;
    }
  }, []);

  const handleAirlineOperatorEdit = useCallback(
    async (params: GridRowParams) => {
      setSelectedAirlineId(+params.row.id);
      setIsEditAirlineOpsModalOpen(true);
    },
    []
  );

  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: "id",
        headerName: "Airline Id",
        align: "left",
        headerAlign: "left",
        flex: 0.2,
      },
      {
        field: "airlineName",
        headerName: "Airline Name",
        align: "left",
        headerAlign: "left",
        editable: true,
        flex: 0.3,
      },
      {
        field: "phoneNumber",
        headerName: "Phone Number",
        align: "left",
        headerAlign: "left",
        editable: true,
        flex: 0.3,
      },
      {
        field: "emailAddress",
        headerName: "Email Address",
        align: "left",
        headerAlign: "left",
        editable: true,
        flex: 0.3,
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
        field: "actions",
        headerName: "Actions",
        type: "actions",
        getActions: (params: GridRowParams) => [
          <GridActionsCellItem
            icon={<PersonIcon />}
            onClick={() => {
              handleAirlineOperatorEdit(params);
            }}
            label="Modify airline operators"
          />,
        ],
      },
    ],
    [handleAirlineOperatorEdit]
  );

  return (
    <Container className="mt-20 w-full px-0">
      <Grid container justifyContent="space-between" alignItems="center">
        <h1>Airlines</h1>
        <Button
          variant="contained"
          className="h-12"
          onClick={() => setIsAddAirlineModalOpen(true)}
        >
          Add Airline
        </Button>
      </Grid>
      <DataTable<Airline>
        apiUrl="/airlines"
        columns={columns}
        hasDeleteRowOption={true}
        onPopulateTable={populateAirlinesTable}
        onEditEntry={handleAirlineEdit}
      />
      <AddAirlineModal
        open={isAddAirlineModalOpen}
        onClose={() => setIsAddAirlineModalOpen(false)}
        operators={operators}
      />
      {operators && selectedAirlineId && (
        <EditAirlineOperatorsModal
          open={isEditAirlineOpsModalOpen}
          onClose={() => setIsEditAirlineOpsModalOpen(false)}
          operators={operators}
          airlineId={selectedAirlineId!}
        />
      )}
    </Container>
  );
};
export default AirlinesTab;
