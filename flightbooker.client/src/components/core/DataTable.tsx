import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import {
  DataGrid,
  GridColDef,
  GridActionsCellItem,
  GridRowParams,
  GridRowModel,
  GridActionsColDef,
} from "@mui/x-data-grid";
import Snackbar from "@mui/material/Snackbar";
import Alert, { AlertProps } from "@mui/material/Alert";
import axiosInstance from "../../utils/axios";
import DeleteIcon from "@mui/icons-material/Delete";
import { IndexedObject } from "../../models/tables/IndexedObject";
import axios from "axios";
import { Box } from "@mui/material";

interface DataTableProps<T> {
  apiUrl: string;
  columns: GridColDef[];
  onPopulateTable?: () => Promise<T[]>;
  hasDeleteRowOption?: boolean;
  onEditEntry?: (newValue: GridRowModel) => void;
  onDeleteRow?: (row: T) => void;
}

const DataTable = <T extends IndexedObject>({
  apiUrl,
  columns,
  onPopulateTable,
  hasDeleteRowOption,
  onEditEntry,
  onDeleteRow,
}: DataTableProps<T>) => {
  const [entries, setEntries] = useState<T[]>([]);
  const columnRules = useRef<GridColDef[]>(columns);

  if (hasDeleteRowOption) {
    // Check if columns already have an actions column
    const actionsColumn = columns.find(
      (column) => column.field === "actions"
    ) as GridActionsColDef;
    if (actionsColumn === undefined)
      columnRules.current = [
        ...columns,
        {
          field: "actions",
          headerName: "Actions",
          type: "actions",
          getActions: (params: GridRowParams) => [
            <GridActionsCellItem
              icon={<DeleteIcon />}
              onClick={() => handleDeleteRow(params.row as T)}
              label="Delete"
            />,
          ],
        },
      ];
    else {
      columnRules.current = [
        ...columns.filter((column) => column.field !== "actions"),
        {
          field: "actions",
          headerName: "Actions",
          type: "actions",
          getActions: (params: GridRowParams) => [
            ...actionsColumn.getActions(params),
            <GridActionsCellItem
              icon={<DeleteIcon />}
              onClick={() => handleDeleteRow(params.row as T)}
              label="Delete"
            />,
          ],
        },
      ];
    }
  }

  const [snackbar, setSnackbar] = useState<Pick<
    AlertProps,
    "children" | "severity"
  > | null>(null);
  const handleCloseSnackbar = () => setSnackbar(null);

  // Fetch data from the backend
  useEffect(() => {
    if (onPopulateTable === undefined) {
      axiosInstance
        .get<T[]>(apiUrl)
        .then((response) => {
          setEntries(response.data);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    } else {
      onPopulateTable()!
        .then((response) => {
          setEntries(response);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }
  }, [apiUrl, onPopulateTable]);

  const processRowUpdate = useCallback(
    async (newRow: GridRowModel) => {
      // Make the HTTP request to save in the backend
      const response =
        onEditEntry === undefined ? null : await onEditEntry(newRow);
      setSnackbar({
        children: "Entry successfully changed!",
        severity: "success",
      });
      return response;
    },
    [onEditEntry]
  );

  const handleProcessRowUpdateError = useCallback((error: Error) => {
    console.error(error);
    setSnackbar({ children: error.message, severity: "error" });
  }, []);

  const deleteRowCallback = useCallback(
    async (row: T) => {
      try {
        await axiosInstance.delete(apiUrl + `/${row.id}`);
        // Remove entry from state
        setEntries((prevEntries) => {
          return prevEntries.filter((entry) => entry.id !== row.id);
        });

        setSnackbar({
          children: "Entry deleted successfully!",
          severity: "success",
        });
      } catch (error) {
        if (axios.isAxiosError(error)) {
          setSnackbar({
            children: JSON.stringify(error.response?.data) || "An error occurred",
            severity: "error",
          });
        }
        else if (error instanceof Error)
          setSnackbar({ children: error.message, severity: "error" });
      }
    },
    [apiUrl]
  );

  const handleDeleteRow = useMemo(() => {
    return onDeleteRow ? onDeleteRow : deleteRowCallback;
  }, [deleteRowCallback, onDeleteRow]);

  return (
    <Box className="w-full h-[400px] max-h-[700px]">
      <DataGrid
        rows={entries}
        columns={columnRules.current!}
        autoPageSize
        pageSizeOptions={[5, 10, 25]}
        processRowUpdate={processRowUpdate}
        onProcessRowUpdateError={handleProcessRowUpdateError}
      />
      {!!snackbar && (
        <Snackbar
          open
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          onClose={handleCloseSnackbar}
          autoHideDuration={6000}
        >
          <Alert {...snackbar} onClose={handleCloseSnackbar} />
        </Snackbar>
      )}
    </Box>
  );
};

export default DataTable;
