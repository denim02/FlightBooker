import * as yup from "yup";
import { FlightRouteData } from "../../../models/DTOs/FlightRouteData";
import { FormValidationResponse } from "../../../models/DTOs/InvalidFormResponse";
import axios from "axios";
import dayjs from "dayjs";
import axiosInstance from "../../../utils/axios";
import { FieldArray, FormikProvider, useFormik } from "formik";
import {
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Typography,
  Container,
  Divider,
  CircularProgress,
} from "@mui/material";
import { DateTimePicker, renderTimeViewClock } from "@mui/x-date-pickers";
import ComplexTextField from "../../../components/core/ComplexTextField";
import { useCallback, useContext } from "react";
import AsyncSelect from "../../../components/core/AsyncSelect";
import { AirportServerData } from "../../../models/DTOs/AirportServerData";
import { Airplane } from "../../../models/tables/Airplane";
import AirlineContext from "../../../stores/airline-context";

const validationSchema = yup.object({
  repeating: yup.boolean().required("The repeating field must be specified."),
  frequency: yup
    .string()
    .matches(
      /(daily|weekly|monthly|yearly){1}/,
      'The frequency can be either "daily", "weekly", "monthly", or "yearly".'
    )
    .test(
      "optional-if-not-repeating",
      "The frequency must be specified if the route is repeating.",
      (value, context) => {
        return !context.parent.repeating || !!value;
      }
    ),
  flights: yup
    .array()
    .of(
      yup.object().shape({
        departureAirportCode: yup
          .string()
          .required("A departure airport must be specified.")
          .length(3, "The airport code must be 3 characters long.")
          .matches(/[a-zA-Z]{3}/, "The airport code must contain 3 letters.")
          .test(
            "is-unique",
            "The departure airport must be different from the arrival airport.",
            (value, context) => {
              return (
                Boolean(value) && value !== context.parent.arrivalAirportCode
              );
            }
          ),
        arrivalAirportCode: yup
          .string()
          .required("An arrival airport must be specified.")
          .length(3, "The airport code must be 3 characters long.")
          .matches(/[a-zA-Z]{3}/, "The airport code must contain 3 letters.")
          .test(
            "is-unique",
            "The arrival airport must be different from the departure airport.",
            (value, context) => {
              return (
                Boolean(value) && value !== context.parent.departureAirportCode
              );
            }
          ),
        departureTime: yup
          .date()
          .required("The departure time must be specified.")
          .test(
            "is-after-arrival-time",
            "The departure time must be before the arrival time.",
            (value, context) => {
              return (
                value &&
                context.parent.arrivalTime &&
                dayjs(value).isBefore(context.parent.arrivalTime)
              );
            }
          ),
        arrivalTime: yup
          .date()
          .required("The arrival time must be specified.")
          .test(
            "is-before-departure-time",
            "The arrival time must be after the departure time.",
            (value, context) => {
              return (
                value &&
                context.parent.departureTime &&
                dayjs(value).isAfter(context.parent.departureTime)
              );
            }
          ),
        airplaneModelId: yup
          .number()
          .required("An airplane model must be selected."),
      })
    )
    .test(
      "minimum-flights",
      "Since the route is not direct, at least 2 flights must be added.",
      (_, context) => {
        return context.parent.isTransit
          ? context.parent.flights.length >= 2
          : true;
      }
    )
    .test(
      "airport-code-match",
      "The departure airport of a connecting flight should match the arrival airport of the previous flight.",
      (_, context) => {
        const { flights, isTransit } = context.parent;
        if (!isTransit) return true;

        for (let i = 0; i < flights.length - 1; i++) {
          if (
            flights[i].arrivalAirportCode !==
            flights[i + 1].departureAirportCode
          ) {
            return false;
          }
        }
        return true;
      }
    )
    .test(
      "time-span-overlap",
      "The departure and arrival times of the flights cannot overlap and must be in chronological order.",
      (_, context) => {
        const { flights } = context.parent;
        for (let i = 0; i < flights.length - 1; i++) {
          if (
            dayjs(flights[i].arrivalTime).isAfter(flights[i + 1].departureTime)
          ) {
            return false;
          }
        }
        return true;
      }
    )
    .test(
      "30-minute-gap",
      "There must be at least a 30-minute gap between the arrival and departure times of connecting flights.",
      (_, context) => {
        const { flights, isTransit } = context.parent;
        if (!isTransit) return true;
        for (let i = 0; i < flights.length - 1; i++) {
          if (
            dayjs(flights[i].arrivalTime)
              .add(30, "minute")
              .isAfter(flights[i + 1].departureTime)
          ) {
            return false;
          }
        }
        return true;
      }
    ),
  prices: yup.object().shape({
    economy: yup
      .number()
      .moreThan(0, "Prices must be greater than 0.")
      .required("The price for economy seats is required."),
    premiumEconomy: yup
      .number()
      .moreThan(0, "Prices must be greater than 0.")
      .required("The price for premium economy seats is required."),
    business: yup
      .number()
      .moreThan(0, "Prices must be greater than 0.")
      .required("The price for business class seats is required."),
    firstClass: yup
      .number()
      .moreThan(0, "Prices must be greater than 0.")
      .required("The price for first class seats is required."),
  }),
});

const initialValues = {
  isTransit: false,
  repeating: false,
  frequency: "monthly",
  flights: [
    {
      departureAirportCode: "",
      arrivalAirportCode: "",
      departureTime: "",
      arrivalTime: "",
      airplaneModelId: "",
    },
  ],
  prices: {
    economy: "",
    premiumEconomy: "",
    business: "",
    firstClass: "",
  },
};

const AddRouteTab = () => {
  const { airline } = useContext(AirlineContext);
  const formik = useFormik<typeof initialValues>({
    initialValues,
    validationSchema,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      try {
        const fixedFlights = values.flights.map((entry) => ({
          ...entry,
          airplaneId: entry.airplaneModelId,
        }));

        const fixedPrices = {
          4: +values.prices.economy,
          3: +values.prices.premiumEconomy,
          2: +values.prices.business,
          1: +values.prices.firstClass,
        };

        await axiosInstance.post(
          "/routes",
          {
            ...values,
            airlineId: airline?.id,
            flights: fixedFlights,
            prices: fixedPrices,
          },
        );
        formik.resetForm();
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

            const validationErrors = { ...formik.errors };
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

  const fetchAirports = useCallback(async () => {
    try {
      const response = await axiosInstance.get<AirportServerData[]>(
        "/airports"
      );
      const data = response.data.map((airport) => ({
        id: airport.airportCode,
        label: airport.airportName,
      }));
      return data;
    } catch (error) {
      console.error("Error:", error);
      return [];
    }
  }, []);

  const fetchAirplanes = useCallback(async () => {
    try {
      const response = await axiosInstance.get<Airplane[]>("/airplanes");
      const data = response.data.map((airplane) => ({
        id: airplane.id,
        label: airplane.brand + " " + airplane.model,
      }));
      return data;
    } catch (error) {
      console.error("Error:", error);
      return [];
    }
  }, []);

  const {
    values,
    touched,
    errors,
    handleChange,
    handleBlur,
    handleSubmit,
    isSubmitting,
    setFieldValue,
  } = formik;

  return (
    <Container className="mt-20 md:w-9/12 lg:w-11/12 xl:w-full px-0">
      <Typography variant="h3" className="text-background font-semibold">
        Add a new route
      </Typography>
      <Divider className="mt-4 mb-10" />
      <form onSubmit={handleSubmit}>
        <Grid container>
          {/* Route Type Row */}
          <Grid
            container
            className="w-full"
            justifyContent="space-between"
            alignItems="bottom"
          >
            <Grid item>
              <FormControl>
                <InputLabel id="isTransit-label">
                  Is the route direct?
                </InputLabel>
                <Select
                  labelId="isTransit-label"
                  name="isTransit"
                  className="w-40"
                  label="Is the route direct?"
                  value={values.isTransit.toString()}
                  onChange={(e) => {
                    // Clear the flights array if the route type changes
                    if (e.target.value === "false")
                      setFieldValue("flights", [initialValues.flights[0]]);
                    setFieldValue("isTransit", e.target.value === "true");
                  }}
                  onBlur={handleBlur}
                >
                  <MenuItem value="false">Direct</MenuItem>
                  <MenuItem value="true">Transit</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item>
              <Typography variant="h4" className="text-primary font-thin">
                {values.isTransit ? "Transit Route" : "Direct Route"}
              </Typography>
            </Grid>
          </Grid>
          {/* Divider */}
          <Grid item container>
            <Divider className="w-full my-6" />
          </Grid>
          {/* Repeating Route Row */}
          <Grid container className="w-full" alignItems="center">
            <Grid item xs={3}>
              <FormControl>
                <InputLabel id="repeating-label">
                  Is the route repeating?
                </InputLabel>
                <Select
                  labelId="repeating-label"
                  label="Is the route repeating?"
                  name="repeating"
                  className="w-40"
                  value={values.repeating.toString()}
                  onChange={(e) =>
                    setFieldValue("repeating", e.target.value === "true")
                  }
                  onBlur={handleBlur}
                  error={touched.repeating && Boolean(errors.repeating)}
                >
                  <MenuItem value="false">No</MenuItem>
                  <MenuItem value="true">Yes</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {values.repeating && (
              <Grid item xs={3}>
                <FormControl>
                  <InputLabel id="frequency-label">Frequency</InputLabel>
                  <Select
                    labelId="frequency-label"
                    label="Frequency"
                    name="frequency"
                    value={values.frequency}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.frequency && Boolean(errors.frequency)}
                  >
                    <MenuItem value="daily">Daily</MenuItem>
                    <MenuItem value="weekly">Weekly</MenuItem>
                    <MenuItem value="monthly">Monthly</MenuItem>
                    <MenuItem value="yearly">Yearly</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            )}
          </Grid>
          {/* Divider */}
          <Grid container className="w-full">
            <Divider className="w-full my-6" />
          </Grid>
          {/* Flight Data */}
          <Grid container className="w-full">
            <Typography variant="h4" className="text-background font-medium">
              Flights
            </Typography>
            <FormikProvider value={formik}>
              <FieldArray name="flights">
                {({ push, remove }) => (
                  <div>
                    {/* Flight Entries */}
                    {values.flights.map((flight, index) => (
                      <Grid container key={index}>
                        {values.isTransit && (
                          <Grid item container className="my-5">
                            <Typography
                              variant="h6"
                              className="text-xl font-light"
                            >
                              Flight #{index + 1}
                            </Typography>
                          </Grid>
                        )}
                        <Grid
                          item
                          container
                          className="w-full"
                          alignItems="center"
                          justifyContent="space-between"
                        >
                          <Typography variant="h6">Airports</Typography>
                          <Grid
                            item
                            container
                            className="gap-x-10"
                            xs={10}
                            justifyContent="center"
                          >
                            <AsyncSelect<FlightRouteData>
                              errors={errors}
                              touched={touched}
                              fetchOptions={fetchAirports}
                              name={`flights[${index}].departureAirportCode`}
                              label="Departure Airport"
                              fullWidth
                              handleChange={(
                                newValue: string | number | null
                              ) => {
                                setFieldValue(
                                  `flights[${index}].departureAirportCode`,
                                  newValue
                                );
                              }}
                            />
                            <AsyncSelect<FlightRouteData>
                              errors={errors}
                              touched={touched}
                              fetchOptions={fetchAirports}
                              name={`flights[${index}].arrivalAirportCode`}
                              label="Arrival Airport"
                              fullWidth
                              handleChange={(
                                newValue: string | number | null
                              ) => {
                                setFieldValue(
                                  `flights[${index}].arrivalAirportCode`,
                                  newValue
                                );
                              }}
                            />
                          </Grid>
                        </Grid>

                        {/* Divider */}
                        <Grid container className="w-full">
                          <Divider className="w-full my-6" />
                        </Grid>

                        <Grid
                          item
                          container
                          className="w-full"
                          alignItems="center"
                          justifyContent="space-between"
                        >
                          <Typography variant="h6">Dates</Typography>
                          <Grid
                            item
                            container
                            className="gap-x-10"
                            xs={10}
                            justifyContent="center"
                          >
                            <DateTimePicker
                              label="Departure Time"
                              value={dayjs(flight.departureTime)}
                              name={`flights[${index}].departureTime`}
                              ampm={false}
                              onChange={(date) =>
                                setFieldValue(
                                  `flights[${index}].departureTime`,
                                  date?.toDate()
                                )
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
                              viewRenderers={{
                                hours: renderTimeViewClock,
                                minutes: renderTimeViewClock,
                                seconds: renderTimeViewClock,
                              }}
                              disablePast
                            />
                            <DateTimePicker
                              label="Arrival Time"
                              value={dayjs(flight.arrivalTime)}
                              ampm={false}
                              name={`flights[${index}].arrivalTime`}
                              onChange={(date) =>
                                setFieldValue(
                                  `flights[${index}].arrivalTime`,
                                  date?.toDate()
                                )
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
                              viewRenderers={{
                                hours: renderTimeViewClock,
                                minutes: renderTimeViewClock,
                                seconds: renderTimeViewClock,
                              }}
                              disablePast
                            />
                          </Grid>
                        </Grid>

                        {/* Divider */}
                        <Grid container className="w-full">
                          <Divider className="w-full my-6" />
                        </Grid>

                        <Grid
                          item
                          container
                          className="w-full"
                          alignItems="center"
                          justifyContent="space-between"
                        >
                          <Typography variant="h6">Airplane Model</Typography>
                          <Grid
                            item
                            container
                            className="gap-x-10"
                            xs={10}
                            justifyContent="center"
                          >
                            <AsyncSelect<FlightRouteData>
                              errors={errors}
                              touched={touched}
                              fetchOptions={fetchAirplanes}
                              name={`flights[${index}].airplaneModelId`}
                              label="Airplane Model"
                              fullWidth
                              handleChange={(
                                newValue: string | number | null
                              ) => {
                                setFieldValue(
                                  `flights[${index}].airplaneModelId`,
                                  newValue
                                );
                              }}
                            />
                          </Grid>
                        </Grid>
                        {index < values.flights.length - 1 && (
                          <Divider className="w-full mb-4 mt-7 h-1 bg-primary" />
                        )}
                      </Grid>
                    ))}
                    {values.isTransit && (
                      <Grid container item className="mt-10 w-full gap-x-5">
                        <Button
                          variant="contained"
                          onClick={() => push({ ...initialValues.flights[0] })}
                        >
                          Add Flight
                        </Button>
                        <Button
                          disabled={values.flights.length <= 1}
                          variant="contained"
                          onClick={() => {
                            if (values.flights.length > 1)
                              remove(values.flights.length - 1);
                          }}
                        >
                          Remove Last Flight
                        </Button>
                      </Grid>
                    )}
                  </div>
                )}
              </FieldArray>
            </FormikProvider>
            {/* Divider */}
            <Grid container className="w-full">
              <Divider className="w-full my-6" />
            </Grid>

            {errors.flights && typeof errors.flights == "string" && (
              <Grid container className="w-full mt-5 mb-10">
                <Typography color="error">{errors.flights}</Typography>
              </Grid>
            )}

            <Grid container className="w-full" spacing={2}>
              <Grid item xs={11}>
                <Typography
                  variant="h5"
                  className="text-background font-medium"
                >
                  Ticket Prices per Seat
                </Typography>
              </Grid>
              <Grid item xs={12} md={5}>
                <ComplexTextField<FlightRouteData>
                  name="prices.economy"
                  label="Economy Class"
                  fullWidth
                  value={values.prices.economy}
                  type="number"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  errors={errors}
                  touched={touched}
                />
              </Grid>
              <Grid item xs={12} md={5}>
                <ComplexTextField<FlightRouteData>
                  name="prices.premiumEconomy"
                  label="Premium Economy Class"
                  fullWidth
                  value={values.prices.premiumEconomy}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  errors={errors}
                  touched={touched}
                />
              </Grid>
              <Grid item xs={12} md={5}>
                <ComplexTextField<FlightRouteData>
                  name="prices.business"
                  label="Business Class"
                  fullWidth
                  value={values.prices.business}
                  type="number"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  errors={errors}
                  touched={touched}
                />
              </Grid>
              <Grid item xs={12} md={5}>
                <ComplexTextField<FlightRouteData>
                  name="prices.firstClass"
                  label="First Class"
                  fullWidth
                  value={values.prices.firstClass}
                  type="number"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  errors={errors}
                  touched={touched}
                />
              </Grid>
            </Grid>
          </Grid>
          <Button
            variant="contained"
            disabled={isSubmitting}
            type="submit"
            className="bg-background hover:bg-primary text-white mt-10 mb-20 w-40 h-10"
          >
            <Typography>Submit</Typography>
            {isSubmitting ? (
              <CircularProgress className="text-white ml-5" size={15} />
            ) : null}
          </Button>
        </Grid>
      </form>
    </Container>
  );
};

export default AddRouteTab;
