import { useAuth } from "../../hooks/use-auth";
import axiosInstance from "../../utils/axios";
import axios from "axios";
import {
Button,
  Card,
  CircularProgress,
  Container,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import supportBackground from "../../assets/images/support-bg.jpg";
import * as yup from "yup";
import { useFormik } from "formik";
import { FormValidationResponse } from "../../models/DTOs/InvalidFormResponse";

const validationSchema = yup.object({
    description: yup
      .string()
      .required("The complaint description is required.")
      .min(30, "The description should be at least 30 characters."),
  });

const SupportPage = () => {
  const { user } = useAuth();

  const initialValues = {
    description: "",
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
          `/complaints`,
          {
            complainantId: user!.userId,
            description: values.description,
          }
        );

        resetForm();
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
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      className="h-screen"
      sx={{
        backgroundImage: {
          xs: `url(${supportBackground})`,
        },
        backgroundSize: "cover",
      }}
    >
      <Card className="w-full md:w-3/5 p-10">

        <Container>
        <Typography variant="h4" className="font-light mb-6">
          Send a Ticket
        </Typography>
        <Typography> Please provide a detailed description of your complaint and a website administrator will be assigned to review and address it. A response to your complaint will be sent to your email once it has been reviewed. Thank you! </Typography>
        <form onSubmit={handleSubmit}>
            <Container className="mt-10">
              <TextField
                fullWidth
                id="description"
                name="description"
                label="Complaint"
                multiline
                minRows={10}
                value={values.description}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.description && Boolean(errors.description)}
                helperText={touched.description && errors.description}
              />
            </Container>
            <Button
              variant="contained"
              disabled={!isValid || isSubmitting}
              type="submit"
              className="bg-background hover:bg-primary text-white mt-10 disabled:bg-gray-500"
            >
              <Typography>Submit</Typography>
              {isSubmitting ? (
                <CircularProgress className="text-white ml-5" size={15} />
              ) : null}
            </Button>
        </form>
        </Container>
      </Card>
    </Grid>
  );
};

export default SupportPage;
