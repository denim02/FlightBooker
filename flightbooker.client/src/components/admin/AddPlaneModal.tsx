import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Button,
  TextField,
  Typography,
  CircularProgress,
  Divider,
} from "@mui/material";
import { useFormik } from "formik";
import { FC, useRef } from "react";
import * as yup from "yup";
import axiosInstance from "../../utils/axios";
import { FormValidationResponse } from "../../models/DTOs/InvalidFormResponse";
import axios from "axios";
import SeatConfigurationForm, {
  SeatConfigurationFormHandle,
} from "./SeatConfigurationForm";
import { RowSeatClassMapping } from "../../models/DTOs/SeatConfigurationData";
import { CreateEntryModalProps } from "./AddAirportModal";

const validationSchema = yup.object({
  brand: yup
    .string()
    .required("The airplane brand is required.")
    .max(50, "The airplane brand should be at most 50 characters."),
  model: yup
    .string()
    .required("The airplane model is required.")
    .max(50, "The airplane model should be at most 50 characters."),
  nrRows: yup
    .number()
    .required("The number of rows is required.")
    .min(1, "The number of rows should be at least 1.")
    .max(100, "The number of rows should be at most 100."),
  nrColumns: yup
    .number()
    .required("The number of columns is required.")
    .min(2, "The number of columns should be at least 2.")
    .max(9, "The number of columns should be at most 9."),
});

const AddPlaneModal: FC<CreateEntryModalProps> = ({
  open,
  onClose,
}: CreateEntryModalProps) => {
  const ref = useRef<SeatConfigurationFormHandle>(null);
  const initialValues = {
    brand: "",
    model: "",
    nrRows: 0,
    nrColumns: 0,
    seatConfiguration: [] as RowSeatClassMapping[],
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
    setFieldTouched,
    resetForm,
  } = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      try {
        if (!ref.current) {
          setErrors({
            ...errors,
            seatConfiguration: "Seat configuration is required.",
          });
          throw new Error("Unknown error occured.");
        }

        if (!ref.current.isValid()) {
          setErrors({
            ...errors,
            seatConfiguration:
              "All rows must be assigned a cabin class before submitting.",
          });
          throw new Error(
            "All rows must be assigned a cabin class before submitting."
          );
        } else {
          values.seatConfiguration = ref.current.getSeatConfiguration();
          await axiosInstance.post("/airplanes", values);
          resetForm();
          onClose();
        }
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
          if (error instanceof Error)
            if (
              error.message ==
              "All rows must be assigned a cabin class before submitting."
            )
              ref.current!.displayError(error.message);
            else console.error("Server error:", error.message);
        }
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleRowChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleChange(e);
    ref.current?.clearState();
  };

  return (
    <Dialog open={open} onClose={() => onClose()} className="max-h-[100%]">
      <form onSubmit={handleSubmit}>
        <DialogTitle className="text-3xl text-background">
          Add New Plane
        </DialogTitle>
        <Divider />

        <DialogContent className="grid gap-y-5">
          <div>
            <TextField
              fullWidth
              id="brand"
              name="brand"
              label="Airplane Brand"
              value={values.brand}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.brand && Boolean(errors.brand)}
              helperText={touched.brand && errors.brand}
            />
          </div>
          <div>
            <TextField
              fullWidth
              id="model"
              name="model"
              label="Airplane Model"
              value={values.model}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.model && Boolean(errors.model)}
              helperText={touched.model && errors.model}
            />
          </div>
          <div>
            <TextField
              fullWidth
              id="nrRows"
              name="nrRows"
              label="Rows"
              type="number"
              value={values.nrRows}
              onChange={handleRowChange}
              onBlur={handleBlur}
              error={touched.nrRows && Boolean(errors.nrRows)}
              helperText={touched.nrRows && errors.nrRows}
            />
          </div>
          <div>
            <TextField
              fullWidth
              id="nrColumns"
              name="nrColumns"
              label="Columns"
              type="number"
              value={values.nrColumns}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.nrColumns && Boolean(errors.nrColumns)}
              helperText={touched.nrColumns && errors.nrColumns}
            />
          </div>
          <SeatConfigurationForm
            data={{
              nrRows: values.nrRows,
              nrColumns: values.nrColumns,
              rowSeatClassMappings: values.seatConfiguration,
              airplaneId: undefined,
            }}
            onTouch={() => {
              setFieldTouched("seatConfiguration", true);
            }}
            ref={ref}
          />
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

export default AddPlaneModal;
