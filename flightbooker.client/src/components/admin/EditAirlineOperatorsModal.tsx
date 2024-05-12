import { FC, useCallback, useRef } from "react";
import SelectAirlineOperatorsField, {
  SelectAirlineOperatorsFieldHandle,
} from "./SelectAirlineOperatorsField";
import { AirlineOperatorData } from "../../models/DTOs/AirlineOperatorData";
import axiosInstance from "../../utils/axios";
import axios from "axios";
import { Button, Dialog, DialogContent, DialogTitle } from "@mui/material";

type EditAirlineOperatorsModalProps = {
  open: boolean;
  onClose: () => void;
  operators: AirlineOperatorData[];
  airlineId: number;
};

const EditAirlineOperatorsModal: FC<EditAirlineOperatorsModalProps> = ({
  open,
  onClose,
  operators,
  airlineId,
}) => {
  const ref = useRef<SelectAirlineOperatorsFieldHandle>(null);

  const handleSubmit = useCallback(async () => {
    try {
      if (!ref.current) return;

      const operatorIds = ref.current.getSelectedOperatorIds();
      await axiosInstance.put(`/airlines/${airlineId}/operators`, operatorIds);

      onClose();
    } catch (error) {
      if (
        axios.isAxiosError(error) &&
        error.response &&
        error.response.data &&
        error.response.data.errors
      ) {
        console.error(error.response.data.errors["GeneralError"]);
      } else if (error instanceof Error) console.error(error.message);
    }
  }, [airlineId, onClose]);

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle className="text-3xl text-background">
        Modify Airline Operators
      </DialogTitle>
      <DialogContent className="grid gap-y-5">
        <SelectAirlineOperatorsField
          operators={operators}
          airlineId={airlineId}
          ref={ref}
        />
        <Button className="px-0 mx-0" onClick={handleSubmit}>
          Save
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default EditAirlineOperatorsModal;
