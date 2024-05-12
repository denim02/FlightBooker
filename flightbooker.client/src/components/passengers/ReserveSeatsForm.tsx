import { forwardRef, useImperativeHandle, useReducer } from "react";
import { RowSeatClassMapping } from "../../models/DTOs/SeatConfigurationData";
import SeatingChart from "../core/SeatingChart";
import { Container } from "@mui/material";
import { CabinClass, getCabinClassColor } from "../../models/CabinClass";

type IndividualSeatData = {
    id: number;
    row: number;
    column: string;
    cabinClass?: CabinClass;
    isReserved: boolean;
}

  export type SeatReservationState = {
    allSeats: IndividualSeatData[];
    selectedSeats: IndividualSeatData[];
    cabinClassMappings: RowSeatClassMapping[];
  }

  export type SeatReservationData = {
    flightId: number;
    selectedSeats: IndividualSeatData[];
  };
  
  enum ModalActionType {
    TOGGLE_SEAT = "TOGGLE_SEAT",
    CLEAR_STATE = "CLEAR_STATE",
  }
  
  interface ModalAction {
    type: ModalActionType;
    payload:
      IndividualSeatData
      | null;
  }
  
  const reducer = (state: SeatReservationState, action: ModalAction) => {
    switch (action.type) {
      case ModalActionType.TOGGLE_SEAT: {
        if (!action.payload) return state;
        const seat = action.payload as IndividualSeatData;
        const selectedSeats = state.selectedSeats.find((s) => s.id === seat.id)
          ? state.selectedSeats.filter((s) => s.id !== seat.id)
          : [...state.selectedSeats, seat];
        return { ...state, selectedSeats };
      }
      case ModalActionType.CLEAR_STATE:
        return { ...state, selectedSeats: [] };
      default:
        return state;
    }
  };
  
  type ReserveSeatsFormProps = {
    flightId: number;
    nrRows: number;
    nrColumns: number;
    data: SeatReservationState;
    onTouch?: () => void | undefined;
  }
  
  export type ReserveSeatsFormHandle = {
    getSeatReservations: () => SeatReservationData;
  };
  
  const ReserveSeatsForm = forwardRef<
    ReserveSeatsFormHandle,
    ReserveSeatsFormProps
  >(({ flightId, nrRows, nrColumns, data, onTouch }, ref) => {
    const [state, dispatch] = useReducer(reducer, data);
    const { cabinClassMappings, selectedSeats, allSeats } = state;
  
    useImperativeHandle(
      ref,
      () => {
        return {
          getSeatReservations() {
            const seats = selectedSeats.map(seat => ({
              ...seat,
              cabinClass: cabinClassMappings.find(c => c.rows.includes(seat.row))?.seatClass
            }));

            return {
              flightId: flightId,
              selectedSeats: seats
            };
          }
        };
      },
      [cabinClassMappings, flightId, selectedSeats]
    );

    const handleSeatClick = (rowIndex: number, columnIndex: number) => {
      // Convert columnIndex to letter
      const columnLetter = String.fromCharCode(65 + columnIndex);

      if (onTouch) onTouch();
      const seat = allSeats.find(
        (s) => s.row === rowIndex && s.column === columnLetter && s.isReserved === false
      );

      if (seat)
        dispatch({ type: ModalActionType.TOGGLE_SEAT, payload: seat });
    };

    const seatColorRule = (rowIndex: number, colIndex: number) => {
      const columnLetter = String.fromCharCode(65 + colIndex);

      let color = "inherit";

      // If the seat is reserved, color it grey
      const seat = allSeats.find(
        (s) => s.row === rowIndex && s.column === columnLetter
      );

      // If it is the currently selected seat, color it green
      const isCurrentlySelected = selectedSeats.find(
        (s) => s.row === rowIndex && s.column === columnLetter
      );

      if (seat && seat.isReserved) {
        color = "grey";
      } 
      else if (isCurrentlySelected) {
        color = "red";
      }
      else {
        const mapping = cabinClassMappings.find((e) =>
          e.rows.includes(rowIndex)
        );
        if (mapping !== undefined) {
          color = getCabinClassColor(mapping.seatClass);
        }
      }
  
      return color;
    };
  
    return (
      <Container>
        <SeatingChart
          onClickSeat={handleSeatClick}
          seatColorRule={seatColorRule}
          rows={nrRows}
          columns={nrColumns}
          cabinClassMappings={cabinClassMappings}
        />
      </Container>
    );
  });
  
  export default ReserveSeatsForm;
  