import { useCallback, useEffect, useMemo, useState } from "react";
import { Complaint } from "../../../models/tables/Complaint";
import axiosInstance from "../../../utils/axios";
import axios from "axios";
import DataTable from "../../../components/core/DataTable";
import {
  GridColDef,
  GridRowParams,
  GridActionsCellItem,
} from "@mui/x-data-grid";
import EditNoteIcon from "@mui/icons-material/EditNote";
import RespondToComplaintModal from "../../../components/admin/RespondToComplaintModal";
import { Container } from "@mui/material";

const ComplaintsTab = () => {
  const [complaintData, setComplaintData] = useState<Complaint[]>([]);
  const [isRespondToComplaintModalOpen, setIsRespondToComplaintModalOpen] =
    useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(
    null
  );

  const fetchComplaintsData = useCallback(async () => {
    try {
      const response = await axiosInstance.get<Complaint[]>("/complaints");

      setComplaintData(
        response.data.map(
          (e) =>
            ({
              ...e,
              dateIssued: new Date(e.dateIssued),
              dateResolved:
                e.dateResolved != null ? new Date(e.dateResolved) : null,
            } as Complaint)
        )
      );
    } catch (error) {
      if (axios.isAxiosError(error))
        throw new Error(error.response?.data || "An error occurred");

      throw error;
    }
  }, []);

  useEffect(() => {
    if (isRespondToComplaintModalOpen === false) {
      fetchComplaintsData();
    }
  }, [fetchComplaintsData, isRespondToComplaintModalOpen]);

  const populateComplaintsTable = useCallback(async () => {
    return complaintData;
  }, [complaintData]);

  const handleRespondToComplaintAction = useCallback(
    async (params: GridRowParams) => {
      setSelectedComplaint(params.row);
      setIsRespondToComplaintModalOpen(true);
    },
    []
  );

  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: "id",
        headerName: "Id",
        align: "center",
        headerAlign: "center",
        flex: 0.1,
      },
      {
        field: "userId",
        headerName: "Complainant Id",
        align: "left",
        headerAlign: "left",
        flex: 0.2,
      },
      {
        field: "description",
        headerName: "Description",
        align: "left",
        headerAlign: "left",
        flex: 0.7,
      },
      {
        field: "assignedAdminName",
        headerName: "Assigned Admin",
        align: "left",
        headerAlign: "left",
        flex: 0.2,
      },
      {
        field: "dateIssued",
        headerName: "Date Issued",
        type: "dateTime",
        align: "left",
        headerAlign: "left",
        flex: 0.4,
      },
      {
        field: "isResolved",
        headerName: "Resolved?",
        align: "left",
        headerAlign: "left",
        flex: 0.2,
      },
      {
        field: "dateResolved",
        headerName: "Date Resolved",
        type: "dateTime",
        align: "left",
        headerAlign: "left",
        flex: 0.4,
      },
      {
        field: "actions",
        headerName: "Actions",
        type: "actions",
        getActions: (params: GridRowParams) => [
          <GridActionsCellItem
            icon={<EditNoteIcon />}
            onClick={() => {
              handleRespondToComplaintAction(params);
            }}
            label="Respond to Complaint"
          />,
        ],
      },
    ],
    [handleRespondToComplaintAction]
  );

  return (
    <Container className="mt-20 w-full px-0">
      <h1>Complaints</h1>
      <DataTable<Complaint>
        apiUrl="/complaints"
        columns={columns}
        hasDeleteRowOption={true}
        onPopulateTable={populateComplaintsTable}
      />
      {selectedComplaint && (
        <RespondToComplaintModal
          open={isRespondToComplaintModalOpen}
          onClose={() => setIsRespondToComplaintModalOpen(false)}
          selectedComplaint={selectedComplaint}
        />
      )}
    </Container>
  );
};

export default ComplaintsTab;
