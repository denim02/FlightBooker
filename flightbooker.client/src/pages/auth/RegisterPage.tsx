import { useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CircularProgress,
  Container,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import axios from "axios";
import * as yup from "yup";
import { FormValidationResponse } from "../../models/DTOs/InvalidFormResponse";
import axiosInstance from "../../utils/axios";
import registerBackground from "../../assets/images/register-bg.jpg";

//=========================================================

const validationSchema = yup.object({
  firstName: yup
    .string()
    .required("The first name must be specified.")
    .max(50, "The first name should be at most 50 characters."),
  lastName: yup
    .string()
    .required("The last name must be specified.")
    .max(50, "The last name should be at most 50 characters."),
  username: yup
    .string()
    .required("The username is required.")
    .max(50, "The username should be at most 50 characters."),
  email: yup
    .string()
    .email("Enter a valid email.")
    .required("You must enter a valid email."),
  password: yup
    .string()
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/,
      "The password must be at least 6 characters long and contain at least one uppercase letter, one lowercase letter, and one number."
    )
    .required("A password is required."),
  phoneNumber: yup
    .string()
    .matches(
      /^\+\d{12}$/,
      "The correct format for a phone number starts with a + sign and the country prefix followed by 9 digits (e.g. +359876220321)."
    )
    .required("Your phone number is required."),
});

const RegisterPage = () => {
  const navigate = useNavigate();

  const initialValues = {
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    phoneNumber: "",
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
  } = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      try {
        const response = await axiosInstance.post("/auth/register", values);
        const responseData: FormValidationResponse = response.data;

        // Upon successful registration, user should confirm email
        if (responseData.entries?.userId) {
          navigate("/confirm-email", {
            state: { userId: responseData.entries.userId },
            replace: true,
          });
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
            console.error("Registration error:", error.message);
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
          xs: `url(${registerBackground})`,
        },
        backgroundSize: "cover",
      }}
    >
      <Grid item xs={12} sm={8} md={7} lg={5}>
        <Card className="max-w-xl drop-shadow-xl shadow-xl rounded-lg py-10 max-h-screen overflow-y-auto">
          <Container className="w-11/12">
            <CardHeader
              title="Register"
              titleTypographyProps={{
                variant: "h4",
                component: "h1",
                className: "font-semibold text-primary",
              }}
            />
            <form onSubmit={handleSubmit}>
              <CardContent className="grid gap-3">
                <div>
                  <TextField
                    fullWidth
                    id="firstName"
                    name="firstName"
                    label="First Name"
                    value={values.firstName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.firstName && Boolean(errors.firstName)}
                    helperText={touched.firstName && errors.firstName}
                  />
                </div>
                <div>
                  <TextField
                    fullWidth
                    id="lastName"
                    name="lastName"
                    label="Last Name"
                    value={values.lastName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.lastName && Boolean(errors.lastName)}
                    helperText={touched.lastName && errors.lastName}
                  />
                </div>
                <div>
                  <TextField
                    fullWidth
                    id="username"
                    name="username"
                    label="Username"
                    value={values.username}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.username && Boolean(errors.username)}
                    helperText={touched.username && errors.username}
                  />
                </div>
                <div>
                  <TextField
                    fullWidth
                    id="email"
                    name="email"
                    label="Email"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.email && Boolean(errors.email)}
                    helperText={touched.email && errors.email}
                  />
                </div>
                <div>
                  <TextField
                    fullWidth
                    id="password"
                    name="password"
                    label="Password"
                    type="password"
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.password && Boolean(errors.password)}
                    helperText={touched.password && errors.password}
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
              </CardContent>
              <CardActions>
                <Button
                  variant="contained"
                  disabled={!isValid || isSubmitting}
                  type="submit"
                  className="bg-primary hover:bg-background disabled:bg-background text-white p-2 w-full"
                >
                  <Typography className="text-white">Register</Typography>
                  {isSubmitting ? (
                    <CircularProgress className="text-white ml-4" size={20} />
                  ) : null}
                </Button>
              </CardActions>
            </form>
          </Container>
        </Card>
      </Grid>
    </Grid>
  );
};

export default RegisterPage;
