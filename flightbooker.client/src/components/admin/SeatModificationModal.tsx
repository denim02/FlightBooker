import { useCallback, useRef, useState } from "react";
import {
  Button,
  DialogContent,
  Dialog,
  DialogTitle,
  Typography,
  CircularProgress,
  Divider,
} from "@mui/material";
import { SeatConfigurationData } from "../../models/DTOs/SeatConfigurationData";
import axiosInstance from "../../utils/axios";
import axios from "axios";
import SeatConfigurationForm, {
  SeatConfigurationFormHandle,
} from "./SeatConfigurationForm";

const SeatModificationModal = ({
  open,
  onClose,
  data,
}: {
  open: boolean;
  onClose: () => void;
  data: SeatConfigurationData;
}) => {
  const ref = useRef<SeatConfigurationFormHandle>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = useCallback(async () => {
    try {
      setIsSubmitting(true);
      if (!ref.current) return;

      if (!ref.current.isValid()) {
        throw new Error(
          "All rows must be assigned a cabin class before submitting."
        );
      }

      const allMappings = ref.current.getSeatConfiguration();
      await axiosInstance.put(
        `/airplanes/${data.airplaneId}/seat-configuration`,
        allMappings
      );

      ref.current.clearState();
      onClose();
    } catch (error) {
      if (
        axios.isAxiosError(error) &&
        error.response &&
        error.response.data &&
        error.response.data.errors
      ) {
        ref.current!.displayError(error.response.data.errors["GeneralError"]);
      } else if (error instanceof Error)
        ref.current!.displayError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  }, [data.airplaneId, onClose]);

  const handleClose = useCallback(() => {
    ref.current?.clearState();
    onClose();
  }, [onClose]);

  return (
    <Dialog open={open} onClose={handleClose} className="max-h-[100%]">
      <DialogTitle className="text-3xl text-background">
        Modify Cabin Class
      </DialogTitle>
      <Divider className="mb-4"/>
      <DialogContent>
        <SeatConfigurationForm data={data} ref={ref} />
        <Button
          variant="contained"
          disabled={isSubmitting}
          onClick={handleSubmit}
          className="bg-background hover:bg-primary text-white w-full mt-4"
        >
          <Typography>Submit</Typography>
          {isSubmitting ? (
            <CircularProgress className="text-white ml-5" size={15} />
          ) : null}
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default SeatModificationModal;
