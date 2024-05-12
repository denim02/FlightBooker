import {
  Box,
  Card,
  CardContent,
  Container,
  FormControlLabel,
  Grid,
  MenuItem,
  Checkbox,
  Select,
  Switch,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Button,
  CircularProgress,
} from "@mui/material";
import HeroSectionBackground from "../assets/images/hero-section-bg.jpg";
import * as yup from "yup";
import { fetchAirports } from "./passenger/api";
import axios from "axios";
import AsyncSelect from "../components/core/AsyncSelect";
import { FilterOptions, INITIAL_FILTERS } from "../stores/filtering-context";
import { useFormik } from "formik";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import ComplexTextField from "../components/core/ComplexTextField";
import { useNavigate } from "react-router-dom";
import { CabinClass } from "../models/CabinClass";

const validationSchema = yup.object().shape({
  departureAirportCode: yup
    .string()
    .required("Departure airport is required")
    .test(
      "is-not-equal",
      "Departure airport and arrival airport must be different.",
      function (value, context) {
        return value !== context.parent.arrivalAirportCode;
      }
    ),
  arrivalAirportCode: yup
    .string()
    .required("Arrival airport is required")
    .test(
      "is-not-equal",
      "Departure airport and arrival airport must be different.",
      function (value, context) {
        return value !== context.parent.departureAirportCode;
      }
    ),
  departureDate: yup.date().required("Departure date is required"),
  isRoundTrip: yup.boolean().optional(),
  returnDate: yup
    .date()
    .optional()
    .test(
      "is-present-if-round-trip",
      "Return date is required for round trip",
      function (value, context) {
        return context.parent.isRoundTrip ? Boolean(value) : true;
      }
    )
    .test(
      "is-after",
      "Return date must be equal to or after the departure date.",
      function (value, context) {
        return context.parent.isRoundTrip
          ? value !== undefined
            ? value >= context.parent.departureDate
            : false
          : true;
      }
    ),
  seats: yup
    .number()
    .required("Number of passengers is required")
    .min(1, "At least 1 passenger is required"),
});

const HomePage = () => {
  const navigate = useNavigate();

  const formik = useFormik<FilterOptions>({
    initialValues: INITIAL_FILTERS,
    validationSchema,
    onSubmit: async (values) => {
      try {
        const queryParams = new URLSearchParams({
          departureAirportCode: values.departureAirportCode,
          arrivalAirportCode: values.arrivalAirportCode,
          departureDate: values.departureDate.toLocaleDateString(),
          returnDate: values.returnDate?.toLocaleDateString() || "",
          seats: values.seats.toString(),
          isRoundTrip: values.isRoundTrip.toString(),
          directFlightsOnly: values.directFlightsOnly.toString(),
          cabinClass: values.cabinClass.toString() || "",
          sortBy: "Price",
          sortOrder: "asc",
        });

        navigate({ pathname: "/search", search: queryParams.toString() });
      } catch (error) {
        if (axios.isAxiosError(error))
          console.error("Error:", error.response?.data.message);
        if (error instanceof Error) console.error("Error:", error.message);
      }
    },
  });

  const {
    values,
    touched,
    errors,
    isValid,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
  } = formik;

  return (
    <Box className="w-full">
      <Box
        sx={{
          backgroundImage: `url(${HeroSectionBackground})`,
          backgroundSize: "cover",
        }}
      >
        <Box className="backdrop-blur-sm bg-opacity-60 bg-background">
          <Container className="max-w-2xl py-32">
            <Grid
              container
              alignItems="center"
              justifyContent="center"
              className="gap-y-10"
            >
              <Grid container className="justify-center md:justify-start">
                <Typography
                  variant="h1"
                  className="text-white text-5xl md:text-6xl lg:text-7xl font-bold md:w-[350px] lg:w-[500px] w-auto text-center md:text-left relative bottom-10 lg:right-20"
                >
                  Welcome to Flight Booker
                </Typography>
              </Grid>
              <Grid container justifyContent="center">
                <Card className="shadow-lg rounded-lg p-5 lg:w-[700px]">
                  <Typography variant="h4" className="ml-4">
                    Find a Flight
                  </Typography>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="grid gap-y-4">
                      <Grid
                        container
                        justifyContent="center"
                        className="gap-y-4"
                      >
                        <Grid item xs={12} md={6}>
                          <AsyncSelect<FilterOptions>
                            errors={errors}
                            touched={touched}
                            fetchOptions={fetchAirports}
                            name="departureAirportCode"
                            label="Departure Airport"
                            className="w-11/12"
                            handleChange={(
                              newValue: string | number | null
                            ) => {
                              setFieldValue("departureAirportCode", newValue);
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <AsyncSelect<FilterOptions>
                            errors={errors}
                            touched={touched}
                            fetchOptions={fetchAirports}
                            name="arrivalAirportCode"
                            label="Arrival Airport"
                            className="w-11/12"
                            handleChange={(
                              newValue: string | number | null
                            ) => {
                              setFieldValue("arrivalAirportCode", newValue);
                            }}
                          />
                        </Grid>
                      </Grid>
                      <Grid
                        container
                        justifyContent="center"
                        className="gap-y-4"
                      >
                        <Grid item xs={12} md={6}>
                          <DatePicker
                            label="Departure Date"
                            value={dayjs(values.departureDate)}
                            name="departureDate"
                            className="w-11/12"
                            onChange={(date) => {
                              setFieldValue("departureDate", date?.toDate());
                            }}
                            slots={{
                              textField: (params) => (
                                <ComplexTextField
                                  {...params}
                                  errors={errors}
                                  touched={touched}
                                />
                              ),
                            }}
                            disablePast
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <DatePicker
                            label="Return Date"
                            value={dayjs(values.returnDate)}
                            name="returnDate"
                            disabled={values.isRoundTrip === false}
                            className="w-11/12"
                            onChange={(date) =>
                              setFieldValue("returnDate", date?.toDate())
                            }
                            slots={{
                              textField: (params) => (
                                <ComplexTextField
                                  {...params}
                                  errors={errors}
                                  touched={touched}
                                />
                              ),
                            }}
                            disablePast
                          />
                        </Grid>
                      </Grid>
                      <Grid
                        container
                        justifyContent="center"
                        className="gap-y-4"
                      >
                        <Grid item xs={12} md={6}>
                          <TextField
                            label="Number of Passengers"
                            type="number"
                            name="seats"
                            value={values.seats}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className="w-11/12"
                            error={touched.seats && Boolean(errors.seats)}
                            helperText={touched.seats && errors.seats}
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <FormControl>
                            <InputLabel id="cabinClass-label">
                              Cabin Class
                            </InputLabel>
                            <Select
                              labelId="cabinClass-label"
                              label="Cabin Class"
                              name="cabinClass"
                              onChange={handleChange}
                              value={values.cabinClass}
                              className="w-36"
                            >
                              <MenuItem value="">Any Class</MenuItem>
                              <MenuItem value={CabinClass.Economy}>
                                Economy
                              </MenuItem>
                              <MenuItem value={CabinClass.Business}>
                                Business
                              </MenuItem>
                              <MenuItem value={CabinClass.FirstClass}>
                                First
                              </MenuItem>
                              <MenuItem value={CabinClass.PremiumEconomy}>
                                Premium Economy
                              </MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>
                      </Grid>
                      <FormControlLabel
                        control={
                          <Switch
                            name="isRoundTrip"
                            checked={values.isRoundTrip}
                            onChange={handleChange}
                          />
                        }
                        label="Round Trip?"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            name="directFlightsOnly"
                            checked={values.directFlightsOnly}
                            onChange={handleChange}
                          />
                        }
                        label="Direct Flights Only?"
                      />
                      <Button
                        variant="contained"
                        disabled={!isValid || isSubmitting}
                        type="submit"
                        className="bg-background hover:bg-primary text-white w-11/12 md:w-auto disabled:bg-gray-500"
                      >
                        <Typography>Search</Typography>
                        {isSubmitting ? (
                          <CircularProgress
                            className="text-white ml-5"
                            size={15}
                          />
                        ) : null}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Container>
        </Box>
      </Box>
    </Box>
  );
};

export default HomePage;
