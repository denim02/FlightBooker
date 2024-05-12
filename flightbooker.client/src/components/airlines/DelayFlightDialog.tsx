import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Button,
  TextField,
  Divider,
  Container,
  CircularProgress,
  Typography,
  DialogContentText,
} from "@mui/material";
import { useFormik } from "formik";
import { FC } from "react";
import * as yup from "yup";
import axiosInstance from "../../utils/axios";
import { FormValidationResponse } from "../../models/DTOs/InvalidFormResponse";
import axios from "axios";

export interface DelayFlightDialogProps {
  open: boolean;
  onClose: () => void;
  selectedFlightId: number;
}

const validationSchema = yup.object({
  delayTime: yup
    .number()
    .required("The delay time is required.")
    .min(1, "The delay time should be at least 1 minute."),
});

const DelayFlightDialog: FC<DelayFlightDialogProps> = ({
  open,
  onClose,
  selectedFlightId,
}) => {
  const initialValues = {
    delayTime: 0,
  };

  const {
    values,
    touched,
    errors,
    handleChange,
    handleBlur,
    handleSubmit,
    isValid,
    isSubmitting,
    resetForm,
  } = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      try {
        await axiosInstance.post(`/flights/${selectedFlightId}/delay`, {
          delay: values.delayTime,
        });

        resetForm();
        onClose();
      } catch (error) {
        if (
          axios.isAxiosError(error) &&
          error.response &&
          error.response.data &&
          error.response.data.errors
        ) {
          const responseData: FormValidationResponse = error.response.data;

          // If server-side validation errors are present, set them to the appropriate keys and
          // set the form errors
          if (responseData.errors) {
            if (responseData.errors.GeneralError)
              console.error("Error:", responseData.errors.GeneralError[0]);

            const validationErrors = { ...errors };
            for (const key in responseData.errors) {
              const existingKey = Object.keys(values).find(
                (k) => k.toLowerCase() === key.toLowerCase()
              );
              if (existingKey) {
                const errorKey = existingKey as keyof typeof values;
                validationErrors[errorKey] = responseData.errors[key].pop();
              }
            }

            setErrors(validationErrors);
          }
        } else {
          if (error instanceof Error) console.error("Error:", error.message);
        }
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <Dialog open={open} onClose={() => onClose()} className="max-h-[100%]">
      <form onSubmit={handleSubmit}>
        <DialogTitle className="text-3xl text-background">
          Set a delay for the flight
        </DialogTitle>
        <Divider />
        <DialogContent>
          <DialogContentText className="text-black">
            Please enter the delay time in minutes for the flight with id{" "}
            <span className="font-bold">{selectedFlightId}</span>. Note that any
            users with reservations for this flight will be notified via email
            about the delay.
          </DialogContentText>

          <Container className="mt-10">
            <TextField
              fullWidth
              id="delayTime"
              name="delayTime"
              label="Delay Time"
              value={values.delayTime}
              onChange={handleChange}
              onBlur={handleBlur}
              type="number"
              error={touched.delayTime && Boolean(errors.delayTime)}
              helperText={touched.delayTime && errors.delayTime}
            />
          </Container>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => onClose()}>Cancel</Button>
          <Button
            variant="contained"
            disabled={!isValid || isSubmitting}
            type="submit"
            className="bg-background hover:bg-primary text-white"
          >
            <Typography>Submit</Typography>
            {isSubmitting ? (
              <CircularProgress className="text-white ml-5" size={15} />
            ) : null}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default DelayFlightDialog;
