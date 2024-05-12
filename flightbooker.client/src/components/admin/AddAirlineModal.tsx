import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Button,
  TextField,
  Divider,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useFormik } from "formik";
import { FC, useRef } from "react";
import * as yup from "yup";
import axiosInstance from "../../utils/axios";
import { FormValidationResponse } from "../../models/DTOs/InvalidFormResponse";
import axios from "axios";
import { CreateEntryModalProps } from "./AddAirportModal";
import SelectAirlineOperatorsField, {
  SelectAirlineOperatorsFieldHandle,
} from "./SelectAirlineOperatorsField";
import { AirlineOperatorData } from "../../models/DTOs/AirlineOperatorData";

const validationSchema = yup.object({
  airlineName: yup.string().required("The airline name is required."),
  country: yup.string().required("The country is required."),
  phoneNumber: yup
    .string()
    .matches(
      /^\+\d{12}$/,
      "The correct format for a phone number starts with a + sign and the country prefix followed by 9 digits (e.g. +359876220321)."
    )
    .required("The phone number is required."),
  emailAddress: yup
    .string()
    .email("Invalid email address.")
    .required("The email address is required."),
});

interface AddAirportModalProps extends CreateEntryModalProps {
  operators: AirlineOperatorData[];
}

const AddAirportModal: FC<AddAirportModalProps> = ({
  open,
  onClose,
  operators,
}: AddAirportModalProps) => {
  const ref = useRef<SelectAirlineOperatorsFieldHandle>(null);
  const initialValues = {
    airlineName: "",
    country: "",
    phoneNumber: "",
    emailAddress: "",
    airlineOperatorIds: [] as string[],
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
        if (!ref.current) {
          setErrors({
            ...errors,
            airlineOperatorIds: "Airline Operators are required.",
          });
          throw new Error("Unknown error occured.");
        }

        values.airlineOperatorIds =
          ref.current.getSelectedOperatorIds() as string[];

        await axiosInstance.post("/airlines", values);

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
          Add New Airline
        </DialogTitle>
        <Divider />
        <DialogContent className="grid gap-y-5">
          <div>
            <TextField
              fullWidth
              id="airlineName"
              name="airlineName"
              label="Airline Name"
              value={values.airlineName}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.airlineName && Boolean(errors.airlineName)}
              helperText={touched.airlineName && errors.airlineName}
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
              id="phoneNumber"
              name="phoneNumber"
              label="Phone Number"
              value={values.phoneNumber}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.phoneNumber && Boolean(errors.phoneNumber)}
              helperText={touched.phoneNumber && errors.phoneNumber}
            />
          </div>
          <div>
            <TextField
              fullWidth
              id="emailAddress"
              name="emailAddress"
              label="Email Address"
              value={values.emailAddress}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.emailAddress && Boolean(errors.emailAddress)}
              helperText={touched.emailAddress && errors.emailAddress}
            />
          </div>
          <SelectAirlineOperatorsField operators={operators} ref={ref} />
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
