import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useReducer,
} from "react";
import {
  RowSeatClassMapping,
  SeatConfigurationData,
} from "../../models/DTOs/SeatConfigurationData";
import { Alert, Button, Container, Divider, Grid, Snackbar } from "@mui/material";
import SeatingChart from "../core/SeatingChart";
import { CabinClass, getCabinClassColor, getCabinClassLabel } from "../../models/CabinClass";

interface SeatConfigurationState {
  selectedCabinClass: CabinClass | null;
  selectedRows: number[];
  allMappings: RowSeatClassMapping[];
  snackbar: { children: string; severity: "success" | "error" } | null;
}

const INITIAL_STATE: SeatConfigurationState = {
  selectedCabinClass: null,
  selectedRows: [],
  allMappings: [],
  snackbar: null,
};

enum ModalActionType {
  SET_CABIN_CLASS = "SET_CABIN_CLASS",
  TOGGLE_ROW = "TOGGLE_ROW",
  CLEAR_SELECTED_ROWS = "CLEAR_SELECTED_ROWS",
  ADD_MAPPING = "ADD_MAPPING",
  SET_ALL_MAPPINGS = "SET_ALL_MAPPINGS",
  CLEAR_STATE = "CLEAR_STATE",
  SHOW_SNACKBAR = "SHOW_SNACKBAR",
  CLOSE_SNACKBAR = "CLOSE_SNACKBAR",
}

interface ModalAction {
  type: ModalActionType;
  payload:
    | CabinClass
    | number
    | RowSeatClassMapping
    | null
    | RowSeatClassMapping[]
    | { children: string; severity: "success" | "error" }
    | null;
}

const reducer = (state: SeatConfigurationState, action: ModalAction) => {
  switch (action.type) {
    case ModalActionType.SET_CABIN_CLASS: {
      const selectedRows =
        state.allMappings.find((e) => e.seatClass === action.payload)?.rows ||
        [];
      return {
        ...state,
        selectedCabinClass: action.payload as CabinClass,
        selectedRows,
      };
    }
    case ModalActionType.TOGGLE_ROW: {
      const row = action.payload as number;
      const selectedRows = state.selectedRows.includes(row)
        ? state.selectedRows.filter((r) => r !== row)
        : [...state.selectedRows, row];
      return { ...state, selectedRows };
    }
    case ModalActionType.CLEAR_SELECTED_ROWS:
      return { ...state, selectedRows: [], selectedCabinClass: null };
    case ModalActionType.ADD_MAPPING: {
      const seatClass = state.selectedCabinClass!;
      const rows = state.selectedRows;
      const newMapping = { seatClass, rows } as RowSeatClassMapping;
      let updatedMappings: RowSeatClassMapping[];

      // Check if rows of this mapping overlap with any existing mappings (other than self)
      const overlappingMappings = state.allMappings.filter((mapping) => {
        return (
          mapping.rows.some((row) => rows.includes(row)) &&
          mapping.seatClass !== seatClass
        );
      });

      if (overlappingMappings.length > 0) {
        updatedMappings = state.allMappings.filter(
          (mapping) => mapping.seatClass !== seatClass
        );
        updatedMappings.push(newMapping);

        // Go over the overlapping mappings and remove overlapping rows from them
        overlappingMappings.forEach((overlappingMapping) => {
          const updatedRows = overlappingMapping.rows.filter(
            (row) => !rows.includes(row)
          );

          // Remove old mappings from the list
          updatedMappings = updatedMappings.filter(
            (mapping) => mapping.seatClass !== overlappingMapping.seatClass
          );

          if (updatedRows.length > 0) {
            updatedMappings.push({
              rows: updatedRows,
              seatClass: overlappingMapping.seatClass,
            } as RowSeatClassMapping);
          }
        });
      } else {
        const existingMappingIndex = state.allMappings.findIndex(
          (mapping) => mapping.seatClass === seatClass
        );
        updatedMappings =
          existingMappingIndex !== -1
            ? state.allMappings.map((mapping, index) =>
                index === existingMappingIndex ? newMapping : mapping
              )
            : [...state.allMappings, newMapping];
      }

      return {
        ...state,
        allMappings: updatedMappings,
        selectedRows: [],
        selectedCabinClass: null,
        snackbar: {
          children: "Mapping added successfully.",
          severity: "success",
        } as { children: string; severity: "success" | "error" },
      };
    }
    case ModalActionType.SET_ALL_MAPPINGS:
      return { ...state, allMappings: action.payload as RowSeatClassMapping[] };
    case ModalActionType.CLEAR_STATE:
      return INITIAL_STATE;
    case ModalActionType.SHOW_SNACKBAR:
      return {
        ...state,
        snackbar: action.payload as {
          children: string;
          severity: "success" | "error";
        },
      };
    case ModalActionType.CLOSE_SNACKBAR:
      return { ...state, snackbar: null };
    default:
      return state;
  }
};

interface SeatConfigurationFormProps {
  data: SeatConfigurationData;
  onTouch?: () => void | undefined;
}

export type SeatConfigurationFormHandle = {
  isValid: () => boolean;
  getSeatConfiguration: () => RowSeatClassMapping[];
  displayError: (message: string) => void;
  clearState: () => void;
};

const SeatConfigurationForm = forwardRef<
  SeatConfigurationFormHandle,
  SeatConfigurationFormProps
>(({ data, onTouch }, ref) => {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
  const { selectedCabinClass, selectedRows, allMappings, snackbar } = state;

  useImperativeHandle(
    ref,
    () => {
      return {
        isValid() {
          const numberOfFilledRows = allMappings.flatMap(
            (mapping) => mapping.rows
          ).length;
          return numberOfFilledRows === data.nrRows;
        },
        getSeatConfiguration() {
          return allMappings;
        },
        displayError(message: string) {
          dispatch({
            type: ModalActionType.SHOW_SNACKBAR,
            payload: { children: message, severity: "error" },
          });
        },
        clearState() {
          dispatch({ type: ModalActionType.CLEAR_STATE, payload: null });
        },
      };
    },
    [allMappings, data.nrRows]
  );

  useEffect(() => {
    dispatch({
      type: ModalActionType.SET_ALL_MAPPINGS,
      payload: data.rowSeatClassMappings,
    });
  }, [data.rowSeatClassMappings]);

  const handleCloseSnackbar = () =>
    dispatch({ type: ModalActionType.CLOSE_SNACKBAR, payload: null });

  const handleCabinClassSelect = (cabinClass: CabinClass) => {
    if (selectedRows.length > 0) {
      dispatch({
        type: ModalActionType.SHOW_SNACKBAR,
        payload: {
          children:
            "You must finish with one cabin class before editing another!",
          severity: "error",
        },
      });
    } else {
      dispatch({ type: ModalActionType.SET_CABIN_CLASS, payload: cabinClass });
    }
  };

  const handleRowClick = (row: number) => {
    if (onTouch !== undefined) onTouch();
    if (!selectedCabinClass) {
      dispatch({
        type: ModalActionType.SHOW_SNACKBAR,
        payload: {
          children: "You must first select a cabin class.",
          severity: "error",
        },
      });
    } else {
      dispatch({ type: ModalActionType.TOGGLE_ROW, payload: row });
    }
  };

  const handleAddMapping = () => {
    if (onTouch !== undefined) onTouch();
    if (!selectedCabinClass) {
      dispatch({
        type: ModalActionType.SHOW_SNACKBAR,
        payload: {
          children: "You must first select a cabin class.",
          severity: "error",
        },
      });
    } else {
      dispatch({ type: ModalActionType.ADD_MAPPING, payload: null });
    }
  };

  const handleCancelMapping = useCallback(() => {
    dispatch({ type: ModalActionType.CLEAR_SELECTED_ROWS, payload: null });
  }, []);

  const handleClear = useCallback(() => {
    dispatch({ type: ModalActionType.CLEAR_STATE, payload: null });
  }, []);

  const seatColorRule = (rowIndex: number) => {
    const isCurrentlySelected = selectedRows.includes(rowIndex);
    const selectedColor = getCabinClassColor(selectedCabinClass);

    // Check if the row is already in all mappings
    const mapping = allMappings.find((e) => e.rows.includes(rowIndex));

    // If it is, check if the row is in a mapping for the chosen cabin class
    // If yes, color it with the color of the cabin class if it is currently selected or set it to inherit if not
    let color = "inherit";
    if (
      mapping !== undefined &&
      mapping.seatClass === selectedCabinClass &&
      !isCurrentlySelected
    ) {
      color = "inherit";
    } else if (isCurrentlySelected) {
      color = selectedColor;
    } else if (mapping !== undefined) {
      color = getCabinClassColor(mapping.seatClass);
    } else {
      color = "inherit";
    }

    return color;
  };

  return (
    <Container>
      <Grid container justifyContent="space-between" alignItems="top">
        {Object.keys(CabinClass)
          .filter((e) => /\d/.test(e))
          .map((cabinClassId) => (
            <Grid item key={cabinClassId} xs={3}>
              <Button
                sx={{
                    '&.MuiButton-contained': {
                        backgroundColor: getCabinClassColor(+cabinClassId),
                        color: 'black'
                    },
                    '&.MuiButton-outlined': {
                        borderColor: getCabinClassColor(+cabinClassId),
                        color: 'black'
                    },
                }}
                className="w-full h-full border-2"
                variant={
                  selectedCabinClass !== null &&
                  selectedCabinClass == +cabinClassId
                    ? "contained"
                    : "outlined"
                }
                onClick={() => {
                  handleCabinClassSelect(+cabinClassId);
                }}
              >
                {getCabinClassLabel(+cabinClassId)}
              </Button>
            </Grid>
          ))}
          
      </Grid>
      <Container className="my-2">
        <Button onClick={handleCancelMapping}>Cancel Current Mapping</Button>
        <Button onClick={handleAddMapping}>Add Mapping for Cabin Class</Button>
        </Container>

<Divider className="mb-5"/>

      <SeatingChart
        onClickSeat={handleRowClick}
        seatColorRule={seatColorRule}
        rows={data.nrRows}
        columns={data.nrColumns}
        cabinClassMappings={allMappings}
      />

      <Button onClick={handleClear}>Clear</Button>

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
    </Container>
  );
});

export default SeatConfigurationForm;
