import { useFormik } from "formik";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useState, useEffect, useMemo } from "react";
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
import { FormValidationResponse } from "../../models/DTOs/InvalidFormResponse";
import axiosInstance from "../../utils/axios";
import registerBackground from "../../assets/images/register-bg.jpg";

type LocationState = {
  userId: string;
};

const isStateValid = (
  state: LocationState | null | undefined
): state is LocationState => {
  if (!state) return false;
  if (typeof state !== "object") return false;
  if (typeof state.userId !== "string") return false;
  return true;
};

const ConfirmEmailPage = () => {
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [resendDisabled, setResendDisabled] = useState<boolean>(false);
  const [disabledTime, setDisabledTime] = useState<number>(30);

  const multiplier: number = 1;
  const disabledTimeMultiplier: number = useMemo(() => {
    if (resendDisabled) return multiplier * 2;

    return multiplier;
  }, [resendDisabled]);

  const { state } = useLocation();
  const navigate = useNavigate();

  // Countdown of disabledTime
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    if (resendDisabled) {
      timer = setTimeout(() => {
        setDisabledTime((prevTime) => prevTime - 1);

        if (disabledTime <= 0) {
          setResendDisabled(false);
          setDisabledTime(30 * disabledTimeMultiplier);
        }
      }, 1000);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [resendDisabled, disabledTime, disabledTimeMultiplier]);

  if (!isStateValid(state)) {
    navigate("/login");
  }

  const initialValues = {
    confirmationToken: "",
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
    onSubmit: async (values, { setErrors, setSubmitting }) => {
      try {
        await axiosInstance.post("/auth/confirmEmail", {
          userId: state.userId,
          ...values,
        });

        setSuccessMessage(
          "Confirmation successful! Redirecting to login page..."
        );
        setTimeout(() => {
          navigate("/login");
        }, 4 * 1000);
      } catch (error) {
        if (
          axios.isAxiosError(error) &&
          error.response?.status === 400 &&
          error.response.data?.errors
        ) {
          const responseData: FormValidationResponse = error.response.data;

          // If server-side validation errors are present, set them to the appropriate keys and
          // set the form errors
          if (responseData.errors) {
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
          } else {
            if (error instanceof Error)
              console.error("Confirmation error: ", error.message);
          }
        }
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleResendConfirmation = async () => {
    setResendDisabled(true);
    try {
      await axiosInstance.post("/auth/resendConfirmationEmail", {
        userId: state.userId,
      });
      setSuccessMessage("Confirmation email resent successfully!");
    } catch (error) {
      if (error instanceof Error)
        console.error("Error resending confirmation email:", error.message);
    }
  };

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
              title="Confirm Email"
              titleTypographyProps={{
                variant: "h4",
                component: "h1",
                className: "font-semibold text-primary",
              }}
            />
            <form onSubmit={handleSubmit}>
              <CardContent>
                <Typography className="mb-6">
                  A confirmation email has been sent to the address you
                  specified. Please enter the code you received here.
                </Typography>
                <TextField
                  fullWidth
                  id="confirmationToken"
                  name="confirmationToken"
                  label="Confirmation Token"
                  value={values.confirmationToken}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={
                    touched.confirmationToken &&
                    Boolean(errors.confirmationToken)
                  }
                  helperText={
                    touched.confirmationToken && errors.confirmationToken
                  }
                />
              </CardContent>
              <CardActions className="grid gap-3">
                <Button
                  variant="contained"
                  disabled={!isValid || isSubmitting}
                  type="submit"
                  className="w-full block bg-primary hover:bg-background disabled:bg-background text-white p-2"
                >
                  <Typography className="text-white">Confirm</Typography>
                  {isSubmitting ? (
                    <CircularProgress className="text-white ml-4" size={20} />
                  ) : null}
                </Button>
                <Button
                  variant="contained"
                  disabled={resendDisabled || isSubmitting}
                  onClick={handleResendConfirmation}
                  className="w-full bg-attention hover:bg-yellow-400 disabled:bg-gray-200 ml-0  p-2"
                >
                  <Typography className="text-black disabled:text-gray-400">
                    Resend Confirmation Email{" "}
                    {resendDisabled ? `(${disabledTime}s)` : ""}
                  </Typography>
                </Button>
              </CardActions>
              <CardContent>
                {successMessage && <Typography>{successMessage}</Typography>}
              </CardContent>
            </form>
          </Container>
        </Card>
      </Grid>
    </Grid>
  );
};

export default ConfirmEmailPage;
