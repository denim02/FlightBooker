import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/use-auth";
import { UserRole } from "../../models/auth/User";
import {
  Button,
  FormControlLabel,
  TextField,
  Checkbox,
  Grid,
  Box,
  Container,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";
import { FormValidationResponse } from "../../models/DTOs/InvalidFormResponse";
import axiosInstance from "../../utils/axios";
import axios from "axios";
import loginBackground from "../../assets/images/login-banner.jpg";

//=========================================================

const validationSchema = yup.object({
  email: yup
    .string()
    .email("Please enter a valid email.")
    .required("The email must be specified."),
  password: yup.string().required("The password is required."),
});

const LoginPage = () => {
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const initialValues = {
    email: "",
    password: "",
    rememberMe: false,
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
    // Send a POST request using axios to the server to login
    // URL: /account/login
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      try {
        const response = await axiosInstance.post("/auth/login", values);
        const responseData: FormValidationResponse = response.data;

        const userRole =
          UserRole[responseData.entries!.role as keyof typeof UserRole];

        setUser({
          userId: responseData.entries!.userId,
          role: userRole,
        });

        if (location.state && location.state.from) {
          navigate(location.state.from);
        } else {
          switch (userRole) {
            case UserRole.Admin:
              navigate("/admin", { replace: true });
              break;
            case UserRole.User:
              navigate("/", { replace: true });
              break;
            case UserRole.AirlineOperator:
              navigate("/airline", { replace: true });
              break;
          }
        }
      } catch (error) {
        if (
          axios.isAxiosError(error) &&
          error.response &&
          error.response.data &&
          error.response.data.errors
        ) {
          const responseData: FormValidationResponse = error.response.data;

          if (responseData.entries?.userId) {
            navigate("/confirm-email", {
              state: { userId: responseData.entries.userId },
            });
          }

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
      sx={{
        backgroundImage: {
          xs: `url(${loginBackground})`,
          sm: "none",
        },
        backgroundSize: "cover",
      }}
      className="h-screen overflow-hidden"
      alignItems="center"
    >
      <Grid item xs={0} md={8} className="hidden md:block">
        <img
          src={loginBackground}
          alt="Image of plain at sunset"
          className="max-h-screen w-full object-cover"
        />
      </Grid>
      <Grid
        item
        container
        xs={12}
        md={4}
        alignItems="center"
        className="h-96 w-2/3 md:w-full bg-white md:bg-none md:h-auto"
      >
        <Container className="mx-4">
          <Typography
            variant="h4"
            component="h1"
            className="font-semibold text-primary mb-4"
          >
            Login
          </Typography>
          <form onSubmit={handleSubmit} className="grid py-4 gap-6">
            <Box>
              <TextField
                id="email"
                name="email"
                label="Email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.email && Boolean(errors.email)}
                helperText={touched.email && errors.email}
                className="w-full"
              />
            </Box>
            <Box>
              <TextField
                id="password"
                name="password"
                label="Password"
                type="password"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.password && Boolean(errors.password)}
                helperText={touched.password && errors.password}
                className="w-full"
              />
            </Box>
            <div>
              <FormControlLabel
                control={
                  <Checkbox
                    name="rememberMe"
                    value={values.rememberMe}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                }
                label="Remember me"
                labelPlacement="start"
                slotProps={{
                  typography: {
                    className: "text-background font-regular",
                  },
                }}
              />
            </div>
            <Button
              variant="contained"
              disabled={!isValid || isSubmitting}
              type="submit"
              className="bg-primary hover:bg-background disabled:bg-background text-white p-2"
            >
              <Typography className="text-white">Login</Typography>
              {isSubmitting ? (
                <CircularProgress className="text-white ml-4" size={20} />
              ) : null}
            </Button>
          </form>

          <Box>
            <Typography className="text-center">
              or{" "}
              <Link to="/register" className="text-primary">
                Register
              </Link>
            </Typography>
          </Box>
        </Container>
      </Grid>
    </Grid>
  );
};

export default LoginPage;
