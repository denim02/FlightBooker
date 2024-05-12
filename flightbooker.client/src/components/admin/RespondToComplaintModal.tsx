import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Button,
  TextField,
  Divider,
  Grid,
  Container,
  CircularProgress,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import { FC } from "react";
import * as yup from "yup";
import axiosInstance from "../../utils/axios";
import { FormValidationResponse } from "../../models/DTOs/InvalidFormResponse";
import axios from "axios";
import { Complaint } from "../../models/tables/Complaint";
import { useAuth } from "../../hooks/use-auth";
import dayjs from "dayjs";

export interface RespondToComplaintModalProps {
  open: boolean;
  onClose: () => void;
  selectedComplaint: Complaint;
}

const validationSchema = yup.object({
  response: yup
    .string()
    .required("The response is required.")
    .min(30, "The response should be at least 30 characters."),
});

const RespondToComplaintModal: FC<RespondToComplaintModalProps> = ({
  open,
  onClose,
  selectedComplaint,
}) => {
  const { user } = useAuth();
  const initialValues = {
    response: "",
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
        await axiosInstance.post(
          `/complaints/respond/${selectedComplaint.id}`,
          {
            adminId: user!.userId,
            response: values.response,
          }
        );

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
          Respond to Complaint
        </DialogTitle>
        <Divider />
        <DialogContent>
          <Grid container className="gap-2">
            <Grid item container>
              <Grid item className="w-1/4 font-semibold">
                Complaint Id:
              </Grid>
              <Grid item>{selectedComplaint.id}</Grid>
            </Grid>
            <Grid item container>
              <Grid item className="w-1/4 font-semibold">
                Complainant Id:
              </Grid>
              <Grid item>{selectedComplaint.userId}</Grid>
            </Grid>
            <Grid item container>
              <Grid item className="w-1/4 font-semibold">
                Description:
              </Grid>
              <Grid item className="w-3/4">
                {selectedComplaint.description}
              </Grid>
            </Grid>
            <Grid item container>
              <Grid item className="w-1/4 font-semibold">
                Date Issued:
              </Grid>
              <Grid item>
                {dayjs(selectedComplaint.dateIssued).format(
                  "DD/MM/YY HH:mm:ss"
                )}
              </Grid>
            </Grid>
          </Grid>
          <Container className="mt-10">
            <TextField
              fullWidth
              id="response"
              name="response"
              label="Response"
              multiline
              minRows={10}
              value={values.response}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.response && Boolean(errors.response)}
              helperText={touched.response && errors.response}
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

export default RespondToComplaintModal;
