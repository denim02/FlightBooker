import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Button,
  TextField,
  CircularProgress,
  Typography,
  Divider,
} from "@mui/material";
import { useFormik } from "formik";
import { FC } from "react";
import * as yup from "yup";
import axiosInstance from "../../utils/axios";
import { FormValidationResponse } from "../../models/DTOs/InvalidFormResponse";
import axios from "axios";

export interface CreateEntryModalProps {
  open: boolean;
  onClose: () => void;
}

const validationSchema = yup.object({
  airportCode: yup
    .string()
    .required("The airport code is required.")
    .max(3, "The airport code should be at most 3 characters."),
  airportName: yup.string().required("The airport name is required."),
  country: yup.string().required("The country is required."),
  city: yup.string().required("The city is required."),
});

const AddAirportModal: FC<CreateEntryModalProps> = ({
  open,
  onClose,
}: CreateEntryModalProps) => {
  const initialValues = {
    airportCode: "",
    airportName: "",
    city: "",
    country: "",
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
        await axiosInstance.post("/airports", values);

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
      <form onSubmit={handleSubmit} className="md:min-w-[500px]">
        <DialogTitle className="text-3xl text-background">
          Add New Airport
        </DialogTitle>
        <Divider />
        <DialogContent className="grid gap-y-5">
          <div>
            <TextField
              fullWidth
              id="airportCode"
              name="airportCode"
              label="Airport Code"
              value={values.airportCode}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.airportCode && Boolean(errors.airportCode)}
              helperText={touched.airportCode && errors.airportCode}
            />
          </div>
          <div>
            <TextField
              fullWidth
              id="airportName"
              name="airportName"
              label="Airport Name"
              value={values.airportName}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.airportName && Boolean(errors.airportName)}
              helperText={touched.airportName && errors.airportName}
            />
          </div>
          <div>
            <TextField
              fullWidth
              id="country"
              name="country"
              label="Country"
              value={values.country}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.country && Boolean(errors.country)}
              helperText={touched.country && errors.country}
            />
          </div>
          <div>
            <TextField
              fullWidth
              id="city"
              name="city"
              label="City"
              value={values.city}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.city && Boolean(errors.city)}
              helperText={touched.city && errors.city}
            />
          </div>
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

export default AddAirportModal;
